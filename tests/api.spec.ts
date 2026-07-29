import { test, expect } from '@playwright/test';

/**
 * Testes de API usando a fixture nativa "request" do Playwright.
 * Alvo: https://jsonplaceholder.typicode.com — API publica e gratuita,
 * mantida especificamente para treino/prototipagem (nao e uma API de
 * producao real; POST/PUT/DELETE sao simulados e nao persistem dados).
 * Ver Capitulo 16 do treinamento para a explicacao linha a linha.
 */
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('API de usuarios (jsonplaceholder)', () => {
  test('GET /users/2 retorna um usuario existente', { tag: ['@api', '@regression'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/users/2`);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.id).toBe(2);
    expect(body.email).toContain('@');
  });

  test('POST /posts cria um post', { tag: ['@api', '@smoke'] }, async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/posts`, {
      data: {
        title: 'Treinamento Playwright',
        body: 'Testando criacao de recurso via API',
        userId: 1,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('Treinamento Playwright');
    expect(body.id).toBeTruthy();
  });

  test('PUT /posts/1 atualiza um post existente', { tag: ['@api', '@regression'] }, async ({ request }) => {
    const response = await request.put(`${API_BASE_URL}/posts/1`, {
      data: {
        id: 1,
        title: 'Titulo atualizado',
        body: 'Corpo atualizado',
        userId: 1,
      },
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.title).toBe('Titulo atualizado');
  });

  test('DELETE /posts/1 remove um post', { tag: ['@api', '@regression'] }, async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/posts/1`);

    expect(response.ok()).toBeTruthy();
  });
});
