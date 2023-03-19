/* eslint-disable @typescript-eslint/no-explicit-any */
let listenerBeingExecuted: (() => void) | null = null;

export const addListener = <T>(listenerFunction: () => T): T => {
  const parentListener = listenerBeingExecuted;
  listenerBeingExecuted = listenerFunction;

  const result = listenerFunction();

  listenerBeingExecuted = parentListener;

  return result;
};

export const createState = <T>(_stateTarget: T): T => {
  if (_stateTarget === null) return null as T;

  let stateTarget: Record<string | symbol, any>;

  if (Array.isArray(_stateTarget)) {
    stateTarget = _stateTarget.map(val =>
      typeof val === 'object' ? createState(val) : val
    ) as Record<string | symbol, any>;
  } else {
    stateTarget = { ..._stateTarget } as Record<string | symbol, any>;
    Object.keys(stateTarget).forEach(key => {
      if (typeof stateTarget[key] === 'object') {
        stateTarget[key] = createState(stateTarget[key]);
      }
    });
  }

  const listenersSubscribedTo: Record<string | symbol, (() => void)[]> = {};

  const executeListeners = (prop: string | symbol) =>
    (listenersSubscribedTo[prop] || []).forEach(listener => listener());

  return new Proxy(stateTarget, {
    get: (target, prop) => {
      if (listenerBeingExecuted) {
        if (
          !(listenersSubscribedTo[prop] || []).includes(listenerBeingExecuted)
        ) {
          if (!listenersSubscribedTo[prop]) listenersSubscribedTo[prop] = [];
          listenersSubscribedTo[prop].push(listenerBeingExecuted);
        }
      }

      return target[prop];
    },
    set: (target, prop, value) => {
      if (typeof value === 'object' && value !== null) {
        target[prop] = createState(
          Array.isArray(value) ? value.slice() : { ...value }
        );

        executeListeners(prop);
        return true;
      }

      target[prop] = value;

      executeListeners(prop);
      return true;
    },
  }) as T;
};
