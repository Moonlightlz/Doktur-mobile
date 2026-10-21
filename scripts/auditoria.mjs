// Auditoría de dependencias con excepciones explícitas.
// Falla ante cualquier aviso de seguridad que no esté en EXCEPCIONES, o si una excepción venció.
// Una excepción solo se admite si NO hay versión corregida publicada y el paquete no llega al
// bundle de la app (solo herramientas de compilación o pruebas). Revisar en cada vencimiento.
import { execSync } from 'node:child_process';

const EXCEPCIONES = {
	'GHSA-vfj7-8cjw-p6xm': {
		paquete: 'braces',
		motivo: 'Sin versión corregida (3.0.3 es la última). Solo en Metro/Jest (patrones de archivos del proyecto), no en la app.',
		vence: '2026-11-20',
	},
	'GHSA-86w9-cpqp-85rv': {
		paquete: 'node-forge',
		motivo: 'Sin versión corregida (1.4.0 es la última). Solo en @expo/cli (certificados de desarrollo y firma de actualizaciones, que no usamos).',
		vence: '2026-11-20',
	},
	'GHSA-hp3w-g68c-fv3c': {
		paquete: 'sprintf-js',
		motivo: 'Sin versión corregida (1.1.3 es la última). Solo en la cobertura de Jest (js-yaml → argparse).',
		vence: '2026-11-20',
	},
	'GHSA-w5hq-g745-h8pq': {
		paquete: 'uuid',
		motivo: 'uuid@7 de la herramienta xcode (prebuild de iOS); el fallo requiere pasar un buffer propio, que xcode no hace. Subir a 11 rompe su API.',
		vence: '2026-11-20',
	},
};

let salida;
try {
	salida = execSync('npm audit --json', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (error) {
	// npm audit termina con código 1 cuando hay avisos: el JSON igual está en stdout.
	salida = error.stdout;
}
const informe = JSON.parse(salida);
const hoy = new Date().toISOString().slice(0, 10);
const avisos = new Map();
for (const [paquete, v] of Object.entries(informe.vulnerabilities ?? {})) {
	for (const via of v.via.filter((x) => typeof x === 'object')) {
		avisos.set(via.url.split('/').pop(), { paquete, severidad: via.severity, titulo: via.title });
	}
}

const errores = [];
for (const [id, a] of avisos) {
	const e = EXCEPCIONES[id];
	if (!e) errores.push(`${id} (${a.paquete}, ${a.severidad}): ${a.titulo}`);
	else if (e.vence < hoy) errores.push(`La excepción ${id} (${e.paquete}) venció el ${e.vence}: revísala.`);
}
for (const [id, e] of Object.entries(EXCEPCIONES)) {
	if (!avisos.has(id)) console.log(`Excepción ${id} (${e.paquete}) ya no hace falta: quítala.`);
}

if (errores.length) {
	console.error(`Avisos de seguridad sin excepción aprobada:\n- ${errores.join('\n- ')}`);
	process.exit(1);
}
console.log(`Auditoría: ${avisos.size} avisos, todos con excepción vigente y justificada.`);
