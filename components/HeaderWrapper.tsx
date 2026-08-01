'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

const hiddenRoutes = ['/login', '/signup'];

const HeaderWrapper = () => {
  const pathname = usePathname();

  // Don't show Navbar if current route matches hiddenRoutes
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }
  return <Navbar />;
};

export default HeaderWrapper;