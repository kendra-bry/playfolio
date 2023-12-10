import Section from '@/components/Section';
import withLayout from '@/components/hoc/withLayout';

const Home = () => {
  return (
    <div className="text-white">
      <div className="text-center my-24 px-10 sm:px-4">
        <h1 className="text-4xl sm:text-6xl my-8">Welcome to Playfolio</h1>
        <h2 className="text-2xl">
          Unleash the Power of Play with Playfolio – Your Ultimate Destination
          for Gaming Exploration!
        </h2>
      </div>

      <div className="border-b-2 border-danger my-10 w-4/5 mx-auto"></div>

      <Section className="md:min-h-64 lg:h-64 px-10 md:px-48 lg:px-64 bg-primary">
        <h2 className="text-2xl text-center mb-4">Search and Add Games</h2>
        <p className="text-lg text-center">
          Explore our vast database of video games and build your personal
          library. With a seamless search feature, you can easily find your
          favorite titles or discover new ones. Hit the &quot;Add to
          Library&quot; button to start building your gaming haven.
        </p>
      </Section>

      <Section className="md:min-h-64 lg:h-64 px-10 md:px-48 lg:px-64 bg-gray-700">
        <h2 className="text-2xl text-center mb-4">Build Your Backlog</h2>
        <div className="text-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
          <div className="border rounded p-4 text-gray-950 bg-gray-200 text-center">
            Craft your gaming future with our backlog feature.
          </div>
          <div className="border rounded p-4 text-gray-950 bg-gray-200 text-center">
            Create a wishlist of games you&apos;re eager to play next.
          </div>
          <div className="border rounded p-4 text-gray-950 bg-gray-200 text-center md:col-span-2 lg:col-span-1">
            The adventure doesn&apos;t end – it&apos;s a perpetual quest.
          </div>
        </div>
      </Section>

      <Section className="md:min-h-64 lg:h-64 px-10 md:px-48 lg:px-64 bg-secondary">
        <h2 className="text-2xl text-center mb-4">Rate, Comment, and Track</h2>
        <p className="text-lg text-center">
          Make each game uniquely yours by adding ratings, start and stop dates,
          and personal comments. Share your thoughts with the community and keep
          track of your gaming journey.
        </p>
      </Section>

      <Section className="md:min-h-64 lg:h-64 px-10 md:px-48 lg:px-64">
        <h2 className="text-2xl text-center mb-4">
          Unleash Your Gaming Potential
        </h2>
        <p className="text-lg text-center">
          Playfolio is more than a website; it&apos;s a celebration of gaming
          culture. Join us on this thrilling adventure and unleash the power of
          play! Your next gaming story begins here.
        </p>
      </Section>
    </div>
  );
};

export default withLayout(Home);
