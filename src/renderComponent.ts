import { LITSTATE } from './global';
import { addListener } from './state';
import { Component } from './types';
import { updateComponentInDom } from './updateComponentInDom';

export const renderComponent = (
  id: string,
  component: Component,
  props: Record<string, unknown>
) => {
  LITSTATE.componentsCurrentProps[id] = props;

  const renderedString = addListener(() => {
    const parentId = LITSTATE.componentBeingRendered;
    LITSTATE.componentBeingRendered = id;

    const renderedString = component(LITSTATE.componentsCurrentProps[id]);

    LITSTATE.componentBeingRendered = parentId;

    const componentInDom = document.getElementById(id);
    if (!componentInDom) return renderedString;

    updateComponentInDom(componentInDom, renderedString);
    return renderedString;
  });

  return renderedString;
};
