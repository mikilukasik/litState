export const getComponentIdFromStack = () =>
  new Error().stack
    ?.split('\n')[3]
    .split(' ')
    .pop()
    ?.replace(window.location.href, '') || 'unknown-caller';
