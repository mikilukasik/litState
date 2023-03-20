import { Component, PropsWithId } from './types';

export const LITSTATE: {
  handlersPerComponent: Record<string, Record<string | number, any>>;
  components: Record<string | number, Component>;
  componentsCurrentProps: Record<string | number, PropsWithId>;
  elementsWithIds: Record<string | number, HTMLElement>;
  listenerBeingExecuted: (() => void) | null;
  componentBeingRendered: string | number | null;
} = {
  handlersPerComponent: {},
  components: {},
  componentsCurrentProps: {},
  elementsWithIds: {},
  listenerBeingExecuted: null,
  componentBeingRendered: null,
};

Object.assign(window, { LITSTATE });
