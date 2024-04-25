<script lang="ts">
  // import { untrack } from 'svelte'
  import { openRepo } from './lix.svelte'
  // import { createGitgraph, TemplateName, templateExtend } from "@gitgraph/js"

  // import SvelteMarkdown from 'svelte-markdown'
  // TODO: move to sveltekit, try load functions and ssr, vscode web and obsidian plugins!

  const host = 'https://git.local'
  const repos = {
    gitserver: 'https://ignored.domain/direct/git.local/opral/example.git',
    test: host + '/git/localhost:8089/janfjohannes/ci-test-repo.git',
    'cal.com': 'https://ignored.domain/direct/git.local/janfjohannes/cal.com.git'
  }
  const selectdRepo = 'cal.com'

  const repo = openRepo(repos[selectdRepo], {
    branch: "main",
    author: { name: 'janfjohannes', email: 'jan@inlang.com' }
  })

  let editing = $state(true)
  let openFile = $state('')
  let file = $state({})

  function open(name) {
    openFile = name
    file = repo.files(openFile)
  }
  open('README.md')

  let message = $state('')
  $effect(() => {
    message = `Changes on ${repo.currentBranch} started ${new Date().toUTCString()}`
  })

  // const graphContainer = document.getElementById("graph-container")
  // const gitgraph = createGitgraph(graphContainer, {
  //   author: 'jan',
  //   template: templateExtend(TemplateName.Metro, {
  //     branch: { lineWidth: 4 },
  //     commit: {
  //       spacingY: 5,
  //       spacingX: 5,
  //       dot: {
  //         size: 8
  //       },
  //       message: {
  //         font: 'normal 11pt Arial',
  //         displayHash: false,
  //       },
  //     },
  //   }) 
  // })
  // window.gitgraph = gitgraph
  // const master = gitgraph.branch("master")
  // master.commit("Initial commit", { author: 'jan'})
  // const stack2 = master.branch("stack 2")
  // stack2.commit("ASomething")
  // const stack1 = master.branch("stack 1")
  // stack1.commit("Add Refactor")
  // stack1.commit("Test")
  // const aFeature = develop.branch("a-feature")
  // aFeature
  //   .commit("Make it work")
  //   .commit("Make it right")
  //   .commit("Make it fast")
  // develop.merge(aFeature)
  // develop.commit("Prepare v1")
  // master.merge(develop).tag("v1.0.0")

  // let timer
  // function debouncedSave() {
  //   // dirty = true
  //   if (timer === 'saving') {
  //     return
  //   }
  //   if (timer) {
  //     clearTimeout(timer)
  //   }

  //   timer = setTimeout(async () => {
  //     timer = 'saving'
  //     // await save()
  //     timer = null
  //   }, 800)
  // }

  // async function readCurrentFile(openFile) {
  //   // dirty = false
  //   setTimeout(repo.updateStatus, 10)
  // }

  function statusClasses(name, status) {
    const fileStatus = status?.find((entry) => entry[0] === name)

    if (fileStatus) {
      let text = 'materialized'
      if (fileStatus[1] !== 'unmodified') {
        text += ' ' + 'modified'
      }
      return text
    }

    return ''
  }
</script>

<main style="width: 100vw;">
  <!-- <header style="position: absolute; top: 10px; left: 30px;">

  </header> -->

  <div class="card">
    <aside style="position: absolute; top: 6px; left: 30px;">
      <h3>Folders</h3>
      <ul class="files" style="list-style: none;">
        {#each repo.folders as { name, type }}
          <li style="cursor: pointer;" on:click={() => open(name)}>
            {type} &nbsp;
            <span class={statusClasses(name, repo.status)}>{name}</span>
          </li>
        {/each}
      </ul>
    </aside>

    <main
      style="margin-left: 267px; position: absolute; top: 6px; whitespace: pre; max-width: 60vw; overflow-y: scroll; max-height: calc(100vh - 43px); box-sizing: border-box"
    >
      <h3 style="margin-left: 0;">{openFile}</h3>

      {#if editing}
        <p
          class="text-body"
          contenteditable="true"
          style="white-space: pre; max-width: 60vw; overflow: hidden; padding: 10px;"
          on:blur
          on:keydown
          bind:innerText={file.content}
        ></p>
      {:else}
        <div
          class="markdown-body"
          on:click={() => {
            editing = true
          }}
        >
          <!-- <SvelteMarkdown source={content} /> -->
        </div>
      {/if}
    </main>

    <aside style="right: 30px; top: 42px; position: absolute; max-width: 337px;">
      Branch:
      <select style="max-width: 200px; padding: 2px;" bind:value={repo.currentBranch}>
        {#each repo.branches as branch}
          <option value={branch}>{branch}</option>
        {/each}
      </select>

      <div style="">
        <h3 style="display: inline-block; margin-right: 6px;">Commits</h3>
        {#if repo.unpushed}
          <button on:click={repo.push} style="display: inline-block;"
            >Push {repo.unpushed} unsaved commits</button
          >
        {/if}
        <button on:click={repo.pull} style="display: inline-block;">Pull</button>
      </div>

      {#each repo.commits as { commit, origin, oid }}
        <div>
          {#if origin}
            <span>(Origin)</span>
          {/if}
          <span>{new Date(commit.author.timestamp * 1000).toUTCString()}</span>
          <span>Author: {commit.author.name}:</span>
          <span>Message: {commit.message}</span>
          <span>Id: {oid}</span>
          <span>Content Hash: {commit.tree}</span>
          <span>Parents: {JSON.stringify(commit.parent)}</span>
          <hr>
        </div>
      {/each}

      {#if repo?.status?.filter(([name, txt]) => txt !== 'unmodified' && !repo?.exclude?.includes(name))?.length}
        <div>
          <h3 style="display: inline-block; margin-right: 6px;">Next Commit</h3>
          <button style="display: inline-block;" on:click={() => repo.commit(message)}
            >Commit and Push {repo.status?.filter(
              ([name, txt]) => txt !== 'unmodified' && !repo.exclude.includes(name)
            )?.length} changed files</button
          >
        </div>
        <textarea rows="3" value={message}></textarea>

        <ul style="list-style: none;">
          {#each repo.status?.filter(([name, txt]) => txt !== 'unmodified' && !repo.exclude.includes(name)) || [] as entry}
            <li style="cursor: pointer;" on:click={() => repo.addExclude(entry[0])}>
              {entry[0]}: {entry[1]}
            </li>
          {/each}
        </ul>
      {/if}

      {#if repo.exclude?.length > 0}
        <h3>Exclude from next commit</h3>
        <ul style="list-style: none;">
          {#each repo.exclude || [] as entry}
            <li style="cursor: pointer;" on:click={() => repo.include(entry)}>{entry}</li>
          {/each}
        </ul>
      {/if}
    </aside>
  </div>
</main>

<style>
  .text-body:focus-visible {
    outline: none;
  }
  .files span {
    font-weight: lighter;
  }
  .files span.materialized {
    font-weight: bold;
  }

  .files span.modified:after {
    content: 'M';
    color: orange;
    margin-left: 4px;
    font-weight: normal;
  }

  ul {
    padding: 0;
  }
  .markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
  }
  :global(img) {
    max-width: 60vw;
  }
  :global(h1) {
    font-size: 2em;
  }
  :global(h3) {
    font-size: 1.5em;
    margin-left: -16px;
    margin-bottom: 6px;
  }
</style>
