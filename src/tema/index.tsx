import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { tokens } from './tokens';

/**
 * Tema de la app a partir de @doktur/tokens. Para cambiar la paleta, edita
 * Doktur-front/packages/tokens/tokens.json y ejecuta `npm run sincronizar`: ningún componente usa
 * colores literales (scripts/sin-colores-literales.mjs lo verifica).
 */
const BASE_PX = 16;

/** Los tokens son literales (`as const`); los temas claro y oscuro comparten esta forma. */
type Ensanchar<T> = { [K in keyof T]: T[K] extends string ? string : Ensanchar<T[K]> };
export type Colores = Ensanchar<typeof tokens.temas.claro>;

/** "1.25rem" → 20, "44px" → 44, "0" → 0. */
export function aPixeles(valor: string): number {
	const n = Number.parseFloat(valor);
	if (Number.isNaN(n)) throw new Error(`Valor de token no numérico: ${valor}`);
	return valor.endsWith('rem') ? n * BASE_PX : n;
}

const mapear = <T extends Record<string, string>>(o: T) =>
	Object.fromEntries(Object.entries(o).map(([k, v]) => [k, aPixeles(v)])) as { [K in keyof T]: number };

export const espacio = mapear(tokens.espacio);
export const radio = mapear(tokens.radio);
export const tamano = mapear(tokens.tipografia.tamano);
export const peso = tokens.tipografia.peso;
export const objetivoTactil = mapear(tokens.objetivoTactil);
export const interlineado = { base: Number(tokens.tipografia.interlineado.base), ajustado: Number(tokens.tipografia.interlineado.ajustado) };

export type PreferenciaTema = 'sistema' | 'claro' | 'oscuro';

interface ContextoTema {
	color: Colores;
	oscuro: boolean;
	preferencia: PreferenciaTema;
	setPreferencia: (p: PreferenciaTema) => void;
}

const Contexto = createContext<ContextoTema | null>(null);

export function ProveedorTema({ children }: { children: ReactNode }) {
	const sistema = useColorScheme();
	const [preferencia, setPreferencia] = useState<PreferenciaTema>('sistema');
	const oscuro = preferencia === 'oscuro' || (preferencia === 'sistema' && sistema === 'dark');
	const valor = useMemo<ContextoTema>(
		() => ({ color: (oscuro ? tokens.temas.oscuro : tokens.temas.claro) as Colores, oscuro, preferencia, setPreferencia }),
		[oscuro, preferencia],
	);
	return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useTema(): ContextoTema {
	const c = useContext(Contexto);
	if (!c) throw new Error('useTema fuera de ProveedorTema');
	return c;
}
