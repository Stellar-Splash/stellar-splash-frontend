import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ErrorBoundary } from '../components/ErrorBoundary';

const BadComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test explosive crash');
  }
  return React.createElement('div', { id: 'safe-child' }, 'Operational Child Content');
};

describe('ErrorBoundary Component', () => {
  it('renders children smoothly when no error is thrown', () => {
    const html = renderToString(
      React.createElement(
        ErrorBoundary,
        null,
        React.createElement(BadComponent, { shouldThrow: false })
      )
    );
    expect(html).toContain('safe-child');
    expect(html).toContain('Operational Child Content');
  });

  it('renders fallback UI when instantiated with initial error state', () => {
    const boundary = new ErrorBoundary({ children: null });
    const derived = ErrorBoundary.getDerivedStateFromError(new Error('Simulated critical crash'));
    expect(derived.hasError).toBe(true);
    expect(derived.error?.message).toBe('Simulated critical crash');

    boundary.state = {
      hasError: true,
      error: new Error('Simulated critical crash'),
      errorInfo: null,
      copied: false,
    };

    const rendered = boundary.render();
    const html = renderToString(rendered as React.ReactElement);
    expect(html).toContain('Application Encountered an Unexpected Error');
    expect(html).toContain('Simulated critical crash');
    expect(html).toContain('Try Again');
    expect(html).toContain('Copy Crash Report');
  });

  it('supports custom function fallback', () => {
    const boundary = new ErrorBoundary({
      children: null,
      fallback: (error, reset) =>
        React.createElement(
          'div',
          { id: 'custom-error-view' },
          `Custom crash handler: ${error.message}`
        ),
    });

    boundary.state = {
      hasError: true,
      error: new Error('Custom Error State'),
      errorInfo: null,
      copied: false,
    };

    const rendered = boundary.render();
    const html = renderToString(rendered as React.ReactElement);
    expect(html).toContain('custom-error-view');
    expect(html).toContain('Custom crash handler: Custom Error State');
  });

  it('notifies onError callback during componentDidCatch lifecycle', () => {
    const onErrorMock = vi.fn();
    const boundary = new ErrorBoundary({
      children: null,
      onError: onErrorMock,
    });

    const error = new Error('Lifecycle test exception');
    const info = { componentStack: '\n    in BadComponent\n    in ErrorBoundary' };

    boundary.componentDidCatch(error, info);
    expect(onErrorMock).toHaveBeenCalledWith(error, info);
    expect(boundary.state.errorInfo).toEqual(info);
  });
});
