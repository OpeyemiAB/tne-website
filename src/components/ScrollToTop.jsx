import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll window to top-left instantly when navigating to a new route
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
