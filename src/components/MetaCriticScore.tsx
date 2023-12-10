interface MetaCriticScoreProps {
  score: number;
  className?: string;
}

const MetaCriticScore = ({ score, className }: MetaCriticScoreProps) => {
  if (score === 0) return null;

  let color;
  if (score >= 80) {
    color = 'text-green-600 border-green-600';
  } else if (score >= 60) {
    color = 'text-yellow-500 border-yellow-500';
  } else {
    color = 'text-red-600 border-red-600';
  }

  return (
    <div
      title="Metacritic Score"
      className={`text-xs font-bold border px-1 mt-2 ${color} ${className}`}
    >
      {score}
    </div>
  );
};

export default MetaCriticScore;
