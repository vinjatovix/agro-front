import { PaginatedResponse } from '../../../src/types/api';
import { Plant } from '../../../src/types/Plant';

export const listPlantsResponse: PaginatedResponse<Plant> = {
  data: [
    {
      id: '678efda2-ac3d-4623-81cd-fc1d0ab80315',
      identity: {
        name: {
          primary: 'perejil',
          aliases: ['prixel', 'perexil', 'petroselino']
        },
        scientificName: 'petroselinum crispum',
        family: 'a1d5f8e2-b3c7-4e1a-9f2a-5c9b8d7e1f3a'
      },
      traits: {
        lifecycle: 'biennial',
        size: {
          height: {
            min: 20,
            max: 40
          },
          spread: {
            min: 20,
            max: 20
          }
        },
        spacingCm: {
          min: 20,
          max: 20
        }
      },
      phenology: {
        sowing: {
          seedsPerHole: {
            min: 5,
            max: 6
          },
          germinationDays: {
            min: 14,
            max: 28
          },
          months: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          methods: {
            direct: {
              depthCm: {
                min: 0.5,
                max: 1
              }
            }
          }
        },
        flowering: {
          months: [4, 5, 6, 7, 8, 9],
          pollination: {
            type: 'insect',
            agents: ['abejas', 'otros insectos polinizadores']
          }
        },
        harvest: {
          months: [3, 4, 5, 6, 7, 8, 9, 10, 11],
          description:
            'Cosecha a partir de 2-3 meses. Cortar hojas desde la base sin dañar el crecimiento central.'
        }
      },
      knowledge: {
        watering: {
          frequency: 'daily',
          conditions: [
            'Mantener suelo húmedo pero no encharcado',
            'Evitar sequía prolongada',
            'Preferible riego constante'
          ]
        },
        light: {
          hoursMin: 4,
          type: 'partial_shade',
          preference: 'all_day'
        },
        pruning: [
          {
            type: 'maintenance',
            intensity: 'moderate',
            season: 'spring',
            frequencyPerYear: 6,
            bestPractices: [
              'Cortar hojas desde la base',
              'No eliminar más de 1/3 de la planta',
              'Estimular rebrote continuo'
            ]
          }
        ],
        propagation: {
          methods: {
            seed: {
              season: 'spring',
              bestPractices: [
                'Semilla con germinación lenta',
                'Macerar semillas 24h antes de siembra',
                'Preferible siembra directa',
                'Evitar trasplante por raíz sensible'
              ]
            }
          }
        },
        ecology: {
          strategicBenefits: [
            'Atrae polinizadores y depredadores',
            'Repelente natural de babosas',
            'Planta acompañante en huerto',
            'Adaptación a climas fríos'
          ]
        },
        notes: [
          'Resiste heladas, ideal para Galicia',
          'No tolera bien el trasplante',
          'Germinación lenta (14-28 días)',
          'Compatible con tomate, cebolla, espárrago y zanahoria',
          'Incompatible con lechuga, apio, puerro y guisante',
          'No repetir cultivo en el mismo lugar antes de 4 años',
          'Prefiere semisombra en verano',
          'Apto para macetas o cultivo bajo árboles'
        ],
        soil: {
          ph: {
            min: 6,
            max: 7.5
          },
          availableDepthCm: {
            min: 30,
            max: 40
          }
        },
        rootSystem: {
          type: 'taproot',
          depthCm: {
            min: 20,
            max: 40
          },
          spreadCm: {
            min: 15,
            max: 25
          }
        }
      },
      metadata: {
        createdAt: new Date('2026-05-12T00:56:03.658Z'),
        createdBy: 'register1',
        updatedAt: new Date('2026-05-12T00:56:03.658Z'),
        updatedBy: 'register1'
      },
      status: 'ACTIVE',
      deletedAt: null
    }
  ],
  pagination: {
    page: 1,
    limit: 25,
    totalPages: 1,
    totalItems: 1
  }
};
