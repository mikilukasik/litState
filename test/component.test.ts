import { component } from '../src/component';
import { renderComponent } from '../src/renderComponent';
import { getIdFromStack } from '../src/getIdFromStack';

jest.mock('../src/renderComponent', () => ({
  renderComponent: jest.fn(() => 'rendered component'),
}));

jest.mock('../src/getIdFromStack', () => ({
  getIdFromStack: jest.fn(),
}));

describe('component', () => {
  const functionalComponent = jest.fn();
  const mockId = 'test-id';
  const attributes = {};
  const props = { someProp: 'someValue' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use the provided id in props', () => {
    const customProps = { id: mockId, ...props };

    component(functionalComponent, attributes)(customProps);

    expect(getIdFromStack).not.toHaveBeenCalled();
    expect(renderComponent).toHaveBeenCalledWith(
      mockId,
      functionalComponent,
      customProps,
      attributes
    );
  });

  it('should generate an id if not provided in props', () => {
    (getIdFromStack as jest.Mock).mockReturnValue(mockId);

    component(functionalComponent, attributes)(props);

    expect(getIdFromStack).toHaveBeenCalled();
    expect(renderComponent).toHaveBeenCalledWith(
      mockId,
      functionalComponent,
      { ...props, id: mockId },
      attributes
    );
  });

  it('should pass attributes to renderComponent', () => {
    const customAttributes = { class: 'test-class' };

    component(functionalComponent, customAttributes)(props);

    expect(renderComponent).toHaveBeenCalledWith(
      expect.any(String),
      functionalComponent,
      expect.any(Object),
      customAttributes
    );
  });

  it('should pass all props correctly', () => {
    (getIdFromStack as jest.Mock).mockReturnValue(mockId);
    const allProps = { ...props, id: mockId };

    component(functionalComponent, attributes)(props);

    expect(renderComponent).toHaveBeenCalledWith(
      mockId,
      functionalComponent,
      allProps,
      attributes
    );
  });

  it('should use default props if none are provided', () => {
    (getIdFromStack as jest.Mock).mockReturnValue(mockId);

    component(functionalComponent, attributes)();

    expect(getIdFromStack).toHaveBeenCalled();

    expect(renderComponent).toHaveBeenCalledWith(
      mockId,
      functionalComponent,
      { id: mockId },
      attributes
    );
  });

  it('should return the result from renderComponent', () => {
    const result = component(functionalComponent, attributes)(props);

    expect(result).toBe('rendered component');
  });
});
