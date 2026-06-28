import type { Metadata } from './Metadata';

export interface Family {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  scientificName: string;
  shortDescription: string;
  highlights: string[];
  extra?: {
    order?: string;
    subfamilies?: string[];
    distribution?: string;
    speciesCount?: number;
  };
  metadata?: Metadata;
}
