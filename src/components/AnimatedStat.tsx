import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

interface AnimatedStatProps {
  value?: string | number;
}

export default function AnimatedStat({ value = "0" }: AnimatedStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const strVal = value == null ? "0" : String(value);
  // Match prefix, numeric content (including commas and dots), and suffix
  const match = strVal.match(/^([^\d]*)((?:\d|,|\.)+)([^\d]*)$/);
  
  const prefix = match ? match[1] : '';
  const numStr = match ? match[2] : strVal;
  const suffix = match ? match[3] : '';
  
  const isFloat = numStr.includes('.') && !numStr.includes(',');
  const isComma = numStr.includes(',');
  const numericValue = parseFloat(numStr.replace(/,/g, ''));
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
    restDelta: 0.001
  });
  
  // Trigger animation when the element scrolls into view
  useEffect(() => {
    if (isInView && !isNaN(numericValue)) {
      motionValue.set(numericValue);
    }
  }, [isInView, numericValue, motionValue]);
  
  useEffect(() => {
    if (isNaN(numericValue)) {
      if (ref.current) ref.current.textContent = strVal;
      return;
    }
    
    return springValue.on("change", (latest) => {
      if (ref.current) {
        let formatted = '';
        if (isFloat) {
          formatted = latest.toFixed(1);
        } else if (isComma) {
          formatted = Math.round(latest).toLocaleString('en-US');
        } else {
          formatted = Math.round(latest).toString();
        }
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
  }, [springValue, isFloat, isComma, prefix, suffix, strVal, numericValue]);
  
  // Failsafe rendering strategy -> Initial load displays standard number before hydration
  return <span ref={ref}>{isNaN(numericValue) ? strVal : `${prefix}0${suffix}`}</span>;
}
