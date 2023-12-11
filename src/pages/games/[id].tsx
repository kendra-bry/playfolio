import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import * as Yup from 'yup';
import { AxiosError } from 'axios';
import { rawgApi, serverApi } from '@/lib/api';
import { Genre, Platforms, RawgGameDetail, SessionUser, Tag } from '@/types';
import { convertShortDate } from '@/helpers/utils';
import withLayout from '@/components/hoc/withLayout';
import MetaCriticScore from '@/components/MetaCriticScore';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/form/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import {
  faWindows,
  faXbox,
  faPlaystation,
} from '@fortawesome/free-brands-svg-icons';
import { Formik, Form, FormikHelpers } from 'formik';
import Textarea from '@/components/form/Textarea';
import Loading from '@/components/Loading';
import Toast, { ToastProps } from '@/components/Toast';
import { Game } from '@prisma/client';
import Head from 'next/head';

interface AddToLibraryFormValues {
  id: number;
  userId: string;
  title: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  rating?: number;
  comment?: string;
}

const AddToLibraryFormSchema = Yup.object().shape({
  id: Yup.number().required('Required'),
  userId: Yup.string().required('Required'),
  title: Yup.string().required('Required'),
  imageUrl: Yup.string(),
  startDate: Yup.date(),
  endDate: Yup.date().min(
    Yup.ref('startDate'),
    'End date cannot be before start date',
  ),
  rating: Yup.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: Yup.string(),
});

const defaultToastProps: ToastProps = {
  message: '',
  visible: false,
  type: 'success',
  timer: 3000,
  noTimeout: false,
};

const GameDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();

  const user = session?.user as SessionUser;

  const [gameDetails, setGameDetails] = useState<RawgGameDetail>();
  const [userGameDetails, setUserGameDetails] = useState<Game>();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [platforms, setPlatforms] = useState<IconDefinition[] | undefined>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addToBacklogLoading, setAddToBacklogLoading] = useState(false);
  const [addToLibraryLoading, setAddToLibraryLoading] = useState(false);
  const [addToLibraryError, setAddToLibraryError] = useState();
  const [toastProps, setToastProps] = useState<ToastProps>(defaultToastProps);
  const [pageTitle, setPageTitle] = useState('Game Details');

  const initialValues: AddToLibraryFormValues = {
    id: gameDetails?.id ?? 0,
    userId: user?.id ?? '',
    title: gameDetails?.name ?? '',
    imageUrl: gameDetails?.background_image ?? '',
    startDate: '',
    endDate: '',
    rating: 0,
    comment: '',
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getPlatforms = () => {
    const platformNames = gameDetails?.platforms?.map(
      (p: Platforms) => p.platform.name,
    );

    const platformIcons = new Set(
      platformNames?.map((p: string) => {
        if (p.toLowerCase().includes('pc')) return faWindows;
        if (p.toLowerCase().includes('playstation')) return faPlaystation;
        if (p.toLowerCase().includes('xbox')) return faXbox;
        return faEllipsis;
      }),
    );
    setPlatforms([...platformIcons]);
  };

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
    setAddToLibraryError(undefined);
  };

  const showLibraryModal = () => setShowModal(true);

  const handleAddToLibrary = async (
    values: AddToLibraryFormValues,
    actions: FormikHelpers<AddToLibraryFormValues>,
  ) => {
    try {
      setAddToLibraryLoading(true);
      await serverApi.post('/api/library/add', values);
      await getUserGameDetails();
      toggleModal();
      setToastProps({
        ...toastProps,
        message: 'Game added to library',
        visible: true,
        type: 'success',
      });
    } catch (error: AxiosError | any) {
      console.log({ error });
      if (error?.response?.data?.message) {
        setAddToLibraryError(error.response.data.message);
      }
    } finally {
      setAddToLibraryLoading(false);
    }
    actions.setSubmitting(false);
  };

  const handleAddToBacklog = async () => {
    setAddToBacklogLoading(true);
    try {
      await serverApi.post('/api/backlog/add', {
        id: gameDetails?.id,
        userId: user?.id,
        title: gameDetails?.name,
        imageUrl: gameDetails?.background_image,
      });
      await getUserGameDetails();
      setToastProps({
        ...toastProps,
        message: 'Game added to backlog',
        visible: true,
        type: 'success',
      });
    } catch (error) {
    } finally {
      setAddToBacklogLoading(false);
    }
  };

  const getUserGameDetails = async () => {
    try {
      if (!user?.id || !gameDetails?.id) return;
      const userGameDetails = (await serverApi.get(
        `/api/player/getGameByPlayerId?playerId=${user?.id}&apiId=${gameDetails?.id}`,
      )) as Game;
      setUserGameDetails(userGameDetails);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!gameDetails) return;
    getUserGameDetails();
    if (!!gameDetails?.name) {
      setPageTitle(gameDetails?.name);
    }

    if (!gameDetails.platforms) return;
    getPlatforms();
  }, [gameDetails]);

  useEffect(() => {
    const getGameDetails = async () => {
      const gameDetails = (await rawgApi(`/games/${id}`)) as RawgGameDetail;
      setGameDetails(gameDetails);
      setIsLoading(false);
    };

    if (id) {
      getGameDetails();
    }
  }, [id]);

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
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white">
        <h1 className="text-4xl mb-4">Game Details</h1>
        <div className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2">
          <div className="order-2 lg:order-1 col-span-2 border rounded p-4">
            <div className="my-1">
              <span className="font-bold">Release Date:</span>{' '}
              {convertShortDate(gameDetails?.released)}
            </div>
            {!!gameDetails?.metacritic && (
              <div className="my-1">
                <span className="font-bold">Metacritic Score:</span>{' '}
                <span className="inline-block ms-1">
                  <MetaCriticScore score={gameDetails?.metacritic ?? 0} />
                </span>
              </div>
            )}
            {!!platforms?.length && (
              <div className="my-1">
                <span className="font-bold">Platforms:</span>{' '}
                {platforms.map((p: IconDefinition, i: number) => (
                  <FontAwesomeIcon key={i} className="mx-1" icon={p} />
                ))}
              </div>
            )}
            {!!gameDetails?.genres?.length && (
              <div className="my-1">
                <span className="font-bold">Genres:</span>{' '}
                {gameDetails?.genres?.map((g: Genre, i: number) => (
                  <span key={i} className="inline-block mx-1">
                    {g.name}
                    {!!gameDetails?.genres?.length &&
                      i !== gameDetails?.genres?.length - 1 &&
                      ' |'}
                  </span>
                ))}
              </div>
            )}
            {!!gameDetails?.website && (
              <div className="my-1 ">
                <span className="font-bold">Website:</span>
                <Link
                  target="_blank"
                  href={gameDetails?.website}
                  className="ms-1 inline-block text-xs whitespace-normal text-blue-400 hover:underline"
                >
                  {gameDetails?.website}
                </Link>
              </div>
            )}
            {!!gameDetails?.tags.length && (
              <div className="my-1 ">
                <span className="font-bold">Tags:</span>
                {gameDetails?.tags?.map((t: Tag, i: number) => (
                  <span
                    key={i}
                    className="inline-block mx-1 text-xs border px-1 text-gray-200 rounded"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            )}
            <div className="border-b-2 border-danger my-4 mx-auto"></div>
            {status === 'authenticated' && !!userGameDetails?.library && (
              <Link href={`/library/${user?.id}`}>
                <Button className="w-full my-1">View In Library</Button>
              </Link>
            )}
            {status === 'authenticated' && !userGameDetails?.library && (
              <Button className="w-full my-1" onClick={showLibraryModal}>
                Add to Library
              </Button>
            )}
            {status === 'authenticated' && !!userGameDetails?.backlog && (
              <Link href={`/backlog/${user?.id}`}>
                <Button className="w-full my-1" color="warning">
                  View in Backlog
                </Button>
              </Link>
            )}
            {status === 'authenticated' && !userGameDetails?.backlog && (
              <Button
                className="w-full my-1"
                color="warning"
                onClick={handleAddToBacklog}
                disabled={addToBacklogLoading}
                spinner={addToBacklogLoading}
              >
                Add to Backlog
              </Button>
            )}
            {status === 'unauthenticated' && (
              <Button
                className="w-full my-1"
                color="secondary"
                onClick={() => signIn()}
              >
                Sign in to Add to Library
              </Button>
            )}
          </div>
          <div className="order-1 lg:order-2 col-span-4 grid grid-cols-1">
            <div className="order-2 xl:col-span-1 lg:col-span-2 p-4">
              <h2 className="text-white text-3xl">{gameDetails?.name}</h2>
              <div className="border-b-2 border-secondary my-4 mx-auto"></div>
              <div className="text-white">
                <p className="text-lg">
                  {showFullDescription
                    ? gameDetails?.description_raw
                    : `${gameDetails?.description_raw?.slice(0, 300)}...`}
                  <button
                    className="text-primary underline cursor-pointer ms-1"
                    onClick={toggleDescription}
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                </p>
              </div>
            </div>
            <div className="order-1 xl:col-span-1 lg:col-span-2 md p-4">
              {!!gameDetails?.background_image && (
                <Image
                  src={gameDetails?.background_image}
                  alt={gameDetails?.name}
                  width={1920}
                  height={1080}
                  className="rounded"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {!isLoading && !!user?.id && (
        <Modal title="Add to Library" onClose={toggleModal} isOpen={showModal}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleAddToLibrary}
            validationSchema={AddToLibraryFormSchema}
          >
            <Form>
              <Input hidden name="id" />
              <Input hidden name="userId" />
              <Input hidden name="imageUrl" />
              <Input label="Title" disabled name="title" />
              <Input label="Start Date" type="date" name="startDate" />
              <Input label="End Date" type="date" name="endDate" />
              <Input
                label="Rating"
                type="number"
                min={1}
                max={5}
                name="rating"
              />
              <Textarea label="Comment" name="comment" />
              {!!addToLibraryError && (
                <div className="bg-danger text-white font-bold p-2 rounded my-2">
                  {addToLibraryError}
                </div>
              )}
              <hr className="my-3" />
              <div className="flex justify-between">
                <Button type="button" color="cancel" onClick={toggleModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  spinner={addToLibraryLoading}
                  disabled={addToLibraryLoading}
                >
                  Add to Library
                </Button>
              </div>
            </Form>
          </Formik>
        </Modal>
      )}
      <Toast
        message={toastProps.message}
        visible={toastProps.visible}
        type={toastProps.type}
        noTimeout={toastProps.noTimeout}
      />
    </>
  );
};

export default withLayout(GameDetails);
