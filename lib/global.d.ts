import { Component } from './types';
export declare const LITSTATE: {
    handlersPerComponent: Record<string, Record<string | symbol, any>>;
    components: Record<string | symbol, Component>;
    componentsCurrentProps: Record<string | symbol, Record<string | symbol, any>>;
    elementsWithIds: Record<string | symbol, HTMLElement>;
    listenerBeingExecuted: (() => void) | null;
    componentBeingRendered: string | number | null;
};
