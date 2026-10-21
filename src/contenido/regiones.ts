// Copiado por scripts/sincronizar.mjs desde Doktur-front/packages/contenido. NO EDITAR aquí.
/**
 * Salud por región (Vía 1, información y educación; no es consejo médico individual).
 *
 * - Cifras: transcritas de las salas situacionales OFICIALES del CDC-Minsa, hasta la semana
 *   epidemiológica (SE) 38 de 2026. Son datos preliminares que el CDC actualiza cada semana.
 * - Nivel de riesgo (frecuente / ocasional / raro): se CALCULA con las reglas de `nivelDe()`
 *   a partir de la incidencia oficial; no es una opinión.
 * - Peligros del clima: ENFEN, Senamhi y Cenepred (algunos a través de prensa: se indica).
 * - Textos de orientación: BORRADOR. Requieren validación médica y bloquean el build de
 *   producción del sitio (apps/info/src/lib/compuerta.ts) mientras `validacionRegional` sea borrador.
 */
import { regionesSamu } from './emergencias';

export interface FuenteRegional {
	nombre: string;
	institucion: string;
	url: string;
	/** Fecha de publicación o del dato (AAAA-MM-DD). */
	fecha: string;
	/** Fuente primaria oficial (true) o prensa que cita a la fuente oficial (false). */
	oficial: boolean;
}

const CONSULTA = '2026-10-21';
const sala = (archivo: string, nombre: string): FuenteRegional => ({
	nombre: `Sala situacional: ${nombre} (hasta la SE 38-2026)`,
	institucion: 'Centro Nacional de Epidemiología, Prevención y Control de Enfermedades (CDC-Minsa)',
	url: `https://www.dge.gob.pe/portal/docs/vigilancia/sala/2026/SE38/${archivo}.pdf`,
	fecha: '2026-09-20',
	oficial: true,
});

