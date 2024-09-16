import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import IndexPopup from '~/popup';

const mockGet = vi.fn();
const mockSet = vi.fn();

vi.mock('@plasmohq/storage', () => ({
  Storage: vi.fn(() => ({ get: mockGet, set: mockSet })),
}));

describe('IndexPopup', async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch enabled state from storage on mount', async () => {
    mockGet.mockResolvedValue(false);
    // biome-ignore lint/suspicious/useAwait:
    await act(async () => {
      render(<IndexPopup />);
    });

    expect(mockGet).toHaveBeenCalledWith('enabled');
    const switchButton = screen.getByRole('switch');
    expect(switchButton).toHaveAttribute('aria-checked', 'false');
  });

  it('should toggle switch button state', async () => {
    mockGet.mockResolvedValue(true);
    // biome-ignore lint/suspicious/useAwait:
    await act(async () => {
      render(<IndexPopup />);
    });

    expect(mockGet).toHaveBeenCalledWith('enabled');
    const switchButton = screen.getByRole('switch');
    expect(switchButton).toHaveAttribute('aria-checked', 'true');

    userEvent.click(switchButton);
    await waitFor(() => {
      expect(switchButton).toHaveAttribute('aria-checked', 'false');
      expect(mockSet).toHaveBeenCalledWith('enabled', false);
    });

    userEvent.click(switchButton);
    await waitFor(() => {
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
      expect(mockSet).toHaveBeenCalledWith('enabled', true);
    });
  });
});
