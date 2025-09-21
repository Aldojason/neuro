import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils'
import { BrowserRouter } from 'react-router-dom'
import AssessmentPage from '../pages/AssessmentPage'
import { AssessmentProvider } from '../contexts/AssessmentContext'
import { AuthProvider } from '../contexts/AuthContext'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ type: 'cognitive' }),
    useNavigate: () => vi.fn()
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      <AssessmentProvider>
        {children}
      </AssessmentProvider>
    </AuthProvider>
  </BrowserRouter>
)

describe('AssessmentPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders cognitive assessment correctly', () => {
    render(<AssessmentPage />, { wrapper: TestWrapper })
    
    expect(screen.getByText('Cognitive Assessment')).toBeInTheDocument()
    expect(screen.getByText('Evaluates memory, attention, and processing speed')).toBeInTheDocument()
  })

  it('shows progress bar', () => {
    render(<AssessmentPage />, { wrapper: TestWrapper })
    
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
    expect(screen.getByText(/Est\. \d+ min remaining/)).toBeInTheDocument()
  })

  it('handles continue button click', async () => {
    render(<AssessmentPage />, { wrapper: TestWrapper })
    
    const continueButton = screen.getByText('Continue')
    expect(continueButton).toBeInTheDocument()
    
    fireEvent.click(continueButton)
    
    await waitFor(() => {
      expect(screen.getByText('Question 2 of 5')).toBeInTheDocument()
    })
  })

  it('handles text input responses', async () => {
    render(<AssessmentPage />, { wrapper: TestWrapper })
    
    // Navigate to second question (text input)
    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)
    
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText('Enter numbers separated by commas')
      expect(textarea).toBeInTheDocument()
      
      fireEvent.change(textarea, { target: { value: '100, 93, 86, 79, 72' } })
      
      const nextButton = screen.getByText('Next')
      expect(nextButton).not.toBeDisabled()
    })
  })

  it('handles radio button responses', async () => {
    // Mock useParams to return behavioral type
    const mockUseParams = vi.fn().mockReturnValue({ type: 'behavioral' })
    vi.doMock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useParams: mockUseParams,
      useNavigate: () => vi.fn()
    }))
    
    render(<AssessmentPage />, { wrapper: TestWrapper })
    
    await waitFor(() => {
      const radioOption = screen.getByLabelText('Not at all')
      expect(radioOption).toBeInTheDocument()
      
      fireEvent.click(radioOption)
      
      const nextButton = screen.getByText('Next')
      expect(nextButton).not.toBeDisabled()
    })
  })

  it('completes assessment and calculates score', async () => {
    const mockNavigate = vi.fn()
    vi.doMock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useParams: () => ({ type: 'cognitive' }),
      useNavigate: () => mockNavigate
    }))
    
    render(<AssessmentPage />, { wrapper: TestWrapper })
    
    // Complete all questions
    for (let i = 0; i < 5; i++) {
      const continueButton = screen.getByText(i === 4 ? 'Complete Assessment' : 'Continue')
      fireEvent.click(continueButton)
      
      await waitFor(() => {
        if (i < 4) {
          expect(screen.getByText(`Question ${i + 2} of 5`)).toBeInTheDocument()
        }
      })
    }
    
    // Should navigate to dashboard after completion
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })
})
