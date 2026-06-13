const fs = require('fs');
const [,, name, distance] = process.argv;

// --- Reset mensuel ---
const currentMonth = new Date().toISOString().slice(0, 7); // "2026-06"
const fileMonth = new Date(fs.statSync('leaderboard.json').mtime).toISOString().slice(0, 7);

if (fileMonth !== currentMonth) {
  fs.writeFileSync('leaderboard.json', '[]');
}
// ---------------------

const lb = JSON.parse(fs.readFileSync('leaderboard.json', 'utf8'));
lb.push({
  name: String(name).toUpperCase().slice(0, 12),
  distance: Math.floor(Number(distance)),
  ts: Date.now()
});
lb.sort((a, b) => b.distance - a.distance);
fs.writeFileSync('leaderboard.json', JSON.stringify(lb.slice(0, 100), null, 2));
