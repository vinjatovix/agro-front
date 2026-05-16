import { useId } from 'react';
import { useFamilies } from '../../../../../pages/families/hooks/useFamilies';
import { t } from '../../../../../i18n/core/t';

interface Props {
  readonly value: string;
  readonly onChange: (id: string) => void;
}

export default function FamilySelect({ value, onChange }: Props) {
  const { families, loading } = useFamilies();
  const selectId = useId();

  return (
    <div className="plant-filters__group">
      <label htmlFor={selectId}>{t('plant.filters.family')}</label>

      <select
        id={selectId}
        className="plant-filters__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      >
        {loading ? (
          <option>{t('common.loading')}</option>
        ) : (
          <>
            <option value="">{t('plant.filters.allFamilies')}</option>

            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.slug}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}
