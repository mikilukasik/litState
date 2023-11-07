/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var LITSTATE = {
    handlersPerComponent: {},
    components: {},
    componentsCurrentProps: {},
    elementsWithIds: {},
    listenerBeingExecuted: null,
    componentBeingRendered: null,
};
Object.assign(window, { LITSTATE: LITSTATE });

/* eslint-disable @typescript-eslint/no-explicit-any */
var componentStates = {};
var listenersById = {};
var listenerBeingExecuted = null;
var addListener = function (listenerFunction, id) {
    var parentListener = listenerBeingExecuted;
    listenerBeingExecuted = id;
    listenersById[id] = listenerFunction;
    var result = listenerFunction();
    listenerBeingExecuted = parentListener;
    return result;
};
var createState = function (_stateTarget) {
    if (!LITSTATE.componentBeingRendered)
        return createNewState(_stateTarget); // creates a global state
    if (componentStates[LITSTATE.componentBeingRendered])
        return componentStates[LITSTATE.componentBeingRendered]; // returns existing local state
    componentStates[LITSTATE.componentBeingRendered] =
        createNewState(_stateTarget);
    return componentStates[LITSTATE.componentBeingRendered]; // creates new local state
};
var createNewState = function (_stateTarget) {
    if (_stateTarget === null)
        return null;
    var stateTarget;
    if (Array.isArray(_stateTarget)) {
        stateTarget = _stateTarget.map(function (val) {
            return typeof val === 'object' ? createState(val) : val;
        });
    }
    else {
        stateTarget = __assign({}, _stateTarget);
        Object.keys(stateTarget).forEach(function (key) {
            if (typeof stateTarget[key] === 'object') {
                stateTarget[key] = createState(stateTarget[key]);
            }
        });
    }
    var listenersSubscribedTo = {};
    var executeListeners = function (prop) {
        return (listenersSubscribedTo[prop] || []).forEach(function (listenerId) {
            listenersById[listenerId]();
        });
    };
    return new Proxy(stateTarget, {
        get: function (target, prop) {
            var propStr = prop.toString();
            if (listenerBeingExecuted && propStr !== 'constructor') {
                if (!listenersSubscribedTo[propStr])
                    listenersSubscribedTo[propStr] = [];
                if (!listenersSubscribedTo[propStr].includes(listenerBeingExecuted)) {
                    listenersSubscribedTo[propStr].push(listenerBeingExecuted);
                }
            }
            return target[propStr];
        },
        set: function (target, prop, value) {
            var propStr = prop.toString();
            if (target[propStr] === value)
                return true;
            if (typeof value === 'object' && value !== null) {
                target[propStr] = createState(Array.isArray(value) ? value.slice() : __assign({}, value));
            }
            else {
                target[propStr] = value;
            }
            executeListeners(propStr);
            return true;
        },
    });
};

var updateAttributes = function (source, target) {
    if (source.nodeType === Node.ELEMENT_NODE &&
        target.nodeType === Node.ELEMENT_NODE) {
        var sourceElement = source;
        var targetElement = target;
        for (var _i = 0, _a = sourceElement.getAttributeNames(); _i < _a.length; _i++) {
            var attr = _a[_i];
            var srcAtt = sourceElement.getAttribute(attr);
            var trgtAtt = targetElement.getAttribute(attr);
            if (srcAtt !== trgtAtt) {
                targetElement.setAttribute(attr, sourceElement.getAttribute(attr));
            }
        }
        for (var _b = 0, _c = targetElement.getAttributeNames(); _b < _c.length; _b++) {
            var attr = _c[_b];
            if (!sourceElement.hasAttribute(attr)) {
                targetElement.removeAttribute(attr);
            }
        }
    }
};
var updateDomElement = function (source, target) {
    if (source.isEqualNode(target))
        return;
    updateAttributes(source, target);
    if (source.isEqualNode(target))
        return;
    if (source.nodeType !== target.nodeType) {
        target.replaceWith(source.cloneNode(true));
        return;
    }
    var sourceChildren = Array.from(source.childNodes);
    var targetChildren = Array.from(target.childNodes);
    sourceChildren.forEach(function (sourceChild, index) {
        if (!sourceChild)
            return;
        var targetChild = targetChildren[index];
        if (!targetChild) {
            target.appendChild(sourceChild.cloneNode(true));
            return;
        }
        updateDomElement(sourceChild, targetChild);
    });
    while (targetChildren.length > sourceChildren.length) {
        var childIndexToRemove = targetChildren.findIndex(function (tc) { return !sourceChildren.includes(tc); });
        if (childIndexToRemove >= 0) {
            try {
                target.removeChild(targetChildren[childIndexToRemove]);
            }
            catch (e) {
                // do nothing if the child was already removed
            }
            targetChildren.splice(childIndexToRemove, 1);
        }
    }
    if (source.isEqualNode(target))
        return;
    target.replaceWith(source.cloneNode(true));
};

var updateComponentInDom = function (id, newHtml) {
    if (!newHtml)
        return;
    var containerInDom = document.getElementById(id);
    if (!containerInDom) {
        return;
    }
    var parser = new DOMParser();
    var doc = parser.parseFromString("<body>".concat(newHtml, "</body>"), 'text/html');
    var parseError = doc.querySelector('parsererror');
    var newElement = doc.body.firstElementChild;
    if (parseError || !newElement || newElement instanceof HTMLUnknownElement) {
        console.warn('empty element rendered');
        containerInDom.innerHTML = '';
        return;
    }
    updateDomElement(newElement, containerInDom);
};

var renderComponent = function (id, component, props, attributes) {
    var componentId = "".concat(LITSTATE.componentBeingRendered || '', "/").concat(id);
    var parsedAttributes = attributes
        ? typeof attributes === 'object'
            ? attributes
            : attributes(props ||
                LITSTATE.componentsCurrentProps[componentId] || { id: componentId })
        : {};
    var renderedString = addListener(function () {
        var parentId = LITSTATE.componentBeingRendered;
        LITSTATE.componentBeingRendered = componentId;
        var renderedString = "<span id=\"".concat(componentId, "\" ").concat(Object.keys(parsedAttributes)
            .map(function (key) { return "".concat(key, "=\"").concat(parsedAttributes[key], "\""); })
            .join(' '), ">").concat(component(props ||
            LITSTATE.componentsCurrentProps[componentId] || { id: componentId }), "</span>");
        LITSTATE.componentsCurrentProps[componentId] = props ||
            LITSTATE.componentsCurrentProps[componentId] || { id: componentId };
        updateComponentInDom(componentId.toString(), renderedString);
        LITSTATE.componentBeingRendered = parentId;
        return renderedString;
    }, "renderListener-".concat(componentId));
    return renderedString;
};