export const FUENTES = {
	dengue: sala('dengue', 'dengue'),
	leptospirosis: sala('leptospirosis', 'leptospirosis'),
	malaria: sala('malaria', 'malaria'),
	leishmaniasis: sala('leishmaniosis', 'leishmaniasis'),
	chagas: sala('chagas', 'enfermedad de Chagas'),
	carrion: sala('carrion', 'enfermedad de Carrión'),
	peste: sala('peste', 'peste'),
	rabia: sala('rabia', 'rabia'),
	diarreas: sala('edas', 'enfermedades diarreicas agudas'),
	neumonias: sala('neumonias', 'neumonías'),
	enfen18: {
		nombre: 'Comunicado Oficial ENFEN N.° 18-2026',
		institucion: 'Comisión Multisectorial ENFEN',
		url: 'https://enfen.imarpe.gob.pe/download/comunicado-oficial-enfen-n-18-2026/',
		fecha: '2026-10-16',
		oficial: true,
	},
	inundacionesPiura: {
		nombre: 'Perú registra las primeras inundaciones por las lluvias asociadas al fenómeno de El Niño (EFE, cita al COEN)',
		institucion: 'Infobae / EFE',
		url: 'https://www.infobae.com/america/agencias/2026/10/20/peru-registra-las-primeras-inundaciones-por-las-lluvias-asociadas-al-fenomeno-de-el-nino/',
		fecha: '2026-10-20',
		oficial: false,
	},
	drenajeSunass: {
		nombre: 'Sunass advierte que tres millones serían afectados por falta de drenajes pluviales en el norte',
		institucion: 'Infobae (cita a Sunass)',
		url: 'https://www.infobae.com/peru/2026/10/20/falta-de-drenajes-pluviales-agrava-el-riesgo-por-el-nino-en-el-norte-del-peru-sunass-advierte-que-tres-millones-serian-afectados/',
		fecha: '2026-10-20',
		oficial: false,
	},
	aguaPotable: {
		nombre: 'Fenómeno El Niño pone en riesgo el suministro de agua potable para siete millones de peruanos',
		institucion: 'Infobae (cita a Sunass)',
		url: 'https://www.infobae.com/peru/2026/10/20/fenomeno-el-nino-pone-en-riesgo-el-suministro-de-agua-potable-para-siete-millones-de-peruanos-a-nivel-nacional/',
		fecha: '2026-10-20',
		oficial: false,
	},
	emergenciaDeficit: {
		nombre: 'Gobierno declara en emergencia 707 distritos de 17 regiones por déficit hídrico (D. S. N.° 140-2026-PCM)',
		institucion: 'La República (cita El Peruano)',
		url: 'https://larepublica.pe/sociedad/2026/10/11/deficit-hidrico-en-peru-gobierno-declara-en-emergencia-707-distritos-de-17-regiones-969683',
		fecha: '2026-10-11',
		oficial: false,
	},
	cenepredDeficit: {
		nombre: 'Cenepred: 397 distritos en riesgo muy alto por déficit hídrico en el periodo 2026-2027',
		institucion: 'Andina (cita a Cenepred)',
		url: 'https://andina.pe/agencia/noticia-cenepred-397-distritos-estan-riesgo-muy-alto-deficit-hidrico-periodo-20262027-1094041.aspx',
		fecha: '2026-09-30',
		oficial: false,
	},
	punoLluvias: {
		nombre: 'El Niño agudiza déficit hídrico en Puno: lluvias se reducirían a la mitad entre enero y marzo de 2027 (Senamhi Puno)',
		institucion: 'La República (cita a Senamhi)',
		url: 'https://larepublica.pe/sociedad/2026/10/06/el-nino-agudiza-deficit-hidrico-en-puno-lluvias-se-reduciran-a-la-mitad-entre-enero-y-marzo-de-2027-121722',
		fecha: '2026-10-06',
		oficial: false,
	},
	senamhiSeco: {
		nombre: 'Senamhi advierte que persisten condiciones secas en la sierra y selva del país',
		institucion: 'Infobae (cita a Senamhi)',
		url: 'https://www.infobae.com/peru/2026/10/15/senamhi-advierte-que-persisten-condiciones-secas-en-la-sierra-y-selva-del-pais/',
		fecha: '2026-10-15',
		oficial: false,
	},
	dengueSe40: {
		nombre: 'Dengue supera los 71 000 casos y suma 75 muertes en Perú (sala situacional Minsa, SE 40)',
		institucion: 'La República (cita al Minsa)',
		url: 'https://larepublica.pe/sociedad/2026/10/19/dengue-supera-los-71000-casos-y-suma-75-muertes-en-peru-ante-la-llegada-de-el-nino-1031852',
		fecha: '2026-10-19',
		oficial: false,
	},
	pesteZonas: {
		nombre: 'Las enfermedades de alto riesgo que aumentarían en Perú por El Niño, según el Minsa',
		institucion: 'Radio Master (cita al Minsa)',
		url: 'https://radiomaster.pe/2026/08/26/las-enfermedades-de-alto-riesgo-que-aumentarian-en-peru-por-el-nino-segun-el-minsa/',
		fecha: '2026-08-26',
		oficial: false,
	},
	heladas: {
		nombre: 'Gobierno actualiza el plan contra heladas y friaje: distritos priorizados para 2026',
		institucion: 'El Peruano',
		url: 'https://www.elperuano.pe/noticia/296876-gobierno-actualiza-plan-contra-heladas-revise-los-distritos-priorizados-para-2026',
		fecha: '2026-07-15',
		oficial: true,
	},
	nino1997: {
		nombre: 'Impacto del fenómeno El Niño de 1997-1998 en la salud de la población peruana',
		institucion: 'Instituto Geofísico del Perú (síntesis de literatura)',
		url: 'https://cienciaclimatica.igp.gob.pe/interpretaciones/132328088/descargar-docx',
		fecha: '2015-01-01',
		oficial: true,
	},
} satisfies Record<string, FuenteRegional>;

export type ClaveFuente = keyof typeof FUENTES;
export const fechaConsultaRegional = CONSULTA;

// ------------------------------------------------------------------ enfermedades

export type IdEnfermedad = 'dengue' | 'leptospirosis' | 'malaria' | 'leishmaniasis' | 'chagas' | 'carrion' | 'peste' | 'rabia';

