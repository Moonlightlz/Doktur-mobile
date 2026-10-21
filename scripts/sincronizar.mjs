// Trae de los otros repositorios lo que la app comparte con la web:
//  - tokens de diseño (colores, espacios) desde Doktur-front/packages/tokens/dist/tokens.ts
//  - números de emergencia, salud por región, escenarios de El Niño y establecimientos (Renipress) desde Doktur-front/packages/contenido
//  - tipos de la API desde Doktur-back/openapi.json (con la herramienta de Doktur-front)
// Uso: npm run sincronizar   (con Doktur-front y Doktur-back en carpetas hermanas)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const front = path.resolve(process.env.DOKTUR_FRONT_DIR ?? path.join(raiz, '..', 'Doktur-front'));
const back = path.resolve(process.env.DOKTUR_BACK_DIR ?? path.join(raiz, '..', 'Doktur-back'));

function copiar(origen, destino, cabecera) {
	if (!existsSync(origen)) throw new Error(`No existe ${origen}`);
	mkdirSync(path.dirname(destino), { recursive: true });
	const contenido = readFileSync(origen, 'utf8');
	writeFileSync(destino, `${cabecera}\n${contenido}`);
	console.log(`✓ ${path.relative(raiz, destino)}`);
}

copiar(
	path.join(front, 'packages/tokens/dist/tokens.ts'),
	path.join(raiz, 'src/tema/tokens.ts'),
	'// Copiado por scripts/sincronizar.mjs desde Doktur-front. NO EDITAR: cambia packages/tokens/tokens.json allá.',
);
// app.config.ts se carga con require() de Node: lee los colores de la versión JSON.
mkdirSync(path.join(raiz, 'src/tema'), { recursive: true });
writeFileSync(path.join(raiz, 'src/tema/tokens.json'), readFileSync(path.join(front, 'packages/tokens/dist/tokens.json'), 'utf8'));
console.log(`✓ ${path.join('src', 'tema', 'tokens.json')}`);
// regiones.ts importa './emergencias', pronostico.ts y establecimientos.ts importan './regiones': se copian juntos.
for (const archivo of ['emergencias.ts', 'regiones.ts', 'pronostico.ts', 'establecimientos.ts', 'establecimientos-datos.ts']) {
	copiar(
		path.join(front, 'packages/contenido', archivo),
		path.join(raiz, 'src/contenido', archivo),
		'// Copiado por scripts/sincronizar.mjs desde Doktur-front/packages/contenido. NO EDITAR aquí.',
	);
}

const generador = path.join(front, 'herramientas/openapi/generar-tipos.mjs');
mkdirSync(path.join(raiz, 'src/api'), { recursive: true });
execFileSync(process.execPath, [generador, path.join(back, 'openapi.json'), path.join(raiz, 'src/api/esquema.d.ts')], { stdio: 'inherit' });
console.log('Sincronización completa. Revisa el diff antes de versionar.');
