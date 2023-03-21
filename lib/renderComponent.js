"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderComponent = void 0;
const global_1 = require("./global");
const state_1 = require("./state");
const recursivelyUpdateComponentInDom_1 = require("./recursivelyUpdateComponentInDom");
const currentPropsProxy = global_1.LITSTATE.componentsCurrentProps;
const renderComponent = (id, component, props, pharsedAttributes) => {
    const parentId = global_1.LITSTATE.componentBeingRendered;
    global_1.LITSTATE.componentBeingRendered = id;
    const renderedString = (0, state_1.addListener)(() => {
        const renderedString = `<span id="${id}" ${Object.keys(pharsedAttributes)
            .map(key => `${key}="${pharsedAttributes[key]}"`)
            .join(' ')}>${component(props || currentPropsProxy[id])}</span>`;
        global_1.LITSTATE.componentsCurrentProps[id] = props;
        (0, recursivelyUpdateComponentInDom_1.recursivelyUpdateComponentInDom)(id.toString(), renderedString);
        return renderedString;
    }, `renderListener-${id}`);
    global_1.LITSTATE.componentBeingRendered = parentId;
    return renderedString;
};
exports.renderComponent = renderComponent;
