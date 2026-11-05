const fs = require("fs/promises");
const path = require("path");
const { defaultCollections } = require("./defaults");

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data", "db.json");

async function readRawDb() {
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

async function writeRawDb(db) {
  await fs.writeFile(DATA_FILE, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

async function readDb() {
  const db = await readRawDb();
  const defaults = defaultCollections();
  let dirty = false;

  for (const [key, value] of Object.entries(defaults)) {
    if (!Array.isArray(db[key])) {
      db[key] = value;
      dirty = true;
    }
  }

  if (dirty) {
    await writeRawDb(db);
  }

  return db;
}

async function writeDb(db) {
  await writeRawDb(db);
}

module.exports = {
  DATA_FILE,
  readDb,
  writeDb
};
