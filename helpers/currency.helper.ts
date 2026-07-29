/**
 * Converte um preco exibido na tela ("$29.99") para numero (29.99).
 * Helpers ficam reservados para logica pura e reutilizavel entre Pages,
 * sem nenhuma interacao direta com o Playwright (sem "page" ou "locator").
 */
export function parsePriceToNumber(displayedPrice: string): number {
  const numericValue = displayedPrice.replace('$', '').trim();
  return Number.parseFloat(numericValue);
}

export function sum(values: number[]): number {
  return values.reduce((total, current) => total + current, 0);
}