export interface Enfermedad {
	nombre: string;
	/** Cómo se transmite, en lenguaje sencillo. BORRADOR: requiere validación médica. */
	queEs: string;
	/** Qué puedes hacer. BORRADOR: requiere validación médica. */
	prevencion: string;
	/** Tema del sitio informativo con más detalle (si existe). */
	tema?: string;
	fuente: ClaveFuente;
}

export const ENFERMEDADES: Record<IdEnfermedad, Enfermedad> = {
	dengue: {
		nombre: 'Dengue',
		queEs: 'Virus que transmite el zancudo Aedes aegypti, que se cría en agua limpia acumulada: baldes, tanques, floreros y llantas.',
		prevencion: 'Escobilla, lava y tapa los recipientes donde guardas agua. Elimina lo que junte agua de lluvia.',
		tema: 'dengue',
		fuente: 'dengue',
	},
	leptospirosis: {
		nombre: 'Leptospirosis',
		queEs: 'Bacteria presente en la orina de ratas y otros animales. Se contagia por contacto con agua o lodo contaminados, sobre todo después de inundaciones.',
		prevencion: 'No camines ni te bañes en agua de inundación. Usa botas y guantes al limpiar lodo o desagües.',
		tema: 'leptospirosis',
		fuente: 'leptospirosis',
	},
	malaria: {
		nombre: 'Malaria (paludismo)',
		queEs: 'Parásito que transmite el zancudo Anopheles, sobre todo en la selva. Causa fiebre alta con escalofríos.',
		prevencion: 'Duerme con mosquitero. Ante fiebre, hazte la prueba gratuita en el establecimiento de salud: el tratamiento es gratuito.',
		fuente: 'malaria',
	},
	leishmaniasis: {
		nombre: 'Leishmaniasis (uta)',
		queEs: 'Parásito que transmite un mosquito muy pequeño (manta blanca o titira) en valles de selva y sierra. Causa llagas en la piel que no sanan.',
		prevencion: 'Usa ropa de manga larga y repelente al atardecer y en la noche. Si tienes una llaga que no sana en semanas, acude al establecimiento.',
		fuente: 'leishmaniasis',
	},
	chagas: {
		nombre: 'Enfermedad de Chagas',
		queEs: 'Parásito que transmite la chinche chirimacha, que vive en grietas de casas de adobe y corrales. Puede dañar el corazón años después.',
		prevencion: 'Tarrajea las grietas, mantén limpios los corrales lejos de la casa y avisa al establecimiento si encuentras chirimachas.',
		fuente: 'chagas',
	},
	carrion: {
		nombre: 'Enfermedad de Carrión (verruga peruana)',
		queEs: 'Bacteria que transmite la titira en valles interandinos. Causa fiebre y anemia; es grave si no se trata a tiempo.',
		prevencion: 'Usa mosquitero y ropa larga en zonas de valle. Ante fiebre con palidez o cansancio extremo, acude de inmediato.',
		fuente: 'carrion',
	},
	peste: {
		nombre: 'Peste',
		queEs: 'Bacteria que transmiten las pulgas de roedores en zonas rurales. No hay casos en el Perú desde 2018, pero las lluvias pueden aumentar los roedores.',
		prevencion: 'Guarda los granos en recipientes cerrados y no dejes basura cerca de la casa. Ante fiebre con ganglios hinchados y dolorosos, acude de inmediato.',
		fuente: 'peste',
	},
	rabia: {
		nombre: 'Rabia',
		queEs: 'Virus que transmite la mordedura de murciélagos (en la selva) o de perros. Es mortal si no se vacuna a tiempo después de la mordedura.',
		prevencion: 'Si te muerde un murciélago o un perro, lava la herida con agua y jabón por 15 minutos y acude ese mismo día al establecimiento de salud.',
		fuente: 'rabia',
	},
};

// ------------------------------------------------------------------ zonas y clima

export type Zona = 'costa-norte' | 'costa-centro' | 'costa-sur' | 'sierra-norte' | 'sierra-centro' | 'sierra-sur' | 'selva-norte' | 'selva-centro-sur';

