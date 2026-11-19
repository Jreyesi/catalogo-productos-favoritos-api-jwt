const METADATOS = [
  {
    patron: /creatina/i,
    protein: '5g creatina',
    servings: '60 servicios',
    goal: 'Fuerza y potencia',
  },
  {
    patron: /whey|prote/i,
    protein: '27g',
    servings: '72 servicios',
    goal: 'Hipertrofia',
  },
  {
    patron: /bcaa|amino/i,
    protein: '8g aminoácidos',
    servings: '40 servicios',
    goal: 'Recuperación',
  },
  {
    patron: /thermo|burn/i,
    protein: 'cafeína + EGCG',
    servings: '60 cápsulas',
    goal: 'Metabolismo',
  },
  {
    patron: /pre[\s-]?workout|pump/i,
    protein: '3.2g beta-alanina',
    servings: '30 servicios',
    goal: 'Energía y enfoque',
  },
];

export function metadatosProducto(producto) {
  const nombre = producto?.nombre ?? '';
  const encontrado = METADATOS.find(({ patron }) => patron.test(nombre));
  return encontrado ?? {
    protein: 'Dosis sugerida',
    servings: 'Según etiqueta',
    goal: 'Suplemento',
  };
}
