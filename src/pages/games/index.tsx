import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Card from '@/components/Card';
import withLayout from '@/components/hoc/withLayout';
import { RawgGame } from '@/types';
import MetaCriticScore from '@/components/MetaCriticScore';
import Loading from '@/components/Loading';

const Games = () => {
  const router = useRouter();

  const [searchResults, setSearchResults] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getItemsFromStorage = () => {
    const searchResultsString = localStorage.getItem('searchResults');

    if (!!searchResultsString) {
      const parsedResults = JSON.parse(searchResultsString) as RawgGame[];
      console.log({ parsedResults });
      setSearchResults(parsedResults);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const { searchTerm } = router.query;
    if (!searchTerm) {
      setIsLoading(false);
      return;
    }
    getItemsFromStorage();
    setIsLoading(false);
  }, [router.query]);

  if (!!isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-white text-4xl">Search Results</h1>
      <div className="border-b-2 border-secondary my-4 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {searchResults?.map((g: RawgGame) => (
          <Link
            key={g.id}
            href={`/games/${g.id}`}
            className=" hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <Card className="text-white my-2">
              <div className="h-40 w-full">
                <Image
                  className="rounded-t-lg w-full h-full"
                  src={
                    g?.short_screenshots && g?.short_screenshots[0]?.image
                      ? g?.short_screenshots[0]?.image
                      : '/images/Playfolio White.png'
                  }
                  alt={g?.name ?? 'Game Image'}
                  width={100}
                  height={100}
                />
              </div>

              <div className="p-4 bg-gray-700 rounded-b-lg">
                <div className="flex justify-between items-start">
                  <div className="text-2xl me-3">{g?.name}</div>
                  <MetaCriticScore score={g?.metacritic ?? 0} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default withLayout(Games);
