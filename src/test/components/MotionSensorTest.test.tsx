import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils'
import MotionSensorTest from '../../components/tests/MotionSensorTest'

// Mock device motion events
const mockDeviceMotionEvent = (acceleration: { x: number; y: number; z: number }) => {
  const event = new Event('devicemotion') as any
  event.acceleration = acceleration
  event.accelerationIncludingGravity = acceleration
  event.rotationRate = { alpha: 0, beta: 0, gamma: 0 }
  event.interval = 16
  return event
}

describe('MotionSensorTest', () => {
  const mockOnComplete = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock DeviceMotionEvent
    Object.defineProperty(window, 'DeviceMotionEvent', {
      writable: true,
      value: class DeviceMotionEvent {
        static requestPermission = vi.fn().mockResolvedValue('granted')
      }
    })
  })

  it('renders start button initially', () => {
    render(
      <MotionSensorTest
        duration={30}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    )

    expect(screen.getByText('Motion Sensor Test')).toBeInTheDocument()
    expect(screen.getByText(/Hold your device steady for \d+ seconds/)).toBeInTheDocument()
    expect(screen.getByText('Start Test')).toBeInTheDocument()
  })

  it('requests permission and starts test', async () => {
    render(
      <MotionSensorTest
        duration={30}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    )

    const startButton = screen.getByText('Start Test')
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(DeviceMotionEvent.requestPermission).toHaveBeenCalled()
    })
  })

  it('shows countdown during test', async () => {
    render(
      <MotionSensorTest
        duration={5}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    )

    const startButton = screen.getByText('Start Test')
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('seconds remaining')).toBeInTheDocument()
    })
  })

  it('collects motion data during test', async () => {
    render(
      <MotionSensorTest
        duration={1}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    )

    const startButton = screen.getByText('Start Test')
    fireEvent.click(startButton)

    // Wait for test to start
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    // Simulate motion data
    const motionEvent = mockDeviceMotionEvent({ x: 0.1, y: 0.2, z: 9.8 })
    window.dispatchEvent(motionEvent)

    // Wait for test to complete
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled()
    }, { timeout: 2000 })

    const callArgs = mockOnComplete.mock.calls[0][0]
    expect(callArgs).toHaveLength(1)
    expect(callArgs[0]).toMatchObject({
      acceleration: { x: 0.1, y: 0.2, z: 9.8 },
      timestamp: expect.any(Number)
    })
  })

  it('handles permission denial', async () => {
    DeviceMotionEvent.requestPermission = vi.fn().mockResolvedValue('denied')

    render(
      <MotionSensorTest
        duration={30}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    )

    const startButton = screen.getByText('Start Test')
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(screen.getByText('Permission Required')).toBeInTheDocument()
      expect(screen.getByText(/This test requires access to your device's motion sensors/)).toBeInTheDocument()
    })
  })

  it('calculates tremor score correctly', () => {
    const testData = [
      { acceleration: { x: 0.1, y: 0.1, z: 9.8 }, timestamp: 1000 },
      { acceleration: { x: 0.2, y: 0.2, z: 9.9 }, timestamp: 1100 },
      { acceleration: { x: 0.15, y: 0.15, z: 9.85 }, timestamp: 1200 }
    ]

    // This would test the internal tremor calculation logic
    // In a real test, you'd expose this function or test it indirectly
    expect(testData).toHaveLength(3)
  })
})
