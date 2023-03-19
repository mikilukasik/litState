"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createState = exports.addListener = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
let listenerBeingExecuted = null;
const addListener = (listenerFunction) => {
    const parentListener = listenerBeingExecuted;
    listenerBeingExecuted = listenerFunction;
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
    const executeListeners = (prop) => (listenersSubscribedTo[prop] || []).forEach(listener => listener());
    return new Proxy(stateTarget, {
        get: (target, prop) => {
            if (listenerBeingExecuted) {
                if (!(listenersSubscribedTo[prop] || []).includes(listenerBeingExecuted)) {
                    if (!listenersSubscribedTo[prop])
                        listenersSubscribedTo[prop] = [];
                    listenersSubscribedTo[prop].push(listenerBeingExecuted);
                }
            }
            return target[prop];
        },
        set: (target, prop, value) => {
            if (typeof value === 'object' && value !== null) {
                target[prop] = (0, exports.createState)(Array.isArray(value) ? value.slice() : Object.assign({}, value));
                executeListeners(prop);
                return true;
            }
            target[prop] = value;
            executeListeners(prop);
            return true;
        },
    });
};
exports.createState = createState;
