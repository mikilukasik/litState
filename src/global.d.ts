export {}; // This line makes this file a module

declare global {
  interface Window {
    LITSTATE: {
      handlersPerComponent: Record<string, Record<string | number, any>>;
      components: Record<string | number, Component>;
      componentsCurrentProps: Record<string | number, PropsWithId>;
      elementsWithIds: Record<string | number, HTMLElement>;
      listenerBeingExecuted: (() => void) | null;
      componentBeingRendered: string | number | null;
    };
  }
}
