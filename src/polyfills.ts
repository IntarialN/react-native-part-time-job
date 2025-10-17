/* eslint-disable no-extend-native */

const defineIfMissing = (prototype, key, factory) => {
  if (typeof prototype[key] !== 'function') {
    Object.defineProperty(prototype, key, {
      configurable: true,
      writable: true,
      value: factory(),
    });
  }
};

defineIfMissing(Array.prototype, 'toReversed', () => function toReversed() {
  return [...this].reverse();
});

defineIfMissing(Array.prototype, 'toSorted', () => function toSorted(compareFn) {
  return [...this].sort(compareFn);
});

defineIfMissing(Array.prototype, 'toSpliced', () => function toSpliced(start, deleteCount, ...items) {
  const clone = [...this];
  const normalizedStart = start ?? 0;
  const normalizedDelete = deleteCount ?? clone.length;
  clone.splice(normalizedStart, normalizedDelete, ...items);
  return clone;
});

defineIfMissing(Array.prototype, 'with', () => function withAt(index, value) {
  const clone = [...this];
  const normalizedIndex = index < 0 ? clone.length + index : index;

  if (normalizedIndex < 0 || normalizedIndex >= clone.length) {
    throw new RangeError('Index out of bounds in Array.prototype.with polyfill');
  }

  clone[normalizedIndex] = value;
  return clone;
});
