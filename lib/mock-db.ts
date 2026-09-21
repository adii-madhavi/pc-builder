import { createClient, type Client, type InValue } from '@libsql/client';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomUUID, randomBytes } from 'node:crypto';
import { catalog } from './catalog';

let database: Promise<Client> | undefined;
function getDatabase() {
  if (!database) database = (async () => {
    let url = process.env.TURSO_DATABASE_URL;
    if (!url) {
      if (process.env.VERCEL) throw new Error('Connect a Turso database before deploying.');
      const directory = process.env.PC_BUILDER_DATA_DIR || path.join(process.cwd(), '.data');
      mkdirSync(directory, { recursive: true });
      url = pathToFileURL(path.join(directory, 'pc-builder.sqlite')).href;
    }
    const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
    await db.batch([
      'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, data TEXT NOT NULL)',
      'CREATE TABLE IF NOT EXISTS builds (id TEXT PRIMARY KEY, data TEXT NOT NULL)',
      'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)',
      { sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', args: ['jwt-secret', randomBytes(48).toString('hex')] },
    ], 'write');
    return db;
  })().catch(error => { database = undefined; throw error; });
  return database;
}
const query = async (sql: string, args: InValue[] = []) => (await getDatabase()).execute({ sql, args });
const parse = (row: unknown): any => row ? JSON.parse((row as { data: string }).data) : undefined;

export async function getJWTSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  const result = await query('SELECT value FROM settings WHERE key = ?', ['jwt-secret']);
  return String(result.rows[0].value);
}

export const mockDB = {
  async createUser(username: string, email: string, passwordHash: string) {
    const user = { _id: randomUUID(), username, email: email.trim().toLowerCase(), passwordHash, createdAt: new Date(), profile: {} };
    await query('INSERT INTO users (id, email, data) VALUES (?, ?, ?)', [user._id, user.email, JSON.stringify(user)]);
    return user;
  },
  async getUserByEmail(email: string) { return parse((await query('SELECT data FROM users WHERE email = ?', [email.trim().toLowerCase()])).rows[0]); },
  async getUserById(id: string) { return parse((await query('SELECT data FROM users WHERE id = ?', [id])).rows[0]); },
  async updateUser(id: string, data: any) {
    const user = await this.getUserById(id);
    if (!user) return;
    Object.assign(user, data);
    await query('UPDATE users SET data = ? WHERE id = ?', [JSON.stringify(user), id]);
    return user;
  },
  getComponents(query: any = {}) {
    return Object.values(catalog).flat().filter(c => (!query.type || c.type.toLowerCase() === query.type.toLowerCase()) && (!query.brand || c.brand === query.brand) && (query.maxPrice == null || c.price <= query.maxPrice)).slice(0, query.limit || 50);
  },
  getComponentsByType(type: string, limit = 50) { return (catalog[type.toLowerCase()] || []).slice(0, limit); },
  getComponent(id: string) { return Object.values(catalog).flat().find(c => c._id === id); },
  async createBuild(userId: string, data: any) {
    const build = { ...data, _id: randomUUID(), userId, likes: 0, views: 0, createdAt: new Date() };
    await query('INSERT INTO builds (id, data) VALUES (?, ?)', [build._id, JSON.stringify(build)]);
    return build;
  },
  async getBuild(id: string) { return parse((await query('SELECT data FROM builds WHERE id = ?', [id])).rows[0]); },
  // ponytail: JSON predicates suit this small catalog; add indexed columns if query latency grows.
  async getUserBuilds(userId: string) { return (await query("SELECT data FROM builds WHERE json_extract(data, '$.userId') = ?", [userId])).rows.map(parse); },
  async getPublicBuilds() { return (await query("SELECT data FROM builds WHERE json_extract(data, '$.isPublic') = 1 ORDER BY json_extract(data, '$.likes') DESC LIMIT 50")).rows.map(parse); },
  async updateBuild(id: string, data: any) {
    const build = await this.getBuild(id);
    if (!build) return;
    Object.assign(build, data);
    await query('UPDATE builds SET data = ? WHERE id = ?', [JSON.stringify(build), id]);
    return build;
  },
  async likeBuild(id: string) {
    return parse((await query("UPDATE builds SET data = json_set(data, '$.likes', json_extract(data, '$.likes') + 1) WHERE id = ? RETURNING data", [id])).rows[0]);
  },
  async deleteBuild(id: string) { return (await query('DELETE FROM builds WHERE id = ?', [id])).rowsAffected > 0; },
};
