/**
 * PersonaErrorBoundary - Error boundary for persona feature
 * Catches and handles errors in persona components gracefully
 */

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */
export class PersonaErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    console.error('PersonaErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional reset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <PersonaErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
          onGoBack={this.props.onReset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * PersonaErrorFallback Component
 * Displays user-friendly error message with recovery options
 */
interface PersonaErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
  onGoBack?: () => void;
}

function PersonaErrorFallback({ error, onReset, onGoBack }: PersonaErrorFallbackProps) {
  // Determine error type and provide appropriate message
  const getErrorMessage = (): { title: string; description: string } => {
    if (!error) {
      return {
        title: 'Something went wrong',
        description: 'An unexpected error occurred while loading your persona.',
      };
    }

    const errorMessage = error.message.toLowerCase();

    // Spline loading errors
    if (errorMessage.includes('spline') || errorMessage.includes('3d') || errorMessage.includes('scene')) {
      return {
        title: '3D Scene Loading Error',
        description: 'Unable to load the 3D visualization. The persona data is still available below.',
      };
    }

    // Calculation errors
    if (errorMessage.includes('calculate') || errorMessage.includes('persona')) {
      return {
        title: 'Persona Calculation Error',
        description: 'Unable to calculate your persona from session data. Please try again or check your session history.',
      };
    }

    // Data errors
    if (errorMessage.includes('data') || errorMessage.includes('invalid')) {
      return {
        title: 'Data Error',
        description: 'There was a problem with your session data. Please try refreshing or contact support.',
      };
    }

    // Generic error
    return {
      title: 'Unexpected Error',
      description: error.message || 'An unexpected error occurred. Please try again.',
    };
  };

  const { title, description } = getErrorMessage();

  return (
    <div className="min-h-screen bg-nav-black text-nav-cream p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          {/* Error Icon */}
          <div
            className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6"
            aria-hidden="true"
          >
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-nav-cream mb-4">
            {title}
          </h1>

          {/* Error Description */}
          <p className="text-nav-cream/70 text-lg max-w-md mb-8">
            {description}
          </p>

          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-8 text-left w-full max-w-2xl">
              <summary className="cursor-pointer text-nav-cream/50 hover:text-nav-cream/70 mb-2">
                Technical Details (Development Only)
              </summary>
              <pre className="bg-card rounded-xl p-4 text-sm text-red-400 overflow-auto max-h-48 border border-nav-lime/10">
                {error.stack || error.message}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-6 py-3 bg-nav-lime text-void font-semibold rounded-xl hover:bg-lime-500 transition focus:outline-none focus:ring-2 focus:ring-nav-lime focus:ring-offset-2 focus:ring-offset-void"
                aria-label="Try again"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            )}
            
            {onGoBack && (
              <button
                onClick={onGoBack}
                className="flex items-center gap-2 px-6 py-3 bg-nav-cream/5 text-nav-cream font-semibold rounded-xl hover:bg-nav-cream/10 transition border border-nav-lime/20 focus:outline-none focus:ring-2 focus:ring-nav-lime focus:ring-offset-2 focus:ring-offset-void"
                aria-label="Go back to dashboard"
              >
                <Home className="w-5 h-5" />
                Back to Dashboard
              </button>
            )}
          </div>

          {/* Help Text */}
          <p className="text-nav-cream/50 text-sm mt-8">
            If this problem persists, try clearing your browser cache or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
