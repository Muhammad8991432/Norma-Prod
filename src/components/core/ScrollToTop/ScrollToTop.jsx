import React, { useEffect } from 'react';

export function ScrollToTop({ behavior = 'instant', children }) {
  // // Hooks
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  }, []);

  return <>{children}</>;
}

export default ScrollToTop;