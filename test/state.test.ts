import { LITSTATE } from '../src/global';
import {
  addListener,
  removeListener,
  batchUpdate,
  createState,
} from '../src/state';

describe('stateManagement', () => {
  it('should create a new state and retrieve values', () => {
    const state = createState({ count: 0 });
    expect(state.count).toBe(0);
  });

  it('should update state values and execute listeners', () => {
    const state = createState({ count: 0 });
    const listenerMock = jest.fn();

    addListener(() => {
      listenerMock(state.count);
      return null;
    }, 'testListener');

    expect(listenerMock).toHaveBeenCalledWith(0);

    state.count = 1;
    expect(state.count).toBe(1);
    expect(listenerMock).toHaveBeenCalledWith(1);

    removeListener('testListener');
  });

  it('should not execute listeners during batchUpdate after initial set', () => {
    const state = createState({ count: 0 });
    const listenerMock = jest.fn();

    addListener(() => {
      listenerMock(state.count);
      return null;
    }, 'testListener');

    expect(listenerMock).toHaveBeenCalledTimes(1);
    expect(listenerMock).toHaveBeenCalledWith(0);

    batchUpdate(() => {
      state.count = 1;
      expect(state.count).toBe(1);

      state.count = 2;
      expect(state.count).toBe(2);

      expect(listenerMock).toHaveBeenCalledTimes(1);
    });

    expect(listenerMock).toHaveBeenCalledTimes(2);
    expect(listenerMock).toHaveBeenCalledWith(2);

    removeListener('testListener');
  });

  it('should be able to handle nested state', () => {
    const state = createState({ nested: { count: 0 } });
    const listenerMock = jest.fn();

    addListener(() => {
      listenerMock(state.nested.count);
      return null;
    }, 'testListener');

    state.nested.count = 1;
    expect(state.nested.count).toBe(1);
    expect(listenerMock).toHaveBeenCalledWith(1);

    removeListener('testListener');
  });

  it('should only subscribe a listener once to a property', () => {
    const state = createState({ count: 0 });
    const listenerMock = jest.fn();

    addListener(() => {
      state.count;
      listenerMock();
    }, 'testListener');

    expect(listenerMock).toHaveBeenCalledTimes(1);

    state.count = 1;
    expect(listenerMock).toHaveBeenCalledTimes(2);

    state.count = 2;
    expect(listenerMock).toHaveBeenCalledTimes(3);

    removeListener('testListener');
  });

  it('should properly unsubscribe listeners', () => {
    const state = createState({ count: 0 });
    const listenerMock = jest.fn();

    addListener(() => {
      state.count;
      listenerMock();
      return null;
    }, 'testListener');

    expect(listenerMock).toHaveBeenCalledTimes(1);

    state.count = 1;
    expect(listenerMock).toHaveBeenCalledTimes(2);

    removeListener('testListener');
    state.count = 2;

    expect(listenerMock).toHaveBeenCalledTimes(2);
  });

  it('should trigger only subscribed listeners based on key changes', () => {
    const state = createState({ count: 0, text: '', nested: { value: 0 } });
    const countListenerMock = jest.fn();
    const textListenerMock = jest.fn();
    const nestedValueListenerMock = jest.fn();

    addListener(() => {
      state.count;
      countListenerMock();
    }, 'countListener');

    addListener(() => {
      state.text;
      textListenerMock();
    }, 'textListener');

    addListener(() => {
      state.nested.value;
      nestedValueListenerMock();
    }, 'nestedValueListener');

    expect(countListenerMock).toHaveBeenCalledTimes(1);
    expect(textListenerMock).toHaveBeenCalledTimes(1);
    expect(nestedValueListenerMock).toHaveBeenCalledTimes(1);

    state.count = 1;
    expect(countListenerMock).toHaveBeenCalledTimes(2);
    expect(textListenerMock).toHaveBeenCalledTimes(1);
    expect(nestedValueListenerMock).toHaveBeenCalledTimes(1);

    state.text = 'hello';
    expect(countListenerMock).toHaveBeenCalledTimes(2);
    expect(textListenerMock).toHaveBeenCalledTimes(2);
    expect(nestedValueListenerMock).toHaveBeenCalledTimes(1);

    state.nested.value = 100;
    expect(countListenerMock).toHaveBeenCalledTimes(2);
    expect(textListenerMock).toHaveBeenCalledTimes(2);
    expect(nestedValueListenerMock).toHaveBeenCalledTimes(2);

    removeListener('countListener');
    removeListener('textListener');
    removeListener('nestedValueListener');
  });

  it('should trigger a listener subscribed to multiple keys only when those keys change', () => {
    const state = createState({
      count: 0,
      text: '',
      flag: false,
      nested: { value: 0 },
    });
    const multiKeyListenerMock = jest.fn();

    addListener(() => {
      state.count;
      state.text;

      multiKeyListenerMock();
    }, 'multiKeyListener');

    expect(multiKeyListenerMock).toHaveBeenCalledTimes(1);

    state.count = 1;
    expect(multiKeyListenerMock).toHaveBeenCalledTimes(2);

    state.text = 'updated';
    expect(multiKeyListenerMock).toHaveBeenCalledTimes(3);

    state.flag = true;
    expect(multiKeyListenerMock).toHaveBeenCalledTimes(3);

    state.nested.value = 100;
    expect(multiKeyListenerMock).toHaveBeenCalledTimes(3);

    removeListener('multiKeyListener');
  });

  it('should handle error during listener removal', () => {
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {
        // do nothing
      });

    removeListener('nonExistentListener');
    expect(consoleErrorMock).toHaveBeenCalled();
    consoleErrorMock.mockRestore();
  });

  it('should not execute a listener that has no subscriptions', () => {
    const state = createState({ count: 0 });
    const listenerMock = jest.fn();

    addListener(listenerMock, 'testListener');

    state.count = 1;
    expect(listenerMock).toHaveBeenCalledTimes(1);
    removeListener('testListener');
  });

  it('should queue listener during batchUpdate', () => {
    const state = createState({ count: 0 });
    const listenerMock = jest.fn();
    addListener(() => {
      state.count;
      listenerMock();
    }, 'testListener');
    batchUpdate(() => {
      state.count = 1;
    });

    expect(listenerMock).toHaveBeenCalledTimes(2);
    removeListener('testListener');
  });

  it('should create and return new global state when no component is being rendered', () => {
    LITSTATE.componentBeingRendered = null;
    const globalState = createState({ count: 0 });
    expect(globalState).toBeDefined();
    expect(globalState.count).toBe(0);
  });

  it('should return existing local state when component is being rendered', () => {
    LITSTATE.componentBeingRendered = 'testComponent';
    const firstState = createState({ count: 0 });
    const secondState = createState({ count: 0 });
    expect(firstState).toBe(secondState);
    LITSTATE.componentBeingRendered = null;
  });

  it('should handle null state target', () => {
    const nullState = createState(null);
    expect(nullState).toBeNull();
  });

  it('should proxy objects within an array', () => {
    const arrayState = createState([
      { item: 'item1', value: 1 },
      { item: 'item2', value: 2 },
    ]);

    const firstItemValue = arrayState[0].value;
    const secondItemValue = arrayState[1].value;

    expect(firstItemValue).toBe(1);
    expect(secondItemValue).toBe(2);

    arrayState[0].value = 10;
    arrayState[1].value = 20;

    expect(arrayState[0].value).toBe(10);
    expect(arrayState[1].value).toBe(20);
  });

  it('should create a new state when setting an object', () => {
    const state = createState({} as { a: { nested: string } });

    state.a = { nested: 'value' };
    expect(state.a.nested).toBe('value');

    state.a.nested = 'new value';
    expect(state.a.nested).toBe('new value');
  });

  it('should create a new state when setting an array', () => {
    const state = createState({} as { a: string[] });

    state.a = ['item1', 'item2'];
    expect(state.a[0]).toBe('item1');
    expect(state.a[1]).toBe('item2');

    state.a.push('item3');
    expect(state.a[2]).toBe('item3');
  });
});
