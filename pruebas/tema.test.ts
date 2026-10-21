import { aPixeles, espacio, objetivoTactil, tamano } from '@/tema';
import { tokens } from '@/tema/tokens';

const claves = (o: object, prefijo = ''): string[] =>
	Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' && v !== null ? claves(v, `${prefijo}${k}.`) : [`${prefijo}${k}`]));

describe('tema desde @doktur/tokens', () => {
	it('convierte rem y px a puntos de pantalla', () => {
		expect(aPixeles('1rem')).toBe(16);
		expect(aPixeles('1.25rem')).toBe(20);
		expect(aPixeles('44px')).toBe(44);
		expect(aPixeles('0')).toBe(0);
		expect(() => aPixeles('auto')).toThrow();
	});

	it('las escalas quedan en números', () => {
		expect(espacio[4]).toBe(16);
		expect(tamano.base).toBe(16);
		// Objetivo táctil mínimo de WCAG 2.2 (2.5.8) y de las guías de Android/iOS.
		expect(objetivoTactil.minimo).toBeGreaterThanOrEqual(44);
	});

	it('el tema claro y el oscuro tienen exactamente los mismos roles', () => {
		expect(claves(tokens.temas.oscuro).sort()).toEqual(claves(tokens.temas.claro).sort());
	});
});
