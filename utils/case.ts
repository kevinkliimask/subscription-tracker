export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function objectToSnakeCase<T extends object>(
  obj: T
): {
  [K in keyof T as K extends string
    ? K extends `${infer F}${infer R}`
      ? F extends Uppercase<F>
        ? `_${Lowercase<F>}${objectToSnakeCase_recursive<R>}`
        : `${Lowercase<F>}${objectToSnakeCase_recursive<R>}`
      : K
    : K]: T[K] extends object
    ? T[K] extends Date
      ? T[K]
      : ReturnType<typeof objectToSnakeCase<T[K]>>
    : T[K];
} {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      toSnakeCase(key),
      value instanceof Object && !(value instanceof Date)
        ? objectToSnakeCase(value as object)
        : value,
    ])
  ) as any;
}

type objectToSnakeCase_recursive<S extends string> = S extends `${infer F}${infer R}`
  ? F extends Uppercase<F>
    ? `_${Lowercase<F>}${objectToSnakeCase_recursive<R>}`
    : `${Lowercase<F>}${objectToSnakeCase_recursive<R>}`
  : S;

export function objectToCamelCase<T extends object>(
  obj: T
): {
  [K in keyof T as K extends `${infer F}_${infer R}`
    ? `${Lowercase<F>}${Capitalize<R>}`
    : Uncapitalize<string & K>]: T[K] extends object
    ? T[K] extends Date
      ? T[K]
      : ReturnType<typeof objectToCamelCase<T[K]>>
    : T[K];
} {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      toCamelCase(key),
      value instanceof Object && !(value instanceof Date)
        ? objectToCamelCase(value as object)
        : value,
    ])
  ) as any;
}
