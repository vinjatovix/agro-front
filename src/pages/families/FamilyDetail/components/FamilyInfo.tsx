import BodySection from '../../../../shared/components/BodySection/BodySection';
import type { Family } from '../../../../types/Family';

interface Props {
  readonly family: Family;
}

export default function FamilyInfo({ family }: Props) {
  return (
    <>
      <BodySection title="📝 Descripción">
        <p>{family.shortDescription}</p>
      </BodySection>

      <BodySection title="🌟 Destacados">
        <ul className="family-list family-list--highlights">
          {family.highlights.map((highlight: string) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </BodySection>
    </>
  );
}
