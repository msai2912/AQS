'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnimatedNumber({ value, color }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [highlight, setHighlight] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setHighlight(true);
      const diff = value - prevValueRef.current;
      const duration = 300; // ms
      const stepTime = 30;
      const steps = Math.ceil(duration / stepTime);
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const animated = Math.round(prevValueRef.current + diff * progress);
        setDisplayValue(animated);

        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayValue(value);
        }
      }, stepTime);

      setTimeout(() => setHighlight(false), 500);
      prevValueRef.current = value;
    }
  }, [value]);

  return (
    <p
      className={`text-2xl md:text-3xl font-bold ${color} transition-all duration-300 ${
        highlight ? 'bg-yellow-200 px-2 py-1 rounded' : ''
      }`}
    >
      {displayValue}
    </p>
  );
}
