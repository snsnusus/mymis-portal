import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AvatarStylePicker } from './avatar-style-picker';

describe('AvatarStylePicker', () => {
  it('highlights the default style when no style is chosen', () => {
    render(<AvatarStylePicker value={null} onChange={vi.fn()} seed={4} />);

    expect(
      screen
        .getByRole('button', { name: 'Avatars' })
        .getAttribute('aria-pressed')
    ).toBe('true');
    expect(
      screen.getByRole('button', { name: 'Bots' }).getAttribute('aria-pressed')
    ).toBe('false');
  });

  it('calls onChange with the clicked style', () => {
    const onChange = vi.fn();
    render(
      <AvatarStylePicker value="avataaars" onChange={onChange} seed={4} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bots' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('bottts');
  });

  it('does not call onChange when the selected style is clicked again', () => {
    const onChange = vi.fn();
    render(
      <AvatarStylePicker value="avataaars" onChange={onChange} seed={4} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Avatars' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables every option when disabled', () => {
    render(
      <AvatarStylePicker
        value="avataaars"
        onChange={vi.fn()}
        seed={4}
        disabled
      />
    );

    screen.getAllByRole('button').forEach((button) => {
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });
  });
});
