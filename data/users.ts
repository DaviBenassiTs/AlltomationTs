import type { UserCredentials } from './types';

/**
 * Massa de dados fixa dos usuarios de demonstracao do saucedemo.com.
 * A senha nunca deveria ficar hardcoded em um projeto real: aqui ela vem
 * de variavel de ambiente (ver utils/env.ts e Capitulo 18).
 */
import { getEnvVar } from '../utils/env';

const DEFAULT_PASSWORD = getEnvVar('DEFAULT_PASSWORD', 'secret_sauce');

export const users = {
  standard: {
    username: 'standard_user',
    password: DEFAULT_PASSWORD,
  } as UserCredentials,

  lockedOut: {
    username: 'locked_out_user',
    password: DEFAULT_PASSWORD,
  } as UserCredentials,

  problem: {
    username: 'problem_user',
    password: DEFAULT_PASSWORD,
  } as UserCredentials,

  performanceGlitch: {
    username: 'performance_glitch_user',
    password: DEFAULT_PASSWORD,
  } as UserCredentials,
};
