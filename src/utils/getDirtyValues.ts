import type { FieldValues } from 'react-hook-form';

export function getDirtyValues<T extends FieldValues>(
  values: T,
  dirtyFields: Partial<Record<keyof T, boolean>>
): Partial<T> {
  const result: Partial<T> = {};

  for (const key of Object.keys(dirtyFields) as Array<keyof T>) {
    result[key] = values[key];
  }

  return result;
}