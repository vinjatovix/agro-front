import InfoRow from './InfoRow';

interface Props {
  method: string;
  season: string;
  bestPractices?: string[];
}

export default function PropagationMethodCard({
  method,
  season,
  bestPractices
}: Props) {
  return (
    <div className="propagation-card">
      <InfoRow label="🌱 Método" value={method} />

      <InfoRow label="📅 Estación" value={season} />

      {bestPractices && bestPractices.length > 0 && (
        <InfoRow
          label="📌 Buenas prácticas"
          value={
            <ul className="propagation-card__list">
              {bestPractices.map((bp) => (
                <li key={bp}>{bp}</li>
              ))}
            </ul>
          }
        />
      )}
    </div>
  );
}