var idCache = {};
var nextId = 0;
var getLongIdFromStack = function (stack) {
    var longId = [2, 3, 4, 5]
        .map(function (row) {
        var _a, _b;
        return (_b = (_a = stack === null || stack === void 0 ? void 0 : stack.split('\n')[row]) === null || _a === void 0 ? void 0 : _a.split(' ').pop()) === null || _b === void 0 ? void 0 : _b.replace(window.location.href, '');
    })
        .join('');
    return longId;
};
var getIdFromStack = function () {
    var _a = new Error().stack, stack = _a === void 0 ? '' : _a;
    var longId = getLongIdFromStack(stack);
    if (!longId) {
        console.warn('Could not generate component id');
        return Math.random().toString().replace('0.', 'lsRndId');
    }
    if (!idCache[longId]) {
        idCache[longId] = "ls".concat(nextId);
        nextId += 1;
    }
    return idCache[longId];
};

var component = function (functionalComponent, attributes) {
    var renderer = function (_props) {
        if (_props === void 0) { _props = {}; }
        var id = _props.id || getIdFromStack();
        var props = __assign(__assign({}, _props), { id: id });
        var renderedString = renderComponent(id, functionalComponent, props, attributes);
        return renderedString;
    };
    return renderer;
};

var handler = function (handlerToDefine, id) {
    var componentId = LITSTATE.componentBeingRendered || 'global';
    var handlerId = "".concat(getIdFromStack()).concat(id ? "-".concat(id) : '');
    if (!LITSTATE.handlersPerComponent[componentId])
        LITSTATE.handlersPerComponent[componentId] = {};
    LITSTATE.handlersPerComponent[componentId][handlerId] = function (event, elm) { return handlerToDefine(event, elm); };
    return "window.LITSTATE.handlersPerComponent['".concat(componentId, "']['").concat(handlerId, "'](event, this)");
};

var html = function (strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var result = '';
    for (var i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            result += values[i];
        }
    }
    return result;
};

var mount = function (content, id) {
    updateComponentInDom(id, content);
};

var ContentCard = component(function (_a) {
    var children = _a.children, sectionName = _a.sectionName;
    return html(templateObject_1$e || (templateObject_1$e = __makeTemplateObject([" <div id=\"", "\" class=\"content-card\">", "</div> "], [" <div id=\"", "\" class=\"content-card\">", "</div> "])), sectionName, children);
});
var templateObject_1$e;

var Home = component(function () { return html(templateObject_1$d || (templateObject_1$d = __makeTemplateObject(["\n    <div class=\"home\">\n      <h2>litState</h2>\n      <p>\n        litState is a lean TypeScript framework for fast web app creation. Its\n        highlights:\n      </p>\n      <ul>\n        <li>Zero dependencies</li>\n        <li>Simple, easy-to-learn API</li>\n        <li>Reactive components with precise updates</li>\n        <li>Effortless state management with proxies</li>\n      </ul>\n      <p>\n        Ideal for small projects, it allows for quick setup and simple global\n        state with automatic component updates.\n      </p>\n      <p>\n        This website is built with litState. Check out the source code\n        <a target=\"_blank\" href=\"https://github.com/mikilukasik/litstate\"\n          >here</a\n        >.\n      </p>\n    </div>\n  "], ["\n    <div class=\"home\">\n      <h2>litState</h2>\n      <p>\n        litState is a lean TypeScript framework for fast web app creation. Its\n        highlights:\n      </p>\n      <ul>\n        <li>Zero dependencies</li>\n        <li>Simple, easy-to-learn API</li>\n        <li>Reactive components with precise updates</li>\n        <li>Effortless state management with proxies</li>\n      </ul>\n      <p>\n        Ideal for small projects, it allows for quick setup and simple global\n        state with automatic component updates.\n      </p>\n      <p>\n        This website is built with litState. Check out the source code\n        <a target=\"_blank\" href=\"https://github.com/mikilukasik/litstate\"\n          >here</a\n        >.\n      </p>\n    </div>\n  "]))); });
var templateObject_1$d;

