import './infoRow.css';

interface Props {
  readonly label: string;
  readonly value: React.ReactNode;
  readonly className?: string;
}

export default function InfoRow({ label, value, className }: Props) {
  return (
    <div className={className ? `info-row ${className}` : 'info-row'}>
      <strong className="info-row__label">{label}</strong>
      <span className="info-row__value">{value}</span>
    </div>
  );
}
