import './hemisphereToggle.css';

interface Props {
  readonly value: 'north' | 'south';
  readonly onChange: (value: 'north' | 'south') => void;
}

export default function HemisphereToggle({ value, onChange }: Props) {
  return (
    <div className="hemisphere-toggle">
      <button
        type="button"
        className={
          value === 'north'
            ? 'hemisphere-toggle__btn hemisphere-toggle__btn--active'
            : 'hemisphere-toggle__btn'
        }
        onClick={() => onChange('north')}
      >
        North
      </button>

      <button
        type="button"
        className={
          value === 'south'
            ? 'hemisphere-toggle__btn hemisphere-toggle__btn--active'
            : 'hemisphere-toggle__btn'
        }
        onClick={() => onChange('south')}
      >
        South
      </button>
    </div>
  );
}
