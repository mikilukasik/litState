"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html = exports.component = exports.mount = exports.createState = exports.handler = void 0;
const LITSTATE = {
    handlersPerComponent: {},
    components: {},
    componentsCurrentProps: {},
    elementsWithIds: {},
    componentBeingRendered: null,
};
Object.assign(window, { LITSTATE });
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
const updateContainer = (container, newHtml) => {
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
        if (!LITSTATE.elementsWithIds[elementId]) {
            return true;
        }
        updateAttributes(newElementsWithIds[elementId], LITSTATE.elementsWithIds[elementId]);
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
        Object.assign(LITSTATE.elementsWithIds, attachedElementsWithIds);
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
    Object.assign(LITSTATE.elementsWithIds, attachedElementsWithIds);
};
const registerHandlers = (id, renderer) => {
    const parentId = LITSTATE.componentBeingRendered;
    LITSTATE.componentBeingRendered = id;
    const result = renderer();
    LITSTATE.componentBeingRendered = parentId;
    return result;
};
const handler = handlerToDefine => {
    const componentId = LITSTATE.componentBeingRendered || 'global';
    const handlerId = Math.random().toString().replace('0.', 'lsHandler');
    if (!LITSTATE.handlersPerComponent[componentId])
        LITSTATE.handlersPerComponent[componentId] = {};
    LITSTATE.handlersPerComponent[componentId][handlerId] = (event, elm) => handlerToDefine(event, elm);
    return `window.LITSTATE.handlersPerComponent.${componentId}.${handlerId}(event, this)`;
};
exports.handler = handler;
const createState = (_stateTarget) => {
    if (_stateTarget === null)
        return null;
    let stateTarget; //extends Record<string|symbol, any> ? Record<string|symbol, any> : null;
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
    const componentsSubscribedTo = {};
    const reRenderAffected = (prop) => {
        Object.keys(componentsSubscribedTo)
            .filter(componentId => componentsSubscribedTo[componentId][prop])
            .forEach(componentId => {
            delete LITSTATE.handlersPerComponent[componentId];
            const container = document.getElementById(componentId);
            if (!container)
                return;
            const renderedString = registerHandlers(componentId, () => LITSTATE.components[componentId](LITSTATE.componentsCurrentProps[componentId]));
            updateContainer(container, renderedString);
        });
    };
    return new Proxy(stateTarget, {
        get: (target, prop) => {
            if (LITSTATE.componentBeingRendered) {
                if (!componentsSubscribedTo[LITSTATE.componentBeingRendered])
                    componentsSubscribedTo[LITSTATE.componentBeingRendered] = {};
                componentsSubscribedTo[LITSTATE.componentBeingRendered][prop] = true;
            }
            return target[prop];
        },
        set: (target, prop, value) => {
            if (typeof value === 'object' && value !== null) {
                target[prop] = (0, exports.createState)(Array.isArray(value) ? value.slice() : Object.assign({}, value));
                reRenderAffected(prop);
                return true;
            }
            target[prop] = value;
            reRenderAffected(prop);
            return true;
        },
    });
};
exports.createState = createState;
const mount = (content, container) => {
    updateContainer(container, content);
};
exports.mount = mount;
const component = (functionalComponent) => {
    return (props = {}) => {
        const id = Math.random().toString().replace('0.', 'lsComponent');
        LITSTATE.components[id] = functionalComponent;
        LITSTATE.componentsCurrentProps[id] = props;
        const renderedString = registerHandlers(id, () => functionalComponent(props));
        return `<span id="${id}">${renderedString}</span>`;
    };
};
exports.component = component;
const html = (strings, ...values) => {
    let result = '';
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            result += values[i];
        }
    }
    return result;
};
exports.html = html;
