// Local persistent storage for the bundled Next.js API (Node 22.13+).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID, randomBytes } from 'node:crypto';
import { catalog } from './catalog';

const directory = process.env.PC_BUILDER_DATA_DIR || path.join(process.cwd(), '.data');
mkdirSync(directory, { recursive: true });
const db = new DatabaseSync(path.join(directory, 'pc-builder.sqlite'));
db.exec('PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS builds (id TEXT PRIMARY KEY, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);');
db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').run('jwt-secret', randomBytes(48).toString('hex'));
export const localJWTSecret = (db.prepare('SELECT value FROM settings WHERE key = ?').get('jwt-secret') as { value: string }).value;
const parse = (row: unknown): any => row ? JSON.parse((row as { data: string }).data) : undefined;

export const mockDB = {
  createUser(username: string, email: string, passwordHash: string) {
    const user = { _id: randomUUID(), username, email: email.trim().toLowerCase(), passwordHash, createdAt: new Date(), profile: {} };
    db.prepare('INSERT INTO users (id, email, data) VALUES (?, ?, ?)').run(user._id, user.email, JSON.stringify(user));
    return user;
  },
  getUserByEmail(email: string) { return parse(db.prepare('SELECT data FROM users WHERE email = ?').get(email.trim().toLowerCase())); },
  getUserById(id: string) { return parse(db.prepare('SELECT data FROM users WHERE id = ?').get(id)); },
  updateUser(id: string, data: any) {
    const user = this.getUserById(id);
    if (!user) return;
    Object.assign(user, data);
    db.prepare('UPDATE users SET data = ? WHERE id = ?').run(JSON.stringify(user), id);
    return user;
  },
  getComponents(query: any = {}) {
    return Object.values(catalog).flat().filter(c => (!query.type || c.type.toLowerCase() === query.type.toLowerCase()) && (!query.brand || c.brand === query.brand) && (query.maxPrice == null || c.price <= query.maxPrice)).slice(0, query.limit || 50);
  },
  getComponentsByType(type: string, limit = 50) { return (catalog[type.toLowerCase()] || []).slice(0, limit); },
  getComponent(id: string) { return Object.values(catalog).flat().find(c => c._id === id); },
  createBuild(userId: string, data: any) {
    const build = { ...data, _id: randomUUID(), userId, likes: 0, views: 0, createdAt: new Date() };
    db.prepare('INSERT INTO builds (id, data) VALUES (?, ?)').run(build._id, JSON.stringify(build));
    return build;
  },
  getBuild(id: string) { return parse(db.prepare('SELECT data FROM builds WHERE id = ?').get(id)); },
  // ponytail: JSON records suit a local simulator; use indexed columns for a large hosted catalog.
  getUserBuilds(userId: string) { return db.prepare('SELECT data FROM builds').all().map(parse).filter(b => b.userId === userId); },
  getPublicBuilds() { return db.prepare('SELECT data FROM builds').all().map(parse).filter(b => b.isPublic).sort((a,b) => b.likes - a.likes).slice(0,50); },
  updateBuild(id: string, data: any) {
    const build = this.getBuild(id);
    if (!build) return;
    Object.assign(build, data);
    db.prepare('UPDATE builds SET data = ? WHERE id = ?').run(JSON.stringify(build), id);
    return build;
  },
  likeBuild(id: string) { const build = this.getBuild(id); return build && this.updateBuild(id, { likes: build.likes + 1 }); },
  deleteBuild(id: string) { return db.prepare('DELETE FROM builds WHERE id = ?').run(id).changes > 0; },
};
