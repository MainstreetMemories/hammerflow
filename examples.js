// HammerFlow - Distribution Examples

// ============================
// JOB A: $500 Depreciation
// ============================
const jobA = {
  revenue: 10000,
  costs: 4000,
  depreciation: 500,
  paidByInsurance: true
};

// INITIAL DISTRIBUTION (when job paid)
const jobA_initial = {
  partners: { mark: 2000, bobby: 2000 },
  dylan: 2000, // Gets paid immediately (depreciation < $1000)
  total: 6000
};

// ============================
// JOB B: $2000 Depreciation  
// ============================
const jobB = {
  revenue: 10000,
  costs: 4000,
  depreciation: 2000,
  paidByInsurance: true
};

// INITIAL DISTRIBUTION (when job paid)
const jobB_initial = {
  partners: { mark: 2000, bobby: 2000 },
  dylan: 0, // Nothing yet (depreciation >= $1000)
  total: 4000
};

// FINAL DISTRIBUTION (when $2000 depreciation paid)
const jobB_final = {
  partners: { mark: 2000, bobby: 2000 }, // Already received
  dylan: 2000, // Now gets paid
  total: 6000
};

console.log('===== JOB A: $500 Depreciation =====');
console.log('INITIAL (now):');
console.log('  Mark:     $2,000 ✓');
console.log('  Bobby:    $2,000 ✓');
console.log('  Dylan:    $2,000 ✓');
console.log('  TOTAL:    $6,000');
console.log('');

console.log('===== JOB B: $2000 Depreciation =====');
console.log('INITIAL (when job paid):');
console.log('  Mark:     $2,000 ✓');
console.log('  Bobby:    $2,000 ✓');
console.log('  Dylan:    $0 (waits)');
console.log('  TOTAL:    $4,000');
console.log('');
console.log('FINAL (when depreciation paid):');
console.log('  Mark:     $2,000 ✓ (already received)');
console.log('  Bobby:    $2,000 ✓ (already received)');
console.log('  Dylan:    $2,000 ✓ NOW');
console.log('  TOTAL:    $6,000');