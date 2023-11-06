import { LITSTATE } from './global';

/* eslint-disable @typescript-eslint/no-explicit-any */
const componentStates: { [key: string]: any } = {};
const listenersById: Record<string, () => void> = {};
const listenerRemoversById: Record<string, () => void> = {};

let listenerBeingExecuted: string | null = null;
let listenersOnHold: { [key: string]: () => void } | null = null;

export const addListener = <T>(listenerFunction: () => T, id: string): T => {
  const parentListener = listenerBeingExecuted;
  listenerBeingExecuted = id;

  listenersById[id] = listenerFunction;
  listenerRemoversById[id] = () => delete listenersById[id];

  const result = listenerFunction();

  listenerBeingExecuted = parentListener;

  return result;
};

export const removeListener = (id: string): void => {
  try {
    listenerRemoversById[id]();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Could not remove listener', e);
  }
};

export const batchUpdate = (updater: () => void) => {
  listenersOnHold = {};

  updater();

  Object.values(listenersOnHold).forEach(l => l());
  listenersOnHold = null;
};

export const createState = <T>(_stateTarget: T): T => {
  if (!LITSTATE.componentBeingRendered) return createNewState(_stateTarget); // creates a global state

  if (componentStates[LITSTATE.componentBeingRendered])
    return componentStates[LITSTATE.componentBeingRendered] as T; // returns existing local state

  componentStates[LITSTATE.componentBeingRendered] =
    createNewState(_stateTarget);
  return componentStates[LITSTATE.componentBeingRendered]; // creates new local state
};

const createNewState = <T>(_stateTarget: T): T => {
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
    (listenersSubscribedTo[prop] || []).forEach(listenerId => {
      if (listenersOnHold) {
        listenersOnHold[listenerId] = listenersById[listenerId];
        return;
      }

      listenersById[listenerId]();
    });

  return new Proxy(stateTarget, {
    get: (target, prop) => {
      const propStr = prop.toString();
      if (listenerBeingExecuted && propStr !== 'constructor') {
        if (!listenersSubscribedTo[propStr])
          listenersSubscribedTo[propStr] = [];

        if (!listenersSubscribedTo[propStr].includes(listenerBeingExecuted)) {
          listenersSubscribedTo[propStr].push(listenerBeingExecuted);

          const existingListenerRemover =
            listenerRemoversById[listenerBeingExecuted];

          const currentListenerId = listenerBeingExecuted;
          listenerRemoversById[listenerBeingExecuted] = () => {
            listenersSubscribedTo[propStr] = listenersSubscribedTo[
              propStr
            ].filter(id => id !== currentListenerId);
            existingListenerRemover();
          };
        }
      }

      return target[propStr];
    },
    set: (target, prop, value) => {
      const propStr = prop.toString();
      if (target[propStr] === value) return true;

      if (typeof value === 'object' && value !== null) {
        target[propStr] = createState(
          Array.isArray(value) ? value.slice() : { ...value }
        );
      } else {
        target[propStr] = value;
      }

      executeListeners(propStr);
      return true;
    },
  }) as T;
};