export interface ClimaZona {
	nombre: string;
	/** Peligro principal de esta temporada (El Niño 2026-2027). */
	peligro: 'lluvias' | 'sequia' | 'mixto';
	ahora: string;
	proximosMeses: string;
	/** Problemas de salud que suben con ese peligro (orientativo; detalle en /pronostico/). */
	saludEsperada: string[];
	fuentes: ClaveFuente[];
}

export const ZONAS: Record<Zona, ClimaZona> = {
	'costa-norte': {
		nombre: 'Costa norte',
		peligro: 'lluvias',
		ahora:
			'Lluvias intensas: el 20 de octubre hubo las primeras inundaciones en la ciudad de Piura. Muchas ciudades del norte no tienen drenaje pluvial.',
		proximosMeses:
			'El ENFEN prevé lluvias por encima de lo normal y caudales altos en los ríos Tumbes, Chira, Piura, La Leche y Jequetepeque desde noviembre.',
		saludEsperada: ['dengue', 'leptospirosis', 'diarreas', 'infecciones de la piel'],
		fuentes: ['enfen18', 'inundacionesPiura', 'drenajeSunass'],
	},
	'costa-centro': {
		nombre: 'Costa central',
		peligro: 'lluvias',
		ahora: 'Mar más caliente de lo normal y lluvias por encima de lo normal previstas para la costa central.',
		proximosMeses: 'El ENFEN prevé caudales altos en los ríos Rímac y Chillón desde diciembre, con riesgo de huaicos en quebradas.',
		saludEsperada: ['dengue', 'diarreas', 'golpe de calor'],
		fuentes: ['enfen18'],
	},
	'costa-sur': {
		nombre: 'Costa sur',
		peligro: 'sequia',
		ahora: 'El comunicado del ENFEN no anuncia lluvias por encima de lo normal para la costa sur.',
		proximosMeses:
			'La sierra sur tiene riesgo de lluvias por debajo de lo normal: puede haber menos agua en los ríos que abastecen a la costa sur.',
		saludEsperada: ['diarreas por falta de agua segura'],
		fuentes: ['enfen18', 'cenepredDeficit'],
	},
	'sierra-norte': {
		nombre: 'Sierra norte',
		peligro: 'mixto',
		ahora: 'Senamhi reporta que todavía persisten condiciones secas en zonas de la sierra norte.',
		proximosMeses: 'El ENFEN prevé lluvias por encima de lo normal en la sierra norte occidental, con riesgo de huaicos y deslizamientos.',
		saludEsperada: ['diarreas', 'infecciones respiratorias'],
		fuentes: ['enfen18', 'senamhiSeco'],
	},
	'sierra-centro': {
		nombre: 'Sierra central',
		peligro: 'sequia',
		ahora: 'Déficit de lluvias: el Gobierno declaró en emergencia 707 distritos de 17 regiones por déficit hídrico (D. S. N.° 140-2026-PCM).',
		proximosMeses: 'Riesgo de sequía durante la temporada de lluvias y heladas en zonas altoandinas.',
		saludEsperada: ['neumonía por heladas', 'diarreas por falta de agua segura', 'desnutrición por pérdida de cosechas'],
		fuentes: ['emergenciaDeficit', 'cenepredDeficit', 'heladas'],
	},
	'sierra-sur': {
		nombre: 'Sierra sur',
		peligro: 'sequia',
		ahora:
			'Puno, Cusco y Apurímac concentran la mayor cantidad de distritos en riesgo muy alto por déficit hídrico, según Cenepred.',
		proximosMeses: 'Senamhi Puno estima que las lluvias podrían reducirse cerca de la mitad entre enero y marzo de 2027.',
		saludEsperada: ['neumonía por heladas', 'diarreas por falta de agua segura', 'desnutrición y anemia por pérdida de cosechas'],
		fuentes: ['cenepredDeficit', 'punoLluvias', 'heladas'],
	},
	'selva-norte': {
		nombre: 'Selva norte',
		peligro: 'sequia',
		ahora: 'Senamhi reporta que persisten condiciones secas en la selva: ríos bajos, dificultades para el transporte fluvial y para el agua.',
		proximosMeses: 'Si las lluvias siguen por debajo de lo normal, el agua segura será el principal riesgo; con lluvias, subirán el dengue y la malaria.',
		saludEsperada: ['malaria', 'dengue', 'leptospirosis', 'diarreas'],
		fuentes: ['senamhiSeco'],
	},
	'selva-centro-sur': {
		nombre: 'Selva central y sur',
		peligro: 'sequia',
		ahora: 'Senamhi reporta que persisten condiciones secas en la selva: ríos bajos y menos agua disponible.',
		proximosMeses: 'Riesgo de déficit hídrico durante la temporada de lluvias en zonas de la selva central y sur, según Cenepred.',
		saludEsperada: ['leishmaniasis', 'dengue', 'diarreas'],
		fuentes: ['senamhiSeco', 'cenepredDeficit'],
	},
};

