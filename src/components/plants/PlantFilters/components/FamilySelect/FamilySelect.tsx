import { useId, useMemo } from 'react';
import { t } from '../../../../../i18n/core/t';
import { useFamilies } from '../../../../../shared/hooks/useFamilies';
import { iconsMap } from '../../../../../shared/constants/iconsMap';
import { capitalizeFirstLetter } from '../../../../../shared/utils/capitalizeFirstLetter';

interface Props {
  readonly value: string;
  readonly onChange: (id: string) => void;
}

export default function FamilySelect({ value, onChange }: Props) {
  const { data, loading, error } = useFamilies();
  const selectId = useId();

  const sortedFamilies = useMemo(
    () =>
      [...data].sort((a, b) =>
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
      ),
    [data]
  );

  return (
    <div className="plant-filters__group">
      <label htmlFor={selectId}>
        {iconsMap['genome']} {t('plant.filters.family')}
      </label>

      <select
        id={selectId}
        data-testid="family-select"
        className="plant-filters__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || Boolean(error)}
        aria-invalid={Boolean(error)}
      >
        {loading && <option value="">{t('common.loading')}</option>}
        {error && <option value="">{t('common.unknown_error')}</option>}
        {!loading && !error && (
          <>
            <option value="">{t('plant.filters.allFamilies')}</option>

            {sortedFamilies.map((f) => (
              <option key={f.id} value={f.id}>
                {capitalizeFirstLetter(f.name)}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}
