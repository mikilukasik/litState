import { html } from '../src/html';

describe('html', () => {
  it('should concatenate template strings with no values', () => {
    const result = html`<div></div>`;
    expect(result).toBe('<div></div>');
  });

  it('should concatenate template strings with multiple values', () => {
    const result = html`<div>${'content'}</div><span>${'more content'}</span>`; // prettier-ignore
    expect(result).toBe('<div>content</div><span>more content</span>');
  });

  it('should handle undefined values', () => {
    const result = html`<div>${undefined}</div>`;
    expect(result).toBe('<div>undefined</div>');
  });

  it('should handle null values', () => {
    const result = html`<div>${null}</div>`;
    expect(result).toBe('<div>null</div>');
  });

  it('should handle numbers', () => {
    const result = html`<div>${123}</div>`;
    expect(result).toBe('<div>123</div>');
  });

  it('should handle expressions', () => {
    const result = html`<div>${1 + 1}</div>`;
    expect(result).toBe('<div>2</div>');
  });

  it('should handle objects by invoking toString', () => {
    const obj = { toString: () => 'object content' };
    const result = html`<div>${obj}</div>`;
    expect(result).toBe('<div>object content</div>');
  });
});
