import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SearchBar from './SearchBar';
import { rawgApi } from '@/lib/api';
import { useSession, signOut, signIn } from 'next-auth/react';
import { SessionUser } from '@/types';

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('Home');
  const [loading, setLoading] = useState(false);

  const user = session?.user as SessionUser;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signIn();
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    router.push('/');
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) return;
    setLoading(true);
    const searchResults = await rawgApi(
      `/games?search=${encodeURIComponent(searchTerm)}`,
    );
    localStorage.setItem('searchResults', JSON.stringify(searchResults));
    router.push(`/games?searchTerm=${searchTerm}`);
    setLoading(false);
  };

  useEffect(() => {
    const currentUrl = router.asPath;
    setActivePage(currentUrl);
  }, [router.asPath]);

  return (
    <nav className="border-gray-200 bg-gray-900 w-full">
      <div className="flex items-center flex-wrap md:flex-nowrap justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-1">
          <Image
            src="/images/Play Dark.png"
            alt="Playfolio Logo Small"
            width={35}
            height={35}
          />
          <Image
            src="/images/Playfolio White.png"
            alt="Playfolio Logo"
            width={100}
            height={100}
          />
        </Link>

        <div className="flex items-center">
          <SearchBar
            className="hidden md:flex md:ml-3"
            inputClass="py-2 px-4 bg-gray-700 rounded-l-md text-white focus:outline-none focus:ring focus:border-primary"
            buttonClass="text-white rounded-r-md px-3 bg-gray-700 hover:bg-gray-950"
            onSubmit={handleSearch}
            isLoading={loading}
          />
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`w-full md:w-auto md:flex  md:items-center md:justify-end ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
          id="navbar-default"
        >
          <ul className="flex flex-col md:flex-row font-medium p-4 md:p-0 mt-4 md:mt-0 border md:border-0 border-gray-700 rounded-lg md:space-x-8 bg-gray-800 md:bg-gray-900 ">
            <li>
              <SearchBar
                className={`md:hidden ${
                  isMenuOpen ? 'flex' : 'hidden'
                } w-full mb-2`}
                inputClass="py-2 px-4 bg-gray-600 rounded-l-md text-white focus:outline-none w-full"
                buttonClass="text-white rounded-r-md px-3 bg-gray-600 hover:bg-gray-700"
                onSubmit={handleSearch}
                isLoading={loading}
              />
            </li>
            <li>
              <Link
                href="/"
                className={`block py-2 px-3 rounded md:p-0 ${
                  activePage === '/'
                    ? 'md:text-primary md:bg-transparent bg-primary'
                    : 'text-white hover:bg-gray-700'
                }`}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            {status === 'authenticated' && (
              <li>
                <Link
                  href={`/library/${user?.id}`}
                  className={`block py-2 px-3 rounded md:p-0 ${
                    activePage.includes('/library')
                      ? 'md:text-primary md:bg-transparent bg-primary'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  Library
                </Link>
              </li>
            )}
            {status === 'authenticated' && (
              <li>
                <Link
                  href={`/backlog/${user?.id}`}
                  className={`block py-2 px-3 rounded md:p-0 ${
                    activePage.includes('/backlog')
                      ? 'md:text-primary md:bg-transparent bg-primary'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  Backlog
                </Link>
              </li>
            )}
            {status === 'unauthenticated' && (
              <li>
                <a
                  onClick={handleSignIn}
                  href="#"
                  className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
                >
                  Sign In
                </a>
              </li>
            )}
            {status === 'authenticated' && (
              <li>
                <a
                  onClick={handleSignOut}
                  href="#"
                  className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
                >
                  Sign Out
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
