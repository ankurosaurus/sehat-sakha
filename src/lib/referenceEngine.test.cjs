// Test suite for Reference Range Engine
function parseRangeBounds(rangeStr) {
  if (!rangeStr) return {};
  const clean = rangeStr.trim();
  const lessMatch = clean.match(/^[<≤]\s*=?\s*([0-9]+(?:\.[0-9]+)?)/);
  if (lessMatch) return { high: parseFloat(lessMatch[1]), isOneSided: '<' };
  const greaterMatch = clean.match(/^[>≥]\s*=?\s*([0-9]+(?:\.[0-9]+)?)/);
  if (greaterMatch) return { low: parseFloat(greaterMatch[1]), isOneSided: '>' };
  const twoSidedMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:-|–|—|to)\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (twoSidedMatch) return { low: parseFloat(twoSidedMatch[1]), high: parseFloat(twoSidedMatch[2]) };
  return {};
}

function classifyValue(value, rangeStr) {
  if (isNaN(value)) return { status: 'indeterminate' };
  const { low, high, isOneSided } = parseRangeBounds(rangeStr);
  if (isOneSided === '<' && high !== undefined) return { status: value <= high ? 'normal' : 'high' };
  if (isOneSided === '>' && low !== undefined) return { status: value >= low ? 'normal' : 'low' };
  if (low !== undefined && high !== undefined) {
    if (value < low) return { status: 'low' };
    if (value > high) return { status: 'high' };
    return { status: 'normal' };
  }
  return { status: 'indeterminate' };
}

const tests = [
  { val: 11.2, range: '13.5 - 17.5', expected: 'low' },
  { val: 13.5, range: '13.5 - 17.5', expected: 'normal' },
  { val: 15.0, range: '13.5 - 17.5', expected: 'normal' },
  { val: 17.5, range: '13.5 - 17.5', expected: 'normal' },
  { val: 18.2, range: '13.5 - 17.5', expected: 'high' },
  { val: 245, range: '< 200', expected: 'high' },
  { val: 180, range: '< 200', expected: 'normal' },
  { val: 38, range: '> 50', expected: 'low' },
  { val: 55, range: '> 50', expected: 'normal' },
  { val: 120, range: '', expected: 'indeterminate' }
];

let allPassed = true;
tests.forEach(t => {
  const res = classifyValue(t.val, t.range).status;
  const ok = res === t.expected;
  if (!ok) allPassed = false;
  console.log(`val: ${t.val}, range: '${t.range}' => ${res} (${ok ? 'PASS' : 'FAIL, expected ' + t.expected})`);
});

if (allPassed) {
  console.log('\n[PASS] All 10 Deterministic Range Engine Tests Passed Successfully!');
  process.exit(0);
} else {
  process.exit(1);
}
