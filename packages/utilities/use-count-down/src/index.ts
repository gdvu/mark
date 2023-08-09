import { useState, useRef, useEffect, useCallback } from 'react';

interface Options {
  autoStart?: boolean;
  onFinished?: () => void;
}

interface CountDownResult {
  readonly value: number;
  readonly stop: () => void;
  readonly trigger: () => void;
  readonly reset: () => void;
  readonly isFinished: boolean;
}

type UseCountDown = (
  initialValue: number,
  interval: number,
  options?: Options
) => CountDownResult;

export const useCountDown: UseCountDown = (
  initialValue,
  interval = 1000,
  options = {}
) => {
  const { autoStart = true, onFinished } = options;

  const [timer, setTimer] = useState<number>(initialValue);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timer | null>(null);

  const stop = useCallback(() => {
    if (!timerRef.current) return;

    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const trigger = useCallback(() => {
    if (timerRef.current) return;
    if (isFinished) return;

    timerRef.current = setInterval(() => {
      if (timer > 0) {
        setTimer(prev => prev - 1000);
      } else {
        stop();
        setTimer(0);
        setIsFinished(true);
        if (onFinished) onFinished();
      }
    }, interval);
  }, [isFinished, interval, timer, stop, onFinished]);

  const reset = useCallback(() => {
    setTimer(initialValue);
    setIsFinished(true);
  }, [initialValue]);

  useEffect(() => {
    if (autoStart) trigger();

    return () => {
      stop();
    };
  }, [autoStart, stop, trigger]);

  return {
    value: timer,
    stop,
    trigger,
    reset,
    isFinished: isFinished
  };
};
