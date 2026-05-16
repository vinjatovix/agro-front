import { t } from '../../../../i18n/core/t';
import type { Family } from '../../../../types/Family';
import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import Badge from '../../../../shared/components/Badge/Bagde';

import './familyHero.css';

interface Props {
  readonly family: Family;
}

export function FamilyHero({ family }: Props) {
  return (
    <header className="family-hero">
      <h1>{capitalizeFirstLetter(family.name)}</h1>

      <div className="family-hero-grid">
        {family.extra?.order && (
          <p className="family-hero__scientific">
            🧭 <strong>{t('family.hero.order')}:</strong> {family.extra.order}
          </p>
        )}

        <p className="family-hero__scientific">
          🧬 <strong>{t('family.hero.scientific_name')}:</strong>{' '}
          {family.scientificName}
        </p>

        {family.extra?.speciesCount && (
          <p className="family-hero__scientific">
            📊 <strong>{t('family.hero.species')}:</strong>{' '}
            {family.extra.speciesCount}
          </p>
        )}
      </div>

      <div className="family-hero__aliases">
        <span className="family-hero__label">{t('family.hero.aliases')}:</span>
        {family.aliases.map((alias) => (
          <Badge key={alias} variant="alias" icon="🏷️">
            {capitalizeFirstLetter(alias)}
          </Badge>
        ))}
      </div>

      {family.extra?.distribution && (
        <p>
          🌍 <strong>{t('family.hero.distribution')}:</strong>{' '}
          {family.extra.distribution}
        </p>
      )}
    </header>
  );
}
