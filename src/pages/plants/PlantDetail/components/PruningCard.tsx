import InfoRow from './InfoRow';

interface Props {
  type: string;
  intensity: string;
  season: string;
  frequencyPerYear: number;
  bestPractices?: string[];
}

export default function PruningCard({
  type,
  intensity,
  season,
  frequencyPerYear,
  bestPractices
}: Props) {
  return (
    <div className="pruning-card">
      <InfoRow label="🧩 Tipo" value={type} />

      <InfoRow label="⚡ Intensidad" value={intensity} />

      <InfoRow label="📅 Estación" value={season} />

      <InfoRow label="🔁 Frecuencia" value={`${frequencyPerYear} veces/año`} />

      {bestPractices && bestPractices.length > 0 && (
        <InfoRow
          label="📌 Buenas prácticas"
          value={
            <ul className="pruning-card__list">
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
