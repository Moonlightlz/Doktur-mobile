// Copiado por scripts/sincronizar.mjs desde Doktur-front/packages/contenido. NO EDITAR aquí.
/**
 * Qué puede pasar con El Niño 2026-2027 y la salud: escenarios por periodo.
 *
 * NO es un pronóstico oficial. Cada afirmación declara su nivel de evidencia:
 * - hecho: ya ocurrió y está documentado (fuente oficial o prensa que cita a la fuente oficial);
 * - pronostico: pronóstico oficial (ENFEN, Senamhi);
 * - estimacion: escenario del comité basado en datos oficiales y en Niños anteriores;
 * - hipotesis: posibilidad plausible con poca evidencia; se vigila, no se afirma.
 * Debe revisarse con cada comunicado del ENFEN y cada sala situacional del CDC-Minsa.
 */
import type { ClaveFuente } from './regiones';

export type Evidencia = 'hecho' | 'pronostico' | 'estimacion' | 'hipotesis';

export const ETIQUETA_EVIDENCIA: Record<Evidencia, string> = {
	hecho: 'Hecho verificado',
	pronostico: 'Pronóstico oficial',
	estimacion: 'Estimación',
	hipotesis: 'Posibilidad a vigilar',
};

export interface Afirmacion {
	texto: string;
	evidencia: Evidencia;
	fuentes: ClaveFuente[];
}

export interface Periodo {
	id: string;
	titulo: string;
	resumen: string;
	clima: Afirmacion[];
	salud: Afirmacion[];
	/** Recomendaciones generales de prevención (borrador: requieren validación médica). */
	queHacer: string[];
}

export const pronosticoActualizado = {
	fecha: '2026-10-21',
	/** Próximo comunicado anunciado por el ENFEN: el escenario debe revisarse ese día. */
	proximaRevision: '2026-10-30',
};

