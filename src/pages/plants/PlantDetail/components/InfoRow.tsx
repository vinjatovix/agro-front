import './infoRow.css';

interface Props {
  readonly label: string;
  readonly value: React.ReactNode;
}

export default function InfoRow({ label, value }: Props) {
  return (
    <div className="info-row">
      <strong className="info-row__label">{label}</strong>
      <span className="info-row__value">{value}</span>
    </div>
  );
}