// ------------------------------------------------------------------ regiones

export type IdRegion =
	| 'amazonas'
	| 'ancash'
	| 'apurimac'
	| 'arequipa'
	| 'ayacucho'
	| 'cajamarca'
	| 'callao'
	| 'cusco'
	| 'huancavelica'
	| 'huanuco'
	| 'ica'
	| 'junin'
	| 'la-libertad'
	| 'lambayeque'
	| 'lima'
	| 'loreto'
	| 'madre-de-dios'
	| 'moquegua'
	| 'pasco'
	| 'piura'
	| 'puno'
	| 'san-martin'
	| 'tacna'
	| 'tumbes'
	| 'ucayali';

/** Casos acumulados 2026 hasta la SE 38 e incidencia por 100 mil habitantes (CDC-Minsa). */
export interface Dato {
	casos: number;
	tia: number;
	muertes?: number;
}

export interface Region {
	id: IdRegion;
	nombre: string;
	capital: string;
	zonas: Zona[];
	datos: Partial<Record<'dengue' | 'leptospirosis' | 'malaria' | 'leishmaniasis' | 'chagas' | 'carrion', Dato>>;
	/** Antecedentes de enfermedades raras sin casos recientes (texto basado en la sala oficial). */
	antecedentes?: Partial<Record<'peste' | 'rabia' | 'carrion', string>>;
}

const d = (casos: number, tia: number, muertes?: number): Dato => ({ casos, tia, ...(muertes !== undefined ? { muertes } : {}) });

