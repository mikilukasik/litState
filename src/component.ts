import { renderComponent } from './renderComponent';
import { Component, ObjectWithOptionalId } from './types';

export const component = (
  functionalComponent: Component,
  attributes?:
    | ObjectWithOptionalId
    | ((props: Record<string, unknown>) => ObjectWithOptionalId)
): ((props?: Record<string, unknown>) => string) => {
  return (props = {}) => {
    const pharsedAttributes: ObjectWithOptionalId = attributes
      ? typeof attributes === 'object'
        ? attributes
        : attributes(props)
      : {};

    const id = Math.random().toString().replace('0.', 'lsComponent');

    const renderedString = renderComponent(id, functionalComponent, props);

    return `<span id="${id}" ${Object.keys(pharsedAttributes)
      .map(key => `${key}="${pharsedAttributes[key]}"`)
      .join(' ')}>${renderedString}</span>`;
  };
};
