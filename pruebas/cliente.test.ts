const mockAlmacen = new Map<string, { valor: string; opciones: unknown }>();
jest.mock('expo-secure-store', () => ({
	WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
	getItemAsync: jest.fn(async (k: string) => mockAlmacen.get(k)?.valor ?? null),
	setItemAsync: jest.fn(async (k: string, valor: string, opciones: unknown) => {
		mockAlmacen.set(k, { valor, opciones });
	}),
	deleteItemAsync: jest.fn(async (k: string) => {
		mockAlmacen.delete(k);
	}),
}));
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { extra: { apiUrl: 'https://api.prueba.test' } } } }));

import { alExpirarSesion, api, cargarToken, exigir, guardarToken, ProblemaApi } from '@/api/cliente';

function respuesta(estado: number, cuerpo: unknown, tipo = 'application/json') {
	return new Response(JSON.stringify(cuerpo), { status: estado, headers: { 'content-type': tipo } });
}

describe('cliente de la API (sesión móvil)', () => {
	let peticiones: Request[];
	beforeEach(async () => {
		peticiones = [];
		mockAlmacen.clear();
		await guardarToken(null);
		global.fetch = jest.fn(async (entrada: RequestInfo | URL) => {
			const r = entrada as Request;
			peticiones.push(r);
			return respuesta(200, { usuario: { id: 'x' } });
		}) as typeof fetch;
	});

	it('guarda el token solo en el mockAlmacenamiento seguro, sin copia a otros equipos', async () => {
		await guardarToken('token-de-prueba');
		expect(mockAlmacen.get('doktur.sesion')).toEqual({ valor: 'token-de-prueba', opciones: { keychainAccessible: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY' } });
		expect(await cargarToken()).toBe('token-de-prueba');
		await guardarToken(null);
		expect(mockAlmacen.has('doktur.sesion')).toBe(false);
	});

	it('envía el token como Bearer y no envía cookies', async () => {
		await guardarToken('token-de-prueba');
		await api.GET('/v1/auth/yo');
		expect(peticiones[0]!.url).toBe('https://api.prueba.test/v1/auth/yo');
		expect(peticiones[0]!.headers.get('authorization')).toBe('Bearer token-de-prueba');
		expect(peticiones[0]!.credentials).toBe('omit');
	});

	it('un 401 avisa que la sesión venció, salvo al iniciar sesión', async () => {
		const aviso = jest.fn();
		const quitar = alExpirarSesion(aviso);
		global.fetch = jest.fn(async () => respuesta(401, { title: 'Inicia sesión', codigo: 'no_autenticado' }, 'application/problem+json')) as typeof fetch;
		await api.GET('/v1/citas');
		expect(aviso).toHaveBeenCalledTimes(1);
		await api.POST('/v1/auth/sesiones', { body: { identificador: 'x', contrasena: 'y', cliente: 'movil' } });
		expect(aviso).toHaveBeenCalledTimes(1);
		quitar();
	});

	it('exigir convierte los errores RFC 9457 y la falta de conexión en ProblemaApi', async () => {
		global.fetch = jest.fn(async () =>
			respuesta(400, { title: 'Revisa los datos enviados.', codigo: 'datos_invalidos', campos: [{ campo: 'telefono', mensaje: 'Celular no válido' }] }, 'application/problem+json'),
		) as typeof fetch;
		const error = await exigir(api.GET('/v1/citas')).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ProblemaApi);
		expect(error).toMatchObject({ estado: 400, codigo: 'datos_invalidos', campos: [{ campo: 'telefono', mensaje: 'Celular no válido' }] });

		global.fetch = jest.fn(async () => {
			throw new TypeError('Network request failed');
		}) as typeof fetch;
		await expect(exigir(api.GET('/v1/citas'))).rejects.toMatchObject({ codigo: 'sin_conexion' });
	});
});
