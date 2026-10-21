// Copiado por scripts/sincronizar.mjs desde Doktur-front/packages/contenido. NO EDITAR aquí.
/**
 * Establecimientos de salud por región, a partir del registro oficial Renipress (Susalud).
 *
 * - Los datos (establecimientos-datos.ts) se GENERAN con scripts/generar-establecimientos.mjs a partir del
 *   CSV mensual de la Plataforma Nacional de Datos Abiertos. No se editan a mano.
 * - Incluye establecimientos públicos, de EsSalud, de las sanidades y municipales con camas (I-4) u
 *   hospitales (II y III). No incluye privados ni puestos y centros sin internamiento.
 * - Qué significa cada categoría: NTS N.° 021-MINSA/DGSP-V.03 (R. M. N.° 546-2011/MINSA).
 * - Derecho a la atención de emergencia: Ley N.° 27604, que modificó los artículos 3 y 39 de la Ley General de Salud.
 */
import { ESTABLECIMIENTOS, fechaCorteRenipress } from './establecimientos-datos';
import type { IdRegion } from './regiones';

export type Categoria = 'I-4' | 'II-1' | 'II-2' | 'II-E' | 'III-1' | 'III-2' | 'III-E';
export type Institucion = 'minsa' | 'gobierno-regional' | 'essalud' | 'ejercito' | 'policia' | 'marina' | 'fap' | 'municipal';

export interface Establecimiento {
	/** Código único de IPRESS en Renipress. */
	codigo: string;
	nombre: string;
	categoria: Categoria;
	institucion: Institucion;
	region: IdRegion;
	provincia: string;
	distrito: string;
	direccion: string;
	/** Teléfono tal como figura en Renipress. */
	telefono?: string;
	/** Número marcable (+51…) solo cuando el registro es inequívoco. */
	tel?: string;
	/** Horario registrado ("24 horas" normalizado). */
	horario?: string;
	lat?: number;
	lon?: number;
}

export { ESTABLECIMIENTOS, fechaCorteRenipress };

export type Grupo = 'general' | 'especializado' | 'con-camas';

/** Grupos para orientar: por norma, solo los hospitales generales tienen emergencia como servicio mínimo. */
export const GRUPOS: Array<{ grupo: Grupo; titulo: string; descripcion: string; categorias: Categoria[] }> = [
	{
		grupo: 'general',
		titulo: 'Hospitales generales',
		descripcion: 'Por norma tienen servicio de emergencia, hospitalización, sala de partos y sala de operaciones.',
		categorias: ['III-1', 'II-2', 'II-1'],
	},
	{
		grupo: 'con-camas',
		titulo: 'Centros de salud con camas',
		descripcion: 'Atienden consultas, partos y urgencias, y pueden internar por poco tiempo. Revisa el horario: no todos atienden las 24 horas.',
		categorias: ['I-4'],
	},
	{
		grupo: 'especializado',
		titulo: 'Hospitales e institutos especializados',
		descripcion: 'Atienden una especialidad o un grupo de edad (por ejemplo, niños o maternidad). No todos tienen servicio de emergencia.',
		categorias: ['III-2', 'III-E', 'II-E'],
	},
];

