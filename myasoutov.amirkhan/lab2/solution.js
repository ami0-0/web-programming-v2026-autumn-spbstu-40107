export function findMissingNumber(arr) {
  const n = arr.length + 1;
  const expectedSum = (n * (n + 1)) / 2;
  return expectedSum - arr.reduce((sum, num) => sum + num, 0);
}
