import { renderComponent } from '../src/renderComponent';
import { LITSTATE } from '../src/global';
import { updateComponentInDom } from '../src/updateComponentInDom';

jest.mock('../src/updateComponentInDom', () => ({
  updateComponentInDom: jest.fn(),
}));

describe('renderComponent', () => {
  const fakeComponent = jest.fn(props => `Rendered content with ${props.text}`);
  const componentId = 'test-component';
  const initialProps = { id: componentId, text: 'initial' };

  beforeEach(() => {
    LITSTATE.componentsCurrentProps = {};
    LITSTATE.componentBeingRendered = null;

    jest.clearAllMocks();
  });

  it('renders a new component with initial props', () => {
    const renderedString = renderComponent(
      componentId,
      fakeComponent,
      initialProps
    );
    expect(renderedString).toContain('Rendered content with initial');
    expect(updateComponentInDom).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('Rendered content with initial')
    );
  });

  it('updates an existing component with new props', () => {
    const newProps = { id: componentId, text: 'updated' };
    renderComponent(componentId, fakeComponent, initialProps);
    const renderedString = renderComponent(
      componentId,
      fakeComponent,
      newProps
    );
    expect(renderedString).toContain('Rendered content with updated');
    expect(updateComponentInDom).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('Rendered content with updated')
    );
  });

  it('correctly passes id within props when attributes are not provided', () => {
    renderComponent('test-component', fakeComponent, initialProps);
    expect(fakeComponent).toHaveBeenCalledWith({
      ...initialProps,
      id: 'test-component',
    });
    expect(updateComponentInDom).toHaveBeenCalledWith(
      '/test-component',
      expect.any(String)
    );
  });

  it('correctly includes the parent component in the id', () => {
    LITSTATE.componentBeingRendered = 'parent-component';
    renderComponent('test-component', fakeComponent, initialProps);
    expect(fakeComponent).toHaveBeenCalledWith({
      ...initialProps,
      id: 'test-component',
    });
    expect(updateComponentInDom).toHaveBeenCalledWith(
      'parent-component/test-component',
      expect.any(String)
    );
  });

  it('applies attributes to the component', () => {
    const attributes = { 'data-test': 'value' };
    renderComponent(componentId, fakeComponent, initialProps, attributes);
    expect(updateComponentInDom).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('data-test="value"')
    );
  });

  it('handles nested components', () => {
    LITSTATE.componentBeingRendered = 'parent-component';
    renderComponent(componentId, fakeComponent, initialProps);
    expect(updateComponentInDom).toHaveBeenCalledWith(
      expect.stringContaining('parent-component/test-component'),
      expect.any(String)
    );
  });

  it('uses an empty object when attributes are not provided', () => {
    renderComponent(componentId, fakeComponent, initialProps);
    expect(fakeComponent).toHaveBeenCalledWith({
      ...initialProps,
      id: componentId,
    });
    expect(updateComponentInDom).toHaveBeenCalledWith(
      `/${componentId}`,
      expect.stringContaining('Rendered content with initial')
    );
  });

  it('uses the attributes object as is', () => {
    const attributes = { 'data-test': 'value', role: 'presentation' };
    renderComponent(componentId, fakeComponent, initialProps, attributes);
    expect(updateComponentInDom).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('data-test="value" role="presentation"')
    );
  });

  it('calls the attributes function with props and uses the returned object', () => {
    const attributesFn = jest.fn(() => ({ 'data-dynamic': 'dynamic-value' }));
    renderComponent(componentId, fakeComponent, initialProps, attributesFn);
    expect(attributesFn).toHaveBeenCalledWith({
      ...initialProps,
      id: componentId,
    });
    expect(updateComponentInDom).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('data-dynamic="dynamic-value"')
    );
  });

  it('calls the attributes function with currentPropsProxy when no props are provided', () => {
    const componentId = 'test-component';
    const fallbackProps = { id: `/${componentId}`, text: 'fallback' };
    const attributesFn = jest.fn(() => ({ 'data-dynamic': 'dynamic-value' }));

    LITSTATE.componentsCurrentProps[`/${componentId}`] = fallbackProps;

    renderComponent(componentId, fakeComponent, undefined, attributesFn);

    expect(attributesFn).toHaveBeenCalledWith({
      ...fallbackProps,
      id: `/${componentId}`,
    });
    expect(updateComponentInDom).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('data-dynamic="dynamic-value"')
    );

    delete LITSTATE.componentsCurrentProps[componentId];
  });

  it('calls the attributes function with only id when no props or fallbackProps are provided', () => {
    const componentId = 'test-component';
    const expectedProps = { id: `/${componentId}` };
    const attributesFn = jest.fn(() => ({ 'data-dynamic': 'dynamic-value' }));

    renderComponent(componentId, fakeComponent, undefined, attributesFn);

    expect(attributesFn).toHaveBeenCalledWith(expectedProps);
    expect(updateComponentInDom).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('data-dynamic="dynamic-value"')
    );
  });

  it('falls back to current props when props are not provided', () => {
    const componentId = 'test-component';
    const fallbackProps = { id: '/test-component', text: 'fallback' };

    LITSTATE.componentsCurrentProps[`/${componentId}`] = fallbackProps;

    renderComponent(componentId, fakeComponent);

    expect(fakeComponent).toHaveBeenCalledWith(fallbackProps);

    delete LITSTATE.componentsCurrentProps[componentId];
  });

  it('creates new props object with id when props and currentProps are not provided', () => {
    renderComponent(componentId, fakeComponent);
    expect(fakeComponent).toHaveBeenCalledWith({ id: `/${componentId}` });
  });
});
