"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderComponent = void 0;
const global_1 = require("./global");
const state_1 = require("./state");
const updateComponentInDom_1 = require("./updateComponentInDom");
const renderComponent = (id, component, props) => {
    global_1.LITSTATE.componentsCurrentProps[id] = props;
    const renderedString = (0, state_1.addListener)(() => {
        const parentId = global_1.LITSTATE.componentBeingRendered;
        global_1.LITSTATE.componentBeingRendered = id;
        const renderedString = component(global_1.LITSTATE.componentsCurrentProps[id]);
        global_1.LITSTATE.componentBeingRendered = parentId;
        const componentInDom = document.getElementById(id);
        if (!componentInDom)
            return renderedString;
        (0, updateComponentInDom_1.updateComponentInDom)(componentInDom, renderedString);
        return renderedString;
    });
    return renderedString;
};
exports.renderComponent = renderComponent;
