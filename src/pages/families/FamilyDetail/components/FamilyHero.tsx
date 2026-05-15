import type { Family } from '../../../../types/Family';
import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import Badge from '../../../../shared/components/Badge/Bagde';

import './familyHero.css';

export function FamilyHero({ family }: { family: Family }) {
  return (
    <header className="family-hero">
      <h1>{capitalizeFirstLetter(family.name)}</h1>

      <div className="family-hero-grid">
        {family.extra?.order && (
          <p className="family-hero__scientific">
            🧭 <strong>Orden:</strong> {family.extra.order}
          </p>
        )}

        <p className="family-hero__scientific">
          🧬 <strong>Nombre científico:</strong> {family.scientificName}
        </p>

        {family.extra?.speciesCount && (
          <p className="family-hero__scientific">
            📊 <strong>Especies:</strong> {family.extra.speciesCount}
          </p>
        )}
      </div>

      <div className="family-hero__aliases">
        <span className="family-hero__label">Alias:</span>
        {family.aliases.map((alias) => (
          <Badge key={alias} variant="alias" icon="🏷️">
            {capitalizeFirstLetter(alias)}
          </Badge>
        ))}
      </div>

      {family.extra?.distribution && (
        <p>
          🌍 <strong>Distribución:</strong> {family.extra.distribution}
        </p>
      )}
    </header>
  );
}
