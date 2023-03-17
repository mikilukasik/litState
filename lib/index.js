"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html = exports.component = exports.mount = exports.createState = exports.handler = void 0;
const LITSTATE = {
    handlersPerComponent: {},
    components: {},
    componentsCurrentProps: {},
    componentBeingRendered: null,
};
Object.assign(window, { LITSTATE });
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
            container.innerHTML = renderedString;
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
    container.innerHTML = content;
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
