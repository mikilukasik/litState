import { Component, ObjectWithOptionalId } from './types';
export declare const component: (functionalComponent: Component, attributes?: ObjectWithOptionalId | ((props: Record<string, unknown>) => ObjectWithOptionalId) | undefined) => (props?: Record<string, unknown>) => string;
