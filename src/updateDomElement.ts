type NodeArray = Array<ChildNode>;

export const updateAttributes = (
  source: ChildNode,
  target: ChildNode
): void => {
  if (
    source.nodeType === Node.ELEMENT_NODE &&
    target.nodeType === Node.ELEMENT_NODE
  ) {
    const sourceElement = source as HTMLElement;
    const targetElement = target as HTMLElement;

    for (const attr of sourceElement.getAttributeNames()) {
      const srcAtt = sourceElement.getAttribute(attr);
      const trgtAtt = targetElement.getAttribute(attr);

      if (srcAtt !== trgtAtt) {
        targetElement.setAttribute(
          attr,
          sourceElement.getAttribute(attr) as string
        );
      }
    }

    for (const attr of targetElement.getAttributeNames()) {
      if (!sourceElement.hasAttribute(attr)) {
        targetElement.removeAttribute(attr);
      }
    }
  }
};

export const updateDomElement = (
  source: ChildNode,
  target: ChildNode
): void => {
  if (source.isEqualNode(target)) return;

  updateAttributes(source, target);

  if (source.isEqualNode(target)) return;

  if (source.nodeType !== target.nodeType) {
    target.replaceWith(source.cloneNode(true));
    return;
  }

  const sourceChildren = Array.from(source.childNodes) as NodeArray;
  const targetChildren = Array.from(target.childNodes) as NodeArray;

  sourceChildren.forEach((sourceChild, index) => {
    if (!sourceChild) return;
    const targetChild = targetChildren[index];

    if (!targetChild) {
      target.appendChild(sourceChild.cloneNode(true));
      return;
    }

    updateDomElement(sourceChild, targetChild);
  });

  while (targetChildren.length > sourceChildren.length) {
    const childIndexToRemove = targetChildren.findIndex(
      tc => !sourceChildren.includes(tc)
    );

    if (childIndexToRemove >= 0) {
      try {
        target.removeChild(targetChildren[childIndexToRemove]);
      } catch (e) {
        // do nothing if the child was already removed
      }

      targetChildren.splice(childIndexToRemove, 1);
    }
  }

  if (source.isEqualNode(target)) return;

  target.replaceWith(source.cloneNode(true));
};

export const tempId = '__LITSTATE__TEMP__ID__';