var GettingStarted = component(function () { return html(templateObject_1$c || (templateObject_1$c = __makeTemplateObject(["\n    <div class=\"getting-started\">\n      <h2>Getting Started</h2>\n\n      Install the package:\n      <pre>\n        <code class=\"language-bash\">\nnpm install litstate\n        </code>\n      </pre>\n\n      Create a global state object:\n      <pre>\n        <code class=\"language-typescript\">\nimport { createState } from 'litstate';\n\nconst initialState = {\n  count: 0,\n};\n\nexport const globalState = createState(initialState);\n        </code>\n      </pre>\n\n      Create multiple components that use the global state:\n      <pre>\n        <code class=\"language-typescript\">\nimport { component, html, handler } from 'litstate';\nimport { globalState } from './globalState';\n\nexport const Counter = component(() => {\n  return html`\n    &lt;div>\n      &lt;p>Count: ${globalState.count}&lt;/p>\n    &lt;/div>\n  `;\n});\n\nexport const IncrementButton = component(() => {\n  const incrementHandler = handler(() => {\n    globalState.count++;\n  });\n\n  return html`\n    &lt;div>\n      &lt;button onclick=\"${incrementHandler}\">Increment&lt;/button>\n    &lt;/div>\n  `;\n});\n        </code>\n      </pre>\n\n      Create a root component that renders the other components:\n      <pre>\n        <code class=\"language-typescript\">\nimport { component, html } from 'litstate';\nimport { Counter } from './Counter';\nimport { IncrementButton } from './IncrementButton';\n\nexport const App = component(() => {\n  return html`\n    &lt;div>\n      ${Counter()}\n      ${IncrementButton()}\n    &lt;/div>\n  `;\n});\n        </code>\n      </pre>\n\n      Create a container element for your app:\n      <pre>\n        <code class=\"language-html\">\n&lt;div id=\"app\">&lt;/div>\n        </code>\n      </pre>\n\n      Mount the root component to the container element:\n      <pre>\n        <code class=\"language-typescript\">\nimport { mount } from 'litstate';\nimport { App } from './App';\n\nmount(App, 'app');\n        </code>\n      </pre>\n\n      <p>That's it! You can now increment the count by clicking the button.</p>\n    </div>\n  "], ["\n    <div class=\"getting-started\">\n      <h2>Getting Started</h2>\n\n      Install the package:\n      <pre>\n        <code class=\"language-bash\">\nnpm install litstate\n        </code>\n      </pre>\n\n      Create a global state object:\n      <pre>\n        <code class=\"language-typescript\">\nimport { createState } from 'litstate';\n\nconst initialState = {\n  count: 0,\n};\n\nexport const globalState = createState(initialState);\n        </code>\n      </pre>\n\n      Create multiple components that use the global state:\n      <pre>\n        <code class=\"language-typescript\">\nimport { component, html, handler } from 'litstate';\nimport { globalState } from './globalState';\n\nexport const Counter = component(() => {\n  return html\\`\n    &lt;div>\n      &lt;p>Count: \\${globalState.count}&lt;/p>\n    &lt;/div>\n  \\`;\n});\n\nexport const IncrementButton = component(() => {\n  const incrementHandler = handler(() => {\n    globalState.count++;\n  });\n\n  return html\\`\n    &lt;div>\n      &lt;button onclick=\"\\${incrementHandler}\">Increment&lt;/button>\n    &lt;/div>\n  \\`;\n});\n        </code>\n      </pre>\n\n      Create a root component that renders the other components:\n      <pre>\n        <code class=\"language-typescript\">\nimport { component, html } from 'litstate';\nimport { Counter } from './Counter';\nimport { IncrementButton } from './IncrementButton';\n\nexport const App = component(() => {\n  return html\\`\n    &lt;div>\n      \\${Counter()}\n      \\${IncrementButton()}\n    &lt;/div>\n  \\`;\n});\n        </code>\n      </pre>\n\n      Create a container element for your app:\n      <pre>\n        <code class=\"language-html\">\n&lt;div id=\"app\">&lt;/div>\n        </code>\n      </pre>\n\n      Mount the root component to the container element:\n      <pre>\n        <code class=\"language-typescript\">\nimport { mount } from 'litstate';\nimport { App } from './App';\n\nmount(App, 'app');\n        </code>\n      </pre>\n\n      <p>That's it! You can now increment the count by clicking the button.</p>\n    </div>\n  "]))); });
var templateObject_1$c;

var Component = component(function (props) {
    props.id; // Accessing props and id inside the component
    return html(templateObject_1$b || (templateObject_1$b = __makeTemplateObject(["\n    <div class=\"component\">\n      <h2>Component Function</h2>\n\n      <p>\n        The <code>component</code> function is used to define a reusable UI\n        component. It takes a function that returns a template literal as an\n        argument. This function can optionally receive an object of props, which\n        are passed when the component is invoked.\n      </p>\n\n      <h3>Props and Composition</h3>\n      <p>\n        Props are objects passed into the component function that allow data to\n        flow from the parent component down to the child components. They are\n        accessible within the component as the first argument to the function.\n      </p>\n\n      <h3>Defining a Component</h3>\n      <pre>\n        <code class=\"language-javascript\">\nexport const MyComponent = component(({ title, content }) => {\n  return html`\n    &lt;div>\n      &lt;h1>${title}&lt;/h1>\n      &lt;p>${content}&lt;/p>\n    &lt;/div>\n  `;\n});\n        </code>\n      </pre>\n\n      <h3>Rendering a Component with Props</h3>\n      <pre>\n        <code class=\"language-javascript\">\n// Somewhere in the parent component\nconst title = 'Hello World';\nconst content = 'This is a simple component.';\n\nhtml`\n  ${MyComponent({ title, content })}\n`;\n        </code>\n      </pre>\n\n      <h3>Usage of Component ID</h3>\n      <p>\n        The component's unique identifier, <code>id</code>, can be included in\n        the props object. If not provided, the <code>id</code> is automatically\n        generated based on the component's position in the call stack and is\n        appended to the props object, facilitating straightforward access within\n        the component function.\n      </p>\n      <p>\n        When instantiating multiple instances of a component within a loop, it's\n        crucial to assign a distinct <code>id</code> prop to each. This\n        <code>id</code> is critical because, without it, components rendered in\n        a loop could share identical stack traces, potentially causing rendering\n        conflicts.\n      </p>\n\n      <pre>\n        <code class=\"language-javascript\">\nimport { component, html } from '../../../src';\n\nexport const LoopComponent = component(props => {\n  const { id } = props; // Destructure the id from props if needed\n\n  return html`\n    &lt;div>\n      &lt;!-- some HTML -->\n    &lt;/div>\n  `;\n});\n\n// Use the component in a loop with unique 'id' props\nhtml`\n  ${yourArray.map((item, index) =>\n    LoopComponent({ ...item, id: item.uniqueId || index })\n  )}\n`;\n</code>\n</pre>\n    </div>\n  "], ["\n    <div class=\"component\">\n      <h2>Component Function</h2>\n\n      <p>\n        The <code>component</code> function is used to define a reusable UI\n        component. It takes a function that returns a template literal as an\n        argument. This function can optionally receive an object of props, which\n        are passed when the component is invoked.\n      </p>\n\n      <h3>Props and Composition</h3>\n      <p>\n        Props are objects passed into the component function that allow data to\n        flow from the parent component down to the child components. They are\n        accessible within the component as the first argument to the function.\n      </p>\n\n      <h3>Defining a Component</h3>\n      <pre>\n        <code class=\"language-javascript\">\nexport const MyComponent = component(({ title, content }) => {\n  return html\\`\n    &lt;div>\n      &lt;h1>\\${title}&lt;/h1>\n      &lt;p>\\${content}&lt;/p>\n    &lt;/div>\n  \\`;\n});\n        </code>\n      </pre>\n\n      <h3>Rendering a Component with Props</h3>\n      <pre>\n        <code class=\"language-javascript\">\n// Somewhere in the parent component\nconst title = 'Hello World';\nconst content = 'This is a simple component.';\n\nhtml\\`\n  \\${MyComponent({ title, content })}\n\\`;\n        </code>\n      </pre>\n\n      <h3>Usage of Component ID</h3>\n      <p>\n        The component's unique identifier, <code>id</code>, can be included in\n        the props object. If not provided, the <code>id</code> is automatically\n        generated based on the component's position in the call stack and is\n        appended to the props object, facilitating straightforward access within\n        the component function.\n      </p>\n      <p>\n        When instantiating multiple instances of a component within a loop, it's\n        crucial to assign a distinct <code>id</code> prop to each. This\n        <code>id</code> is critical because, without it, components rendered in\n        a loop could share identical stack traces, potentially causing rendering\n        conflicts.\n      </p>\n\n      <pre>\n        <code class=\"language-javascript\">\nimport { component, html } from '../../../src';\n\nexport const LoopComponent = component(props => {\n  const { id } = props; // Destructure the id from props if needed\n\n  return html\\`\n    &lt;div>\n      &lt;!-- some HTML -->\n    &lt;/div>\n  \\`;\n});\n\n// Use the component in a loop with unique 'id' props\nhtml\\`\n  \\${yourArray.map((item, index) =>\n    LoopComponent({ ...item, id: item.uniqueId || index })\n  )}\n\\`;\n</code>\n</pre>\n    </div>\n  "])));
});
var templateObject_1$b;

