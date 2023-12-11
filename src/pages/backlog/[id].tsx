import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import Toast, { ToastProps } from '@/components/Toast';
import withLayout from '@/components/hoc/withLayout';
import { SessionUser } from '@/types';
import { serverApi } from '@/lib/api';
import { Game } from '@prisma/client';
import Button from '@/components/Button';
import Link from 'next/link';
import Image from 'next/image';

const defaultToastProps: ToastProps = {
  message: '',
  visible: false,
  type: 'success',
  timer: 3000,
  noTimeout: false,
};

const UserBacklog = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();

  const user = session?.user as SessionUser;

  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState<ToastProps>(defaultToastProps);
  const [backlogDetails, setBacklogDetails] = useState<Game[]>([]);
  const [isRemovingFromBacklog, setIsRemovingFromBacklog] = useState('');

  const handleRemoveFromBacklog = async (game: Game) => {
    setIsRemovingFromBacklog(game.id);
    try {
      console.log({ game });
      await serverApi.delete('/api/backlog/remove', {
        data: { gameId: game.id },
      });
      setBacklogDetails((prevBacklogDetails) =>
        prevBacklogDetails.filter((g) => g.id !== game.id),
      );
      setToastProps({
        ...toastProps,
        message: `${game.title} removed from backlog`,
        visible: true,
        type: 'success',
      });
    } catch (error: AxiosError | any) {
      console.log(error);
      let message = error.message;
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }
      setToastProps({
        ...toastProps,
        message: message,
        visible: true,
        type: 'danger',
      });
    } finally {
      setIsRemovingFromBacklog('');
    }
  };

  useEffect(() => {
    if (!id) return;

    const getBacklogDetails = async () => {
      setIsLoading(true);
      try {
        const backlogDetails = (await serverApi.get(
          `/api/backlog/get?playerId=${id}`,
        )) as Game[];
        console.log({ backlogDetails });
        setBacklogDetails(backlogDetails);
      } catch (error: AxiosError | any) {
        console.log(error);
        let message = error.message;
        if (error?.response?.data?.message) {
          message = error.response.data.message;
        }
        setToastProps({
          ...toastProps,
          message: message,
          visible: true,
          type: 'danger',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!!id) {
      getBacklogDetails();
    }
  }, [id]);

  useEffect(() => {
    if (status === 'unauthenticated' || user?.id !== id) {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    const toastTimer = toastProps.timer;

    const timer = setTimeout(() => {
      setToastProps(defaultToastProps);
    }, toastTimer);
    return () => clearTimeout(timer);
  }, [toastProps]);

  if (!!isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white">
        <h1 className="text-4xl mb-4">Player Backlog</h1>
        <div className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-gray-700">
          {!backlogDetails?.length && (
            <div className="text-xl">No games in backlog</div>
          )}
          {backlogDetails?.map((game) => (
            <div
              key={game.id}
              className="border rounded-lg p-4 flex flex-col justify-between bg-gray-800 shadow-xl"
            >
              <div className="flex flex-col justify-between">
                {!!game?.imageUrl && (
                  <Image
                    src={game?.imageUrl}
                    alt={game?.title}
                    width={1920}
                    height={1080}
                    className="rounded mb-3"
                  />
                )}
                <div className="text-xl font-bold mb-2">{game.title}</div>
              </div>
              <div className="border-t-2 border-secondary my-2"></div>
              <div>
                <Link href={`/games/${game.apiId}`}>
                  <Button size="sm" className="w-full my-1">
                    View Game Details
                  </Button>
                </Link>
                <Button
                  color="danger"
                  size="sm"
                  className="w-full my-1"
                  onClick={() => handleRemoveFromBacklog(game)}
                  disabled={isRemovingFromBacklog === game.id}
                  spinner={isRemovingFromBacklog === game.id}
                >
                  Remove from Backlog
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toast
        message={toastProps.message}
        visible={toastProps.visible}
        type={toastProps.type}
        noTimeout={toastProps.noTimeout}
      />
    </>
  );
};

export default withLayout(UserBacklog);
