export const getComponentIdFromStack = () => {
  const { stack } = new Error();

  return (
    [2, 3]
      .map(row =>
        stack
          ?.split('\n')
          [row].split(' ')
          .pop()
          ?.replace(window.location.href, '')
      )
      .join('') || 'unknown-caller'
  );
};
