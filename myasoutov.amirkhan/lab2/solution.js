export function findMissingNumber(arr) {
  if (!arr.every((num) => typeof num === 'number' && !Number.isNaN(num))) {
    throw new TypeError('Все элементы массива должны быть числами');
  }

  const n = arr.length + 1;
  const expectedSum = (n * (n + 1)) / 2;
  return expectedSum - arr.reduce((sum, num) => sum + num, 0);
}
