import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock device motion and orientation APIs
Object.defineProperty(window, 'DeviceMotionEvent', {
  writable: true,
  value: class DeviceMotionEvent {
    constructor() {}
    requestPermission = () => Promise.resolve('granted')
  }
})

Object.defineProperty(window, 'DeviceOrientationEvent', {
  writable: true,
  value: class DeviceOrientationEvent {
    constructor() {}
    requestPermission = () => Promise.resolve('granted')
  }
})

// Mock MediaRecorder
Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: class MediaRecorder {
    constructor() {}
    start() {}
    stop() {}
    pause() {}
    resume() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {}
  }
})

// Mock getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: () => Promise.resolve({
      getTracks: () => [],
      getAudioTracks: () => [],
      getVideoTracks: () => []
    })
  }
})
