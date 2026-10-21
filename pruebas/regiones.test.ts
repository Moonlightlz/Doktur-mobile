import { CATEGORIA, ESTABLECIMIENTOS, establecimientosDe, INSTITUCION } from '@/contenido/establecimientos';
import { PERIODOS, pronosticoActualizado } from '@/contenido/pronostico';
import { ENFERMEDADES, FUENTES, REGIONES, regionPorId, riesgosDeRegion, tieneSamu, ZONAS } from '@/contenido/regiones';

const region = (id: string) => {
	const r = regionPorId(id);
	if (!r) throw new Error(`No existe la región ${id}`);
	return r;
};

describe('salud por región (contenido sincronizado de Doktur-front)', () => {
	it('tiene las 25 regiones, con ids únicos y zonas válidas', () => {
		expect(REGIONES).toHaveLength(25);
		expect(new Set(REGIONES.map((r) => r.id)).size).toBe(25);
		for (const r of REGIONES) {
			expect(r.zonas.length).toBeGreaterThan(0);
			for (const z of r.zonas) expect(ZONAS[z]).toBeDefined();
		}
	});

	it('calcula el nivel con los umbrales declarados (incidencia por 100 mil)', () => {
		const piura = riesgosDeRegion(region('piura'));
		const nivel = (id: string) => piura.find((x) => x.enfermedad === id)?.nivel;
		expect(nivel('dengue')).toBe('frecuente'); // TIA 533
		expect(nivel('leptospirosis')).toBe('frecuente'); // TIA 121
		expect(nivel('leishmaniasis')).toBe('ocasional'); // TIA 8,3
		expect(nivel('chagas')).toBe('raro'); // 1 caso
		expect(nivel('peste')).toBe('raro'); // solo antecedente
		// Ordenado de más a menos frecuente.
		const orden = piura.map((x) => x.nivel);
		expect(orden).toEqual([...orden].sort((a, b) => ['frecuente', 'ocasional', 'raro'].indexOf(a) - ['frecuente', 'ocasional', 'raro'].indexOf(b)));
	});

	it('la malaria es frecuente en Loreto y no aparece donde no hay casos', () => {
		expect(riesgosDeRegion(region('loreto')).find((x) => x.enfermedad === 'malaria')?.nivel).toBe('frecuente');
		expect(riesgosDeRegion(region('tumbes')).some((x) => x.enfermedad === 'malaria')).toBe(false);
	});

	it('escribe las cifras con la norma RAE (espacio duro desde cinco cifras)', () => {
		const dengue = riesgosDeRegion(region('piura')).find((x) => x.enfermedad === 'dengue');
		expect(dengue?.motivo).toBe('11 701 casos y 7 fallecidos en 2026 (hasta la SE 38).');
		const lepto = riesgosDeRegion(region('piura')).find((x) => x.enfermedad === 'leptospirosis');
		expect(lepto?.motivo.startsWith('2670 casos')).toBe(true);
	});

	it('el SAMU solo se ofrece donde gob.pe lo lista', () => {
		expect(tieneSamu(region('piura'))).toBe(true);
		expect(tieneSamu(region('puno'))).toBe(false);
		expect(tieneSamu(region('arequipa'))).toBe(false);
	});

	it('todas las fuentes usan https y las enfermedades citan una fuente existente', () => {
		for (const f of Object.values(FUENTES)) expect(f.url.startsWith('https://')).toBe(true);
		for (const e of Object.values(ENFERMEDADES)) expect(FUENTES[e.fuente]).toBeDefined();
	});
});

describe('escenarios de El Niño', () => {
	it('cada afirmación declara su evidencia y cita al menos una fuente', () => {
		const afirmaciones = PERIODOS.flatMap((p) => [...p.clima, ...p.salud]);
		expect(afirmaciones.length).toBeGreaterThan(10);
		for (const a of afirmaciones) {
			expect(['hecho', 'pronostico', 'estimacion', 'hipotesis']).toContain(a.evidencia);
			expect(a.fuentes.length).toBeGreaterThan(0);
			for (const f of a.fuentes) expect(FUENTES[f]).toBeDefined();
		}
	});

	it('los pronósticos oficiales citan al ENFEN o al Senamhi', () => {
		const oficiales = PERIODOS.flatMap((p) => p.clima).filter((a) => a.evidencia === 'pronostico');
		for (const a of oficiales) expect(a.fuentes.some((f) => FUENTES[f].institucion.includes('ENFEN') || FUENTES[f].institucion.includes('Senamhi'))).toBe(true);
	});

	it('declara la fecha de la próxima revisión después de la actualización', () => {
		expect(pronosticoActualizado.proximaRevision > pronosticoActualizado.fecha).toBe(true);
	});
});

describe('establecimientos (Renipress, sincronizado de Doktur-front)', () => {
	it('cada región tiene al menos un establecimiento y todos apuntan a una región existente', () => {
		for (const r of REGIONES) expect(establecimientosDe(r.id).length).toBeGreaterThan(0);
		for (const e of ESTABLECIMIENTOS) expect(regionPorId(e.region)).toBeDefined();
	});

	it('los números marcables tienen formato peruano y las coordenadas caen dentro del Perú', () => {
		for (const e of ESTABLECIMIENTOS) {
			if (e.tel) expect(e.tel).toMatch(/^\+51\d{8,9}$/);
			if (e.lat !== undefined) {
				expect(e.lat).toBeGreaterThan(-18.5);
				expect(e.lat).toBeLessThan(0.1);
				expect(e.lon).toBeGreaterThan(-81.5);
				expect(e.lon).toBeLessThan(-68.5);
			}
		}
	});

	it('no incluye privados y cada categoría pertenece a un grupo con descripción', () => {
		const instituciones = new Set(ESTABLECIMIENTOS.map((e) => e.institucion));
		expect([...instituciones].every((i) => i in INSTITUCION)).toBe(true);
		for (const e of ESTABLECIMIENTOS) expect(CATEGORIA[e.categoria]).toBeDefined();
		expect(new Set(ESTABLECIMIENTOS.map((e) => e.codigo)).size).toBe(ESTABLECIMIENTOS.length);
	});
});
