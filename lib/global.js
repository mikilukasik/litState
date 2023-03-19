"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LITSTATE = void 0;
exports.LITSTATE = {
    handlersPerComponent: {},
    components: {},
    componentsCurrentProps: {},
    elementsWithIds: {},
    listenerBeingExecuted: null,
    componentBeingRendered: null,
};
Object.assign(window, { LITSTATE: exports.LITSTATE });
