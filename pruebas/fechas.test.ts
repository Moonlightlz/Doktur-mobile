import { diaDe, formatoHora, relativo, salaAbierta } from '@/utiles/fechas';

describe('fechas en hora de Perú', () => {
	it('muestra la hora de Lima sin importar la zona del teléfono', () => {
		expect(formatoHora('2026-10-21T14:30:00.000Z')).toBe('09:30');
		// 23:30 en Lima del día 20 es el día 21 en UTC.
		expect(diaDe('2026-10-21T04:30:00.000Z')).toBe('2026-10-20');
	});

	it('relativo sin Intl.RelativeTimeFormat', () => {
		const ahora = Date.parse('2026-10-20T12:00:00Z');
		expect(relativo('2026-10-20T11:55:00Z', ahora)).toBe('hace 5 minutos');
		expect(relativo('2026-10-20T14:00:00Z', ahora)).toBe('en 2 horas');
		expect(relativo('2026-10-20T12:00:20Z', ahora)).toBe('ahora');
	});

	it('la sala abre 15 minutos antes y cierra 30 minutos después (igual que la API)', () => {
		const c = { inicio: '2026-10-20T15:00:00Z', fin: '2026-10-20T15:30:00Z', estado: 'programada' };
		expect(salaAbierta(c, Date.parse('2026-10-20T14:44:00Z'))).toBe(false);
		expect(salaAbierta(c, Date.parse('2026-10-20T14:45:00Z'))).toBe(true);
		expect(salaAbierta(c, Date.parse('2026-10-20T16:00:00Z'))).toBe(true);
		expect(salaAbierta(c, Date.parse('2026-10-20T16:01:00Z'))).toBe(false);
		expect(salaAbierta({ ...c, estado: 'cancelada' }, Date.parse('2026-10-20T15:10:00Z'))).toBe(false);
	});
});
