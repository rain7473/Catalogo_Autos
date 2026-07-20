import { describe, expect, it } from 'vitest';

import { vehiculos, WHATSAPP_BASE_URL, WHATSAPP_NUMBER } from '../../src/vehiculos';

describe('datos del catalogo', () => {
  it('expone identificadores unicos y campos requeridos para cada vehiculo', () => {
    const ids = vehiculos.map((vehiculo) => vehiculo.id);

    expect(new Set(ids).size).toBe(vehiculos.length);
    expect(vehiculos.length).toBeGreaterThan(0);

    for (const vehiculo of vehiculos) {
      expect(vehiculo.nombre).not.toHaveLength(0);
      expect(vehiculo.marca).not.toHaveLength(0);
      expect(vehiculo.anio).toBeGreaterThanOrEqual(1980);
      expect(vehiculo.km).toBeGreaterThanOrEqual(0);
      expect(vehiculo.precio).toBeGreaterThan(0);
      expect(['disponible', 'vendido']).toContain(vehiculo.estado);
      expect(vehiculo.imagen).toMatch(/^https:\/\//);
    }
  });

  it('incluye vehiculos disponibles y vendidos para los filtros de estado', () => {
    expect(vehiculos.some((vehiculo) => vehiculo.estado === 'disponible')).toBe(true);
    expect(vehiculos.some((vehiculo) => vehiculo.estado === 'vendido')).toBe(true);
  });

  it('configura un enlace de WhatsApp valido sin credenciales', () => {
    const url = new URL(WHATSAPP_BASE_URL);

    expect(url.hostname).toBe('wa.me');
    expect(url.pathname).toBe(`/${WHATSAPP_NUMBER}`);
    expect(WHATSAPP_NUMBER).toMatch(/^\d+$/);
  });
});
