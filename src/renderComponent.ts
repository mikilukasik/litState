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
  const parentId = LITSTATE.componentBeingRendered;
  LITSTATE.componentBeingRendered = id;

  const parsedAttributes: ObjectWithOptionalId = attributes
      ? typeof attributes === 'object'
        ? attributes
        : attributes(props)
      : {};

  if (parsedAttributes.class&&parsedAttributes.class.startsWith('board-container'))console.log(parsedAttributes)

  const renderedString = addListener(() => {
    const renderedString = `<span id="${id}" ${Object.keys(parsedAttributes)
      .map(key => `${key}="${parsedAttributes[key]}"`)
      .join(' ')}>${component(props || currentPropsProxy[id])}</span>`;

    LITSTATE.componentsCurrentProps[id] = props;

    recursivelyUpdateComponentInDom(id.toString(), renderedString);
    return renderedString;
  }, `renderListener-${id}`);

  LITSTATE.componentBeingRendered = parentId;

  return renderedString;
};
