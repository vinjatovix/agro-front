import './Badge.css';

interface Props {
  readonly children: React.ReactNode;
  readonly variant?:
    | 'default'
    | 'family'
    | 'scientific'
    | 'alias'
    | 'unavailable';
  readonly icon?: string;
}

export default function Badge({ children, variant = 'default', icon }: Props) {
  return (
    <span className={`badge badge--${variant}`}>
      {icon && (
        <span className="badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
