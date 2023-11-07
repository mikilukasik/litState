import {
  getIdFromStack,
  getLongIdFromStack,
  resetId,
} from '../src/getIdFromStack';

const originalLocation = window.location;
const originalError = Error;

beforeAll(() => {
  delete (window as any).location;
  window.location = {
    ...originalLocation,
    href: 'http://localhost/',
  } as Location;
});

afterAll(() => {
  window.location = originalLocation;
});

describe('getIdFromStack', () => {
  let mockErrorInstance: Error;
  let mockStack: string;

  beforeEach(() => {
    jest.restoreAllMocks();

    mockStack = `
      Error
        at Object.<anonymous> (http://localhost/path/to/file.js:2:7)
        at Object.<anonymous> (http://localhost/path/to/file.js:4:7)
    `;

    mockErrorInstance = {
      ...new originalError(),
      get stack() {
        return mockStack;
      },
    } as Error;

    jest.spyOn(global, 'Error').mockImplementation(() => mockErrorInstance);
  });

  it('should return a random-like string when it cannot generate an ID', () => {
    Object.defineProperty(mockErrorInstance, 'stack', {
      get: () => undefined,
    });

    const id = getIdFromStack();
    expect(id).toMatch(/^lsRndId\d+$/);
  });

  it('should warn when it cannot generate an ID', () => {
    Object.defineProperty(mockErrorInstance, 'stack', {
      get: () => undefined,
    });

    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {
        // Do nothing
      });

    getIdFromStack();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Could not generate component id'
    );

    consoleWarnSpy.mockRestore();
  });

  it('should cache and return the same ID for the same stack trace', () => {
    const id1 = getIdFromStack();
    const id2 = getIdFromStack();
    const id3 = getIdFromStack();

    expect(id1).toEqual(id2);
    expect(id1).toEqual(id3);
  });

  it('should generate different IDs for different stack traces', () => {
    const mockStack1 = `
      Error
        at Object.<anonymous> (http://localhost/path/to/file.js:2:7)
        at Object.<anonymous> (http://localhost/path/to/file.js:4:7)
    `;
    const mockStack2 = `
      Error
        at Object.<anonymous> (http://localhost/path/to/other-file.js:5:10)
        at Object.<anonymous> (http://localhost/path/to/other-file.js:6:10)
    `;

    Object.defineProperty(mockErrorInstance, 'stack', {
      get: () => mockStack1,
    });
    const id1 = getIdFromStack();

    Object.defineProperty(mockErrorInstance, 'stack', {
      get: () => mockStack2,
    });
    const id2 = getIdFromStack();

    expect(id1).not.toEqual(id2);
  });

  it('should increment the ID for new stack traces', () => {
    const idOriginal = getIdFromStack();

    const mockStackNew = `
      Error
        at Object.<anonymous> (http://localhost/new/path/to/file.js:2:7)
        at Object.<anonymous> (http://localhost/new/path/to/file.js:4:7)
    `;

    Object.defineProperty(mockErrorInstance, 'stack', {
      get: () => mockStackNew,
    });

    const idNew = getIdFromStack();

    expect(idNew).not.toEqual(idOriginal);
    expect(idNew).toMatch(/ls\d+/);
    expect(idNew).not.toMatch(/^lsRndId\d+$/);

    const originalNumericId = parseInt(idOriginal.replace('ls', ''));
    const newNumericId = parseInt(idNew.replace('ls', ''));
    expect(newNumericId).toBeGreaterThan(originalNumericId);
  });

  it('should handle error during ID generation', () => {
    jest.spyOn(global, 'Error' as any).mockImplementation(() => {
      throw { message: 'Test error' };
    });

    expect(() => getIdFromStack()).toThrow('Test error');

    jest.restoreAllMocks();
  });
});

describe('getLongIdFromStack', () => {
  it('should extract the correct long ID from a well-formed stack trace', () => {
    const stack = `
      Error
        at Object.<anonymous> (http://localhost/path/to/file.js:2:7)
        at Object.<anonymous> (http://localhost/path/to/file.js:4:7)
    `;
    const longId = getLongIdFromStack(stack);
    expect(longId).toBe('(path/to/file.js:2:7)(path/to/file.js:4:7)');
  });

  it('should return an empty string if the stack trace is malformed', () => {
    const stack = `Error`;
    const longId = getLongIdFromStack(stack);
    expect(longId).toBe('');
  });

  it('should return an empty string if stack is undefined', () => {
    const stack = undefined;
    const longId = getLongIdFromStack(stack as unknown as string);
    expect(longId).toBe('');
  });

  it('should reset the internal counter and clear the cache used by getIdFromStack', () => {
    resetId();

    const id1 = getIdFromStack();
    const id2 = getIdFromStack();

    expect(id1).not.toBe(id2);

    resetId();

    const idAfterReset = getIdFromStack();

    expect(idAfterReset).toBe(id1);
    expect(idAfterReset).not.toBe(id2);
  });
});
