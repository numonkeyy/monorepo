import sqlite3InitModule from "@eliaspourquoi/sqlite-node-wasm";
import { setSqliteModule, sqliteModule } from "../kysely/sqliteModule.js";
import { wasmBinary } from "./sqliteWasmBinary.js";

export const createInMemoryDatabase = async ({
  readOnly = false,
}: {
  readOnly?: boolean;
}) => {
  if (!sqliteModule) {
    const log = console.log;
    // @ts-ignore
    globalThis.sqlite3ApiConfig = {
      debug: log,
      log: log,
      warn: (...args: any) => {
        if (args[0] !== "Ignoring inability to install OPFS sqlite3_vfs:")
          console.log(...args);
      },
      error: log,
    };
    await initSqlite();
  }
  const flags = [
    readOnly ? "r" : "cw", // read and write
    "", // non verbose
  ].join("");

  return new sqliteModule.oo1.DB(":memory:", flags);
};

async function initSqlite() {
  setSqliteModule(
    await sqlite3InitModule({
      // @ts-expect-error
      wasmBinary: wasmBinary,
      // https://github.com/opral/inlang-sdk/issues/170#issuecomment-2334768193
      locateFile: () => "sqlite3.wasm",
    }),
  );
}
