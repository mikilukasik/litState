import { LITSTATE } from './global';
import { addListener } from './state';
import { ComponentDefiner, ObjectWithOptionalId, PropsWithId } from './types';
import { updateComponentInDom } from './updateComponentInDom';

export const renderComponent = (
  id: string | number,
  component: ComponentDefiner,
  props?: PropsWithId,
  attributes?:
    | ObjectWithOptionalId
    | ((props: Record<string, unknown>) => ObjectWithOptionalId)
) => {
  const componentId = `${LITSTATE.componentBeingRendered || ''}/${id}`;

  const parsedAttributes: ObjectWithOptionalId = attributes
    ? typeof attributes === 'object'
      ? attributes
      : attributes(
          props ||
            LITSTATE.componentsCurrentProps[componentId] || { id: componentId }
        )
    : {};

  const renderedString = addListener(() => {
    const parentId = LITSTATE.componentBeingRendered;
    LITSTATE.componentBeingRendered = componentId;

    const renderedString = `<span id="${componentId}" ${Object.keys(
      parsedAttributes
    )
      .map(key => `${key}="${parsedAttributes[key]}"`)
      .join(' ')}>${component(
      props ||
        LITSTATE.componentsCurrentProps[componentId] || { id: componentId }
    )}</span>`;

    LITSTATE.componentsCurrentProps[componentId] = props ||
      LITSTATE.componentsCurrentProps[componentId] || { id: componentId };

    updateComponentInDom(componentId.toString(), renderedString);

    LITSTATE.componentBeingRendered = parentId;

    return renderedString;
  }, `renderListener-${componentId}`);

  return renderedString;
};