// Transcripción de las tablas oficiales (SE 38-2026): dengue (casos, TIA, fallecidos), leptospirosis
// (casos, TIA, defunciones), malaria (casos, TIA), leishmaniasis (casos, TIA), Chagas (casos, TIA),
// Carrión (casos 2026). Revisar contra los PDF de FUENTES antes de cada publicación.
export const REGIONES: Region[] = [
	{
		id: 'amazonas',
		nombre: 'Amazonas',
		capital: 'Chachapoyas',
		zonas: ['selva-norte', 'sierra-norte'],
		datos: { dengue: d(2794, 638.68, 3), leptospirosis: d(345, 78.86, 1), malaria: d(11, 2.51), leishmaniasis: d(90, 20.57) },
		antecedentes: {
			rabia: 'El último caso de rabia humana en el Perú se notificó en Amazonas en 2024 (transmisión silvestre).',
			carrion: 'Casos de Carrión notificados en 2021, 2022 y 2024.',
		},
	},
	{
		id: 'ancash',
		nombre: 'Áncash',
		capital: 'Huaraz',
		zonas: ['costa-centro', 'sierra-centro'],
		datos: { dengue: d(662, 55.1), leptospirosis: d(33, 2.75, 2), leishmaniasis: d(123, 10.24) },
		antecedentes: { carrion: 'Zona con casos de Carrión: 14 casos entre 2021 y 2024.' },
	},
	{
		id: 'apurimac',
		nombre: 'Apurímac',
		capital: 'Abancay',
		zonas: ['sierra-sur'],
		datos: { dengue: d(10, 2.38), leptospirosis: d(29, 6.91, 1), leishmaniasis: d(19, 4.53) },
	},
	{
		id: 'arequipa',
		nombre: 'Arequipa',
		capital: 'Arequipa',
		zonas: ['costa-sur', 'sierra-sur'],
		datos: { dengue: d(3, 0.18), leptospirosis: d(4, 0.24), leishmaniasis: d(2, 0.12), chagas: d(15, 0.94) },
		antecedentes: {
			rabia: 'Única región con rabia canina reciente: los 8 casos en perros de 2024 a 2026 fueron en Arequipa.',
			carrion: '3 casos de Carrión notificados en 2025.',
		},
	},
	{
		id: 'ayacucho',
		nombre: 'Ayacucho',
		capital: 'Ayacucho',
		zonas: ['sierra-sur', 'selva-centro-sur'],
		datos: { dengue: d(75, 11.28), leptospirosis: d(669, 100.63, 1), malaria: d(1, 0.15), leishmaniasis: d(104, 15.64), chagas: d(9, 1.36) },
	},
	{
		id: 'cajamarca',
		nombre: 'Cajamarca',
		capital: 'Cajamarca',
		zonas: ['sierra-norte'],
		datos: { dengue: d(593, 41.05), leptospirosis: d(285, 19.73, 3), leishmaniasis: d(214, 14.81), chagas: d(1, 0.07) },
		antecedentes: {
			peste: 'Zona histórica de peste: concentró el 72 % de los casos del país entre 2000 y 2024. Sin casos desde 2018.',
			carrion: 'Zona con casos de Carrión: 13 casos entre 2021 y 2025.',
		},
	},
	{
		id: 'callao',
		nombre: 'Callao',
		capital: 'Callao',
		zonas: ['costa-centro'],
		datos: { dengue: d(342, 27.6), leptospirosis: d(31, 2.5) },
	},
	{
		id: 'cusco',
		nombre: 'Cusco',
		capital: 'Cusco',
		zonas: ['sierra-sur', 'selva-centro-sur'],
		datos: { dengue: d(445, 31.77, 1), leptospirosis: d(193, 13.78, 1), malaria: d(1, 0.07), leishmaniasis: d(281, 20.06), chagas: d(1, 0.07), carrion: d(1, 0) },
	},
	{
		id: 'huancavelica',
		nombre: 'Huancavelica',
		capital: 'Huancavelica',
		zonas: ['sierra-centro'],
		datos: { leptospirosis: d(8, 2.51) },
	},
	{
		id: 'huanuco',
		nombre: 'Huánuco',
		capital: 'Huánuco',
		zonas: ['sierra-centro', 'selva-centro-sur'],
		datos: { dengue: d(818, 110.78), leptospirosis: d(175, 23.7, 1), leishmaniasis: d(133, 18.01), chagas: d(2, 0.27), carrion: d(1, 0) },
	},
	{
		id: 'ica',
		nombre: 'Ica',
		capital: 'Ica',
		zonas: ['costa-centro'],
		datos: { dengue: d(574, 52.49), leptospirosis: d(66, 6.04, 2), leishmaniasis: d(1, 0.09), chagas: d(2, 0.19) },
	},
	{
		id: 'junin',
		nombre: 'Junín',
		capital: 'Huancayo',
		zonas: ['sierra-centro', 'selva-centro-sur'],
		datos: { dengue: d(1681, 122.17, 2), leptospirosis: d(110, 7.99, 1), malaria: d(235, 17.08), leishmaniasis: d(229, 16.64) },
	},
	{
		id: 'la-libertad',
		nombre: 'La Libertad',
		capital: 'Trujillo',
		zonas: ['costa-norte', 'sierra-norte'],
		datos: { dengue: d(10454, 481.6, 3), leptospirosis: d(162, 7.46, 2), leishmaniasis: d(145, 6.68), chagas: d(2, 0.09), carrion: d(1, 0) },
		antecedentes: { peste: 'Zona histórica de peste (19 % de los casos del país entre 2000 y 2024). Sin casos desde 2018.' },
	},
	{
		id: 'lambayeque',
		nombre: 'Lambayeque',
		capital: 'Chiclayo',
		zonas: ['costa-norte'],
		datos: { dengue: d(7065, 510.61, 14), leptospirosis: d(722, 52.18, 2), leishmaniasis: d(8, 0.58), chagas: d(1, 0.07), carrion: d(1, 0) },
		antecedentes: { peste: 'Zona histórica de peste: el último caso confirmado del país fue en Lambayeque, en 2018.' },
	},
	{
		id: 'lima',
		nombre: 'Lima',
		capital: 'Lima',
		zonas: ['costa-centro', 'sierra-centro'],
		datos: { dengue: d(5794, 49.99, 3), leptospirosis: d(300, 2.59, 19), leishmaniasis: d(133, 1.15), chagas: d(1, 0.01), carrion: d(2, 0) },
		antecedentes: { carrion: 'En 2024 hubo un brote de Carrión con 205 casos en la sierra de Lima.' },
	},
	{
		id: 'loreto',
		nombre: 'Loreto',
		capital: 'Iquitos',
		zonas: ['selva-norte'],
		datos: { dengue: d(3021, 282.84, 5), leptospirosis: d(3238, 303.16, 0), malaria: d(17383, 1627.47, 1), leishmaniasis: d(146, 13.67), carrion: d(1, 0) },
		antecedentes: { rabia: 'Casos de rabia humana por mordedura de murciélago en 2019.' },
	},
	{
		id: 'madre-de-dios',
		nombre: 'Madre de Dios',
		capital: 'Puerto Maldonado',
		zonas: ['selva-centro-sur'],
		datos: { dengue: d(2913, 1368.41, 8), leptospirosis: d(774, 363.59, 5), malaria: d(5, 2.35), leishmaniasis: d(511, 240.05) },
	},
	{
		id: 'moquegua',
		nombre: 'Moquegua',
		capital: 'Moquegua',
		zonas: ['costa-sur', 'sierra-sur'],
		datos: { dengue: d(1, 0.49), leptospirosis: d(7, 3.41), leishmaniasis: d(1, 0.49) },
	},
	{
		id: 'pasco',
		nombre: 'Pasco',
		capital: 'Cerro de Pasco',
		zonas: ['sierra-centro', 'selva-centro-sur'],
		datos: { dengue: d(651, 246.46, 1), leptospirosis: d(32, 12.11), leishmaniasis: d(60, 22.71) },
	},
	{
		id: 'piura',
		nombre: 'Piura',
		capital: 'Piura',
		zonas: ['costa-norte', 'sierra-norte'],
		datos: { dengue: d(11701, 533.09, 7), leptospirosis: d(2670, 121.64, 10), leishmaniasis: d(182, 8.29), chagas: d(1, 0.05) },
		antecedentes: {
			peste: 'El Minsa incluye a Piura entre las cuatro zonas del país con antecedentes de peste. Sin casos desde 2018.',
			carrion: 'Casos de Carrión notificados en 2021, 2022, 2023 y 2025.',
		},
	},
	{
		id: 'puno',
		nombre: 'Puno',
		capital: 'Puno',
		zonas: ['sierra-sur', 'selva-centro-sur'],
		datos: { dengue: d(25, 2.08), leptospirosis: d(17, 1.41), malaria: d(1, 0.08), leishmaniasis: d(91, 7.57) },
		antecedentes: { rabia: 'Una de las dos regiones con casos de rabia humana por perros entre 2012 y 2025.' },
	},
	{
		id: 'san-martin',
		nombre: 'San Martín',
		capital: 'Moyobamba',
		zonas: ['selva-norte'],
		datos: { dengue: d(8201, 855.99, 19), leptospirosis: d(700, 73.06, 5), malaria: d(4, 0.42), leishmaniasis: d(124, 12.94), chagas: d(1, 0.11) },
	},
	{
		id: 'tacna',
		nombre: 'Tacna',
		capital: 'Tacna',
		zonas: ['costa-sur', 'sierra-sur'],
		datos: { leptospirosis: d(6, 1.48) },
	},
	{
		id: 'tumbes',
		nombre: 'Tumbes',
		capital: 'Tumbes',
		zonas: ['costa-norte'],
		datos: { dengue: d(2002, 596.96, 1), leptospirosis: d(956, 285.06, 4) },
	},
	{
		id: 'ucayali',
		nombre: 'Ucayali',
		capital: 'Pucallpa',
		zonas: ['selva-centro-sur'],
		datos: { dengue: d(3582, 542.62, 4), leptospirosis: d(738, 111.8, 5), malaria: d(5, 0.76), leishmaniasis: d(221, 33.48), chagas: d(18, 2.79) },
	},
];

