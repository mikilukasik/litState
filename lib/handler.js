"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const global_1 = require("./global");
const handler = handlerToDefine => {
    const componentId = global_1.LITSTATE.componentBeingRendered || 'global';
    const handlerId = Math.random().toString().replace('0.', 'lsHandler');
    if (!global_1.LITSTATE.handlersPerComponent[componentId])
        global_1.LITSTATE.handlersPerComponent[componentId] = {};
    global_1.LITSTATE.handlersPerComponent[componentId][handlerId] = (event, elm) => handlerToDefine(event, elm);
    return `window.LITSTATE.handlersPerComponent['${componentId}']['${handlerId}'](event, this)`;
};
exports.handler = handler;