var StateManagement = component(function () { return html(templateObject_1$a || (templateObject_1$a = __makeTemplateObject(["\n    <div class=\"state-management\">\n      <h2>State Management</h2>\n\n      <p>\n        State management plays a critical role in the consistent and efficient\n        behavior of UI components within web applications. Employing a reactive\n        state management pattern with recursively created proxies can\n        significantly enhance this process.\n      </p>\n\n      <h3>Creating Global and Local States</h3>\n      <p>\n        Global state proxies are created using the\n        <code>createState</code> method as outlined in the getting started\n        guide. Invoking the same method within a component initializes a local\n        state that is unique to it. This state is first set when the component\n        mounts, and on every rerender, the initially created local state is\n        consistently returned.\n      </p>\n\n      <h3>Automatic Component Rerenders</h3>\n      <p>\n        When interacting with state proxies, components do not require explicit\n        listeners for state changes. Internally, the\n        <code>addListener</code> method is utilized to automatically manage\n        rerenders of the component whenever its state properties are updated.\n      </p>\n\n      <h3>Batch Updates</h3>\n      <p>\n        Batch updates are a performance optimization technique that consolidates\n        state changes to prevent unnecessary rerenders. By wrapping state\n        changes within the <code>batchUpdate</code> method, all updates are\n        grouped and executed simultaneously, deferring rerenders until the\n        entire batch operation is complete.\n      </p>\n\n      <h3>Listeners for Custom Logic</h3>\n      <p>\n        To implement custom logic in response to state changes outside of\n        component lifecycles, you can use the <code>addListener</code> and\n        <code>removeListener</code> methods. These listeners execute once upon\n        creation, monitoring the accessed state properties, and are reinvoked\n        whenever those properties undergo changes. These listeners do not always\n        require a unique identifier. However, assigning a unique ID is necessary\n        when you intend to remove them later or if they are within loops to\n        prevent duplicates.\n      </p>\n\n      <h3>Deeply Nested Proxies</h3>\n      <p>\n        This state management pattern allows you to work with deeply nested\n        objects and arrays within your state, all treated as proxies. As a\n        result, components that depend on specific state properties will\n        rerender only when those particular properties are updated, ensuring\n        efficient and targeted updates.\n      </p>\n\n      <h3>Code Example and Usage</h3>\n      <p>\n        Below is a code example that showcases the implementation of state\n        management with proxies, including the use of batch updates and listener\n        methods for external state changes.\n      </p>\n\n      Initialize state management:\n      <pre>\n        <code class=\"language-typescript\">\nimport { createState } from 'litstate';\n\nexport const appState = createState({\n  user: null,\n  theme: 'light',\n  isLoggedIn: false\n});\n        </code>\n      </pre>\n\n      Listen to state changes in your components:\n      <pre>\n        <code class=\"language-typescript\">\nimport { component, html, handler } from 'litstate';\nimport { appState } from './appState';\n\nexport const UserInfo = component(() => {\n  return html`\n    &lt;div>\n      User: ${appState.user ? appState.user.name : 'Guest'}\n    &lt;/div>\n  `;\n});\n\nexport const ThemeSwitcher = component(() => {\n  const toggleTheme = handler(() => {\n    appState.theme = appState.theme === 'light' ? 'dark' : 'light';\n  });\n\n  return html`\n    &lt;button onclick=\"${toggleTheme}\">\n      Switch to ${appState.theme === 'light' ? 'dark' : 'light'} theme\n    &lt;/button>\n  `;\n});\n        </code>\n      </pre>\n\n      Update the global state from anywhere in your code:\n      <pre>\n        <code class=\"language-typescript\">\nimport { appState } from './appState';\n\nconst login = (username) => {\n  // Simulate a login\n  appState.user = { name: username };\n  appState.isLoggedIn = true;\n};\n        </code>\n      </pre>\n\n      You can also listen to state changes from outside of components. These\n      listeners are triggered once upon being added, subscribing to the keys\n      they reference. They will be executed again whenever any of the subscribed\n      keys are modified. When creating listeners within loops, ensure to provide\n      a unique id for each listener to maintain the correct tracking.\n      <pre>\n        <code class=\"language-typescript\">\nimport { addListener, removeListener } from 'litstate';\nimport { appState } from './appState';\n\naddListener(appState, () => {\n  const { user } = appState;\n  if (user) {\n    console.log('User logged in:', user.name);\n  }\n}, 'userLoginListener'); // The ID is optional unless you need to remove the listener later, or it is within a loop\n\n// Later, remove the listener\nremoveListener('userLoginListener');\n        </code>\n      </pre>\n\n      Components can also have their own local state:\n      <pre>\n        <code class=\"language-typescript\">\nimport { component, html, handler } from 'litstate';\n\nexport const Counter = component(() => {\n  const state = createState({ count: 0 });\n\n  const increment = handler(() => {\n    state.count++;\n  }\n\n  return html`\n    &lt;div>\n      Count: ${state.count}\n      &lt;button onclick=\"${increment}\">Increment&lt;/button>\n    &lt;/div>\n  `;\n});\n        </code>\n      </pre>\n\n      Perform batch updates to prevent unnecessary rerenders:\n      <pre>\n        <code class=\"language-typescript\">\nimport { batchUpdate, appState } from './appState';\n\n// Example of a batch update to change multiple state properties\nbatchUpdate(() => {\n    appState.user = { name: 'Alice' };\n    appState.isLoggedIn = true;\n    appState.theme = 'dark';\n});\n\n// This ensures that all changes are made in a single go,\n// reducing the number of renders triggered.\n        </code>\n      </pre>\n    </div>\n  "], ["\n    <div class=\"state-management\">\n      <h2>State Management</h2>\n\n      <p>\n        State management plays a critical role in the consistent and efficient\n        behavior of UI components within web applications. Employing a reactive\n        state management pattern with recursively created proxies can\n        significantly enhance this process.\n      </p>\n\n      <h3>Creating Global and Local States</h3>\n      <p>\n        Global state proxies are created using the\n        <code>createState</code> method as outlined in the getting started\n        guide. Invoking the same method within a component initializes a local\n        state that is unique to it. This state is first set when the component\n        mounts, and on every rerender, the initially created local state is\n        consistently returned.\n      </p>\n\n      <h3>Automatic Component Rerenders</h3>\n      <p>\n        When interacting with state proxies, components do not require explicit\n        listeners for state changes. Internally, the\n        <code>addListener</code> method is utilized to automatically manage\n        rerenders of the component whenever its state properties are updated.\n      </p>\n\n      <h3>Batch Updates</h3>\n      <p>\n        Batch updates are a performance optimization technique that consolidates\n        state changes to prevent unnecessary rerenders. By wrapping state\n        changes within the <code>batchUpdate</code> method, all updates are\n        grouped and executed simultaneously, deferring rerenders until the\n        entire batch operation is complete.\n      </p>\n\n      <h3>Listeners for Custom Logic</h3>\n      <p>\n        To implement custom logic in response to state changes outside of\n        component lifecycles, you can use the <code>addListener</code> and\n        <code>removeListener</code> methods. These listeners execute once upon\n        creation, monitoring the accessed state properties, and are reinvoked\n        whenever those properties undergo changes. These listeners do not always\n        require a unique identifier. However, assigning a unique ID is necessary\n        when you intend to remove them later or if they are within loops to\n        prevent duplicates.\n      </p>\n\n      <h3>Deeply Nested Proxies</h3>\n      <p>\n        This state management pattern allows you to work with deeply nested\n        objects and arrays within your state, all treated as proxies. As a\n        result, components that depend on specific state properties will\n        rerender only when those particular properties are updated, ensuring\n        efficient and targeted updates.\n      </p>\n\n      <h3>Code Example and Usage</h3>\n      <p>\n        Below is a code example that showcases the implementation of state\n        management with proxies, including the use of batch updates and listener\n        methods for external state changes.\n      </p>\n\n      Initialize state management:\n      <pre>\n        <code class=\"language-typescript\">\nimport { createState } from 'litstate';\n\nexport const appState = createState({\n  user: null,\n  theme: 'light',\n  isLoggedIn: false\n});\n        </code>\n      </pre>\n\n      Listen to state changes in your components:\n      <pre>\n        <code class=\"language-typescript\">\nimport { component, html, handler } from 'litstate';\nimport { appState } from './appState';\n\nexport const UserInfo = component(() => {\n  return html\\`\n    &lt;div>\n      User: \\${appState.user ? appState.user.name : 'Guest'}\n    &lt;/div>\n  \\`;\n});\n\nexport const ThemeSwitcher = component(() => {\n  const toggleTheme = handler(() => {\n    appState.theme = appState.theme === 'light' ? 'dark' : 'light';\n  });\n\n  return html\\`\n    &lt;button onclick=\"\\${toggleTheme}\">\n      Switch to \\${appState.theme === 'light' ? 'dark' : 'light'} theme\n    &lt;/button>\n  \\`;\n});\n        </code>\n      </pre>\n\n      Update the global state from anywhere in your code:\n      <pre>\n        <code class=\"language-typescript\">\nimport { appState } from './appState';\n\nconst login = (username) => {\n  // Simulate a login\n  appState.user = { name: username };\n  appState.isLoggedIn = true;\n};\n        </code>\n      </pre>\n\n      You can also listen to state changes from outside of components. These\n      listeners are triggered once upon being added, subscribing to the keys\n      they reference. They will be executed again whenever any of the subscribed\n      keys are modified. When creating listeners within loops, ensure to provide\n      a unique id for each listener to maintain the correct tracking.\n      <pre>\n        <code class=\"language-typescript\">\nimport { addListener, removeListener } from 'litstate';\nimport { appState } from './appState';\n\naddListener(appState, () => {\n  const { user } = appState;\n  if (user) {\n    console.log('User logged in:', user.name);\n  }\n}, 'userLoginListener'); // The ID is optional unless you need to remove the listener later, or it is within a loop\n\n// Later, remove the listener\nremoveListener('userLoginListener');\n        </code>\n      </pre>\n\n      Components can also have their own local state:\n      <pre>\n        <code class=\"language-typescript\">\nimport { component, html, handler } from 'litstate';\n\nexport const Counter = component(() => {\n  const state = createState({ count: 0 });\n\n  const increment = handler(() => {\n    state.count++;\n  }\n\n  return html\\`\n    &lt;div>\n      Count: \\${state.count}\n      &lt;button onclick=\"\\${increment}\">Increment&lt;/button>\n    &lt;/div>\n  \\`;\n});\n        </code>\n      </pre>\n\n      Perform batch updates to prevent unnecessary rerenders:\n      <pre>\n        <code class=\"language-typescript\">\nimport { batchUpdate, appState } from './appState';\n\n// Example of a batch update to change multiple state properties\nbatchUpdate(() => {\n    appState.user = { name: 'Alice' };\n    appState.isLoggedIn = true;\n    appState.theme = 'dark';\n});\n\n// This ensures that all changes are made in a single go,\n// reducing the number of renders triggered.\n        </code>\n      </pre>\n    </div>\n  "]))); });
var templateObject_1$a;

