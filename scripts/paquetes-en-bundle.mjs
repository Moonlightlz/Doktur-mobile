// Lista cuántos archivos de ciertos paquetes entraron al bundle de la app (a partir del mapa de fuentes).
// Sirve para comprobar que las dependencias con avisos de seguridad aceptados (scripts/auditoria.mjs)
// son solo de herramientas y no viajan dentro de la app.
// Uso: npm run exportar:android -- --source-maps && node scripts/paquetes-en-bundle.mjs
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.argv[2] ?? 'dist-android/_expo/static/js/android');
const archivo = readdirSync(dir).find((f) => f.endsWith('.map'));
if (!archivo) {
	console.error(`No hay mapa de fuentes en ${dir}. Exporta con --source-maps.`);
	process.exit(1);
}
const mapa = JSON.parse(readFileSync(path.join(dir, archivo), 'utf8'));
const fuentes = mapa.sources.map((s) => s.split(path.win32.sep).join('/'));

const NO_DEBEN_ESTAR = ['node_modules/braces/', 'node_modules/node-forge/', 'node_modules/sprintf-js/', 'node_modules/uuid/', 'node_modules/decode-uri-component/'];
const REFERENCIA = ['parches/decode-uri-component', 'node_modules/livekit-client/', 'node_modules/@livekit/react-native/', 'node_modules/openapi-fetch/', 'node_modules/expo-secure-store/'];

let error = false;
for (const p of NO_DEBEN_ESTAR) {
	const n = fuentes.filter((s) => s.includes(p)).length;
	console.log(`${n === 0 ? 'ok ' : 'MAL'} ${p.padEnd(42)} ${n}`);
	if (n > 0) error = true;
}
for (const p of REFERENCIA) console.log(`    ${p.padEnd(42)} ${fuentes.filter((s) => s.includes(p)).length}`);
console.log(`Fuentes en el bundle: ${fuentes.length}`);
if (error) process.exit(1);
