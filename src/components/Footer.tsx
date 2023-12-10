import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 px-10 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center container mx-auto">
        <div className="order-2 sm:order-1 flex items-center text-gray-200">
          Discover
          <span className="inline-block h-2 w-2 rounded-full bg-warning mx-2"></span>
          Play
          <span className="inline-block h-2 w-2 rounded-full bg-warning mx-2"></span>
          Share
        </div>
        <Link href="/" className="order-1 sm:order-2 flex items-center space-x-1">
          <Image
            src="/images/Play Dark.png"
            alt="Playfolio Logo"
            width={25}
            height={25}
          />
          <Image
            src="/images/Playfolio White.png"
            alt="Playfolio Logo"
            width={75}
            height={75}
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
