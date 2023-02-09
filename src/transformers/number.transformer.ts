interface ToNumberOptions {
  default?: number;
  max?: number;
  min?: number;
}

/**
 * Transform value to number
 * @param {string} value
 * @param {ToNumberOptions} opts
 */
export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);
  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }
  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }
    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }
  return newValue;
}
