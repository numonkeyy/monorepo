import { sql, type Kysely } from "kysely";

export async function createSchema(args: { db: Kysely<any> }) {
	return await sql`

  CREATE TABLE branch (
    id TEXT PRIMARY KEY DEFAULT (uuid_v4()),
    name TEXT NOT NULL UNIQUE,
    active INTEGER DEFAULT FALSE,
    base_branch TEXT
  ) strict;

  CREATE TABLE branch_change (
    id TEXT DEFAULT (uuid_v4()),
    change_id TEXT NOT NULL,
    branch_id TEXT NOT NULL,
    seq INTEGER NOT NULL
  ) strict;

  -- random uuid as the function is not available yet on creating the schema
  INSERT INTO branch(id, name, active) values('961582e6-ac9a-480c-ab62-4792821318fc', 'main', true);

  CREATE TABLE file_internal (
    id TEXT PRIMARY KEY DEFAULT (uuid_v4()),  
    path TEXT NOT NULL UNIQUE,
    data BLOB NOT NULL,
    metadata TEXT  -- Added metadata field
  ) strict;

  CREATE TABLE change_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id TEXT,
    path TEXT NOT NULL,
    data BLOB,
    metadata TEXT  -- Added metadata field
  ) strict;

  create view file as
    select z.id as id, z.path as path, z.data as data, z.metadata as metadata, MAX(z.mx) as queue_id from 
      (select file_id as id, path, data, metadata, id as mx from change_queue UNION select id, path, data, metadata, 0 as mx from file_internal) as z
    group by z.id;
  
  CREATE TABLE change (
    id TEXT PRIMARY KEY DEFAULT (uuid_v4()),
    author TEXT,
    parent_id TEXT,
    type TEXT NOT NULL,
    file_id TEXT NOT NULL,
    plugin_key TEXT NOT NULL,
    operation TEXT NOT NULL,
    value TEXT,
    meta TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
  ) strict;

  CREATE VIEW change_view AS SELECT author, change.id as id, change.file_id as file_id, change.parent_id as parent_id, type, plugin_key, operation, value, meta, created_at, branch_change.branch_id as branch_id,  branch_change.seq as seq FROM branch_change LEFT JOIN change ON branch_change.change_id = change.id ORDER BY seq;

  CREATE TABLE conflict (
    change_id TEXT NOT NULL,
    conflicting_change_id TEXT NOT NULL,
    reason TEXT,
    meta TEXT,
    resolved_with_change_id TEXT,
    PRIMARY KEY (change_id, conflicting_change_id)
  ) strict;

  CREATE TRIGGER file_update INSTEAD OF UPDATE ON file
  BEGIN
    insert into change_queue(file_id, path, data, metadata) values(NEW.id, NEW.path, NEW.data, NEW.metadata);
    select triggerWorker();
  END;

  CREATE TRIGGER file_insert INSTEAD OF INSERT ON file
  BEGIN
    insert into change_queue(file_id, path, data, metadata) values(NEW.id, NEW.path, NEW.data, NEW.metadata);
    select triggerWorker();
  END;

  CREATE TRIGGER change_queue_remove BEFORE DELETE ON change_queue
  BEGIN
    insert or replace into file_internal(id, path, data, metadata) values(OLD.file_id, OLD.path, OLD.data, OLD.metadata);
  END;
`.execute(args.db);
}
