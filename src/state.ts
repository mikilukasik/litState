/* eslint-disable @typescript-eslint/no-explicit-any */
let listenerBeingExecuted: string | null = null;
const listenersById: Record<string, () => void> = {};
let listenersOnHold: (()=>void)[] | null = null;

export const addListener = <T>(listenerFunction: () => T, id: string): T => {
  const parentListener = listenerBeingExecuted;
  listenerBeingExecuted = id;

  listenersById[id] = listenerFunction;
  const result = listenerFunction();

  listenerBeingExecuted = parentListener;

  return result;
};

export const batchUpdate = (updater:()=>void)=>{
  listenersOnHold = [];

  updater();

  listenersOnHold.forEach(l => l());
  listenersOnHold = null;
}

export const createState = <T>(_stateTarget: T): T => {
  if (_stateTarget === null) return null as T;

  let stateTarget: Record<string | number, any>;

  if (Array.isArray(_stateTarget)) {
    stateTarget = _stateTarget.map(val =>
      typeof val === 'object' ? createState(val) : val
    ) as Record<string | number, any>;
  } else {
    stateTarget = { ..._stateTarget } as Record<string | number, any>;
    Object.keys(stateTarget).forEach(key => {
      if (typeof stateTarget[key] === 'object') {
        stateTarget[key] = createState(stateTarget[key]);
      }
    });
  }

  const listenersSubscribedTo: Record<string | number, string[]> = {};

  const executeListeners = (prop: string | number) =>
    (listenersSubscribedTo[prop] || []).forEach(listenerId =>
      listenersById[listenerId]()
    );

  return new Proxy(stateTarget, {
    get: (target, prop) => {
      const propStr = prop.toString();
      if (listenerBeingExecuted && propStr !== 'constructor') {
        if (
          // TODO: figure out how constructor makes it here and errors 
          !(listenersSubscribedTo[propStr] || []).includes(
            listenerBeingExecuted
          )
        ) {
          if (!listenersSubscribedTo[propStr])
            listenersSubscribedTo[propStr] = [];
          listenersSubscribedTo[propStr].push(listenerBeingExecuted);
        } 
      }

      return target[propStr];
    },
    set: (target, prop, value) => {
      const propStr = prop.toString();
      if (typeof value === 'object' && value !== null) {
        target[propStr] = createState(
          Array.isArray(value) ? value.slice() : { ...value }
        );

        if (listenersOnHold) {
          listenersOnHold.push(()=>{
            executeListeners(propStr);
          });
        } else {
          executeListeners(propStr);
        }

        return true;
      }

      target[propStr] = value;

      if (listenersOnHold) {
        listenersOnHold.push(()=>{
          executeListeners(propStr);
        });
      } else {
        executeListeners(propStr);
      }

      return true;
    },
  }) as T;
};
