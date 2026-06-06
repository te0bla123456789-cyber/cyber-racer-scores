const fs = require('fs');
const [,, name, distance] = process.argv;
const lb = JSON.parse(fs.readFileSync('leaderboard.json', 'utf8'));
lb.push({
  name: String(name).toUpperCase().slice(0, 12),
  distance: Math.floor(Number(distance)),
  ts: Date.now()
});
lb.sort((a, b) => b.distance - a.distance);
fs.writeFileSync('leaderboard.json', JSON.stringify(lb.slice(0, 100), null, 2));
