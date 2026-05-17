import type { Plant } from '../../../../types/Plants/Plant';

import BodySection from '../../../../shared/components/BodySection/BodySection';

import './plantNotes.css';
import { t } from '../../../../i18n/core/t';

interface Props {
  readonly plant: Plant;
}

export default function PlantNotes({ plant }: Props) {
  const notes = plant.knowledge.notes ?? [];

  if (!notes.length) {
    return null;
  }

  return (
    <BodySection title={`📝 ${t('plant.notes.title')}`}>
      <ul className="plant-list plant-list--notes">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </BodySection>
  );
}
