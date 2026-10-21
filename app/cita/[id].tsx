import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { api, exigir, ProblemaApi } from '@/api/cliente';
import { claves, useCita } from '@/api/consultas';
import { Aviso, Boton, Cargando, ErrorApi, Insignia, Pantalla, Tarjeta, Texto, Titulo } from '@/ui';
import { DESENLACE, ESTADO_CITA, SERVICIO } from '@/utiles/etiquetas';
import { formatoFechaLarga, formatoHora } from '@/utiles/fechas';

export default function CitaPaciente() {
	const { id = '', reservada } = useLocalSearchParams<{ id: string; reservada?: string }>();
	const cita = useCita(id);
	const cliente = useQueryClient();
	const cancelar = useMutation({
		mutationFn: () => exigir(api.POST('/v1/citas/{id}/cancelar', { params: { path: { id } } })),
		onSuccess: () => cliente.invalidateQueries({ queryKey: claves.citas }),
	});

	if (cita.isPending) return <Pantalla><Cargando /></Pantalla>;
	if (cita.error) return <Pantalla><ErrorApi error={cita.error} /></Pantalla>;
	const c = cita.data;
	const e = ESTADO_CITA[c.estado];
	const futura = new Date(c.inicio).getTime() > Date.now();

	return (
		<Pantalla>
			<Titulo>{`${SERVICIO[c.servicio]}: ${formatoFechaLarga(c.inicio)}`}</Titulo>
			<Texto suave>{`${formatoHora(c.inicio)} a ${formatoHora(c.fin)} (hora de Perú)`}</Texto>
			<Insignia texto={e.texto} tono={e.tono} />
			{reservada === '1' && <Aviso tipo="exito">Tu cita quedó reservada.</Aviso>}
			<Tarjeta>
				<Texto>
					<Texto pesoTexto="seminegrita">Profesional: </Texto>
					{c.profesional.nombres} {c.profesional.apellidos} ({c.profesional.especialidad})
				</Texto>
				<Texto>
					<Texto pesoTexto="seminegrita">Modalidad: </Texto>
					{c.modalidad === 'audio' ? 'llamada de audio' : 'videollamada'}
				</Texto>
				{c.motivo && (
					<Texto>
						<Texto pesoTexto="seminegrita">Motivo: </Texto>
						{c.motivo}
					</Texto>
				)}
			</Tarjeta>
			<Tarjeta>
				{c.salaDisponible ? (
					<>
						<Texto>La sala está abierta. La consulta no se graba.</Texto>
						<Boton texto="Entrar a la consulta" onPress={() => router.push(`/sala/${c.id}`)} />
					</>
				) : (
					c.estado === 'programada' && <Texto suave>La sala se abre 15 minutos antes de la hora de tu cita.</Texto>
				)}
				<Boton texto="Tengo un signo de alarma" variante="emergencia" onPress={() => router.push({ pathname: '/signos', params: { cita: c.id } })} />
				{c.estado === 'programada' && futura && (
					<Boton
						texto="Cancelar la cita"
						variante="secundario"
						ocupado={cancelar.isPending}
						onPress={() =>
							Alert.alert('¿Cancelar la cita?', 'El horario quedará libre para otra persona.', [
								{ text: 'Volver', style: 'cancel' },
								{ text: 'Sí, cancelar', style: 'destructive', onPress: () => cancelar.mutate() },
							])
						}
					/>
				)}
				<ErrorApi error={cancelar.error} />
			</Tarjeta>
			{c.estado === 'finalizada' && <Indicaciones citaId={c.id} />}
		</Pantalla>
	);
}

function Indicaciones({ citaId }: { citaId: string }) {
	const atencion = useQuery({
		queryKey: claves.atencion(citaId),
		queryFn: () => exigir(api.GET('/v1/citas/{id}/atencion', { params: { path: { id: citaId } } })),
		retry: false,
	});
	if (atencion.isPending) return <Cargando />;
	if (atencion.error) {
		if (atencion.error instanceof ProblemaApi && atencion.error.estado === 404) {
			return <Texto suave>El profesional todavía no publica las indicaciones de esta atención.</Texto>;
		}
		return <ErrorApi error={atencion.error} />;
	}
	const a = atencion.data;
	return (
		<Tarjeta tipo={a.desenlace === 'derivacion_urgente' ? 'alerta' : 'normal'}>
			<Titulo nivel={2}>Indicaciones del profesional</Titulo>
			{a.desenlace && <Texto pesoTexto="seminegrita">Resultado: {DESENLACE[a.desenlace]}</Texto>}
			{a.desenlace === 'derivacion_urgente' && (
				<Aviso tipo="error" titulo="Debes acudir hoy a un establecimiento de salud">
					La IPRESS fue avisada y hará seguimiento. Si empeoras en el camino, llama al 106.
				</Aviso>
			)}
			<Texto>{a.indicaciones ?? 'Sin indicaciones escritas.'}</Texto>
		</Tarjeta>
	);
}
