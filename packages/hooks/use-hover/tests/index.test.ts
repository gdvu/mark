import { renderHook, act } from '@testing-library/react';
import { useHover } from '../src';

describe('useHover', () => {
  it('should return false initially', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useHover(ref));
    expect(result.current).toBe(false);
  });

  it('should return true when mouse enters and false when mouse leaves', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useHover(ref));

    expect(result.current).toBe(false);

    act(() => {
      ref.current.dispatchEvent(new MouseEvent('mouseenter'));
    });

    expect(result.current).toBe(true);

    act(() => {
      ref.current.dispatchEvent(new MouseEvent('mouseleave'));
    });

    expect(result.current).toBe(false);
  });

  it('should clean up event listeners on unmount', () => {
    const ref = { current: document.createElement('div') };
    const addEventListenerSpy = jest.spyOn(ref.current, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(
      ref.current,
      'removeEventListener'
    );

    const { unmount } = renderHook(() => useHover(ref));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mouseenter',
      expect.any(Function)
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mouseleave',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mouseenter',
      expect.any(Function)
    );

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mouseleave',
      expect.any(Function)
    );
  });
});