export const PERIODOS: Periodo[] = [
	{
		id: 'ahora',
		titulo: 'Ahora (octubre de 2026)',
		resumen: 'El Niño costero ya está activo: lluvias e inundaciones en el norte y sequía en la sierra y la selva, al mismo tiempo.',
		clima: [
			{ texto: 'El ENFEN mantiene la Alerta de El Niño Costero (comunicado del 16 de octubre).', evidencia: 'hecho', fuentes: ['enfen18'] },
			{
				texto: 'El 20 de octubre las lluvias intensas causaron las primeras inundaciones en la ciudad de Piura; el COEN anunció más lluvias en Piura y Tumbes.',
				evidencia: 'hecho',
				fuentes: ['inundacionesPiura'],
			},
			{
				texto: 'El Gobierno declaró en emergencia 707 distritos de 17 regiones por déficit hídrico (falta de lluvias).',
				evidencia: 'hecho',
				fuentes: ['emergenciaDeficit'],
			},
			{ texto: 'Senamhi reporta que persisten condiciones secas en la sierra y la selva.', evidencia: 'hecho', fuentes: ['senamhiSeco'] },
		],
		salud: [
			{
				texto: 'El dengue ya supera los 71 000 casos y 75 fallecidos en 2026, 122 % más que en el mismo periodo de 2025. Piura, La Libertad, San Martín y Lambayeque tienen más casos.',
				evidencia: 'hecho',
				fuentes: ['dengueSe40', 'dengue'],
			},
			{
				texto: 'Hay 12 270 casos de leptospirosis y 65 fallecidos hasta mediados de setiembre; Loreto, Piura y Tumbes concentran la mayoría.',
				evidencia: 'hecho',
				fuentes: ['leptospirosis'],
			},
			{ texto: 'Hay 17 646 casos de malaria hasta mediados de setiembre; casi todos (98 %) en Loreto.', evidencia: 'hecho', fuentes: ['malaria'] },
		],
		queHacer: [
			'Guarda los números de emergencia: SAMU 106 (donde opera), Bomberos 116 y Línea 113 Salud.',
			'Escobilla, lava y tapa los recipientes donde guardas agua: así cortas el criadero del zancudo del dengue.',
			'Prepara tu mochila de emergencia con medicinas, documentos y agua segura.',
		],
	},
	{
		id: 'nov-dic',
		titulo: 'Noviembre y diciembre de 2026',
		resumen: 'Se esperan más lluvias y ríos crecidos en el norte y la costa central. El dengue y la leptospirosis podrían subir.',
		clima: [
			{
				texto: 'Lluvias por encima de lo normal en la costa norte, la costa central y la sierra norte occidental.',
				evidencia: 'pronostico',
				fuentes: ['enfen18'],
			},
			{
				texto: 'Caudales altos en los ríos Tumbes, Chira, Piura, La Leche y Jequetepeque desde noviembre, y en el Rímac y el Chillón desde diciembre.',
				evidencia: 'pronostico',
				fuentes: ['enfen18'],
			},
			{ texto: 'El Niño costero se mantendría con magnitud extraordinaria hasta enero de 2027.', evidencia: 'pronostico', fuentes: ['enfen18'] },
		],
		salud: [
			{
				texto: 'Más casos de dengue en la costa norte y la selva: la lluvia y el agua guardada en casa multiplican los criaderos del zancudo. En 2023, con El Niño costero, Piura tuvo más de 79 000 casos.',
				evidencia: 'estimacion',
				fuentes: ['dengue'],
			},
			{
				texto: 'Brotes de leptospirosis en las semanas siguientes a cada inundación, sobre todo en Piura, Tumbes y Lambayeque.',
				evidencia: 'estimacion',
				fuentes: ['leptospirosis', 'inundacionesPiura'],
			},
			{
				texto: 'Más diarreas donde se corte el agua potable o se use agua de inundación: Sunass advierte que el suministro de unos 7 millones de personas está en riesgo.',
				evidencia: 'estimacion',
				fuentes: ['aguaPotable', 'diarreas'],
			},
		],
		queHacer: [
			'No camines ni dejes jugar a los niños en agua de inundación.',
			'Hierve o clora el agua para tomar si se corta el servicio o el agua cambia de color.',
			'Ante fiebre en zonas con dengue, no te automediques: acude al establecimiento de salud.',
		],
	},
	{
		id: 'ene-mar',
		titulo: 'Enero a marzo de 2027',
		resumen: 'Es el centro de la temporada de lluvias: el momento de mayor riesgo en el norte y de mayor sequía en el sur.',
		clima: [
			{ texto: 'El Niño costero bajaría de extraordinario a fuerte; la temporada de lluvias dura hasta abril.', evidencia: 'pronostico', fuentes: ['enfen18'] },
			{
				texto: 'En Puno las lluvias podrían reducirse cerca de la mitad entre enero y marzo, según Senamhi Puno.',
				evidencia: 'estimacion',
				fuentes: ['punoLluvias'],
			},
		],
		salud: [
			{
				texto: 'Pico de dengue en la costa norte y la selva entre febrero y mayo, como en años anteriores (en 2024 el pico nacional fue a inicios de abril).',
				evidencia: 'estimacion',
				fuentes: ['dengue'],
			},
			{
				texto: 'En la sierra sur, menos agua y cosechas perdidas pueden aumentar las diarreas, la desnutrición y la anemia en niños.',
				evidencia: 'estimacion',
				fuentes: ['cenepredDeficit', 'punoLluvias'],
			},
			{
				texto: 'Reaparición de la peste en sus zonas históricas (Cajamarca, La Libertad, Lambayeque y Piura) si las lluvias aumentan los roedores. No hay casos desde 2018.',
				evidencia: 'hipotesis',
				fuentes: ['pesteZonas', 'peste'],
			},
			{
				texto: 'Aumento de la malaria en la costa norte, como ocurrió durante El Niño de 1997-1998.',
				evidencia: 'hipotesis',
				fuentes: ['nino1997', 'malaria'],
			},
		],
		queHacer: [
			'Si vives cerca de un río o quebrada, conoce la ruta de evacuación y el punto seguro de tu zona.',
			'Usa mosquitero y repelente; elimina el agua acumulada después de cada lluvia.',
			'En zonas con sequía, guarda el agua en recipientes tapados y lávate las manos antes de comer.',
		],
	},
	{
		id: 'abr-may',
		titulo: 'Abril y mayo de 2027',
		resumen: 'Las lluvias empiezan a bajar, pero el dengue puede seguir alto y llega el frío a la sierra.',
		clima: [{ texto: 'El Niño costero seguiría fuerte hasta inicios del otoño de 2027.', evidencia: 'pronostico', fuentes: ['enfen18'] }],
		salud: [
			{ texto: 'El dengue puede seguir alto hasta mayo; la leptospirosis, mientras haya zonas inundadas.', evidencia: 'estimacion', fuentes: ['dengue', 'leptospirosis'] },
			{
				texto: 'Con el inicio de la temporada de heladas suben las neumonías en zonas altoandinas, sobre todo en menores de 5 años y adultos mayores.',
				evidencia: 'estimacion',
				fuentes: ['neumonias', 'heladas'],
			},
		],
		queHacer: [
			'Abriga a los niños y adultos mayores en las noches frías y ventila la casa sin humo de leña.',
			'Ante respiración rápida o hundimiento de costillas en un niño, acude de inmediato: es un signo de alarma.',
		],
	},
];
