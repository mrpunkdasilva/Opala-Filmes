/**
 * Creates a pseudo-random number generator from a seed string.
 * @param {string} seed - The seed.
 * @returns {function(): number} A function that returns a pseudo-random number between 0 and 1.
 */
export function makePRNG(seed) {
  let s = seed ? seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) : Math.floor(Math.random() * 10000);
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Generates a deterministic hexadecimal ID from a seed.
 * @param {string} seed - The seed for the ID.
 * @returns {string} A 16-character uppercase hex ID prefixed with '0x'.
 */
export function generateGemId(seed) {
  if (!seed) return '0x0000000000000000';
  const prng = makePRNG(seed);
  let id = '0x';
  for (let i = 0; i < 16; i++) {
    id += Math.floor(prng() * 16).toString(16);
  }
  return id.toUpperCase();
}
