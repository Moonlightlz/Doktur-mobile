// Falla si algún componente usa colores literales en lugar del tema (tokens de @doktur/tokens).
// Así, cambiar la paleta en Doktur-front/packages/tokens/tokens.json + `npm run sincronizar` basta.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRECTORIOS = ['app', 'src'];
// Archivos generados que SÍ contienen los colores (la fuente de los tokens).
const EXCLUIDOS = new Set([path.join('src', 'tema', 'tokens.ts')]);
const LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\bcolor:\s*['"](?!transparent)[a-z]+['"]/g;

const listar = (d) =>
	readdirSync(d).flatMap((n) => {
		const r = path.join(d, n);
		return statSync(r).isDirectory() ? listar(r) : [r];
	});

const hallazgos = [];
for (const dir of DIRECTORIOS) {
	for (const archivo of listar(path.join(raiz, dir)).filter((r) => /\.(tsx?|jsx?)$/.test(r))) {
		const relativo = path.relative(raiz, archivo);
		if (EXCLUIDOS.has(relativo)) continue;
		readFileSync(archivo, 'utf8')
			.split('\n')
			.forEach((linea, i) => {
				const sinComentario = linea.replace(/\/\/.*$/, '');
				if (LITERAL.test(sinComentario)) hallazgos.push(`${relativo}:${i + 1}: ${linea.trim()}`);
				LITERAL.lastIndex = 0;
			});
	}
}
if (hallazgos.length) {
	console.error(`Colores literales encontrados (usar useTema().color):\n${hallazgos.join('\n')}`);
	process.exit(1);
}
console.log('Sin colores literales: todos los colores provienen de los tokens.');
