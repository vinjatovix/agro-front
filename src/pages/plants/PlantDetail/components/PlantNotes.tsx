import type { Plant } from '../../../../types/Plant';

import BodySection from '../../../../shared/components/BodySection/BodySection';

import './plantNotes.css';

interface Props {
  readonly plant: Plant;
}

export default function PlantNotes({ plant }: Props) {
  const notes = plant.knowledge.notes ?? [];

  if (!notes.length) {
    return null;
  }

  return (
    <BodySection title="Notas">
      <ul className="plant-list plant-list--notes">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </BodySection>
  );
}
