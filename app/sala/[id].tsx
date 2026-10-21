import { AudioSession, VideoTrack } from '@livekit/react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { ConnectionQuality, type Participant, Room, RoomEvent, Track, VideoPresets } from 'livekit-client';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { api, exigir, ProblemaApi } from '@/api/cliente';
import { useCita } from '@/api/consultas';
import { espacio, radio, tamano, useTema } from '@/tema';
import { Aviso, Boton, Cargando, ErrorApi, Pantalla, Pila, Tarjeta, Texto, Titulo } from '@/ui';
import { formatoFechaLarga, formatoHora } from '@/utiles/fechas';

type Estado = 'previa' | 'conectando' | 'en_llamada' | 'reconectando' | 'terminada';

const TEXTO_CALIDAD: Record<ConnectionQuality, string> = {
	[ConnectionQuality.Excellent]: 'muy buena',
	[ConnectionQuality.Good]: 'buena',
	[ConnectionQuality.Poor]: 'débil',
	[ConnectionQuality.Lost]: 'perdida',
	[ConnectionQuality.Unknown]: 'midiendo…',
};

/**
 * Sala de la consulta. Audio primero (D-005): la cámara empieza apagada. No se graba. El medio
 * viaja cifrado entre el teléfono y el servidor de medios; NO es cifrado de extremo a extremo.
 */
