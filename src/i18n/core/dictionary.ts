export const dictionary = {
  app: {
    brand: 'AgroApp',
    welcome_message: 'Bienvenido a AgroApp, tu guía de cultivo de plantas.',
    nav: {
      plants: 'Plantas',
      families: 'Familias'
    }
  },
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',

    loading: 'Cargando...',
    not_found: 'No encontrado',
    unknown_error: 'Error desconocido',
    results_per_page: 'Resultados por página',
    filters: 'Filtros'
  },

  family: {
    families: 'Familias',
    detail: {
      loading: 'Cargando familia...',
      not_found: 'Familia no encontrada'
    },
    hero: {
      order: 'Orden',
      scientific_name: 'Nombre científico',
      species: 'Especies',
      aliases: 'Alias',
      distribution: 'Distribución'
    },
    info: {
      description: 'Descripción',
      highlights: 'Destacados'
    },
    plants: {
      title: 'Plantas',
      view_all: 'Ver todas las plantas de esta familia'
    }
  },
  plant: {
    plants: 'Plantas',
    filters: {
      clear: 'Borrar filtros',
      search_label: 'Buscar plantas',
      search_placeholder: 'Nombre, alias...',
      aliases: 'Alias',
      family: 'Familia',
      allFamilies: 'Todas las familias',
      lifeCycle: 'Ciclo de vida',
      lifeCycleValues: {
        annual: 'Anual',
        biennial: 'Bienal',
        perennial: 'Perenne'
      },
      sowingMonths: 'Meses de siembra',
      sowingMethod: 'Método de siembra',
      sowingMethodValues: {
        direct: 'Directa',
        starter: 'Semillero'
      },

      lightType: 'Tipo de luz',
      lightTypeValues: {
        full_sun: 'Sol pleno',
        partial_shade: 'Sombra parcial',
        full_shade: 'Sombra total'
      },
      rootSystem: 'Sistema radicular',
      rootSystemValues: {
        fibrous: 'Fibroso',
        taproot: 'Pivotante',
        rhizome: 'Rizoma'
      },
      light: 'Luz',
      lightHoursMin: 'Horas de luz disponibles',
      strategicBenefits: 'Ecología',
      soilPh: 'pH del suelo',
      spacingCm: 'Espacio disponible (cm)',
      soilAvailableDepthCm: 'Profundidad disponible (cm)'
    },
    detail: {
      loading: 'Cargando planta...',
      not_found: 'Planta no encontrada'
    },
    hero: {
      scientific_name: 'Nombre científico',
      aliases: 'Alias'
    },
    calendar: {
      title: 'Calendario',

      seeds_per_hole: 'Semillas por golpe',
      germination: 'Germinación',

      sowing: 'Siembra',
      flowering: 'Floración',
      harvest: 'Cosecha',

      days: 'días',
      season: 'Estación',
      seasonValues: {
        spring: 'Primavera',
        summer: 'Verano',
        autumn: 'Otoño',
        winter: 'Invierno'
      }
    },
    quick_facts: {
      title: 'Datos rápidos',

      lifecycle: 'Ciclo de vida',
      light: 'Luz',
      light_hours: 'Horas de luz',
      watering: 'Riego',
      watering_conditions: 'Condiciones de riego',
      height: 'Altura',
      spread: 'Ancho',
      spacing: 'Espaciado'
    },
    cultivation: {
      title: 'Cultivo',

      soil_ph: 'pH del suelo',
      soil_depth: 'Profundidad del suelo',
      root_system: 'Sistema radicular',
      root_depth: 'Profundidad de la raíz',

      propagation: {
        propagation: 'Propagación',
        method: 'Método',
        season: 'Estación',
        best_practices: 'Buenas prácticas',

        methodValues: {
          cutting: 'Esqueje',
          grafting: 'Injerto',
          layering: 'Acodo',
          division: 'División',
          seed: 'Semilla'
        }
      },
      pruning: {
        pruning: 'Poda',
        type: 'Tipo',
        pruningTypeValues: {
          maintenance: 'Mantenimiento',
          rejuvenation: 'Rejuvenecimiento',
          shaping: 'Formación'
        },
        intensity: 'Intensidad',
        pruningIntensityValues: {
          light: 'Ligera',
          moderate: 'Moderada',
          hard: 'Fuerte'
        },
        frequency: 'Frecuencia',
        times_per_year: 'veces/año',
        best_practices: 'Buenas prácticas'
      }
    },

    ecology: {
      title: 'Ecología'
    },
    notes: {
      title: 'Notas'
    },
    resources: {
      title: 'Recursos',
      video_title: 'Video sobre la planta'
    },
    hemisphere: {
      title: 'Hemisferio',
      north: 'Norte',
      south: 'Sur'
    }
  }
} as const;
