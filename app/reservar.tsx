import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { randomUUID } from 'expo-crypto';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { api, type Esquemas, exigir, ProblemaApi } from '@/api/cliente';
import { claves, useConsentimientos, vigentes } from '@/api/consultas';
import { useUsuario } from '@/sesion/sesion';
import { espacio, objetivoTactil, radio, tamano, useTema } from '@/tema';
import { Aviso, Boton, Cabecera, Campo, Cargando, ErrorApi, IconoRedondo, Opcion, Pantalla, Pila, Tarjeta, Texto, TextoCabecera, Titulo } from '@/ui';
import { diaDe, formatoFechaLarga, formatoHora } from '@/utiles/fechas';

type Profesional = Esquemas['ProfesionalPublicoDto'];

export default function Reservar() {
	const [profesional, setProfesional] = useState<Profesional | null>(null);
	return profesional ? <ElegirHorario profesional={profesional} onVolver={() => setProfesional(null)} /> : <ElegirProfesional onElegir={setProfesional} />;
}

function ElegirProfesional({ onElegir }: { onElegir: (p: Profesional) => void }) {
	const lista = useQuery({ queryKey: claves.profesionales, queryFn: () => exigir(api.GET('/v1/profesionales')) });
	return (
		<Pantalla
			cabecera={
				<Cabecera volver antetitulo="Paso 1 de 3" titulo="Reservar una cita">
					<TextoCabecera>Elige un profesional. La atención es por llamada de audio o video.</TextoCabecera>
				</Cabecera>
			}
		>
			{lista.isPending ? (
				<Cargando />
			) : lista.error ? (
				<ErrorApi error={lista.error} />
			) : lista.data.length === 0 ? (
				<Texto>No hay profesionales disponibles por ahora.</Texto>
			) : (
				lista.data.map((p) => (
					<Tarjeta key={p.id}>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: espacio[3] }}>
							<IconoRedondo nombre="estetoscopio" />
							<View style={{ flex: 1 }}>
								<Titulo nivel={2}>
									{p.nombres} {p.apellidos}
								</Titulo>
								<Texto suave>
									{p.especialidad} · CMP {p.numeroCmp}
									{p.numeroRne ? ` · RNE ${p.numeroRne}` : ''}
								</Texto>
							</View>
						</View>
						{p.presentacion && <Texto>{p.presentacion}</Texto>}
						<Texto variante="sm">
							{p.proximaFranja ? `Próximo horario: ${formatoFechaLarga(p.proximaFranja)}, ${formatoHora(p.proximaFranja)}` : 'Sin horarios libres por ahora'}
						</Texto>
						<Boton texto="Ver horarios" icono="calendario" disabled={!p.proximaFranja} onPress={() => onElegir(p)} />
					</Tarjeta>
				))
			)}
		</Pantalla>
	);
}

