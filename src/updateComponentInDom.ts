import { updateDomElement } from './updateDomElement';

export const updateComponentInDom = (id: string, newHtml: string): void => {
  if (!newHtml) return;

  const containerInDom = document.getElementById(id);
  if (!containerInDom) {
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${newHtml}</body>`, 'text/html');

  const parseError = doc.querySelector('parsererror');
  const newElement = doc.body.firstElementChild;

  if (parseError || !newElement || newElement instanceof HTMLUnknownElement) {
    console.warn('empty element rendered');
    containerInDom.innerHTML = '';
    return;
  }

  updateDomElement(newElement, containerInDom);
};
