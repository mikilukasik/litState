export type Component = (props: Record<string | symbol, any>) => string;
export declare const handler: (handlerToDefine: (event: Event, elm: HTMLElement) => void) => string;
export declare const createState: <T>(_stateTarget: T) => T;
export declare const mount: (content: string, container: HTMLElement) => void;
export declare const component: (functionalComponent: Component) => (props?: Record<string | symbol, any>) => string;
export declare const html: (strings: TemplateStringsArray, ...values: any[]) => string;
