import { LITSTATE } from './global';

export const handler: (
  handlerToDefine: (event: Event, elm: HTMLElement) => void
) => string = handlerToDefine => {
  const componentId = LITSTATE.componentBeingRendered || 'global';
  const handlerId = Math.random().toString().replace('0.', 'lsHandler');

  if (!LITSTATE.handlersPerComponent[componentId])
    LITSTATE.handlersPerComponent[componentId] = {};

  LITSTATE.handlersPerComponent[componentId][handlerId] = (
    event: Event,
    elm: HTMLElement
  ) => handlerToDefine(event, elm);

  return `window.LITSTATE.handlersPerComponent.${componentId}.${handlerId}(event, this)`;
};
