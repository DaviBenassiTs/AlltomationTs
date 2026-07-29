/**
 * Interfaces compartilhadas de massa de dados.
 * Ficam separadas dos dados em si para permitir reuso em factories e builders.
 */
export interface UserCredentials {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}
