import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { serverApi } from '@/lib/api';
import { SessionUser } from '@/types';
import * as Yup from 'yup';
import withLayout from '@/components/hoc/withLayout';
import Loading from '@/components/Loading';
import { Game as PrismaGame, Review } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import Toast, { ToastProps } from '@/components/Toast';
import { AxiosError } from 'axios';
import Modal from '@/components/Modal';
import { Form, Formik } from 'formik';
import { Input, Textarea } from '@/components/form';
import { convertShortDate } from '@/helpers/utils';

interface GameWithReviews extends PrismaGame {
  reviews: Review[];
}

interface EditReviewFormValues {
  reviewId?: string;
  gameId?: string;
  userId?: string;
  imageUrl?: string;
  title?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  rating?: number;
  comment?: string;
}

const EditReviewFormSchema = Yup.object().shape({
  reviewId: Yup.string().required('Required'),
  gameId: Yup.string().required('Required'),
  userId: Yup.string().required('Required'),
  imageUrl: Yup.string(),
  title: Yup.string().required('Required'),
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

const UserLibrary = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();

  const user = session?.user as SessionUser;

  const [gameDetails, setGameDetails] = useState<GameWithReviews[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isRemovingFromLibrary, setIsRemovingFromLibrary] = useState('');
  const [toastProps, setToastProps] = useState<ToastProps>(defaultToastProps);
  const [editReviewError, setEditReviewError] = useState('');
  const [editReviewLoading, setEditReviewLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameWithReviews | null>(
    null,
  );

  const initialValues: EditReviewFormValues = {
    reviewId: selectedGame?.reviews[0]?.id ?? '',
    gameId: selectedGame?.id ?? '',
    userId: user?.id ?? '',
    imageUrl: selectedGame?.imageUrl ?? '',
    title: selectedGame?.title ?? '',
    startDate: selectedGame?.startDate
      ? new Date(selectedGame?.startDate).toISOString().split('T')[0]
      : '',
    endDate: selectedGame?.endDate
      ? new Date(selectedGame?.endDate).toISOString().split('T')[0]
      : '',
    rating: selectedGame?.reviews[0]?.rating ?? 0,
    comment: selectedGame?.reviews[0]?.comment ?? '',
  };

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
    setSelectedGame(null);
  };

  const showEditReviewModal = (game: GameWithReviews) => {
    setShowModal(true);
    setSelectedGame(game);
  };

  const handleRemoveFromLibrary = async (gameId: string) => {
    try {
      setIsRemovingFromLibrary(gameId);
      await serverApi.delete('/api/library/remove', {
        data: { gameId },
      });
      setGameDetails((prev) => prev?.filter((game) => game.id !== gameId));
      setToastProps({
        ...toastProps,
        message: 'Game removed from library',
        visible: true,
        type: 'success',
      });
    } catch (error: AxiosError | any) {
      console.log({ error });
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
      setIsRemovingFromLibrary('');
    }
  };

  const handleEditReview = async (values: EditReviewFormValues) => {
    try {
      setEditReviewLoading(true);
      const updatedGame = (await serverApi.post(
        '/api/library/edit',
        values,
      )) as GameWithReviews;

      setGameDetails((prev) => {
        const updatedGameIndex = prev?.findIndex(
          (g) => g.id === updatedGame.id,
        );
        if (updatedGameIndex !== -1 && !!updatedGameIndex && prev) {
          prev[updatedGameIndex] = updatedGame;
        }
        return [...prev!];
      });

      toggleModal();

      setToastProps({
        ...toastProps,
        message: 'Review updated',
        visible: true,
        type: 'success',
      });
    } catch (error: AxiosError | any) {
      console.log({ error });
      let message = error.message;
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }
      setEditReviewError(message);
    } finally {
      setEditReviewLoading(false);
    }
  };

  useEffect(() => {
    const getLibraryDetails = async () => {
      try {
        const libraryDetails = (await serverApi.get(
          `/api/library/get?playerId=${id}`,
        )) as GameWithReviews[];
        setGameDetails(libraryDetails);
      } catch (error: AxiosError | any) {
        console.log({ error });
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

    if (id) {
      getLibraryDetails();
    }
  }, [id]);

  useEffect(() => {
    const toastTimer = toastProps.timer;

    const timer = setTimeout(() => {
      setToastProps(defaultToastProps);
    }, toastTimer);
    return () => clearTimeout(timer);
  }, [toastProps]);

  useEffect(() => {
    if (status === 'unauthenticated' || user?.id !== id) {
      router.push('/');
    }
  }, [status]);

  if (!!isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white">
        <h1 className="text-4xl mb-4">Player Library</h1>
        <div className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-gray-700">
          {!gameDetails?.length && (
            <div className="text-xl">No games in library</div>
          )}
          {gameDetails?.map((game) => (
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
                {game?.startDate && (
                  <div className="text-lg">
                    Start Date: {convertShortDate(game?.startDate)}
                  </div>
                )}
                {game?.endDate && (
                  <div className="text-lg">
                    End Date: {convertShortDate(game?.endDate)}
                  </div>
                )}
                {!!game.reviews.length && (
                  <>
                    {game?.reviews[0]?.rating && (
                      <div className="text-lg">
                        Rating: {game?.reviews[0]?.rating}
                      </div>
                    )}
                    {game?.reviews[0]?.comment && (
                      <div className="text-lg">
                        Review: {game?.reviews[0]?.comment}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="border-t-2 border-secondary my-2"></div>
              <div>
                <Button
                  color="warning"
                  size="sm"
                  className="w-full my-1"
                  onClick={() => showEditReviewModal(game)}
                >
                  Edit Review
                </Button>
                <Link href={`/games/${game.apiId}`}>
                  <Button size="sm" className="w-full my-1">
                    View Game Details
                  </Button>
                </Link>
                <Button
                  color="danger"
                  size="sm"
                  className="w-full my-1"
                  onClick={() => handleRemoveFromLibrary(game.id)}
                  disabled={isRemovingFromLibrary === game.id}
                  spinner={isRemovingFromLibrary === game.id}
                >
                  Remove from Library
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!!selectedGame && (
        <Modal title="Edit Review" onClose={toggleModal} isOpen={showModal}>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleEditReview}
            validationSchema={EditReviewFormSchema}
          >
            <Form>
              <Input hidden name="reviewId" />
              <Input hidden name="gameId" />
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
              {!!editReviewError && (
                <div className="bg-danger text-white font-bold p-2 rounded my-2">
                  {editReviewError}
                </div>
              )}
              <hr className="my-3" />
              <div className="flex justify-between">
                <Button type="button" color="cancel" onClick={toggleModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  spinner={editReviewLoading}
                  disabled={editReviewLoading}
                >
                  Edit Review
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

export default withLayout(UserLibrary);
