/* eslint-disable @typescript-eslint/no-explicit-any */
export type Props = { [key: string]: any };

export type Component = (props: Props) => string;

export type ObjectWithOptionalId = {
  [key: string]: unknown;
  id?: string;
};

export type HTMLElementsById = Record<string, HTMLElement>;
