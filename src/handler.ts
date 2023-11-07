import { getIdFromStack } from './getIdFromStack';
import { LITSTATE } from './global';

export const handler: (
  handlerToDefine: (event: Event, elm: HTMLElement) => void,
  id?: string | number
) => string = (handlerToDefine, id) => {
  const componentId = LITSTATE.componentBeingRendered || 'global';
  const handlerId = `${getIdFromStack()}${id ? `-${id}` : ''}`;

  if (!LITSTATE.handlersPerComponent[componentId])
    LITSTATE.handlersPerComponent[componentId] = {};

  LITSTATE.handlersPerComponent[componentId][handlerId] = (
    event: Event,
    elm: HTMLElement
  ) => handlerToDefine(event, elm);

  return `window.LITSTATE.handlersPerComponent['${componentId}']['${handlerId}'](event, this)`;
};
