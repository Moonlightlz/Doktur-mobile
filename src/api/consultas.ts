import { useQuery } from '@tanstack/react-query';
import { api, exigir } from './cliente';

export const claves = {
	citas: ['citas'] as const,
	cita: (id: string) => ['citas', id] as const,
	atencion: (id: string) => ['citas', id, 'atencion'] as const,
	consentimientos: ['consentimientos'] as const,
	textos: ['consentimientos', 'textos'] as const,
	llamadas: ['llamadas'] as const,
	profesionales: ['profesionales'] as const,
	franjasDe: (id: string) => ['profesionales', id, 'franjas'] as const,
};

export const useCitas = () => useQuery({ queryKey: claves.citas, queryFn: () => exigir(api.GET('/v1/citas')) });
export const useCita = (id: string) =>
	useQuery({ queryKey: claves.cita(id), queryFn: () => exigir(api.GET('/v1/citas/{id}', { params: { path: { id } } })) });
export const useConsentimientos = () =>
	useQuery({ queryKey: claves.consentimientos, queryFn: () => exigir(api.GET('/v1/consentimientos')) });
export const useTextosConsentimiento = () =>
	useQuery({ queryKey: claves.textos, queryFn: () => exigir(api.GET('/v1/consentimientos/textos')), staleTime: Infinity });
export const useLlamadas = () =>
	useQuery({ queryKey: claves.llamadas, queryFn: () => exigir(api.GET('/v1/llamadas-urgentes')), refetchInterval: 30_000 });

export function vigentes(lista: Array<{ tipo: string; revocadoEn: string | null }> | undefined): Set<string> {
	return new Set((lista ?? []).filter((c) => c.revocadoEn === null).map((c) => c.tipo));
}
