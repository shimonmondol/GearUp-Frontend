'use client';

import { usePathname } from 'next/navigation';

const hiddenRoutes = ['/login', '/signup'];

const HeaderWrapper = () => {
  const pathname = usePathname();

  // Don't show Navbar if current route matches hiddenRoutes
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }
};

export default HeaderWrapper;