"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.component = void 0;
const renderComponent_1 = require("./renderComponent");
const component = (functionalComponent, attributes) => {
    return (props = {}) => {
        const pharsedAttributes = attributes
            ? typeof attributes === 'object'
                ? attributes
                : attributes(props)
            : {};
        const id = Math.random().toString().replace('0.', 'lsComponent');
        const renderedString = (0, renderComponent_1.renderComponent)(id, functionalComponent, props);
        return `<span id="${id}" ${Object.keys(pharsedAttributes)
            .map(key => `${key}="${pharsedAttributes[key]}"`)
            .join(' ')}>${renderedString}</span>`;
    };
};
exports.component = component;
