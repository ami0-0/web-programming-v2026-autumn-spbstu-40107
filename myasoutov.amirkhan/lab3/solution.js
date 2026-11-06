export function findMedian(arr) {
  if (!arr.every((num) => typeof num === 'number' && !Number.isNaN(num))) {
    throw new TypeError('Все элементы массива должны быть числами');
  }

  if (arr.length === 0) {
    return null;
  }

  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}
