import { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
  const router = useRouter();
  const { callbackUrl } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const email = useRef('');
  const password = useRef('');

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setHasError(false);
    try {
      const result = await signIn('credentials', {
        email: email.current,
        password: password.current,
        redirect: false,
      });

      if (!result?.ok) {
        setHasError(true);
      } else {
        if (callbackUrl && !callbackUrl.includes('/register')) {
          window.location.replace(callbackUrl as string);
        } else {
          window.location.replace('/');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex items-center min-h-screen p-4 bg-gray-700 lg:justify-center">
        <div className="flex flex-col bg-gray-900 rounded-md shadow-lg md:flex-row flex-1 lg:max-w-screen-md">
          <div className="p-4 py-6 text-primary md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
            <div className="my-3 text-4xl font-bold tracking-wider text-center">
              <Link href="/">
                <div className="flex">
                  <Image
                    src="/images/Playfolio White.png"
                    alt="Playfolio Logo"
                    width={250}
                    height={250}
                  />
                </div>
              </Link>
            </div>
            <p className="mt-6 text-xl font-normal text-center text-primary md:mt-0">
              Unleash the Power of Play
            </p>
            <p className="flex flex-col items-center justify-center mt-10 text-center">
              <span>Don&apos;t have an account?</span>
              <Link
                href="/auth/register"
                className="hover:underline text-warning"
              >
                Get Started!
              </Link>
            </p>
          </div>
          <div className="p-5 bg-white md:flex-1">
            <h3 className="my-4 text-2xl font-semibold text-gray-700">
              Account Login
            </h3>
            <form onSubmit={handleSignIn} className="flex flex-col space-y-5">
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-500"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  autoFocus
                  className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-secondary text-gray-700"
                  onChange={(e) => (email.current = e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-500"
                  >
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  id="password"
                  className="px-4 py-2 transition duration-300 border border-gray-300 rounded text-gray-700 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-secondary"
                  onChange={(e) => (password.current = e.target.value)}
                />
              </div>
              {!!hasError && (
                <div className="bg-danger text-white font-bold p-2 rounded my-2">
                  Invalid username or password.
                </div>
              )}
              <div>
                <Button type="submit" className="w-full" color="secondary">
                  Log in
                  {!!isLoading && (
                    <FontAwesomeIcon
                      className="ms-1"
                      icon={faCircleNotch}
                      spin
                    />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
