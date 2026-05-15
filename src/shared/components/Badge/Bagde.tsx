import './badge.css';

interface Props {
  readonly children: React.ReactNode;
  readonly variant?: 'default' | 'family' | 'scientific' | 'alias';
  readonly icon?: string;
}

export default function Badge({ children, variant = 'default', icon }: Props) {
  return (
    <span className={`badge badge--${variant}`}>
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  );
}
