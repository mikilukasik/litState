import { handler } from '../src/handler'; // Adjust the import path as needed.
import { LITSTATE } from '../src/global';

jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

describe('handler', () => {
  beforeEach(() => {
    LITSTATE.handlersPerComponent = {};
    LITSTATE.componentBeingRendered = null;
  });

  it('should define a handler and return the correct handler string', () => {
    const mockHandlerFunction = jest.fn();
    LITSTATE.componentBeingRendered = 'testComponent';

    const handlerString = handler(mockHandlerFunction);

    expect(handlerString).toBe(
      "window.LITSTATE.handlersPerComponent['testComponent']['lsHandler123456789'](event, this)"
    );
  });

  it('should register the handler function for the current component', () => {
    const mockHandlerFunction = jest.fn();
    LITSTATE.componentBeingRendered = 'testComponent';

    handler(mockHandlerFunction);

    expect(
      LITSTATE.handlersPerComponent['testComponent']['lsHandler123456789']
    ).toBeDefined();
  });

  it('should use "global" as the componentId if componentBeingRendered is not set', () => {
    const mockHandlerFunction = jest.fn();

    const handlerString = handler(mockHandlerFunction);

    expect(handlerString).toBe(
      "window.LITSTATE.handlersPerComponent['global']['lsHandler123456789'](event, this)"
    );
    expect(
      LITSTATE.handlersPerComponent['global']['lsHandler123456789']
    ).toBeDefined();
  });

  it('should call the handler function when invoked', () => {
    const mockHandlerFunction = jest.fn();
    const mockEvent = new Event('click');
    const mockElement = document.createElement('div');

    LITSTATE.componentBeingRendered = 'testComponent';
    const handlerString = handler(mockHandlerFunction);

    const simulatedHandlerInvocation = (event: Event) => {
      const handlerInvocationCode = handlerString.replace(
        /this/g,
        'mockElement'
      );
      const handlerFunction = new Function(
        'event',
        'mockElement',
        handlerInvocationCode
      );
      handlerFunction(event, mockElement);
    };

    simulatedHandlerInvocation(mockEvent);

    expect(mockHandlerFunction).toHaveBeenCalledWith(mockEvent, mockElement);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
