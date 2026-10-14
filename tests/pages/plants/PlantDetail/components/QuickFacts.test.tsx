import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { t } from '../../../../../src/i18n/core/t';
import QuickFacts from '../../../../../src/pages/plants/PlantDetail/components/QuickFacts';
import { reportMissingTranslation } from '../../../../../src/shared/observability/reportMissingTranslation';
import type { Plant } from '../../../../../src/types/Plants/Plant';
import { buildPlant } from '../../../../fixtures/plants/buildPlant';

vi.mock(
  '../../../../../src/shared/observability/reportMissingTranslation',
  () => ({
    reportMissingTranslation: vi.fn()
  })
);

function buildPlantWithKnowledge(
  light: Partial<Plant['knowledge']['light']>,
  watering: Partial<Plant['knowledge']['watering']> = {}
): Plant {
  const plant = buildPlant();
  return {
    ...plant,
    knowledge: {
      ...plant.knowledge,
      light: { ...plant.knowledge.light, ...light },
      watering: { ...plant.knowledge.watering, ...watering }
    }
  };
}

function buildPlantWithLifecycle(lifecycle: Plant['traits']['lifecycle']) {
  const plant = buildPlant();
  return buildPlant({ traits: { ...plant.traits, lifecycle } });
}

describe('QuickFacts', () => {
  beforeEach(() => {
    vi.mocked(reportMissingTranslation).mockClear();
  });

  it('labels full sun as the light type filter does', () => {
    render(
      <QuickFacts plant={buildPlantWithKnowledge({ type: 'full_sun' })} />
    );

    expect(screen.getByText('Sol pleno')).toBeInTheDocument();
    expect(
      screen.getByText(t('plant.filters.lightTypeValues.full_sun'))
    ).toBeInTheDocument();
    expect(screen.queryByText('Pleno sol')).not.toBeInTheDocument();
  });

  it('labels partial shade as the light type filter does', () => {
    render(
      <QuickFacts plant={buildPlantWithKnowledge({ type: 'partial_shade' })} />
    );

    expect(
      screen.getByText(t('plant.filters.lightTypeValues.partial_shade'))
    ).toBeInTheDocument();
  });

  it.each(['annual', 'biennial', 'perennial'] as const)(
    'labels the %s lifecycle as the filter does',
    (lifecycle) => {
      render(<QuickFacts plant={buildPlantWithLifecycle(lifecycle)} />);

      expect(
        screen.getByText(t(`plant.filters.lifeCycleValues.${lifecycle}`))
      ).toBeInTheDocument();
    }
  );

  it.each(['weekly', 'cada 3 días'])(
    'shows the watering frequency "%s" as received',
    (frequency) => {
      render(<QuickFacts plant={buildPlantWithKnowledge({}, { frequency })} />);

      expect(screen.getByText(frequency)).toBeInTheDocument();
    }
  );

  it('shows and reports an unknown light type', () => {
    render(
      <QuickFacts plant={buildPlantWithKnowledge({ type: 'full_shade' })} />
    );

    expect(screen.getByText('full_shade')).toBeInTheDocument();
    expect(
      screen.queryByText('plant.filters.lightTypeValues.full_shade')
    ).not.toBeInTheDocument();
    expect(reportMissingTranslation).toHaveBeenCalledWith(
      'plant.filters.lightTypeValues.full_shade'
    );
  });

  it('reads the light hours from the dictionary', () => {
    render(<QuickFacts plant={buildPlantWithKnowledge({ hoursMin: 6 })} />);

    expect(screen.getByText('6 h o más al día')).toBeInTheDocument();
  });
});