function ElegirHorario({ profesional, onVolver }: { profesional: Profesional; onVolver: () => void }) {
	const usuario = useUsuario();
	const cliente = useQueryClient();
	const { color } = useTema();
	const consentimientos = useConsentimientos();
	const franjas = useQuery({
		queryKey: claves.franjasDe(profesional.id),
		queryFn: () => exigir(api.GET('/v1/profesionales/{id}/franjas', { params: { path: { id: profesional.id } } })),
	});
	const [franjaId, setFranjaId] = useState<string | null>(null);
	const puedeTeleconsulta = usuario.nivelIdentidad === 'N2' && vigentes(consentimientos.data).has('telemedicina');
	const [eleccion, setServicio] = useState<'teleconsulta' | 'teleorientacion' | null>(null);
	const servicio = puedeTeleconsulta ? (eleccion ?? 'teleconsulta') : 'teleorientacion';
	const [modalidad, setModalidad] = useState<'audio' | 'video'>('audio');
	const [motivo, setMotivo] = useState('');
	// Una clave por intento: si la red falla y se reintenta, la API no crea dos citas.
	const clave = useRef(randomUUID());

	const reservar = useMutation({
		mutationFn: () =>
			exigir(
				api.POST('/v1/citas', {
					params: { header: { 'idempotency-key': clave.current } },
					body: { franjaId: franjaId!, servicio, modalidad, ...(motivo.trim() ? { motivo: motivo.trim() } : {}) },
				}),
			),
		onSuccess: async (cita) => {
			await cliente.invalidateQueries({ queryKey: claves.citas });
			setFranjaId(null);
			onVolver();
			// Reemplaza la reserva: volver atrás desde la cita no debe reabrir el formulario ya enviado.
			router.replace({ pathname: '/cita/[id]', params: { id: cita.id, reservada: '1' } });
		},
		onError: async (error) => {
			clave.current = randomUUID();
			if (error instanceof ProblemaApi && error.estado === 409) {
				setFranjaId(null);
				await cliente.invalidateQueries({ queryKey: claves.franjasDe(profesional.id) });
			}
		},
	});

	const porDia = new Map<string, Esquemas['FranjaDto'][]>();
	for (const f of franjas.data ?? []) porDia.set(diaDe(f.inicio), [...(porDia.get(diaDe(f.inicio)) ?? []), f]);

	return (
		<Pantalla
			cabecera={
				<Cabecera volver={onVolver} textoVolver="Otro profesional" antetitulo="Paso 2 de 3" titulo={`${profesional.nombres} ${profesional.apellidos}`}>
					<TextoCabecera>Elige el día y la hora (hora de Perú).</TextoCabecera>
				</Cabecera>
			}
		>
			{franjas.isPending ? (
				<Cargando />
			) : franjas.error ? (
				<ErrorApi error={franjas.error} />
			) : porDia.size === 0 ? (
				<Texto>No quedan horarios libres en los próximos 14 días.</Texto>
			) : (
				[...porDia.values()].map((lista) => (
					<Tarjeta key={lista[0]!.id}>
						<Titulo nivel={3}>{formatoFechaLarga(lista[0]!.inicio)}</Titulo>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espacio[2] }}>
							{lista.map((f) => {
								const elegida = franjaId === f.id;
								return (
									<Pressable
										key={f.id}
										accessibilityRole="button"
										accessibilityState={{ selected: elegida }}
										accessibilityLabel={`${formatoFechaLarga(f.inicio)}, ${formatoHora(f.inicio)}`}
										onPress={() => setFranjaId(f.id)}
										style={{
											minWidth: 88,
											minHeight: objetivoTactil.comodo,
											borderRadius: radio.md,
											borderWidth: 2,
											alignItems: 'center',
											justifyContent: 'center',
											borderColor: elegida ? color.accion.primaria.fondo : color.borde.base,
											backgroundColor: elegida ? color.accion.primaria.fondo : color.fondo.base,
										}}
									>
										<Text style={{ fontSize: tamano.base, fontWeight: '600', color: elegida ? color.accion.primaria.texto : color.texto.base }}>
											{formatoHora(f.inicio)}
										</Text>
									</Pressable>
								);
							})}
						</View>
					</Tarjeta>
				))
			)}

			{franjaId && (
				<Tarjeta>
					<Titulo nivel={2}>Paso 3 de 3: confirma</Titulo>
					<Pila separacion={espacio[2]}>
						<Texto pesoTexto="seminegrita">Tipo de atención</Texto>
						<Opcion
							tipo="radio"
							marcada={servicio === 'teleorientacion'}
							titulo="Teleorientación"
							descripcion="Consejos y orientación sobre qué hacer. No incluye diagnóstico."
							alPresionar={() => setServicio('teleorientacion')}
						/>
						<Opcion
							tipo="radio"
							marcada={servicio === 'teleconsulta'}
							deshabilitada={!puedeTeleconsulta}
							titulo="Teleconsulta"
							descripcion={puedeTeleconsulta ? 'Atención médica a distancia.' : 'Necesitas tu identidad verificada y el consentimiento de telemedicina.'}
							alPresionar={() => setServicio('teleconsulta')}
						/>
					</Pila>
					<Pila separacion={espacio[2]}>
						<Texto pesoTexto="seminegrita">¿Cómo prefieres la llamada?</Texto>
						<Opcion tipo="radio" marcada={modalidad === 'audio'} titulo="Solo audio (recomendado)" descripcion="Usa menos datos y funciona mejor con mala señal." alPresionar={() => setModalidad('audio')} />
						<Opcion tipo="radio" marcada={modalidad === 'video'} titulo="Video" descripcion="Puedes apagar la cámara en cualquier momento." alPresionar={() => setModalidad('video')} />
					</Pila>
					<Campo etiqueta="Motivo (opcional)" ayuda="Escribe solo lo necesario para la consulta. Máximo 500 caracteres." multiline maxLength={500} value={motivo} onChangeText={setMotivo} />
					<Aviso tipo="informacion">La consulta no se graba. Si tu caso es una emergencia, no reserves: llama al 106.</Aviso>
					<ErrorApi error={reservar.error} />
					<Boton texto="Reservar" icono="citaNueva" ocupado={reservar.isPending} onPress={() => reservar.mutate()} />
				</Tarjeta>
			)}
		</Pantalla>
	);
}