var Html = component(function () {
    return html(templateObject_1$9 || (templateObject_1$9 = __makeTemplateObject(["\n    <div class=\"html-explanation\">\n      <h2>HTML Function</h2>\n\n      <p>\n        The <code>html</code> function is a tagged template literal function\n        designed for creating HTML strings. It processes template literals,\n        which are enclosed in backticks, and can contain placeholders for\n        dynamic content.\n      </p>\n\n      <h3>How It Works</h3>\n      <p>\n        A template literal has two types of values: raw strings and values to be\n        interpolated. The\n        <code>html</code> function receives an array of strings and a list of\n        values to be interpolated into those strings. It then concatenates them\n        in order, forming a single HTML string.\n      </p>\n\n      <h3>Advantages of Using <code>html</code></h3>\n      <p>\n        This approach allows developers to write HTML in a familiar syntax\n        within JavaScript files while providing the convenience of inserting\n        dynamic content. Additionally, it aids in IDE syntax highlighting and\n        format checking, improving the development experience.\n      </p>\n\n      <h3>Example of <code>html</code> Function</h3>\n      <pre>\n        <code class=\"language-javascript\">\nexport const Greeting = component(({ name }) => {\n  return html`\n    &lt;div>Hello, ${name}!&lt;/div>\n  `;\n});\n        </code>\n      </pre>\n\n      <h3>Dynamic Content Interpolation</h3>\n      <p>\n        The placeholders in the template literal are filled with the values\n        provided, allowing dynamic content to be seamlessly integrated into the\n        static HTML structure.\n      </p>\n\n      <h3>Usage in Components</h3>\n      <p>\n        Components return the result of the <code>html</code> function, which is\n        an HTML string representing the component's template. This allows for\n        the creation of complex UIs with dynamic data binding.\n      </p>\n    </div>\n  "], ["\n    <div class=\"html-explanation\">\n      <h2>HTML Function</h2>\n\n      <p>\n        The <code>html</code> function is a tagged template literal function\n        designed for creating HTML strings. It processes template literals,\n        which are enclosed in backticks, and can contain placeholders for\n        dynamic content.\n      </p>\n\n      <h3>How It Works</h3>\n      <p>\n        A template literal has two types of values: raw strings and values to be\n        interpolated. The\n        <code>html</code> function receives an array of strings and a list of\n        values to be interpolated into those strings. It then concatenates them\n        in order, forming a single HTML string.\n      </p>\n\n      <h3>Advantages of Using <code>html</code></h3>\n      <p>\n        This approach allows developers to write HTML in a familiar syntax\n        within JavaScript files while providing the convenience of inserting\n        dynamic content. Additionally, it aids in IDE syntax highlighting and\n        format checking, improving the development experience.\n      </p>\n\n      <h3>Example of <code>html</code> Function</h3>\n      <pre>\n        <code class=\"language-javascript\">\nexport const Greeting = component(({ name }) => {\n  return html\\`\n    &lt;div>Hello, \\${name}!&lt;/div>\n  \\`;\n});\n        </code>\n      </pre>\n\n      <h3>Dynamic Content Interpolation</h3>\n      <p>\n        The placeholders in the template literal are filled with the values\n        provided, allowing dynamic content to be seamlessly integrated into the\n        static HTML structure.\n      </p>\n\n      <h3>Usage in Components</h3>\n      <p>\n        Components return the result of the <code>html</code> function, which is\n        an HTML string representing the component's template. This allows for\n        the creation of complex UIs with dynamic data binding.\n      </p>\n    </div>\n  "])));
});
var templateObject_1$9;

