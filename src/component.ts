import { renderComponent } from './renderComponent';
import { getIdFromStack } from './getIdFromStack';

import {
  Component,
  ComponentDefiner,
  ObjectWithOptionalId,
  PropsWithId,
} from './types';

export const component = (
  functionalComponent: ComponentDefiner,
  attributes?:
    | ObjectWithOptionalId
    | ((props: Record<string, unknown>) => ObjectWithOptionalId)
): Component => {
  const renderer: Component = (_props = {}) => {
    const id = _props.id || getIdFromStack();

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
