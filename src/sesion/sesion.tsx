import { useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { alExpirarSesion, api, cargarToken, type Esquemas, exigir, guardarToken, ProblemaApi } from '../api/cliente';

export type Usuario = Esquemas['Usuario'];

interface EstadoSesion {
	cargando: boolean;
	usuario: Usuario | null;
	expirada: boolean;
	iniciarSesion: (datos: { identificador: string; contrasena: string }) => Promise<Usuario>;
	verificarTelefono: (datos: { telefono: string; codigo: string }) => Promise<Usuario>;
	cerrarSesion: () => Promise<void>;
	refrescar: () => Promise<void>;
}

const Contexto = createContext<EstadoSesion | null>(null);

export function ProveedorSesion({ children }: { children: ReactNode }) {
	const cliente = useQueryClient();
	const [cargando, setCargando] = useState(true);
	const [usuario, setUsuario] = useState<Usuario | null>(null);
	const [expirada, setExpirada] = useState(false);
	const conSesion = useRef(false);
	useEffect(() => {
		conSesion.current = usuario !== null;
	}, [usuario]);

	const limpiar = useCallback(async () => {
		await guardarToken(null);
		setUsuario(null);
		cliente.clear();
	}, [cliente]);

	const refrescar = useCallback(async () => {
		try {
			const yo = await exigir(api.GET('/v1/auth/yo'));
			setUsuario(yo.usuario);
		} catch (error) {
			if (error instanceof ProblemaApi && error.estado === 401) await limpiar();
			else throw error;
		}
	}, [limpiar]);

	useEffect(() => {
		(async () => {
			if (await cargarToken()) await refrescar().catch(() => {});
		})().finally(() => setCargando(false));
	}, [refrescar]);

	useEffect(
		() =>
			alExpirarSesion(() => {
				if (conSesion.current) setExpirada(true);
				void limpiar();
			}),
		[limpiar],
	);

	const valor = useMemo<EstadoSesion>(
		() => ({
			cargando,
			usuario,
			expirada,
			async iniciarSesion(datos) {
				const r = await exigir(api.POST('/v1/auth/sesiones', { body: { ...datos, cliente: 'movil' } }));
				if (!r.token) throw new ProblemaApi(500, 'sin_token', 'No se pudo iniciar la sesión.');
				cliente.clear();
				await guardarToken(r.token);
				setExpirada(false);
				setUsuario(r.usuario);
				return r.usuario;
			},
			async verificarTelefono(datos) {
				const r = await exigir(api.POST('/v1/auth/verificar-telefono', { body: { ...datos, cliente: 'movil' } }));
				if (!r.token) throw new ProblemaApi(500, 'sin_token', 'No se pudo iniciar la sesión.');
				cliente.clear();
				await guardarToken(r.token);
				setExpirada(false);
				setUsuario(r.usuario);
				return r.usuario;
			},
			async cerrarSesion() {
				try {
					await exigir(api.DELETE('/v1/auth/sesiones/actual'));
				} catch {
					// Aunque la API no responda, el token se borra del equipo.
				} finally {
					await limpiar();
				}
			},
			refrescar,
		}),
		[cargando, usuario, expirada, cliente, limpiar, refrescar],
	);

	return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSesion(): EstadoSesion {
	const c = useContext(Contexto);
	if (!c) throw new Error('useSesion fuera de ProveedorSesion');
	return c;
}

export function useUsuario(): Usuario {
	const { usuario } = useSesion();
	if (!usuario) throw new Error('Pantalla protegida sin usuario');
	return usuario;
}