var Handler = component(function () {
    return html(templateObject_1$8 || (templateObject_1$8 = __makeTemplateObject(["\n    <div class=\"handler\">\n      <h2>Handler Function</h2>\n\n      <p>\n        The <code>handler</code> function helps in defining and attaching event\n        handlers within component templates. It accepts a function that will\n        handle the event and an optional identifier for the handler.\n      </p>\n\n      <h3>Functionality</h3>\n      <p>\n        The <code>handler</code> function assigns the provided event handling\n        function to a unique identifier within the component's context. This\n        association ensures that the handler is correctly invoked when the\n        corresponding event is triggered on the element.\n      </p>\n\n      <h3>Event Binding</h3>\n      <p>\n        It returns a string that binds the event handler to the component's\n        instance. This string is used within the HTML markup to assign the\n        handler to an event, such as\n        <code>onclick</code>.\n      </p>\n\n      <h3>Example Usage</h3>\n      <pre>\n        <code class=\"language-javascript\">\nexport const IncrementButton = component(() => {\n  const incrementHandler = handler((event, element) => {\n    console.log('Event:', event);\n    console.log('Element:', element);\n    globalState.count++;\n  });\n\n  return html`\n    &lt;div>\n      &lt;button onclick=\"${incrementHandler}\">Increment&lt;/button>\n    &lt;/div>\n  `;\n});\n        </code>\n      </pre>\n\n      <p>\n        In the example above, the <code>handler</code> creates an event handler\n        that logs the event object and the element that triggered the event\n        before incrementing the state count.\n      </p>\n\n      <h3>Advantages</h3>\n      <p>\n        This structure allows for better code separation and readability. The\n        event handler logic is maintained outside of the HTML string, thus\n        making the templates cleaner and the code more maintainable.\n      </p>\n    </div>\n  "], ["\n    <div class=\"handler\">\n      <h2>Handler Function</h2>\n\n      <p>\n        The <code>handler</code> function helps in defining and attaching event\n        handlers within component templates. It accepts a function that will\n        handle the event and an optional identifier for the handler.\n      </p>\n\n      <h3>Functionality</h3>\n      <p>\n        The <code>handler</code> function assigns the provided event handling\n        function to a unique identifier within the component's context. This\n        association ensures that the handler is correctly invoked when the\n        corresponding event is triggered on the element.\n      </p>\n\n      <h3>Event Binding</h3>\n      <p>\n        It returns a string that binds the event handler to the component's\n        instance. This string is used within the HTML markup to assign the\n        handler to an event, such as\n        <code>onclick</code>.\n      </p>\n\n      <h3>Example Usage</h3>\n      <pre>\n        <code class=\"language-javascript\">\nexport const IncrementButton = component(() => {\n  const incrementHandler = handler((event, element) => {\n    console.log('Event:', event);\n    console.log('Element:', element);\n    globalState.count++;\n  });\n\n  return html\\`\n    &lt;div>\n      &lt;button onclick=\"\\${incrementHandler}\">Increment&lt;/button>\n    &lt;/div>\n  \\`;\n});\n        </code>\n      </pre>\n\n      <p>\n        In the example above, the <code>handler</code> creates an event handler\n        that logs the event object and the element that triggered the event\n        before incrementing the state count.\n      </p>\n\n      <h3>Advantages</h3>\n      <p>\n        This structure allows for better code separation and readability. The\n        event handler logic is maintained outside of the HTML string, thus\n        making the templates cleaner and the code more maintainable.\n      </p>\n    </div>\n  "])));
});
var templateObject_1$8;

