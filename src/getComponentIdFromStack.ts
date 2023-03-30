const idCache: Record<string, string> = {};
let nextId = 0;

export const getComponentIdFromStack = () => {
  const { stack } = new Error();

  const longId = [2, 3]
    .map(row =>
      stack
        ?.split('\n')
        [row].split(' ')
        .pop()
        ?.replace(window.location.href, '')
    )
    .join('');

  if (!longId) {
    console.warn('Counld not generate component id');
    return Math.random().toString().replace('0.', 'lsCrnd');
  }

  if (!idCache[longId]) {
    idCache[longId] = `lsC${nextId}`;
    nextId += 1;
  }

  return idCache[longId];
};
