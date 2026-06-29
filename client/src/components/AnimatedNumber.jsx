import { useEffect, useState } from "react";

function AnimatedNumber({ value, duration = 1500 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;

    const end = Number(value);

    if (isNaN(end)) {
      setDisplayValue(0);
      return;
    }

    const startTime = performance.now();

    function animate(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const current = Math.floor(progress * end);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export default AnimatedNumber;