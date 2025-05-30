import { addToast } from '@heroui/toast'

export const requireNonNull = <T> (val?: T, message?: string): NonNullable<T> => {
  if (val === undefined || val === null) {
    throw new Error(message ?? 'Value must not be null')
  }
  return val
}

export const createErrorHandler = (title: string) => {
  return (err: unknown) => {
    addToast({
      title,
      description: (err as Error)?.message ?? 'An unknown error occurred.',
      color: 'danger',
    })
    console.error(err)
  }
}
