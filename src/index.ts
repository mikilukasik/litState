/* eslint-disable @typescript-eslint/no-explicit-any */
export type Component = (props: Record<string | symbol, any>) => string;

const LITSTATE: {
  handlersPerComponent: Record<string, Record<string | symbol, any>>;
  components: Record<string | symbol, Component>;
  componentsCurrentProps: Record<string | symbol, Record<string | symbol, any>>;
  elementsWithIds: Record<string | symbol, HTMLElement>;
  componentBeingRendered: string | number | null;
} = {
  handlersPerComponent: {},
  components: {},
  componentsCurrentProps: {},
  elementsWithIds: {},
  componentBeingRendered: null,
};

Object.assign(window, { LITSTATE });

type HTMLElementsById = Record<string, HTMLElement>;

const parseHtmlWithIds = (newElement: Element): HTMLElementsById => {
  const elementsById: HTMLElementsById = {};

  function traverse(element: Element) {
    if (element.id && !element.id.startsWith('lsComponent')) {
      elementsById[element.id] = element as HTMLElement;
    }

    for (const child of Array.from(element.children)) {
      traverse(child);
    }
  }

  traverse(newElement);
  return elementsById;
};

const updateAttributes = (source: HTMLElement, target: HTMLElement): void => {
  // Update attributes
  for (const { name, value } of Array.from(source.attributes)) {
    if (target.getAttribute(name) !== value) {
      target.setAttribute(name, value);
    }
  }
};

const updateContainer = (container: HTMLElement, newHtml: string): void => {
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

  const needToReRender = Object.keys(newElementsWithIds).reduce(
    (p, elementId) => {
      if (!LITSTATE.elementsWithIds[elementId]) {
        return true;
      }

      updateAttributes(
        newElementsWithIds[elementId],
        LITSTATE.elementsWithIds[elementId]
      );
      return p;
    },
    false
  );

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

const registerHandlers = (id: string | number, renderer: () => any) => {
  const parentId = LITSTATE.componentBeingRendered;
  LITSTATE.componentBeingRendered = id;

  const result = renderer();

  LITSTATE.componentBeingRendered = parentId;
  return result;
};

export const handler: (
  handlerToDefine: (event: Event, elm: HTMLElement) => void
) => string = handlerToDefine => {
  const componentId = LITSTATE.componentBeingRendered || 'global';
  const handlerId = Math.random().toString().replace('0.', 'lsHandler');

  if (!LITSTATE.handlersPerComponent[componentId])
    LITSTATE.handlersPerComponent[componentId] = {};

  LITSTATE.handlersPerComponent[componentId][handlerId] = (
    event: Event,
    elm: HTMLElement
  ) => handlerToDefine(event, elm);

  return `window.LITSTATE.handlersPerComponent.${componentId}.${handlerId}(event, this)`;
};

export const createState = <T>(_stateTarget: T): T => {
  if (_stateTarget === null) return null as T;

  let stateTarget: Record<string | symbol, any>; //extends Record<string|symbol, any> ? Record<string|symbol, any> : null;

  if (Array.isArray(_stateTarget)) {
    stateTarget = _stateTarget.map(val =>
      typeof val === 'object' ? createState(val) : val
    ) as Record<string | symbol, any>;
  } else {
    stateTarget = { ..._stateTarget } as Record<string | symbol, any>;
    Object.keys(stateTarget).forEach(key => {
      if (typeof stateTarget[key] === 'object') {
        stateTarget[key] = createState(stateTarget[key]);
      }
    });
  }

  const componentsSubscribedTo: Record<
    string | symbol,
    Record<string | symbol, boolean>
  > = {};

  const reRenderAffected = (prop: string | symbol) => {
    Object.keys(componentsSubscribedTo)
      .filter(componentId => componentsSubscribedTo[componentId][prop])
      .forEach(componentId => {
        delete LITSTATE.handlersPerComponent[componentId];
        const container = document.getElementById(componentId);
        if (!container) return;

        const renderedString = registerHandlers(componentId, () =>
          LITSTATE.components[componentId](
            LITSTATE.componentsCurrentProps[componentId]
          )
        );

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
        target[prop] = createState(
          Array.isArray(value) ? value.slice() : { ...value }
        );

        reRenderAffected(prop);
        return true;
      }

      target[prop] = value;
      reRenderAffected(prop);
      return true;
    },
  }) as T;
};

export const mount = (content: string, container: HTMLElement) => {
  updateContainer(container, content);
};

export const component = (
  functionalComponent: Component
): ((props?: Record<string | symbol, any>) => string) => {
  return (props = {}) => {
    const id = Math.random().toString().replace('0.', 'lsComponent');

    LITSTATE.components[id] = functionalComponent;
    LITSTATE.componentsCurrentProps[id] = props;

    const renderedString = registerHandlers(id, () =>
      functionalComponent(props)
    );

    return `<span id="${id}">${renderedString}</span>`;
  };
};

export const html = (
  strings: TemplateStringsArray,
  ...values: any[]
): string => {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += values[i];
    }
  }
  return result;
};
