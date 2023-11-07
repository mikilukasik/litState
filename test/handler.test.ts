import { handler } from '../src/handler'; // Adjust the import path as needed.
import { LITSTATE } from '../src/global';
import { resetId } from '../src/getIdFromStack';

jest.mock('../src/getIdFromStack', () => ({
  getIdFromStack: jest.fn(() => 'mockedId'),
}));

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
      "window.LITSTATE.handlersPerComponent['testComponent']['mockedId'](event, this)"
    );
  });

  it('should register the handler function for the current component', () => {
    const mockHandlerFunction = jest.fn();
    LITSTATE.componentBeingRendered = 'testComponent';

    handler(mockHandlerFunction);

    expect(
      LITSTATE.handlersPerComponent['testComponent']['mockedId']
    ).toBeDefined();
  });

  it('should use "global" as the componentId if componentBeingRendered is not set', () => {
    const mockHandlerFunction = jest.fn();

    const handlerString = handler(mockHandlerFunction);

    expect(handlerString).toBe(
      "window.LITSTATE.handlersPerComponent['global']['mockedId'](event, this)"
    );
    expect(LITSTATE.handlersPerComponent['global']['mockedId']).toBeDefined();
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

  it('should append the provided id to the handlerId if given', () => {
    const mockHandlerFunction = jest.fn();
    const providedId = 'unique123';
    LITSTATE.componentBeingRendered = 'testComponent';

    const handlerString = handler(mockHandlerFunction, providedId);

    expect(handlerString).toBe(
      `window.LITSTATE.handlersPerComponent['testComponent']['mockedId-unique123'](event, this)`
    );

    expect(
      LITSTATE.handlersPerComponent['testComponent'][`mockedId-${providedId}`]
    ).toBeDefined();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
