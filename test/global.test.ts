import '../src/global.d';
import '../src/global';

describe('LITSTATE', () => {
  it('should have the correct structure and default values', () => {
    const {
      handlersPerComponent,
      components,
      componentsCurrentProps,
      elementsWithIds,
      listenerBeingExecuted,
      componentBeingRendered,
    } = window.LITSTATE;

    expect(handlersPerComponent).toEqual({});
    expect(components).toEqual({});
    expect(componentsCurrentProps).toEqual({});
    expect(elementsWithIds).toEqual({});
    expect(listenerBeingExecuted).toBeNull();
    expect(componentBeingRendered).toBeNull();
  });

  it('should allow adding handlers', () => {
    const handler = () => console.log('test');
    window.LITSTATE.handlersPerComponent['testComponent'] = { click: handler };

    expect(window.LITSTATE.handlersPerComponent['testComponent'].click).toBe(
      handler
    );
  });

  it('should allow setting a component', () => {
    const component = () => '<div>Test</div>';
    window.LITSTATE.components['testComponent'] = component;

    expect(window.LITSTATE.components['testComponent']).toBe(component);
  });

  it('should allow updating componentsCurrentProps', () => {
    const props = { id: 'testComponent', content: 'Test Content' };
    window.LITSTATE.componentsCurrentProps['testComponent'] = props;

    expect(window.LITSTATE.componentsCurrentProps['testComponent']).toEqual(
      props
    );
  });

  it('should allow adding elements with IDs', () => {
    const element = document.createElement('div');
    element.id = 'testElement';
    window.LITSTATE.elementsWithIds['testElement'] = element;

    expect(window.LITSTATE.elementsWithIds['testElement']).toBe(element);
  });

  it('should allow setting listenerBeingExecuted', () => {
    const listener = () => console.log('Executing listener');
    window.LITSTATE.listenerBeingExecuted = listener;

    expect(window.LITSTATE.listenerBeingExecuted).toBe(listener);
  });

  it('should allow setting componentBeingRendered', () => {
    window.LITSTATE.componentBeingRendered = 'testComponent';

    expect(window.LITSTATE.componentBeingRendered).toBe('testComponent');
  });

  it('should allow resetting LITSTATE', () => {
    window.LITSTATE.handlersPerComponent['testComponent'] = {
      click: () => {
        // Do nothing
      },
    };
    window.LITSTATE.components['testComponent'] = () => '<div></div>';
    window.LITSTATE.componentsCurrentProps['testComponent'] = {
      id: 'testComponent',
    };
    window.LITSTATE.elementsWithIds['testComponent'] =
      document.createElement('div');
    window.LITSTATE.listenerBeingExecuted = () => {
      // Do nothing
    };
    window.LITSTATE.componentBeingRendered = 'testComponent';

    window.LITSTATE.handlersPerComponent = {};
    window.LITSTATE.components = {};
    window.LITSTATE.componentsCurrentProps = {};
    window.LITSTATE.elementsWithIds = {};
    window.LITSTATE.listenerBeingExecuted = null;
    window.LITSTATE.componentBeingRendered = null;

    expect(window.LITSTATE.handlersPerComponent).toEqual({});
    expect(window.LITSTATE.components).toEqual({});
    expect(window.LITSTATE.componentsCurrentProps).toEqual({});
    expect(window.LITSTATE.elementsWithIds).toEqual({});
    expect(window.LITSTATE.listenerBeingExecuted).toBeNull();
    expect(window.LITSTATE.componentBeingRendered).toBeNull();
  });
});
