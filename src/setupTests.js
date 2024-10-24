import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})