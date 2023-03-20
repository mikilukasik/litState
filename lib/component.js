"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.component = void 0;
const renderComponent_1 = require("./renderComponent");
const component = (functionalComponent, attributes) => {
    const renderer = (id, _props) => {
        if (!id)
            throw new Error(`component called without id`);
        const props = Object.assign(Object.assign({}, _props), { id });
        const pharsedAttributes = attributes
            ? typeof attributes === 'object'
                ? attributes
                : attributes(props)
            : {};
        const renderedString = (0, renderComponent_1.renderComponent)(id, functionalComponent, props, pharsedAttributes);
        return renderedString;
    };
    return renderer;
};
exports.component = component;
