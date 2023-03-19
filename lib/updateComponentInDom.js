"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComponentInDom = void 0;
const global_1 = require("./global");
const parseHtmlWithIds = (newElement) => {
    const elementsById = {};
    function traverse(element) {
        if (element.id && !element.id.startsWith('lsComponent')) {
            elementsById[element.id] = element;
        }
        for (const child of Array.from(element.children)) {
            traverse(child);
        }
    }
    traverse(newElement);
    return elementsById;
};
const updateAttributes = (source, target) => {
    // Update attributes
    for (const { name, value } of Array.from(source.attributes)) {
        if (target.getAttribute(name) !== value) {
            target.setAttribute(name, value);
        }
    }
};
const updateComponentInDom = (container, newHtml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${newHtml}</body>`, 'text/html');
    const newElement = doc.body.firstElementChild;
    if (!newElement) {
        container.innerHTML = '';
        return;
    }
    const newElementsWithIds = parseHtmlWithIds(newElement);
    if (!newElementsWithIds) {
        // todo: check if we need to clear disappeared elements form memory to avoid memory leak here
        // Clear the target element's content
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        // Add the new element to the target element
        container.appendChild(newElement);
        return;
    }
    const needToReRender = Object.keys(newElementsWithIds).reduce((p, elementId) => {
        if (!global_1.LITSTATE.elementsWithIds[elementId]) {
            return true;
        }
        updateAttributes(newElementsWithIds[elementId], global_1.LITSTATE.elementsWithIds[elementId]);
        return p;
    }, false);
    if (needToReRender) {
        // Clear the target element's content
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        // Add the new element to the target element
        container.appendChild(newElement);
        const attachedElementsWithIds = parseHtmlWithIds(container);
        Object.assign(global_1.LITSTATE.elementsWithIds, attachedElementsWithIds);
        return;
    }
    if (newElement.isEqualNode(container.firstElementChild)) {
        return;
    }
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    // Add the new element to the target element
    container.appendChild(newElement);
    const attachedElementsWithIds = parseHtmlWithIds(container);
    Object.assign(global_1.LITSTATE.elementsWithIds, attachedElementsWithIds);
};
exports.updateComponentInDom = updateComponentInDom;
