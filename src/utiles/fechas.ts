/** Horas en hora de Perú (UTC−5, sin horario de verano). Solo Intl.DateTimeFormat (Hermes lo soporta). */
const ZONA = 'America/Lima';
const fechaLarga = new Intl.DateTimeFormat('es-PE', { timeZone: ZONA, weekday: 'long', day: 'numeric', month: 'long' });
const hora = new Intl.DateTimeFormat('es-PE', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hour12: false });
const fechaHora = new Intl.DateTimeFormat('es-PE', {
	timeZone: ZONA,
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
});
const claveDia = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' });
const fechaCompleta = new Intl.DateTimeFormat('es-PE', { timeZone: ZONA, day: 'numeric', month: 'long', year: 'numeric' });

/** Fecha de un contenido ("2026-10-21" → "21 de octubre de 2026"). Se fija al mediodía de Lima. */
export const formatoDia = (aaaaMmDd: string) => fechaCompleta.format(new Date(`${aaaaMmDd}T12:00:00-05:00`));

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export const formatoFechaLarga = (iso: string) => mayuscula(fechaLarga.format(new Date(iso)));
export const formatoHora = (iso: string) => hora.format(new Date(iso));
export const formatoFechaHora = (iso: string) => fechaHora.format(new Date(iso));
export const diaDe = (iso: string) => claveDia.format(new Date(iso));

/** "hace 5 minutos", "en 2 horas" (sin Intl.RelativeTimeFormat, que Hermes no garantiza). */
export function relativo(iso: string, ahora = Date.now()): string {
	const minutos = Math.round((new Date(iso).getTime() - ahora) / 60_000);
	const abs = Math.abs(minutos);
	const [n, unidad] = abs < 60 ? [abs, abs === 1 ? 'minuto' : 'minutos'] : [Math.round(abs / 60), Math.round(abs / 60) === 1 ? 'hora' : 'horas'];
	if (abs === 0) return 'ahora';
	return minutos < 0 ? `hace ${n} ${unidad}` : `en ${n} ${unidad}`;
}

const ANTES_MS = 15 * 60_000;
const DESPUES_MS = 30 * 60_000;

/** Misma regla que la API (que es la que decide): la sala abre 15 min antes y cierra 30 min después. */
export function salaAbierta(c: { inicio: string; fin: string; estado: string }, ahora = Date.now()): boolean {
	return (
		['programada', 'en_curso'].includes(c.estado) &&
		ahora >= new Date(c.inicio).getTime() - ANTES_MS &&
		ahora <= new Date(c.fin).getTime() + DESPUES_MS
	);
}
