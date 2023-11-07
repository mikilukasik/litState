import { updateAttributes, updateDomElement } from '../src/updateDomElement';

describe('updateAttributes', () => {
  let sourceElement: HTMLElement;
  let targetElement: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="component" class="foo" data-test="source"></div>
      <div id="component" class="bar" data-target-att="test"></div>
    `;

    const elements = document.querySelectorAll('#component');
    sourceElement = elements[0] as HTMLElement;
    targetElement = elements[1] as HTMLElement;
  });

  it('should not do anything if nodes are not elements', () => {
    const sourceTextNode = document.createTextNode('source');
    const targetTextNode = document.createTextNode('target');
    updateAttributes(sourceTextNode, targetTextNode);
  });

  it('should copy attributes from source to target', () => {
    updateAttributes(sourceElement, targetElement);
    expect(targetElement.getAttribute('class')).toBe('foo');
    expect(targetElement.getAttribute('data-test')).toBe('source');
  });

  it('should remove attributes from target that are not in source', () => {
    updateAttributes(sourceElement, targetElement);
    expect(targetElement.hasAttribute('data-target-att')).toBeFalsy();
  });
});

describe('updateDomElement', () => {
  let source: Element;
  let target: Element;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="component"></div>
      <div id="component"></div>
    `;
    const elements = document.querySelectorAll('#component');
    source = elements[0];
    target = elements[1];
  });

  it('should return early if source and target are equal', () => {
    source.textContent = 'Same content';
    target.textContent = 'Same content';
    updateDomElement(source, target);
  });

  it('should update attributes correctly', () => {
    source.setAttribute('class', 'new-class');
    target.setAttribute('class', 'old-class');
    updateDomElement(source, target);
    expect(target.getAttribute('class')).toBe('new-class');
  });

  it('should remove extra child nodes from target not present in source', () => {
    const extraChild = document.createElement('span');
    target.appendChild(extraChild);
    updateDomElement(source, target);
    expect(target.hasChildNodes()).toBeFalsy();
  });

  it('should not change target if source and target have the same children', () => {
    const child = document.createElement('span');
    source.appendChild(child);
    target.appendChild(child.cloneNode(true));
    updateDomElement(source, target);
    expect(target.childNodes.length).toBe(1);
    expect(target.firstChild?.isEqualNode(child)).toBeTruthy();
  });

  it('should update child nodes recursively', () => {
    const sourceChild = document.createElement('div');
    sourceChild.textContent = 'Source Text';
    source.appendChild(sourceChild);

    const targetChild = document.createElement('div');
    targetChild.textContent = 'Target Text';
    target.appendChild(targetChild);

    updateDomElement(source, target);
    expect(target.textContent).toBe('Source Text');
  });

  it('should handle case where target has more children than source', () => {
    for (let i = 0; i < 3; i++) {
      target.appendChild(document.createElement('span'));
    }
    updateDomElement(source, target);
    expect(target.children.length).toBe(0);
  });

  it('should handle case where source has more children than target', () => {
    for (let i = 0; i < 3; i++) {
      source.appendChild(document.createElement('span'));
    }
    updateDomElement(source, target);
    expect(target.children.length).toBe(3);
  });

  it('should replace target with source if they are not equal and have no children', () => {
    source.textContent = 'Different content';
    updateDomElement(source, target);
    expect(target.isEqualNode(source)).toBeTruthy();
    expect(target.textContent).toBe('Different content');
  });

  it('should skip updating when source child is null or undefined', () => {
    const sourceChild = null;
    const targetChild = document.createElement('div');
    targetChild.textContent = 'Target Text';
    target.appendChild(targetChild);

    Object.defineProperty(source, 'childNodes', {
      get: jest.fn(() => [sourceChild]),
      configurable: true,
    });

    updateDomElement(source, target);

    expect(target.textContent).toBe('Target Text');
  });

  it('should replace target with source if they are different node types', () => {
    source = document.createTextNode(
      'This is a source text node'
    ) as unknown as Element;

    updateDomElement(source, target);

    expect(document.body.contains(target)).toBeFalsy();
    expect(document.body.textContent).toContain('This is a source text node');
  });
});
