// Copiado por scripts/sincronizar.mjs desde Doktur-front/packages/contenido. NO EDITAR aquí.
/**
 * Números de emergencia y orientación.
 *
 * Regla del comité (Fase 5, §6; V1-02): ningún número se publica en producción sin verificación
 * directa y con fecha. La página oficial gob.pe/547 tiene "Último cambio: 14/01/2024" e incluye
 * entradas desactualizadas, por eso todos los números parten como "pendiente".
 */

export interface Verificacion {
	estado: 'pendiente' | 'verificado';
	/** ISO yyyy-mm-dd en que se verificó llamando o con la entidad. */
	fecha?: string;
	/** Cómo se verificó (p. ej., "llamada de prueba", "confirmación escrita de la DIRESA Piura"). */
	medio?: string;
	responsable?: string;
}

export interface Fuente {
	nombre: string;
	url: string;
	/** Fecha de "Último cambio" que declara la fuente. */
	actualizadaEl?: string;
	consultadaEl: string;
}

export interface NumeroEmergencia {
	numero: string;
	nombre: string;
	paraQue: string;
	/** Nota de cobertura (p. ej., regiones donde opera). */
	cobertura?: string;
	fuente: Fuente;
	verificacion: Verificacion;
}

const telefonosGobPe: Fuente = {
	nombre: 'Teléfonos de emergencia (gob.pe)',
	url: 'https://www.gob.pe/547',
	actualizadaEl: '2024-01-14',
	consultadaEl: '2026-10-20',
};

/** Regiones que gob.pe/547 lista para el SAMU 106 (además de Lima). */
export const regionesSamu = [
	'Amazonas',
	'Áncash',
	'Ayacucho',
	'Huancavelica',
	'Huánuco',
	'Junín',
	'La Libertad',
	'Lambayeque',
	'Lima',
	'Loreto',
	'Madre de Dios',
	'Pasco',
	'Piura',
	'Tacna',
	'Tumbes',
	'Ucayali',
];

/** Números que se muestran en la barra de emergencia de todas las páginas. */
export const numerosPrincipales: NumeroEmergencia[] = [
	{
		numero: '106',
		nombre: 'SAMU',
		paraQue: 'Emergencias médicas y ambulancia',
		cobertura: `No opera en todas las regiones. Según gob.pe está disponible en Lima y en: ${regionesSamu
			.filter((r) => r !== 'Lima')
			.join(', ')}.`,
		fuente: telefonosGobPe,
		verificacion: { estado: 'pendiente' },
	},
	{
		numero: '116',
		nombre: 'Bomberos',
		paraQue: 'Incendios, rescates y emergencias',
		fuente: telefonosGobPe,
		verificacion: { estado: 'pendiente' },
	},
	{
		numero: '105',
		nombre: 'Policía',
		paraQue: 'Central policial',
		fuente: telefonosGobPe,
		verificacion: { estado: 'pendiente' },
	},
];

export const otrosNumeros: NumeroEmergencia[] = [
	{
		numero: '115',
		nombre: 'Defensa Civil',
		paraQue: 'Emergencias por desastres',
		fuente: telefonosGobPe,
		verificacion: { estado: 'pendiente' },
	},
	{
		numero: '100',
		nombre: 'Línea 100',
		paraQue: 'Denuncia contra la violencia familiar y sexual',
		fuente: telefonosGobPe,
		verificacion: { estado: 'pendiente' },
	},
];

export interface OpcionLinea113 {
	opcion: string;
	descripcion: string;
}

/** Línea 113 Salud del Minsa: orientación gratuita las 24 horas. */
export const linea113 = {
	numero: '113',
	nombre: 'Línea 113 Salud (Minsa)',
	paraQue: 'Orientación e información en salud, gratis, las 24 horas, desde cualquier teléfono fijo o celular',
	opciones: [
		{ opcion: '1', descripcion: 'Dengue, influenza y enfermedades asociadas a lluvias o huaicos' },
		{ opcion: '2', descripcion: 'Teleconsulta por Hospital Digital' },
		{ opcion: '3', descripcion: 'Atención con un profesional de la salud (medicina, gestantes, nutrición, vacunación)' },
		{ opcion: '5', descripcion: 'Salud mental y psicología' },
	] satisfies OpcionLinea113[],
	/** Opciones administrativas (no de orientación en salud): se muestran en la página de establecimientos. */
	otrasOpciones: {
		sis: { opcion: '4', descripcion: 'Consultas sobre el SIS' },
		susalud: { opcion: '7', descripcion: 'Superintendencia Nacional de Salud (Susalud)' },
	} satisfies Record<string, OpcionLinea113>,
	whatsapp: ['955557000', '952842623'],
	correo: 'infosalud@minsa.gob.pe',
	fuente: {
		nombre: 'Línea 113 Salud: recibir orientación e información en salud (gob.pe)',
		url: 'https://www.gob.pe/555-recibir-informacion-y-orientacion-en-salud',
		actualizadaEl: '2026-09-07',
		consultadaEl: '2026-10-20',
	} satisfies Fuente,
	verificacion: { estado: 'pendiente' } as Verificacion,
};

export function todosLosNumeros() {
	return [...numerosPrincipales, ...otrosNumeros, linea113];
}