var Mount = component(function () {
    return html(templateObject_1$7 || (templateObject_1$7 = __makeTemplateObject(["\n    <div class=\"mount\">\n      <h2>Mount Method</h2>\n\n      <p>\n        The <code>mount</code> method is responsible for rendering a component\n        into a specified DOM container. It connects the component's rendering\n        output to the actual web page.\n      </p>\n\n      <h3>Usage</h3>\n      <p>\n        To use <code>mount</code>, you must first define a container element in\n        your HTML, such as a <code>div</code> with an identifier. Then, you call\n        <code>mount</code> with your root component and the identifier of the\n        container element as arguments.\n      </p>\n\n      <h3>Example</h3>\n      <pre>\n        <code class=\"language-javascript\">\n// Define your container element in HTML\n&lt;div id=\"app\">&lt;/div>\n\n// Import the mount function and your root component\nimport { mount } from 'litstate';\nimport { App } from './App';\n\n// Mount the root component into the container\nmount(App, 'app');\n        </code>\n      </pre>\n\n      <p>\n        The example above demonstrates how <code>mount</code> takes the\n        <code>App</code> component and renders it within the element with the\n        <code>id</code> of \"app\".\n      </p>\n\n      <h3>Single Root</h3>\n      <p>\n        Typically, an application will have a single root component that\n        contains all other components, and you use <code>mount</code> to render\n        this root component.\n      </p>\n\n      <h3>Initialization</h3>\n      <p>\n        The <code>mount</code> function is usually called once, when\n        initializing the application, to kick off the rendering process and\n        display the initial UI.\n      </p>\n    </div>\n  "], ["\n    <div class=\"mount\">\n      <h2>Mount Method</h2>\n\n      <p>\n        The <code>mount</code> method is responsible for rendering a component\n        into a specified DOM container. It connects the component's rendering\n        output to the actual web page.\n      </p>\n\n      <h3>Usage</h3>\n      <p>\n        To use <code>mount</code>, you must first define a container element in\n        your HTML, such as a <code>div</code> with an identifier. Then, you call\n        <code>mount</code> with your root component and the identifier of the\n        container element as arguments.\n      </p>\n\n      <h3>Example</h3>\n      <pre>\n        <code class=\"language-javascript\">\n// Define your container element in HTML\n&lt;div id=\"app\">&lt;/div>\n\n// Import the mount function and your root component\nimport { mount } from 'litstate';\nimport { App } from './App';\n\n// Mount the root component into the container\nmount(App, 'app');\n        </code>\n      </pre>\n\n      <p>\n        The example above demonstrates how <code>mount</code> takes the\n        <code>App</code> component and renders it within the element with the\n        <code>id</code> of \"app\".\n      </p>\n\n      <h3>Single Root</h3>\n      <p>\n        Typically, an application will have a single root component that\n        contains all other components, and you use <code>mount</code> to render\n        this root component.\n      </p>\n\n      <h3>Initialization</h3>\n      <p>\n        The <code>mount</code> function is usually called once, when\n        initializing the application, to kick off the rendering process and\n        display the initial UI.\n      </p>\n    </div>\n  "])));
});
var templateObject_1$7;

