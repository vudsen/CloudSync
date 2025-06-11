import { addToast } from '@heroui/toast'
import { getTranslationAsReactNode } from '@/util/getTranslation.tsx'
import type React from 'react'

export const requireNonNull = <T> (val?: T, message?: string): NonNullable<T> => {
  if (val === undefined || val === null) {
    throw new Error(message ?? 'Value must not be null')
  }
  return val
}

export const createErrorHandler = (title: React.ReactNode) => {
  return (err: unknown) => {
    addToast({
      title,
      description: (err as Error)?.message ?? getTranslationAsReactNode('unknownError'),
      color: 'danger',
    })
    console.error(err)
  }
}

export const formatTimestampToDateString = (timestamp: number): string => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}`
}