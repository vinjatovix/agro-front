import { t } from '../../../../i18n/core/t';
import Badge from '../../../../shared/components/Badge/Badge';
import Icon from '../../../../shared/components/Icon/Icon';
import ScientificName from '../../../../shared/components/ScientificName/ScientificName';
import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import type { Family } from '../../../../types/Family';

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
            <Icon name="explore" decorative />{' '}
            <strong>{t('family.hero.order')}:</strong> {family.extra.order}
          </p>
        )}

        <p className="family-hero__scientific">
          <Icon name="biotech" decorative />{' '}
          <strong>{t('family.hero.scientific_name')}:</strong>{' '}
          <ScientificName>{family.scientificName}</ScientificName>
        </p>

        {family.extra?.speciesCount && (
          <p className="family-hero__scientific">
            <Icon name="bar_chart" decorative />{' '}
            <strong>{t('family.hero.species')}:</strong>{' '}
            {family.extra.speciesCount}
          </p>
        )}
      </div>

      <div className="family-hero__aliases">
        <span className="family-hero__label">{t('family.hero.aliases')}:</span>
        {family.aliases.map((alias) => (
          <Badge key={alias} variant="alias" icon="label">
            {capitalizeFirstLetter(alias)}
          </Badge>
        ))}
      </div>

      {family.extra?.distribution && (
        <p>
          <Icon name="public" decorative />{' '}
          <strong>{t('family.hero.distribution')}:</strong>{' '}
          {family.extra.distribution}
        </p>
      )}
    </header>
  );
}
