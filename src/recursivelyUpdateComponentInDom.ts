type NodeArray = Array<ChildNode>;

const updateAttributes = (source: ChildNode, target: ChildNode): void => {
  if (
    source.nodeType === Node.ELEMENT_NODE &&
    target.nodeType === Node.ELEMENT_NODE
  ) {
    const sourceElement = source as HTMLElement;
    const targetElement = target as HTMLElement;

    // Add or update attributes from sourceElement to targetElement
    for (const attr of sourceElement.getAttributeNames()) {
      const srcAtt = sourceElement.getAttribute(attr);
      const trgtAtt = targetElement.getAttribute(attr);

      if (srcAtt !== trgtAtt) {
        // if (attr === 'id') {
        //   console.log('tried to update id from', trgtAtt, 'to', srcAtt);
        //   return;
        // }

        targetElement.setAttribute(
          attr,
          sourceElement.getAttribute(attr) as string
        );
      }
    }

    // Remove attributes from targetElement that don't exist in sourceElement
    for (const attr of targetElement.getAttributeNames()) {
      if (!sourceElement.hasAttribute(attr)) {
        targetElement.removeAttribute(attr);
      }
    }
  }
};

const updateDomElement = (source: ChildNode, target: ChildNode): void => {
  if (source.isEqualNode(target)) {
    return;
  }

  updateAttributes(source, target);

  if (source.isEqualNode(target)) {
    return;
  }

  const sourceHasChildren = source.hasChildNodes();
  const targetHasChildren = target.hasChildNodes();

  if (sourceHasChildren && targetHasChildren) {
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

    // Remove extra children in the target that are not in the source
    while (targetChildren.length > sourceChildren.length) {
      const childIndexToRemove = targetChildren.findIndex(
        tc => !sourceChildren.includes(tc)
      );

      if (childIndexToRemove < 0)
        throw new Error('couldnt find childnode to remove');

      try{
        target.removeChild(targetChildren[childIndexToRemove]);
      } catch(e){
        // todo: should swallow?
        console.warn(e)
      }

      targetChildren.splice(childIndexToRemove, 1);
    }

    if (source.isEqualNode(target)) {
      return;
    }

    if (!source.hasChildNodes()) throw new Error('ran out of child nodes');
  }

  target.replaceWith(source.cloneNode(true));
};

export const tempId = '__LITSTATE__TEMP__ID__';

export const recursivelyUpdateComponentInDom = (
  id: string,
  newHtml: string
): void => {
  if (!newHtml) return;

  const containerInDom = document.getElementById(id);
  if (!containerInDom) {
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${newHtml}</body>`, 'text/html');
  const newElement = doc.body.firstElementChild;

  if (!newElement) {
    console.warn('empty element rendered');
    containerInDom.innerHTML = '';
    return;
  }

  updateDomElement(newElement, containerInDom);
  return;
};
