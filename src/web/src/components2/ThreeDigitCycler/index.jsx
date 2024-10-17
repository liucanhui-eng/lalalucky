import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { easeCubic } from 'd3-ease';

const ThreeDigitCycler = ({ startCycling, stopCycling, stopAtNumbers }) => {
  const [isCycling, setIsCycling] = useState(false);
  const [currentStopAt, setCurrentStopAt] = useState([null, null, null]);

  // Slot machine style with smooth d3-ease animations
  const spring0 = useSpring({
    from: { number: 0 },
    number: isCycling ? 9 : currentStopAt[0] !== null ? currentStopAt[0] : 0,
    config: { duration: 400, easing: easeCubic },
    loop: isCycling,
  });

  const spring1 = useSpring({
    from: { number: 0 },
    number: isCycling ? 9 : currentStopAt[1] !== null ? currentStopAt[1] : 0,
    config: { duration: 800, easing: easeCubic },
    loop: isCycling,
    delay: 200, // Delay for the second digit
  });

  const spring2 = useSpring({
    from: { number: 0 },
    number: isCycling ? 9 : currentStopAt[2] !== null ? currentStopAt[2] : 0,
    config: { duration: 1200, easing: easeCubic },
    loop: isCycling,
    delay: 400, // Delay for the third digit
  });

  useEffect(() => {
    if (startCycling) {
      setIsCycling(true);
      setCurrentStopAt([null, null, null]); // Reset stop at numbers
    }
  }, [startCycling]);

  useEffect(() => {
    if (stopCycling) {
      setIsCycling(false);
    }
  }, [stopCycling]);

  useEffect(() => {
    if (stopAtNumbers) {
      setIsCycling(false); // Stop the cycling
      setCurrentStopAt(stopAtNumbers); // Set the stop numbers
    }
  }, [stopAtNumbers]);

  return (
    <div className="flex space-x-4 text-4xl font-bold">
      <animated.div>{spring0.number.to((n) => Math.floor(n))}</animated.div>
      <animated.div>{spring1.number.to((n) => Math.floor(n))}</animated.div>
      <animated.div>{spring2.number.to((n) => Math.floor(n))}</animated.div>
    </div>
  );
};

export default ThreeDigitCycler;
