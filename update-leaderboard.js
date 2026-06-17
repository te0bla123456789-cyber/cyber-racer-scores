const fs = require('fs');
const [,, name, distance] = process.argv;

const FILE_NAME = 'leaderboard.json';

// 1. Sécurité : Créer le fichier s'il n'existe pas encore au tout premier lancement
if (!fs.existsSync(FILE_NAME)) {
  fs.writeFileSync(FILE_NAME, '[]');
}

// --- Reset mensuel ---
const currentMonth = new Date().toISOString().slice(0, 7); 
const fileMonth = new Date(fs.statSync(FILE_NAME).mtime).toISOString().slice(0, 7);

if (fileMonth !== currentMonth) {
  fs.writeFileSync(FILE_NAME, '[]');
}
// ---------------------

// 2. Sécurité : Vérifier que l'utilisateur a bien entré un nom et un nombre valide
if (!name || isNaN(Number(distance))) {
  console.error("Erreur : Veuillez fournir un nom valide et une distance numérique.");
  process.exit(1); // Arrête le script pour éviter de corrompre le fichier JSON
}

const lb = JSON.parse(fs.readFileSync(FILE_NAME, 'utf8'));

lb.push({
  name: String(name).toUpperCase().slice(0, 12),
  distance: Math.floor(Number(distance)),
  ts: Date.now() // <-- Le fameux Timestamp !
});

// 3. Amélioration : Utiliser le 'ts' pour départager les égalités
lb.sort((a, b) => {
  if (b.distance === a.distance) {
    // Si la distance est égale, le plus petit timestamp (le premier à avoir joué) gagne
    return a.ts - b.ts; 
  }
  // Sinon, on trie par la plus grande distance
  return b.distance - a.distance;
});

// Sauvegarde du Top 100
fs.writeFileSync(FILE_NAME, JSON.stringify(lb.slice(0, 100), null, 2));
console.log(`Le score de ${name} a été ajouté avec succès !`);
