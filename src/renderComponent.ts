import { LITSTATE } from './global';
import { addListener } from './state';
import { ComponentDefiner, PropsWithId } from './types';
import { recursivelyUpdateComponentInDom } from './recursivelyUpdateComponentInDom';

const currentPropsProxy = LITSTATE.componentsCurrentProps;

export const renderComponent = (
  id: string | number,
  component: ComponentDefiner,
  props: PropsWithId,
  pharsedAttributes: Record<string, unknown>
) => {
  const parentId = LITSTATE.componentBeingRendered;
  LITSTATE.componentBeingRendered = id;

  const renderedString = addListener(() => {
    const renderedString = `<span id="${id}" ${Object.keys(pharsedAttributes)
      .map(key => `${key}="${pharsedAttributes[key]}"`)
      .join(' ')}>${component(props || currentPropsProxy[id])}</span>`;

    LITSTATE.componentsCurrentProps[id] = props;

    recursivelyUpdateComponentInDom(id.toString(), renderedString);
    return renderedString;
  }, `renderListener-${id}`);

  LITSTATE.componentBeingRendered = parentId;

  return renderedString;
};
