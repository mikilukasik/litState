import { updateComponentInDom } from './updateComponentInDom';

export const mount = (content: string, id: string) => {
  updateComponentInDom(id, content);
};