// ------------------------------------------------------------------ nivel de riesgo (reglas explícitas)

export type Nivel = 'frecuente' | 'ocasional' | 'raro';

/**
 * Umbrales de incidencia acumulada 2026 (por 100 mil habitantes) para cada nivel.
 * Criterio del comité para orientar a la población, NO una clasificación oficial del Minsa.
 */
const UMBRALES: Record<'dengue' | 'leptospirosis' | 'malaria' | 'leishmaniasis' | 'chagas', { frecuente: number; ocasional: number }> = {
	dengue: { frecuente: 100, ocasional: 10 },
	leptospirosis: { frecuente: 50, ocasional: 5 },
	malaria: { frecuente: 100, ocasional: 5 },
	leishmaniasis: { frecuente: 20, ocasional: 5 },
	chagas: { frecuente: Number.POSITIVE_INFINITY, ocasional: 1 },
};

export interface RiesgoRegional {
	enfermedad: IdEnfermedad;
	nivel: Nivel;
	/** Frase con el dato oficial que justifica el nivel. */
	motivo: string;
}

/**
 * Norma RAE: los números de más de cuatro cifras se separan en grupos de tres con espacio
 * (duro, para que no se corten). Sin Intl: el resultado es igual en Node y en Hermes (app móvil).
 */