var Router = component(function () {
    return html(templateObject_1$6 || (templateObject_1$6 = __makeTemplateObject(["\n    <div class=\"router\">\n      <h2>Router and Link Components with Navigate Method</h2>\n\n      <p>\n        This setup provides a simple client-side routing mechanism for\n        single-page applications (SPAs). It uses a global state to keep track of\n        the current route and updates the browser's URL without causing a page\n        reload.\n      </p>\n\n      <h3>Navigate Method</h3>\n      <p>\n        The <code>navigate</code> function changes the current URL using\n        <code>history.pushState</code> and updates the current route in the\n        state.\n      </p>\n\n      <h3>Link Component</h3>\n      <p>\n        The <code>Link</code> component renders an anchor\n        (<code>&lt;a&gt;</code>) tag that, when clicked, prevents the default\n        browser navigation and instead calls the <code>navigate</code> function,\n        thereby changing the route without a page refresh.\n      </p>\n\n      <h3>Router Component</h3>\n      <p>\n        The <code>Router</code> component takes a set of routes and renders the\n        component corresponding to the current route. If no route matches, it\n        falls back to a default ('*') route if provided.\n      </p>\n\n      <h3>Popstate Event Listener</h3>\n      <p>\n        An event listener for the <code>popstate</code> event is used to handle\n        the browser's back and forward navigation, ensuring the displayed\n        component matches the URL.\n      </p>\n\n      <h3>Example Usage</h3>\n      <pre>\n        <code class=\"language-javascript\">\n\nimport { Router, Link, navigate } from 'litstate/components';\nimport { Home } from './Home';\nimport { About } from './About';\nimport { NotFound } from './NotFound';\n\n// Usage of Link component\nconst NavBar = () => {\n  return html`\n    &lt;div>\n      ${Link({ to: '/', children: 'Home' })}\n      ${Link({ to: '/about', children: 'About' })}\n    &lt;/div>\n  `;\n};\n\n// Setup routes for Router component\nconst routes = {\n  '/': Home,\n  '/about': About,\n  '*': NotFound,\n};\n\n// Usage of Router component\nconst App = () => {\n  return html`\n    &lt;div>\n      &lt;Router routes=${routes} />\n    &lt;/div>\n  `;\n}\n\n// Programmatic navigation\nnavigate('/about');\n        </code>\n      </pre>\n\n      <p>\n        The example code snippets show how the <code>Link</code> component is\n        used to create navigable links, and how the\n        <code>Router</code> component is set up with route-to-component\n        mappings.\n      </p>\n    </div>\n  "], ["\n    <div class=\"router\">\n      <h2>Router and Link Components with Navigate Method</h2>\n\n      <p>\n        This setup provides a simple client-side routing mechanism for\n        single-page applications (SPAs). It uses a global state to keep track of\n        the current route and updates the browser's URL without causing a page\n        reload.\n      </p>\n\n      <h3>Navigate Method</h3>\n      <p>\n        The <code>navigate</code> function changes the current URL using\n        <code>history.pushState</code> and updates the current route in the\n        state.\n      </p>\n\n      <h3>Link Component</h3>\n      <p>\n        The <code>Link</code> component renders an anchor\n        (<code>&lt;a&gt;</code>) tag that, when clicked, prevents the default\n        browser navigation and instead calls the <code>navigate</code> function,\n        thereby changing the route without a page refresh.\n      </p>\n\n      <h3>Router Component</h3>\n      <p>\n        The <code>Router</code> component takes a set of routes and renders the\n        component corresponding to the current route. If no route matches, it\n        falls back to a default ('*') route if provided.\n      </p>\n\n      <h3>Popstate Event Listener</h3>\n      <p>\n        An event listener for the <code>popstate</code> event is used to handle\n        the browser's back and forward navigation, ensuring the displayed\n        component matches the URL.\n      </p>\n\n      <h3>Example Usage</h3>\n      <pre>\n        <code class=\"language-javascript\">\n\nimport { Router, Link, navigate } from 'litstate/components';\nimport { Home } from './Home';\nimport { About } from './About';\nimport { NotFound } from './NotFound';\n\n// Usage of Link component\nconst NavBar = () => {\n  return html\\`\n    &lt;div>\n      \\${Link({ to: '/', children: 'Home' })}\n      \\${Link({ to: '/about', children: 'About' })}\n    &lt;/div>\n  \\`;\n};\n\n// Setup routes for Router component\nconst routes = {\n  '/': Home,\n  '/about': About,\n  '*': NotFound,\n};\n\n// Usage of Router component\nconst App = () => {\n  return html\\`\n    &lt;div>\n      &lt;Router routes=\\${routes} />\n    &lt;/div>\n  \\`;\n}\n\n// Programmatic navigation\nnavigate('/about');\n        </code>\n      </pre>\n\n      <p>\n        The example code snippets show how the <code>Link</code> component is\n        used to create navigable links, and how the\n        <code>Router</code> component is set up with route-to-component\n        mappings.\n      </p>\n    </div>\n  "])));
});
var templateObject_1$6;

var Content = component(function () {
    return html(templateObject_1$5 || (templateObject_1$5 = __makeTemplateObject(["\n      <div class=\"content\">\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n      </div>\n    "], ["\n      <div class=\"content\">\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n      </div>\n    "])), ContentCard({ sectionName: 'home', children: Home() }), ContentCard({
        sectionName: 'getting-started',
        children: GettingStarted(),
    }), ContentCard({ sectionName: 'component', children: Component() }), ContentCard({
        sectionName: 'state-management',
        children: StateManagement(),
    }), ContentCard({ sectionName: 'html', children: Html() }), ContentCard({ sectionName: 'handler', children: Handler() }), ContentCard({ sectionName: 'mount', children: Mount() }), ContentCard({ sectionName: 'router', children: Router() }));
});
var templateObject_1$5;

var leftBarState = createState({
    isOpen: false,
});
var LeftBar = component(function () { return html(templateObject_1$4 || (templateObject_1$4 = __makeTemplateObject(["\n    <div class=\"left-bar", "\">\n      <a href=\"#\">Home</a>\n      <a href=\"#getting-started\">Getting Started</a>\n      <a href=\"#component\">Component</a>\n      <a href=\"#state-management\">State Management</a>\n      <a href=\"#html\">literal HTML</a>\n      <a href=\"#handler\">Handler</a>\n      <a href=\"#mount\">Mount</a>\n      <a href=\"#router\">Router</a>\n    </div>\n  "], ["\n    <div class=\"left-bar", "\">\n      <a href=\"#\">Home</a>\n      <a href=\"#getting-started\">Getting Started</a>\n      <a href=\"#component\">Component</a>\n      <a href=\"#state-management\">State Management</a>\n      <a href=\"#html\">literal HTML</a>\n      <a href=\"#handler\">Handler</a>\n      <a href=\"#mount\">Mount</a>\n      <a href=\"#router\">Router</a>\n    </div>\n  "])), leftBarState.isOpen ? ' active' : ''); });
var templateObject_1$4;

var Hamburger = component(function () {
    return html(templateObject_1$3 || (templateObject_1$3 = __makeTemplateObject(["\n      <div\n        class=\"hamburger\"\n        onclick=\"", "\"\n      >\n        \u2630\n      </div>\n    "], ["\n      <div\n        class=\"hamburger\"\n        onclick=\"", "\"\n      >\n        \u2630\n      </div>\n    "])), handler(function () { return (leftBarState.isOpen = !leftBarState.isOpen); }));
});
var templateObject_1$3;

var Title = component(function () { return html(templateObject_1$2 || (templateObject_1$2 = __makeTemplateObject(["\n    <div class=\"title\">\n      <h1>litState</h1>\n    </div>\n  "], ["\n    <div class=\"title\">\n      <h1>litState</h1>\n    </div>\n  "]))); });
var templateObject_1$2;

var TopBar = component(function () { return html(templateObject_1$1 || (templateObject_1$1 = __makeTemplateObject([" <div class=\"top-bar\">", " ", "</div> "], [" <div class=\"top-bar\">", " ", "</div> "])), Hamburger(), Title()); });
var templateObject_1$1;

var App = component(function () { return html(templateObject_1 || (templateObject_1 = __makeTemplateObject([" <div class=\"app\">", " ", " ", "</div> "], [" <div class=\"app\">", " ", " ", "</div> "])), TopBar(), LeftBar(), Content()); });
var templateObject_1;

const containerId = 'app';

mount(App(), containerId);
