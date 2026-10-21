import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { api, exigir } from '@/api/cliente';
import { claves } from '@/api/consultas';
import { linea113, numerosPrincipales } from '@/contenido/emergencias';
import { Aviso, Boton, BotonLlamar, Cabecera, Cargando, ErrorApi, Opcion, Pantalla, Pila, Tarjeta, Texto, TextoCabecera, Titulo } from '@/ui';
import { formatoHora } from '@/utiles/fechas';

const GRUPOS: Record<string, string> = {
	general: 'Cualquier persona',
	dengue: 'Fiebre o sospecha de dengue',
	diarrea: 'Diarrea o vómitos',
	ninos: 'Niñas y niños',
	salud_mental: 'Salud mental',
};

/** Signos de alarma (D-016): no es un diagnóstico; cualquier signo marcado ofrece contacto humano. */
export default function Signos() {
	const { cita } = useLocalSearchParams<{ cita?: string }>();
	const cliente = useQueryClient();
	const lista = useQuery({ queryKey: ['triaje', 'lista'], queryFn: () => exigir(api.GET('/v1/triaje/lista')), staleTime: Infinity });
	const [marcados, setMarcados] = useState<Record<string, boolean>>({});
	const evaluar = useMutation({
		mutationFn: () => exigir(api.POST('/v1/triaje/evaluar', { body: { respuestas: marcados, ...(cita ? { citaId: cita } : {}) } })),
	});
	const llamada = useMutation({
		mutationFn: () => exigir(api.POST('/v1/llamadas-urgentes')),
		onSuccess: () => cliente.invalidateQueries({ queryKey: claves.llamadas }),
	});

	const cabecera = (
		<Cabecera antetitulo="Esto no es un diagnóstico" titulo="Signos de alarma">
			<TextoCabecera>Marca lo que tú o la persona que cuidas tiene AHORA.</TextoCabecera>
		</Cabecera>
	);
	if (lista.isPending) return <Pantalla cabecera={cabecera}><Cargando /></Pantalla>;
	if (lista.error) {
		// Aunque falle la API, la ruta humana se muestra igual.
		return (
			<Pantalla cabecera={cabecera}>
				<ErrorApi error={lista.error} />
				<NumerosDeEmergencia />
			</Pantalla>
		);
	}
	const grupos = [...new Set(lista.data.preguntas.map((p) => p.grupo))];
	const resultado = evaluar.data;

	return (
		<Pantalla cabecera={cabecera}>
			{!lista.data.validada && <Aviso tipo="aviso">Lista en borrador: está pendiente de validación médica antes del piloto.</Aviso>}

			{resultado ? (
				resultado.hayAlarma && resultado.acciones ? (
					<Tarjeta tipo="alerta">
						<Titulo nivel={2}>Busca atención ahora</Titulo>
						<Texto>{resultado.acciones.mensaje}</Texto>
						<NumerosDeEmergencia />
						{resultado.acciones.puedeSolicitarLlamada &&
							(llamada.data ? (
								<Aviso tipo="exito" titulo="Pedido recibido">
									{`La IPRESS te llamará antes de las ${formatoHora(llamada.data.plazoHasta)}. Ten tu celular a la mano. No esperes la llamada si empeoras: llama al 106.`}
								</Aviso>
							) : (
								<Pila>
									<Texto>Si no puedes llamar o no sabes qué hacer, pide que la IPRESS te llame.</Texto>
									<Boton texto="Pedir que me llamen" icono="telefonoLlamada" variante="secundario" ocupado={llamada.isPending} onPress={() => llamada.mutate()} />
								</Pila>
							))}
						<ErrorApi error={llamada.error} />
					</Tarjeta>
				) : (
					<Tarjeta>
						<Titulo nivel={2}>No marcaste signos de alarma</Titulo>
						<Texto>Si aparece alguno o te sientes peor, vuelve aquí o llama al 106.</Texto>
						<Boton texto="Reservar una cita" icono="citaNueva" onPress={() => router.push('/reservar')} />
						<Boton texto="Revisar otra vez" variante="secundario" onPress={() => evaluar.reset()} />
					</Tarjeta>
				)
			) : (
				<Pila>
					{grupos.map((g) => (
						<Tarjeta key={g}>
							<Titulo nivel={3}>{GRUPOS[g] ?? g}</Titulo>
							{lista.data.preguntas
								.filter((p) => p.grupo === g)
								.map((p) => (
									<Opcion key={p.id} alarma marcada={!!marcados[p.id]} titulo={p.texto} alPresionar={() => setMarcados({ ...marcados, [p.id]: !marcados[p.id] })} />
								))}
						</Tarjeta>
					))}
					<ErrorApi error={evaluar.error} />
					<Boton texto="Ver qué hacer" icono="lista" ocupado={evaluar.isPending} onPress={() => evaluar.mutate()} />
					<Texto variante="sm" suave>
						Si no puedes esperar, no completes esta lista: llama al 106 o acude al establecimiento de salud más cercano.
					</Texto>
				</Pila>
			)}
		</Pantalla>
	);
}

function NumerosDeEmergencia() {
	const samu = numerosPrincipales.find((n) => n.numero === '106');
	return (
		<Pila separacion={8}>
			{samu && <BotonLlamar numero={samu.numero} texto={`Llamar al ${samu.numero} (${samu.nombre})`} />}
			<BotonLlamar numero={linea113.numero} texto={`Línea ${linea113.numero} Salud`} variante="secundario" />
			{samu?.cobertura && <Texto variante="sm">{`${samu.cobertura} Donde no haya SAMU, acude al establecimiento de salud más cercano.`}</Texto>}
		</Pila>
	);
}
