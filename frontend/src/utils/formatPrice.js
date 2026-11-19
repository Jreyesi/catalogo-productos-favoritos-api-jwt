const formatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
});

export const formatPrice = (value) => formatter.format(Number(value) || 0);
