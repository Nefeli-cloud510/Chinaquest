import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

function dataDir() {
  return path.join(process.cwd(), "data");
}

async function ensureDataDir() {
  await fs.mkdir(dataDir(), { recursive: true });
}

export function newId(prefix: string) {
  return `${prefix}_${randomBytes(10).toString("hex")}`;
}

export function newToken() {
  return randomBytes(32).toString("base64url");
}

async function readJsonFile<T extends JsonValue>(fileName: string, fallback: T) {
  await ensureDataDir();
  const filePath = path.join(dataDir(), fileName);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (e) {
    const data = fallback;
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
}

async function writeJsonFile(fileName: string, value: JsonValue) {
  await ensureDataDir();
  const filePath = path.join(dataDir(), fileName);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
}

const locks = new Map<string, Promise<void>>();

async function withLock<T>(key: string, fn: () => Promise<T>) {
  const current = locks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>((r) => (release = r));
  locks.set(key, current.then(() => next));

  await current;
  try {
    return await fn();
  } finally {
    release();
    const tail = locks.get(key);
    if (tail === next) locks.delete(key);
  }
}

export async function readJson<T extends JsonValue>(
  fileName: string,
  fallback: T,
) {
  return readJsonFile(fileName, fallback);
}

export async function updateJson<T extends JsonValue>(
  fileName: string,
  fallback: T,
  updater: (current: T) => T | Promise<T>,
) {
  return withLock(fileName, async () => {
    const current = await readJsonFile(fileName, fallback);
    const next = await updater(current);
    await writeJsonFile(fileName, next);
    return next;
  });
}

export async function appendNdjson(fileName: string, line: JsonValue) {
  await ensureDataDir();
  const filePath = path.join(dataDir(), fileName);
  const payload = `${JSON.stringify(line)}\n`;
  await fs.appendFile(filePath, payload, "utf-8");
}