export default function Sala() {
	useKeepAwake();
	const { id = '' } = useLocalSearchParams<{ id: string }>();
	const cita = useCita(id);
	const { color } = useTema();
	const sala = useRef<Room | null>(null);
	const [estado, setEstado] = useState<Estado>('previa');
	const [error, setError] = useState<unknown>(null);
	const [microfono, setMicrofono] = useState(true);
	const [camara, setCamara] = useState(false);
	const [calidad, setCalidad] = useState<ConnectionQuality>(ConnectionQuality.Unknown);
	const [, refrescar] = useReducer((n: number) => n + 1, 0);

	useEffect(
		() => () => {
			void sala.current?.disconnect();
			void AudioSession.stopAudioSession();
		},
		[],
	);

	async function entrar() {
		setError(null);
		setEstado('conectando');
		try {
			const { url, token } = await exigir(api.POST('/v1/citas/{id}/token-video', { params: { path: { id } } }));
			await AudioSession.startAudioSession();
			const room = new Room({
				adaptiveStream: true,
				dynacast: true,
				videoCaptureDefaults: { resolution: VideoPresets.h360.resolution },
				publishDefaults: { simulcast: true, videoSimulcastLayers: [VideoPresets.h180] },
			});
			sala.current = room;
			room
				.on(RoomEvent.ParticipantConnected, refrescar)
				.on(RoomEvent.ParticipantDisconnected, refrescar)
				.on(RoomEvent.TrackSubscribed, refrescar)
				.on(RoomEvent.TrackUnsubscribed, refrescar)
				.on(RoomEvent.TrackMuted, refrescar)
				.on(RoomEvent.TrackUnmuted, refrescar)
				.on(RoomEvent.LocalTrackPublished, refrescar)
				.on(RoomEvent.LocalTrackUnpublished, refrescar)
				.on(RoomEvent.ActiveSpeakersChanged, refrescar)
				.on(RoomEvent.ConnectionQualityChanged, (q, p) => {
					if (p.isLocal) setCalidad(q);
				})
				.on(RoomEvent.Reconnecting, () => setEstado('reconectando'))
				.on(RoomEvent.Reconnected, () => setEstado('en_llamada'))
				.on(RoomEvent.Disconnected, () => setEstado('terminada'));
			await room.connect(url, token);
			setEstado('en_llamada');
			try {
				await room.localParticipant.setMicrophoneEnabled(true);
			} catch {
				setMicrofono(false);
				setError(new ProblemaApi(0, 'sin_microfono', 'No pudimos usar tu micrófono. Revisa el permiso en Ajustes; igual puedes escuchar.'));
			}
			refrescar();
		} catch (e) {
			await sala.current?.disconnect();
			sala.current = null;
			await AudioSession.stopAudioSession();
			setEstado('previa');
			setError(
				e instanceof ProblemaApi
					? e
					: new ProblemaApi(0, 'sin_conexion_medios', 'No pudimos conectar la llamada. Revisa tu conexión; si no funciona, el profesional te llamará por teléfono.'),
			);
		}
	}

	async function alternar(tipo: 'microfono' | 'camara') {
		const room = sala.current;
		if (!room) return;
		try {
			if (tipo === 'microfono') {
				await room.localParticipant.setMicrophoneEnabled(!microfono);
				setMicrofono(!microfono);
			} else {
				await room.localParticipant.setCameraEnabled(!camara);
				setCamara(!camara);
			}
		} catch {
			setError(new ProblemaApi(0, 'sin_dispositivo', tipo === 'camara' ? 'No pudimos usar tu cámara. Sigue la consulta solo con audio.' : 'No pudimos cambiar el micrófono.'));
		}
	}

	async function salir() {
		await sala.current?.disconnect();
		await AudioSession.stopAudioSession();
		router.back();
	}

	if (cita.isPending) return <Pantalla><Cargando /></Pantalla>;
	if (cita.error) return <Pantalla><ErrorApi error={cita.error} /></Pantalla>;
	const c = cita.data;
	const room = sala.current;
	const participantes: Participant[] = room ? [room.localParticipant, ...room.remoteParticipants.values()] : [];

	return (
		<Pantalla>
			<Titulo>Consulta</Titulo>
			<Texto suave>{`${formatoFechaLarga(c.inicio)}, ${formatoHora(c.inicio)} · ${c.profesional.nombres} ${c.profesional.apellidos}`}</Texto>
			<ErrorApi error={error} />
			{estado === 'previa' || estado === 'conectando' ? (
				<Tarjeta>
					<Texto>Entrarás con solo audio. Podrás encender la cámara si hace falta.</Texto>
					<Texto>• Busca un lugar privado y con buena señal.{'\n'}• La consulta no se graba.{'\n'}• Si la llamada falla, el profesional te llamará por teléfono.</Texto>
					<Boton texto={estado === 'conectando' ? 'Conectando…' : 'Entrar a la consulta'} ocupado={estado === 'conectando'} disabled={!c.salaDisponible} onPress={entrar} />
					{!c.salaDisponible && <Texto suave>La sala se abre 15 minutos antes de la hora de la cita.</Texto>}
				</Tarjeta>
			) : estado === 'terminada' ? (
				<Tarjeta>
					<Titulo nivel={2}>La llamada terminó</Titulo>
					<Boton texto="Volver a entrar" onPress={entrar} />
					<Boton texto="Ver la cita" variante="secundario" onPress={() => router.back()} />
				</Tarjeta>
			) : (
				<Pila>
					{estado === 'reconectando' && <Aviso tipo="aviso">Se perdió la conexión. Reconectando…</Aviso>}
					{participantes.map((p) => {
						const pub = p.getTrackPublication(Track.Source.Camera);
						const conVideo = !!pub?.track && !pub.isMuted;
						const nombre = p.isLocal ? 'Tú' : p.name || 'Participante';
						return (
							<View
								key={p.identity}
								accessibilityLabel={`${nombre}${p.isSpeaking ? ', hablando' : ''}`}
								style={{
									aspectRatio: 4 / 3,
									borderRadius: radio.lg,
									overflow: 'hidden',
									backgroundColor: color.fondo.invertido,
									borderWidth: 4,
									borderColor: p.isSpeaking ? color.foco : 'transparent',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								{conVideo ? (
									<VideoTrack trackRef={{ participant: p, publication: pub, source: Track.Source.Camera }} style={{ width: '100%', height: '100%' }} objectFit="cover" mirror={p.isLocal} />
								) : (
									<Text style={{ color: color.texto.invertido, fontSize: tamano['2xl'], fontWeight: '700' }}>{nombre.charAt(0)}</Text>
								)}
								<View style={{ position: 'absolute', left: espacio[2], bottom: espacio[2], backgroundColor: color.superposicion, borderRadius: radio.sm, paddingHorizontal: espacio[2] }}>
									<Text style={{ color: color.texto.invertido, fontSize: tamano.sm }}>{nombre}</Text>
								</View>
							</View>
						);
					})}
					{participantes.length === 1 && <Texto suave>Esperando al profesional…</Texto>}
					<Texto variante="sm" suave accessibilityLiveRegion="polite">
						Conexión: {TEXTO_CALIDAD[calidad]}. {calidad === ConnectionQuality.Poor && camara ? 'Apaga la cámara para mejorar el audio.' : ''}
					</Texto>
					<Boton texto={microfono ? 'Silenciar micrófono' : 'Activar micrófono'} variante="secundario" onPress={() => alternar('microfono')} />
					<Boton texto={camara ? 'Apagar cámara' : 'Encender cámara'} variante="secundario" onPress={() => alternar('camara')} />
					<Boton texto="Salir de la llamada" variante="emergencia" onPress={salir} />
				</Pila>
			)}
		</Pantalla>
	);
}
