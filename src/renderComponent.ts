import { LITSTATE } from './global';
import { addListener } from './state';
import { ComponentDefiner, ObjectWithOptionalId, PropsWithId } from './types';
import { recursivelyUpdateComponentInDom } from './recursivelyUpdateComponentInDom';

const currentPropsProxy = LITSTATE.componentsCurrentProps;

export const renderComponent = (
  id: string | number,
  component: ComponentDefiner,
  props: PropsWithId,
  attributes?:
    | ObjectWithOptionalId
    | ((props: Record<string, unknown>) => ObjectWithOptionalId)
) => {
  const componentId = `${LITSTATE.componentBeingRendered || ''}/${id}`;

  const parsedAttributes: ObjectWithOptionalId = attributes
    ? typeof attributes === 'object'
      ? attributes
      : attributes(props)
    : {};

  const renderedString = addListener(() => {
    const parentId = LITSTATE.componentBeingRendered;
    LITSTATE.componentBeingRendered = componentId;

    const renderedString = `<span id="${componentId}" ${Object.keys(
      parsedAttributes
    )
      .map(key => `${key}="${parsedAttributes[key]}"`)
      .join(' ')}>${component(props || currentPropsProxy[componentId])}</span>`;

    LITSTATE.componentsCurrentProps[componentId] = props;

    recursivelyUpdateComponentInDom(componentId.toString(), renderedString);

    LITSTATE.componentBeingRendered = parentId;

    return renderedString;
  }, `renderListener-${componentId}`);

  return renderedString;
};
