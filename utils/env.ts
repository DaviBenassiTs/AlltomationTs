/**
 * Le uma variavel de ambiente com um valor padrao opcional.
 * Centralizar o acesso a process.env aqui evita espalhar "process.env.X"
 * (e o "any" implicito que vem junto) pelo restante do framework.
 */
export function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name];

  if (value !== undefined && value !== '') {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
}
