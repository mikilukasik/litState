import { updateComponentInDom } from './updateComponentInDom';

export const mount = (content: string, container: HTMLElement) => {
  updateComponentInDom(container, content);
};