const formato = { format: (n: number) => (n >= 10_000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n)) };

export function riesgosDeRegion(r: Region): RiesgoRegional[] {
	const lista: RiesgoRegional[] = [];
	for (const [clave, umbral] of Object.entries(UMBRALES) as Array<[keyof typeof UMBRALES, (typeof UMBRALES)[keyof typeof UMBRALES]]>) {
		const dato = r.datos[clave];
		if (!dato || dato.casos === 0) continue;
		const nivel: Nivel = dato.tia >= umbral.frecuente ? 'frecuente' : dato.tia >= umbral.ocasional ? 'ocasional' : 'raro';
		const muertes = dato.muertes ? ` y ${dato.muertes} ${dato.muertes === 1 ? 'fallecido' : 'fallecidos'}` : '';
		lista.push({
			enfermedad: clave,
			nivel,
			motivo: `${formato.format(dato.casos)} ${dato.casos === 1 ? 'caso' : 'casos'}${muertes} en 2026 (hasta la SE 38).`,
		});
	}
	const carrion = r.datos.carrion;
	if (carrion?.casos || r.antecedentes?.carrion) {
		lista.push({
			enfermedad: 'carrion',
			nivel: 'raro',
			motivo: [carrion?.casos ? `${carrion.casos} ${carrion.casos === 1 ? 'caso' : 'casos'} en 2026.` : '', r.antecedentes?.carrion ?? ''].filter(Boolean).join(' '),
		});
	}
	if (r.antecedentes?.peste) lista.push({ enfermedad: 'peste', nivel: 'raro', motivo: r.antecedentes.peste });
	if (r.antecedentes?.rabia) lista.push({ enfermedad: 'rabia', nivel: 'raro', motivo: r.antecedentes.rabia });
	const orden: Record<Nivel, number> = { frecuente: 0, ocasional: 1, raro: 2 };
	return lista.sort((a, b) => orden[a.nivel] - orden[b.nivel]);
}

export const tieneSamu = (r: Region) => regionesSamu.includes(r.nombre);

export function regionPorId(id: string): Region | undefined {
	return REGIONES.find((r) => r.id === id);
}

/** Estado de validación del contenido regional (los textos de ENFERMEDADES y ZONAS). */
export const validacionRegional = {
	estado: 'borrador' as 'borrador' | 'validado',
	pendientes: [
		'Validar con el Director Médico los textos de "qué es" y "qué hacer" de cada enfermedad.',
		'Confirmar los umbrales de frecuente/ocasional/raro (criterio del comité, no oficial del Minsa).',
		'Las cifras son de la SE 38-2026: actualizarlas con la sala situacional vigente antes de publicar.',
		'Los datos de clima de prensa deben confirmarse con el documento oficial (Cenepred, Senamhi, D. S. N.° 140-2026-PCM).',
	],
};
