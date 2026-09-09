const { selectNextParticipant } = require('./dist/participants/selection.util');

const participants = [
  { id: 1, name: 'Alex', spokenCount: 2, color: '#6366f1' },
  { id: 2, name: 'Maya', spokenCount: 0, color: '#ec4899' },
  { id: 3, name: 'Sam', spokenCount: 1, color: '#10b981' },
  { id: 4, name: 'Priya', spokenCount: 0, color: '#f59e0b' },
];

console.log('--- Testing Anti-Repeat ---');
const lastWinnerId = 2; // Maya
for (let i = 0; i < 100; i++) {
  const winner = selectNextParticipant(participants, lastWinnerId);
  if (winner.id === lastWinnerId) {
    console.error('FAIL: Repeat winner selected!');
    process.exit(1);
  }
}
console.log('PASS: No repeat winners in 100 trials.');

console.log('--- Testing Weighted Probability (10,000 trials) ---');
const counts = { Alex: 0, Maya: 0, Sam: 0, Priya: 0 };
for (let i = 0; i < 10000; i++) {
  const winner = selectNextParticipant(participants, null);
  counts[winner.name]++;
}
console.log('Results:', counts);

if (counts['Maya'] > counts['Alex'] && counts['Priya'] > counts['Alex'] && counts['Sam'] > counts['Alex']) {
  console.log('PASS: Lower spoken count yielded higher selection probability.');
} else {
  console.error('FAIL: Probability distribution unexpected.');
  process.exit(1);
}

console.log('All backend selection verification checks passed!');
