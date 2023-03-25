import { renderComponent } from './renderComponent';
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
  const renderer: Component = (id, _props) => {
    if (!id) throw new Error(`component called without id`);

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
