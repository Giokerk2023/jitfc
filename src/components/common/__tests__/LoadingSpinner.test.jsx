import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner, PageLoader } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    render(<LoadingSpinner size="small" />);
    const loader = screen.getByRole('status').querySelector('svg');
    expect(loader).toHaveClass('w-4', 'h-4');
  });

  it('applies brand color', () => {
    render(<LoadingSpinner />);
    const loader = screen.getByRole('status').querySelector('svg');
    expect(loader).toHaveClass('text-brand-600');
  });
});

describe('PageLoader', () => {
  it('renders full page loader', () => {
    render(<PageLoader />);
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(loader.parentElement).toHaveClass('fixed', 'inset-0');
  });
});