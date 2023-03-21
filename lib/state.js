"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createState = exports.addListener = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
let listenerBeingExecuted = null;
const listenersById = {};
const addListener = (listenerFunction, id) => {
    const parentListener = listenerBeingExecuted;
    listenerBeingExecuted = id;
    listenersById[id] = listenerFunction;
    const result = listenerFunction();
    listenerBeingExecuted = parentListener;
    return result;
};
exports.addListener = addListener;
const createState = (_stateTarget) => {
    if (_stateTarget === null)
        return null;
    let stateTarget;
    if (Array.isArray(_stateTarget)) {
        stateTarget = _stateTarget.map(val => typeof val === 'object' ? (0, exports.createState)(val) : val);
    }
    else {
        stateTarget = Object.assign({}, _stateTarget);
        Object.keys(stateTarget).forEach(key => {
            if (typeof stateTarget[key] === 'object') {
                stateTarget[key] = (0, exports.createState)(stateTarget[key]);
            }
        });
    }
    const listenersSubscribedTo = {};
    const executeListeners = (prop) => (listenersSubscribedTo[prop] || []).forEach(listenerId => listenersById[listenerId]());
    return new Proxy(stateTarget, {
        get: (target, prop) => {
            const propStr = prop.toString();
            if (listenerBeingExecuted) {
                // console.log(listenerBeingExecuted.toString());
                if (!(listenersSubscribedTo[propStr] || []).includes(listenerBeingExecuted)) {
                    if (!listenersSubscribedTo[propStr])
                        listenersSubscribedTo[propStr] = [];
                    listenersSubscribedTo[propStr].push(listenerBeingExecuted);
                    console.log(listenersSubscribedTo[propStr].length);
                }
                else
                    console.log('did not subscribe');
            }
            return target[propStr];
        },
        set: (target, prop, value) => {
            const propStr = prop.toString();
            if (typeof value === 'object' && value !== null) {
                target[propStr] = (0, exports.createState)(Array.isArray(value) ? value.slice() : Object.assign({}, value));
                executeListeners(propStr);
                return true;
            }
            target[propStr] = value;
            executeListeners(propStr);
            return true;
        },
    });
};
exports.createState = createState;
