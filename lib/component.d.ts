import { Component, ComponentDefiner, ObjectWithOptionalId } from './types';
export declare const component: (functionalComponent: ComponentDefiner, attributes?: ObjectWithOptionalId | ((props: Record<string, unknown>) => ObjectWithOptionalId) | undefined) => Component;
