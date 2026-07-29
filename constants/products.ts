/**
 * Enum com os nomes exatos dos produtos exibidos em inventory.html.
 * Usar enum em vez de strings soltas evita erros de digitacao nos testes.
 */
export enum ProductName {
  BACKPACK = 'Sauce Labs Backpack',
  BIKE_LIGHT = 'Sauce Labs Bike Light',
  BOLT_T_SHIRT = 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET = 'Sauce Labs Fleece Jacket',
  ONESIE = 'Sauce Labs Onesie',
  RED_T_SHIRT = 'Test.allTheThings() T-Shirt (Red)',
}

export enum SortOption {
  NAME_A_TO_Z = 'az',
  NAME_Z_TO_A = 'za',
  PRICE_LOW_TO_HIGH = 'lohi',
  PRICE_HIGH_TO_LOW = 'hilo',
}
