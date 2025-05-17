/* 
When a user connects, generate a unique session ID.
Store that ID in your database along with:
    IP address
    User agent
    Timestamp
    Location

including geo ip and fingerprintjs

*/
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const db = new sqlite3.Database('./db/sessions.db');
const FingerprintJS = require('@fingerprintjs/fingerprintjs-pro');
const { createHash } = require('crypto');
const axios = require('axios');
const { API_KEY } = process.env;

// Ensure table exists
db.run(`CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    ip_address TEXT,
    user_agent TEXT,
    location TEXT,
    fingerprint TEXT,
    last_active DATETIME,
    status TEXT
)`);

async function getLocation(ip) {
    // Placeholder for actual location fetching logic
    return "Location based on IP";
}

async function getFingerprint(req) {
    const fingerprint = await FingerprintJS.get();
    return fingerprint;
}
async function createSession(req) {
    const sessionId = uuidv4();
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const location = await getLocation(ip);
    const fingerprint = await getFingerprint(req);
    const now = new Date().toISOString();

    db.run(
        `INSERT INTO sessions (session_id, ip_address, user_agent, location, fingerprint, last_active, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [sessionId, ip, userAgent, location, fingerprint, now, 'Active']
    );

    return sessionId;
}
async function getSession(sessionId) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM sessions WHERE session_id = ?`,
            [sessionId],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}
async function updateSession(sessionId) {
    const now = new Date().toISOString();
    db.run(
        `UPDATE sessions SET last_active = ? WHERE session_id = ?`,
        [now, sessionId]
    );
}   

async function deleteSession(sessionId) {
    db.run(
        `DELETE FROM sessions WHERE session_id = ?`,
        [sessionId]
    );
}

async function getAllSessions() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM sessions`, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function closeDb() {
    db.close();
}

async function getGeoLocation(ip) {
    try {
        const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ip}`);
        const { country_name, city } = response.data;
        return `${city}, ${country_name}`;
    } catch (error) {
        console.error('Error fetching geo location:', error);
        return 'Unknown';
    }
}
async function getFingerprint(req) {
    const fp = await FingerprintJS.get();
    return createHash('sha256').update(fp.visitorId).digest('hex');
}
async function getLocation(ip) {
    const location = await getGeoLocation(ip);
    return location;
}



module.exports = {
    createSession,
    getSession,
    updateSession,
    deleteSession,
    getAllSessions,
    closeDb
};
