"use client";

import Logo from './logo'
import Navbar from './navbar'

const Header = () => {
  return (

    <div className="fixed top-0 w-full z-10">
      <Navbar />
      <header className="w-full flex items-center justify-between h-[70px] max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <Logo />
      </header>
    </div>
  );
}

export default Header;