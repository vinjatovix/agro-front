import type { Metadata } from './Metadata';
import type { Range } from './Range';
import type { Seasons } from './Seasons';

export interface Plant {
  id: string;

  identity: {
    name: {
      primary: string;
      aliases?: string[];
    };
    scientificName?: string;
    family: string;
  };

  traits: {
    lifecycle: 'annual' | 'perennial' | 'biennial';
    size: {
      height: {
        min: number;
        max: number;
      };
      spread: {
        min: number;
        max: number;
      };
    };
    spacingCm: {
      min: number;
      max: number;
    };
  };

  phenology: {
    sowing: {
      seedsPerHole: Range;
      germinationDays: Range;
      months: number[];
      methods: {
        direct: {
          depthCm: Range;
        };
        starter?: {
          depthCm: Range;
        };
      };
    };
    flowering: {
      months: number[];
      pollination?: {
        type: 'insect' | 'wind' | 'self';
        agents?: string[];
      };
    };
    harvest: {
      months: number[];
      description?: string;
    };
  };

  knowledge: {
    soil?: {
      ph: Range;
      availableDepthCm: Range;
    };
    rootSystem: {
      type: 'fibrous' | 'taproot' | 'adventitious' | 'rhizome';
      depthCm: Range;
      spreadCm: Range;
    };
    watering?: {
      frequency: 'daily' | 'weekly';
      amountMm?: number;
      conditions?: string[];
    };
    light: {
      hoursMin: number;
      type: 'full_sun' | 'partial_shade' | 'full_shade';
      preference?: 'morning' | 'afternoon' | 'all_day';
    };
    pruning?: Array<{
      type: 'maintenance' | 'rejuvenation' | 'shaping';
      intensity: 'light' | 'moderate' | 'hard';
      season: Seasons;
      frequencyPerYear: number;
      bestPractices?: string[];
    }>;
    propagation?: {
      methods: Record<
        string,
        {
          season?: Seasons;
          estimatedTimeWeeks?: Range;
          bestPractices?: string[];
        }
      >;
    };
    ecology?: {
      strategicBenefits?: string[];
    };
    resources?: Array<{
      type: 'image' | 'article' | 'video';
      url: string;
      title?: string;
      source?: string;
      tags?: string[];
    }>;
    notes?: string[];
  };
  metadata: Metadata;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  deletedAt: Date | null;
}

export type PlantLifecycle = Plant['traits']['lifecycle'];

export type RootSystem = Plant['knowledge']['rootSystem']['type'];

export type LightType = Plant['knowledge']['light']['type'];

export type SowingMethod = keyof Plant['phenology']['sowing']['methods'];
