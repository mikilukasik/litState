import { mount } from '../src/mount';
import { updateComponentInDom } from '../src/updateComponentInDom';

jest.mock('../src/updateComponentInDom', () => ({
  updateComponentInDom: jest.fn(),
}));

describe('mount', () => {
  it('should call recursivelyUpdateComponentInDom with the correct arguments', () => {
    const content = '<div>Test Content</div>';
    const id = 'test-id';

    mount(content, id);

    expect(updateComponentInDom).toHaveBeenCalledWith(id, content);
  });
});
