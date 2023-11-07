const idCache: Record<string, string> = {};
let nextId = 0;

export const resetId = () => {
  nextId = 0;
  Object.keys(idCache).forEach(key => delete idCache[key]);
};

export const getLongIdFromStack = (stack: string) => {
  const longId = [2, 3, 4, 5]
    .map(row =>
      stack
        ?.split('\n')
        [row]?.split(' ')
        .pop()
        ?.replace(window.location.href, '')
    )
    .join('');

  return longId;
};

export const getIdFromStack = () => {
  const { stack = '' } = new Error();
  const longId = getLongIdFromStack(stack);

  if (!longId) {
    console.warn('Could not generate component id');
    return Math.random().toString().replace('0.', 'lsRndId');
  }

  if (!idCache[longId]) {
    idCache[longId] = `ls${nextId}`;
    nextId += 1;
  }

  return idCache[longId];
};
