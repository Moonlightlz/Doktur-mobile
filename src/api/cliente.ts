import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import createClient, { type Middleware } from 'openapi-fetch';
import type { components, paths } from './esquema';

export type Esquemas = components['schemas'];

/**
 * Cliente de la API, tipado desde el contrato OpenAPI (Doktur-back/openapi.json).
 *
 * La app usa sesión "movil": un token opaco que se envía como Bearer. Se guarda SOLO en el
 * almacenamiento seguro del sistema (Keychain en iOS, Keystore en Android), accesible solo con el
 * equipo desbloqueado y sin copia a otros equipos. Nunca en AsyncStorage ni en logs.
 */
const CLAVE_TOKEN = 'doktur.sesion';
const OPCIONES_ALMACEN: SecureStore.SecureStoreOptions = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export const URL_API: string = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ?? 'http://10.0.2.2:3180';

let token: string | null = null;
const alExpirar = new Set<() => void>();

export async function cargarToken(): Promise<string | null> {
	token = await SecureStore.getItemAsync(CLAVE_TOKEN, OPCIONES_ALMACEN);
	return token;
}

export async function guardarToken(nuevo: string | null): Promise<void> {
	token = nuevo;
	if (nuevo) await SecureStore.setItemAsync(CLAVE_TOKEN, nuevo, OPCIONES_ALMACEN);
	else await SecureStore.deleteItemAsync(CLAVE_TOKEN, OPCIONES_ALMACEN);
}

/** Se llama cuando la API responde 401 (sesión vencida o revocada). */
export function alExpirarSesion(fn: () => void): () => void {
	alExpirar.add(fn);
	return () => {
		alExpirar.delete(fn);
	};
}

const RUTAS_DE_INGRESO = ['/v1/auth/sesiones', '/v1/auth/verificar-telefono', '/v1/auth/registro'];

export const middlewareSesion: Middleware = {
	onRequest({ request }) {
		if (token) request.headers.set('Authorization', `Bearer ${token}`);
		return request;
	},
	onResponse({ request, response }) {
		const ruta = new URL(request.url).pathname;
		if (response.status === 401 && !RUTAS_DE_INGRESO.some((r) => ruta.endsWith(r))) {
			for (const fn of alExpirar) fn();
		}
		// Solo observa: no devuelve nada para no reemplazar la respuesta.
	},
};

// Sin cookies: la sesión móvil es solo el token Bearer (la API rechaza mezclar ambos tipos).
// `fetch` se resuelve en cada llamada (permite interceptarlo en pruebas; en la app es el mismo).
export const api = createClient<paths>({ baseUrl: URL_API, credentials: 'omit', fetch: (peticion) => globalThis.fetch(peticion) });
api.use(middlewareSesion);

/** Error de la API en formato RFC 9457, con el código estable que define el backend. */
export class ProblemaApi extends Error {
	constructor(
		readonly estado: number,
		readonly codigo: string,
		readonly titulo: string,
		readonly campos: Array<{ campo: string; mensaje: string }> = [],
	) {
		super(titulo);
	}
}

interface Problema {
	title?: string;
	codigo?: string;
	campos?: Array<{ campo: string; mensaje: string }>;
}

/** Devuelve los datos o lanza ProblemaApi (también si no hay conexión). */
export async function exigir<T>(peticion: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
	let r: { data?: T; error?: unknown; response: Response };
	try {
		r = await peticion;
	} catch {
		throw new ProblemaApi(0, 'sin_conexion', 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.');
	}
	if (r.error !== undefined || !r.response.ok) {
		const p = (typeof r.error === 'object' && r.error !== null ? r.error : {}) as Problema;
		throw new ProblemaApi(r.response.status, p.codigo ?? 'error', p.title ?? 'Ocurrió un error. Inténtalo de nuevo.', p.campos ?? []);
	}
	return r.data as T;
}
