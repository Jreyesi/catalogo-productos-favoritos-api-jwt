const porId = {
  1: '/productos/creatina.svg',
  2: '/productos/proteina.svg',
  3: '/productos/bcaa.svg',
  4: '/productos/thermo.svg',
  5: '/productos/preworkout.svg',
};

const porNombre = [
  [/creatina/i, 'creatina.svg'],
  [/whey|prote/i, 'proteina.svg'],
  [/bcaa/i, 'bcaa.svg'],
  [/thermo/i, 'thermo.svg'],
  [/pump|pre[\s-]?workout/i, 'preworkout.svg'],
];

export function imagenProducto(producto) {
  if (porId[producto?.id]) return porId[producto.id];
  const nombre = producto?.nombre ?? '';
  const encontrada = porNombre.find(([patron]) => patron.test(nombre));
  return `/productos/${encontrada?.[1] ?? 'generico.svg'}`;
}
