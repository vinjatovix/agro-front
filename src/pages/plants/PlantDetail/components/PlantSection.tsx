import type { ReactNode } from 'react';

import './plantSection.css';

interface Props {
  readonly title: string;
  readonly children: ReactNode;
}

export default function PlantSection({ title, children }: Props) {
  return (
    <section className="plant-section">
      <h2 className="plant-section__title">{title}</h2>

      <div className="plant-section__content">{children}</div>
    </section>
  );
}
