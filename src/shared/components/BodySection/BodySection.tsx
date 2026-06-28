import type { ReactNode } from 'react';

import './bodySection.css';

interface Props {
  readonly title: string;
  readonly children: ReactNode;
}

export default function BodySection({ title, children }: Props) {
  return (
    <section
      className="body-section"
      data-testid={`section-${title.toLowerCase()}`}
    >
      <h2 className="body-section__title">{title}</h2>

      <div className="body-section__content">{children}</div>
    </section>
  );
}
