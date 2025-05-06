import { describe, test, expect } from "vitest";
import request from 'supertest';
import { app } from '../src/app.js'; 

describe('Pruebas para app.ts', () => {
  test('GET /ruta-no-existe - Debería responder con 501 (Ruta no implementada)', async () => {
    const response = await request(app).get('/ruta-no-existe');
    expect(response.status).toBe(501);
  });

  test('Servidor debería estar configurado correctamente', () => {
    expect(app).toBeDefined(); 
  });
});