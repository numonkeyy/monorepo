import { commit } from "./commit";
import { v4 } from "uuid";

function indexByFileId (changes) {
    const changesByFileId = {}
    changes.forEach(change => {
      if (!changesByFileId[change.file_id]) {
        changesByFileId[change.file_id] = {}
      }
      if (!changesByFileId[change.file_id][change.value.id]) {
        changesByFileId[change.file_id][change.value.id] = []
      }
  
      changesByFileId[change.file_id][change.value.id].push(change)
    })
  
    return changesByFileId
  }

export async function merge ({ db, sql, path, incomming, plugins, userId }) {
    const dirty = await db
      .selectFrom("change")
      .select('id')
      .where('commit_id', 'is', null)
      .executeTakeFirst()
    if (dirty) {
      throw new Error('cannot merge on uncommited changes, pls commit first')
    }
  
    const hasConflicts = await db
      .selectFrom("change")
      .selectAll()
      .where('conflict', 'is not', null)
      .executeTakeFirst()
    if (hasConflicts) {
      throw new Error('cannot merge on existing conflicts, pls resolve first')
    }
  
    const { commit_id : aHead } = await db
      .selectFrom('ref')
      .selectAll()
      .where('name', '=', 'current')
      .executeTakeFirstOrThrow()
  
    const { commit_id : bHead } = await incomming.db
      .selectFrom('ref')
      .selectAll()
      .where('name', '=', 'current')
      .executeTakeFirstOrThrow()
  
    if (aHead === bHead) {
      return
    }
  
    const bCommits = (await incomming.sql`select * from "commit" order by created`).reverse()
  
    let commonAncestor
    for (const commit of bCommits) {    
      // TODO: use single join on attached database instead
      commonAncestor = (await sql`select * from "commit" where id = ${commit.id} limit 1`)[0]
      if (commonAncestor) {
        break
      }
    }
  
    if (!commonAncestor) {
      throw new Error('no common ancestor found')
    }
  
    // FIXME: hack needs replacement with parent id
    const aOnlyCommits = await sql`select * from "commit" where created > ${commonAncestor.created}`
    const bOnlyCommits= bCommits.filter(commit => commit.created > commonAncestor.created)
  
    const aOnlyChanges = await db
      .selectFrom('change')
      .selectAll()
      .where('commit_id', 'in', aOnlyCommits.map(commit => commit.id))
      .orderBy("created", "desc")
      .execute()
  
    const bOnlyChanges = await incomming.db
      .selectFrom('change')
      .selectAll()
      .where('commit_id', 'in', bOnlyCommits.map(commit => commit.id))
      .orderBy("created", "desc")
      .execute()
  
    const aOnlyChangesByFileId = indexByFileId(aOnlyChanges)
    const bOnlyChangesByFileId = indexByFileId(bOnlyChanges)
  
    // FIXME: new files in a are ignored for now, could have info relevant for merging, so best to add this
  
    const fileChanges: any[] = []
    for (const [fileId, atomChangesByAtomId ] of Object.entries(bOnlyChangesByFileId)) {
      if (!aOnlyChangesByFileId[fileId]) {
        console.warn('TODO: copy over new files fileId: ' + fileId)
        continue
      }
  
      const fileChange: {
        fileId: string
        changes: any[]
        conflicts: any[]
      } = {
        fileId: fileId,
        changes: [],
        conflicts: []
      }
      // @ts-ignore
      for (const [atomId, atomChanges] of Object.entries(atomChangesByAtomId)) {
        if (aOnlyChangesByFileId[fileId][atomId]) {
          const current = aOnlyChangesByFileId[fileId][atomId]
          const base = await db
            .selectFrom('change') 
            .selectAll()
            .where("id", "=", current.at(-1).parent_id)
            .executeTakeFirstOrThrow()
          
          fileChange.conflicts.push({ current, incoming: atomChanges, base})
        } else {
          fileChange.changes.push(atomChanges)
        }
      }
  
      fileChanges.push(fileChange)
    }
  
    const mergeResults: any[] = []
    for (const fileChange of fileChanges) {    
      const current = (await sql`select blob from file where id = ${fileChange.fileId}`)[0]?.blob
      const incoming = (await incomming.sql`select blob from file where id = ${fileChange.fileId}`)[0]?.blob
  
      for (const plugin of plugins) {
        const mergeRes = await plugin.merge!.file!({
          current,
          incoming,
          ...fileChange
        })
  
        mergeResults.push({fileId: fileChange.fileId, ...mergeRes})
      }
    }
  
    for (const { fileId, result, unresolved } of mergeResults) {
      if (result) {
        await db
          .updateTable("file")
          .set({
            blob: result,
          })
          .where(
            "id",
            "=",
            fileId
          )
          .execute()
      }
  
      if (unresolved) {
        for (const { current, incoming } of unresolved) {
          const parent = await db
            .selectFrom("change")
            .select("id")
            .where((eb) => eb.ref("value", "->>").key("id"), "=", current[0].value.id)
            .where("type", "=", current[0].type)
            .where("file_id", "=", current[0].file_id)
            .where("plugin_key", "=", current[0].plugin_key)
            .where("commit_id", "is not", null)
            .orderBy("created", "desc")
            .executeTakeFirst()
  
          await db
            .insertInto("change")
            .values({
              id: v4(),
              type: current[0].type,
              file_id: current[0].file_id,
              plugin_key: current[0].plugin_key,
              parent_id: parent?.id,
              value: JSON.stringify(current[0].value),
              conflict: JSON.stringify(incoming),
            })
            .execute()
        }
      } 
    }
  
    // TODO: sync in the history from the incoming database and add a link in the merge commit 
    await commit({
      db,
      userId,
      description: "Merge in " + path,
      merge: true
    })
  }