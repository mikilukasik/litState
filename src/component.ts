import { renderComponent } from './renderComponent';
import {
  Component,
  ComponentDefiner,
  ObjectWithOptionalId,
  PropsWithId,
} from './types';

const getComponentInstanceIdFromStack = () =>
  new Error().stack
    ?.split('\n')[3]
    .split(' ')
    .pop()
    ?.replace(window.location.href, '') || 'unknown-caller';

export const component = (
  functionalComponent: ComponentDefiner,
  attributes?:
    | ObjectWithOptionalId
    | ((props: Record<string, unknown>) => ObjectWithOptionalId)
): Component => {
  const renderer: Component = (_props = {}) => {
    const id = _props.id || getComponentInstanceIdFromStack();

    const props: PropsWithId = { ..._props, id };

    const renderedString = renderComponent(
      id,
      functionalComponent,
      props,
      attributes
    );

    return renderedString;
  };

  return renderer;
};
