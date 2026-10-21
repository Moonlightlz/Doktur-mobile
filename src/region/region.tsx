import * as SecureStore from 'expo-secure-store';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { type IdRegion, type Region, regionPorId } from '../contenido/regiones';

/**
 * Región elegida por la persona para personalizar la información.
 * Se guarda SOLO en este teléfono: no se envía a la API ni se asocia a la cuenta (minimización de datos).
 * Funciona también sin sesión iniciada.
 */
const CLAVE = 'doktur.region';
const OPCIONES: SecureStore.SecureStoreOptions = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

interface ContextoRegion {
	region: Region | null;
	cargando: boolean;
	elegir: (id: IdRegion) => Promise<void>;
	olvidar: () => Promise<void>;
}

const Contexto = createContext<ContextoRegion | null>(null);

export function ProveedorRegion({ children }: { children: ReactNode }) {
	const [region, setRegion] = useState<Region | null>(null);
	const [cargando, setCargando] = useState(true);

	useEffect(() => {
		let vigente = true;
		SecureStore.getItemAsync(CLAVE, OPCIONES)
			.then((id) => {
				// Un id que ya no existe (contenido actualizado) se ignora.
				if (vigente) setRegion(id ? (regionPorId(id) ?? null) : null);
			})
			.catch(() => undefined)
			.finally(() => {
				if (vigente) setCargando(false);
			});
		return () => {
			vigente = false;
		};
	}, []);

	const elegir = useCallback(async (id: IdRegion) => {
		setRegion(regionPorId(id) ?? null);
		await SecureStore.setItemAsync(CLAVE, id, OPCIONES);
	}, []);

	const olvidar = useCallback(async () => {
		setRegion(null);
		await SecureStore.deleteItemAsync(CLAVE, OPCIONES);
	}, []);

	const valor = useMemo(() => ({ region, cargando, elegir, olvidar }), [region, cargando, elegir, olvidar]);
	return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useRegion(): ContextoRegion {
	const c = useContext(Contexto);
	if (!c) throw new Error('useRegion fuera de ProveedorRegion');
	return c;
}
