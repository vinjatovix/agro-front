import InfoRow from './InfoRow';

const PROPAGATION_METHODS_LABELS: Record<string, string> = {
  cutting: 'Esqueje',
  grafting: 'Injerto',
  layering: 'Acodo',
  division: 'División',
  seed: 'Semilla'
};

const SEASON_LABELS: Record<string, string> = {
  spring: 'Primavera',
  summer: 'Verano',
  autumn: 'Otoño',
  winter: 'Invierno'
};

interface Props {
  readonly method: string;
  readonly season: string;
  readonly bestPractices?: string[];
}

export default function PropagationMethodCard({
  method,
  season,
  bestPractices
}: Props) {
  return (
    <div className="propagation-card" data-testid={`propagation-${method}`}>
      <InfoRow
        label="🌱 Método"
        value={PROPAGATION_METHODS_LABELS[method] ?? method}
      />

      <InfoRow label="📅 Estación" value={SEASON_LABELS[season] ?? season} />

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