/** Qué es cada categoría, en lenguaje sencillo (NTS N.° 021-MINSA/DGSP-V.03). */
export const CATEGORIA: Record<Categoria | 'I-1' | 'I-2' | 'I-3', { nombre: string; detalle: string }> = {
	'I-1': { nombre: 'Puesto de salud', detalle: 'Con personal de salud que no es médico (por ejemplo, obstetra o enfermera). Consulta y primeros auxilios.' },
	'I-2': { nombre: 'Puesto de salud con médico', detalle: 'Consulta médica y primeros auxilios.' },
	'I-3': { nombre: 'Centro de salud', detalle: 'Consulta, laboratorio y atención de urgencias. No interna pacientes.' },
	'I-4': { nombre: 'Centro de salud con camas', detalle: 'Además del centro de salud: farmacia, partos e internamiento.' },
	'II-1': { nombre: 'Hospital general', detalle: 'Emergencia, hospitalización, sala de partos y sala de operaciones.' },
	'II-2': { nombre: 'Hospital general con cuidados intensivos', detalle: 'Como el anterior, con más especialidades y unidad de cuidados intensivos.' },
	'II-E': { nombre: 'Hospital especializado', detalle: 'Atiende una especialidad o un grupo de edad.' },
	'III-1': { nombre: 'Hospital de alta complejidad', detalle: 'Hospital general de referencia regional o nacional, con cuidados intensivos.' },
	'III-E': { nombre: 'Hospital especializado de alta complejidad', detalle: 'Atiende una especialidad con la mayor capacidad del país o de la región.' },
	'III-2': { nombre: 'Instituto especializado', detalle: 'Atiende una especialidad e investiga (por ejemplo, el Instituto Nacional de Salud del Niño).' },
};

export const INSTITUCION: Record<Institucion, string> = {
	minsa: 'Público · Ministerio de Salud',
	'gobierno-regional': 'Público · Gobierno Regional',
	essalud: 'EsSalud',
	ejercito: 'Sanidad del Ejército',
	policia: 'Sanidad de la Policía',
	marina: 'Sanidad de la Marina',
	fap: 'Sanidad de la Fuerza Aérea',
	municipal: 'Municipal',
};

export const grupoDe = (c: Categoria): Grupo => GRUPOS.find((g) => g.categorias.includes(c))?.grupo ?? 'especializado';

export function establecimientosDe(region: IdRegion): Establecimiento[] {
	return ESTABLECIMIENTOS.filter((e) => e.region === region);
}

/** Enlace para abrir la ubicación en un mapa (solo se abre si la persona lo toca). */
export const enlaceMapa = (e: Establecimiento) =>
	e.lat !== undefined && e.lon !== undefined ? `https://www.google.com/maps/search/?api=1&query=${e.lat}%2C${e.lon}` : undefined;

export const fuenteRenipress = {
	nombre: 'Registro Nacional de Entidades Prestadoras de Servicios de Salud (Renipress)',
	institucion: 'Superintendencia Nacional de Salud (Susalud), en la Plataforma Nacional de Datos Abiertos',
	url: 'https://www.datosabiertos.gob.pe/dataset/registro-nacional-de-entidades-prestadoras-de-servicios-de-salud-renipress',
	licencia: 'Open Data Commons Attribution License',
};

export const fuenteCategorias = {
	nombre: 'NTS N.° 021-MINSA/DGSP-V.03 "Categorías de establecimientos del sector salud" (R. M. N.° 546-2011/MINSA)',
	institucion: 'Ministerio de Salud (copia publicada por la Gerencia Regional de Salud de Arequipa)',
	url: 'https://www.saludarequipa.gob.pe/desa/archivos/Normas_Legales/NTS%20021-MINSA-DGSP-V.03%20%E2%80%9CCATEGOR%C3%8DAS%20DE%20ESTABLECIMIENTOS%20DEL%20SECTOR%20SALUD%E2%80%9D%20-%20RM%20546-2011MINSA.pdf',
};

export const fuenteLeyEmergencias = {
	nombre: 'Ley N.° 27604, que modifica la Ley General de Salud sobre la obligación de atender emergencias y partos',
	institucion: 'Congreso de la República (texto reproducido por el Colegio Médico del Perú)',
	url: 'https://www.cmp.org.pe/wp-content/uploads/2020/02/modifica_ley_general_salud.pdf',
};

/** Pendientes antes de publicar (la compuerta del sitio los exige). */
export const validacionEstablecimientos = {
	estado: 'borrador' as 'borrador' | 'validado',
	pendientes: [
		'Abogado: confirmar que los artículos 3 y 39 de la Ley General de Salud (Ley N.° 27604) siguen vigentes con ese texto.',
		'Director Médico: revisar las descripciones de las categorías y de los grupos.',
		'Los teléfonos y horarios son los registrados en Renipress: verificar por muestreo antes de publicar.',
	],
};
