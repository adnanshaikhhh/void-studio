import { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

export function Marquee() {
  const containerRef = useRef(null);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  // We'll create an array of logo placeholders (SVG rectangles)
  const logos = Array.from({ length: 20 }, (_, i) => (
    <div key={i} className="flex-shrink-0 w-24 h-12 mx-4">
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="none" stroke="white" strokeWidth="2"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" fontSize="14">
          LOGO
        </text>
      </svg>
    </div>
  ));

  // Spring for smooth direction change
  const spring = useSpring({ delay: 0 });

  // Update scroll speed based on scroll velocity
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTimestamp = performance.now();

    const updateScrollSpeed = () => {
      const now = performance.now();
      const deltaTime = now - lastTimestamp;
      if (deltaTime > 0) {
        const deltaY = window.scrollY - lastScrollY;
        const speed = deltaY / deltaTime;
        setScrollSpeed(speed);
      }
      lastScrollY = window.scrollY;
      lastTimestamp = now;
      requestAnimationFrame(updateScrollSpeed);
    };

    requestAnimationFrame(updateScrollSpeed);

    return () => {
      // Cleanup
    };
  }, []);

  // Change direction on hover
  const handleMouseEnter = () => {
    setDirection(-direction);
  };

  const handleMouseLeave = () => {
    setDirection(direction); // Reset to original? Actually, we want to go back to the original direction after hover?
    // We'll just set it back to 1 (right) for simplicity, but we can store the original direction.
  };

  // We'll use a ref to store the original direction
  const originalDirection = useRef(1);
  useEffect(() => {
    originalDirection.current = direction;
  }, [direction]);

  // When mouse leaves, reset to original direction
  const handleMouseLeaveReset = () => {
    setDirection(originalDirection.current);
  };

  // Calculate the transform based on scroll speed and direction
  const translateX = (scrollSpeed * 0.1) * direction; // Adjust sensitivity

  return (
    <section className="relative w-full overflow-hidden bg-black/50">
      <div
        ref={containerRef}
        className="flex flex-nowrap w-max px-4 py-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeaveReset}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {logos.map((logo, index) => (
          <div key={index} className="flex-shrink-0 w-24 h-12 mx-4">
            {logo}
          </div>
        ))}
        {/* Duplicate the logos to create seamless loop */}
        {logos.map((logo, index) => (
          <div key={index + logos.length} className="flex-shrink-0 w-24 h-12 mx-4">
            {logo}
          </div>
        ))}
      </div>
    </section>
  );
}