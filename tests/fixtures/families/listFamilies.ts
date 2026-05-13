import { PaginatedResponse } from '../../../src/types/api';
import { Family } from '../../../src/types/Family';

export const listFamiliesResponse: PaginatedResponse<Family> = {
  data: [
    {
      id: 'd0a3b923-c1ac-4796-afa4-1c801ff1a4a3',
      slug: 'Amaryllidaceae',
      name: 'amarilidáceas',
      aliases: [
        'familia del ajo',
        'familia del narciso',
        'familia de la amarillis'
      ],
      scientificName: 'Amaryllidaceae',
      shortDescription:
        'Son plantas herbáceas, perennes, mayormente bulbosas (a veces rizomatosas), con hojas basales, lineales o acintadas. Sus flores son vistosas, actinomorfas o ligeramente zigomorfas, dispuestas en umbelas o pseudoumbelas sobre un escapo. Tienen 6 tépalos y 6 estambres, con ovario ínfero en la mayoría de sus miembros.',
      highlights: [
        'Incluye especies muy populares como el ajo (Allium sativum), la cebolla (Allium cepa), los narcisos (Narcissus) y las amarilis.',
        'Algunas especies producen alcaloides como la galantamina, usada en el tratamiento del Alzheimer.',
        'Sus flores son muy apreciadas en jardinería por su belleza y fragancia.',
        'La subfamilia Allioideae es responsable del olor característico del ajo y la cebolla, gracias a compuestos de azufre.'
      ],
      extra: {
        order: 'Asparagales',
        subfamilies: ['Agapanthoideae', 'Allioideae', 'Amaryllidoideae'],
        distribution:
          'Distribuida por todo el mundo, con mayor diversidad en regiones tropicales, subtropicales y templadas cálidas. Centros de biodiversidad importantes en África del Sur, América del Sur (especialmente los Andes) y la región mediterránea.',
        speciesCount: 1650
      },
      metadata: {
        createdAt: new Date('2026-05-11T21:05:48.475Z'),
        createdBy: 'register1',
        updatedAt: new Date('2026-05-11T21:05:48.475Z'),
        updatedBy: 'register1'
      }
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    totalPages: 2,
    totalItems: 32
  }
};
