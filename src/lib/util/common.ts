export const requireNonNull = <T> (val?: T, message?: string): NonNullable<T> => {
  if (!val) {
    throw new Error(message ?? 'Value must not be null')
  }
  return val
}