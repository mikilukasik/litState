import { updateComponentInDom } from '../src/updateComponentInDom';
import { updateDomElement } from '../src/updateDomElement';

jest.mock('../src/updateDomElement', () => ({
  updateDomElement: jest.fn(),
}));

describe('updateComponentInDom', () => {
  const originalConsoleWarn = console.warn;
  let consoleOutput: string[] = [];
  const mockedWarn = (output: string) => consoleOutput.push(output);

  beforeEach(() => {
    console.warn = mockedWarn;
    consoleOutput = [];
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.warn = originalConsoleWarn;
  });

  it('should not perform operation if newHtml is empty', () => {
    document.body.innerHTML = `<div id="test-container"></div>`;
    updateComponentInDom('test-container', '');
    expect(document.getElementById('test-container')?.innerHTML).toBe('');
    expect(updateDomElement).not.toHaveBeenCalled();
  });

  it('should not perform operation if container does not exist', () => {
    updateComponentInDom('non-existent-container', '<div>New Content</div>');
    expect(updateDomElement).not.toHaveBeenCalled();
  });

  it('should warn and clear container if newHtml is invalid', () => {
    document.body.innerHTML = `<div id="test-container"></div>`;
    updateComponentInDom('test-container', '<div');
    expect(consoleOutput).toContain('empty element rendered');
    expect(document.getElementById('test-container')?.innerHTML).toBe('');
  });

  it('should update container with new HTML content', () => {
    document.body.innerHTML = `<div id="test-container">Old Content</div>`;
    const containerId = 'test-container';
    const containerElement = document.getElementById(containerId);

    const newHtml = '<div>New Content</div>';

    updateComponentInDom(containerId, newHtml);

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${newHtml}</body>`, 'text/html');
    const newElement = doc.body.firstElementChild;

    expect(updateDomElement).toHaveBeenCalledWith(newElement, containerElement);
  });
});
