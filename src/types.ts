/* eslint-disable @typescript-eslint/no-explicit-any */
export type Props = Record<string, any>;
export type PropsWithId = Props & { id: string | number };

// export type Component = (id: string, props: Props) => string;

export type ObjectWithOptionalId = {
  [key: string]: any;
  id?: string;
};

export type HTMLElementsById = Record<string, HTMLElement>;

export type Component = (props?: Props) => string;

export type ComponentDefiner = (props: PropsWithId) => string;
