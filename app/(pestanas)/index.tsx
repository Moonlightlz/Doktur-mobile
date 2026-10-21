import { router } from 'expo-router';
import { View } from 'react-native';
import { useCitas, useConsentimientos, useLlamadas, vigentes } from '@/api/consultas';
import { ZONAS } from '@/contenido/regiones';
import { ICONO_PELIGRO, nombresFrecuentes } from '@/region/componentes';
import { useRegion } from '@/region/region';
import { useUsuario } from '@/sesion/sesion';
import { espacio, useTema } from '@/tema';
import {
	Aviso,
	Boton,
	BotonCabecera,
	Cabecera,
	Cargando,
	ErrorApi,
	Icono,
	IconoRedondo,
	Insignia,
	Pantalla,
	Seccion,
	Tarjeta,
	TarjetaEnlace,
	Texto,
	TextoCabecera,
	Titulo,
	useAhora,
} from '@/ui';
import { TarjetaCita } from '@/ui/tarjeta-cita';
import { formatoFechaLarga, formatoHora, relativo } from '@/utiles/fechas';

export default function Inicio() {
	const usuario = useUsuario();
	const { color } = useTema();
	const { region } = useRegion();
	const ahora = useAhora();
	const citas = useCitas();
	const consentimientos = useConsentimientos();
	const llamadas = useLlamadas();

	const proximas = (citas.data ?? [])
		.filter((c) => ['programada', 'en_curso'].includes(c.estado) && new Date(c.fin).getTime() + 30 * 60_000 > ahora)
		.sort((a, b) => a.inicio.localeCompare(b.inicio));
	const llamada = (llamadas.data ?? []).find((l) => ['pendiente', 'en_contacto'].includes(l.estado));
	const firmados = vigentes(consentimientos.data);
	const pasos = [
		{ hecho: firmados.has('datos_personales'), texto: 'Acepta el tratamiento de tus datos personales.' },
		{ hecho: usuario.nivelIdentidad !== 'N0', texto: 'Indica tu documento de identidad.' },
		{ hecho: usuario.nivelIdentidad === 'N2', texto: 'La IPRESS verifica tu identidad.' },
		{ hecho: firmados.has('telemedicina'), texto: 'Firma el consentimiento para telemedicina.' },
	];
	const zona = region ? ZONAS[region.zonas[0]!] : null;
	const frecuentes = region ? nombresFrecuentes(region) : [];

	return (
		<Pantalla
			cabecera={
				<Cabecera antetitulo={formatoFechaLarga(new Date(ahora).toISOString())} titulo={`Hola, ${usuario.nombres}`}>
					<TextoCabecera>Información y atención de salud para la temporada de El Niño.</TextoCabecera>
					<BotonCabecera
						icono="region"
						texto={region ? `${region.nombre} · Cambiar` : 'Elige tu región'}
						accessibilityLabel={region ? `Tu región: ${region.nombre}. Cambiar región` : 'Elige tu región'}
						onPress={() => router.push(region ? '/regiones' : '/region')}
					/>
				</Cabecera>
			}
		>
			{llamada && (
				<Aviso tipo="aviso" titulo="La IPRESS te llamará">
					{`Pediste una llamada ${relativo(llamada.creadaEn, ahora)}. Te llamarán antes de las ${formatoHora(llamada.plazoHasta)}. Si empeoras, no esperes: llama al 106.`}
				</Aviso>
			)}
			<Tarjeta tipo="alerta">
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: espacio[3] }}>
					<IconoRedondo nombre="alarma" tono="alerta" />
					<View style={{ flex: 1 }}>
						<Titulo nivel={2}>¿Te sientes muy mal?</Titulo>
					</View>
				</View>
				<Texto>Revisa los signos de alarma. Si tienes alguno, te diremos qué hacer y podrás pedir que te llamen.</Texto>
				<Boton texto="Revisar signos de alarma" icono="alarma" variante="emergencia" onPress={() => router.push('/signos')} />
			</Tarjeta>

			{region && zona ? (
				<Tarjeta>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: espacio[3] }}>
						<IconoRedondo nombre={ICONO_PELIGRO[zona.peligro]} tono={zona.peligro === 'sequia' ? 'aviso' : 'informacion'} />
						<View style={{ flex: 1 }}>
							<Texto variante="sm" suave>
								En tu región
							</Texto>
							<Titulo nivel={2}>{region.nombre}</Titulo>
						</View>
					</View>
					<Texto>{zona.ahora}</Texto>
					{frecuentes.length > 0 && (
						<View style={{ gap: espacio[2] }}>
							<Texto variante="sm" pesoTexto="seminegrita">
								Frecuentes este año:
							</Texto>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espacio[2] }}>
								{frecuentes.map((f) => (
									<Insignia key={f} texto={f} tono="alerta" icono="vector" />
								))}
							</View>
						</View>
					)}
					<Boton texto="Ver mi región" icono="region" variante="secundario" onPress={() => router.push('/region')} />
				</Tarjeta>
			) : (
				<TarjetaEnlace icono="region" titulo="Elige tu región" descripcion="Te mostramos las enfermedades frecuentes donde vives." onPress={() => router.push('/region')} />
			)}
			<TarjetaEnlace
				icono="tendencia"
				tono="informacion"
				titulo="Qué puede pasar con El Niño"
				descripcion="Escenarios para tu salud de aquí a mayo de 2027."
				onPress={() => router.push('/pronostico')}
			/>
			<TarjetaEnlace icono="citaNueva" titulo="Reservar una cita" descripcion="Orientación o consulta por llamada de audio o video." onPress={() => router.push('/reservar')} />

			<Seccion titulo="Tus próximas citas" accion={{ texto: 'Ver todas', onPress: () => router.push('/citas') }}>
				{citas.isPending ? (
					<Cargando />
				) : citas.error ? (
					<ErrorApi error={citas.error} />
				) : proximas.length === 0 ? (
					<Texto suave>No tienes citas programadas.</Texto>
				) : (
					proximas.map((c) => <TarjetaCita key={c.id} cita={c} ahora={ahora} />)
				)}
			</Seccion>

			{pasos.some((p) => !p.hecho) && (
				<Tarjeta>
					<Titulo nivel={2}>Para usar la teleconsulta</Titulo>
					{pasos.map((p, i) => (
						<View
							key={p.texto}
							accessible
							accessibilityLabel={`Paso ${i + 1}: ${p.texto} ${p.hecho ? 'Hecho' : 'Pendiente'}`}
							style={{ flexDirection: 'row', alignItems: 'flex-start', gap: espacio[3] }}
						>
							{p.hecho ? (
								<Icono nombre="correcto" color={color.exito.borde} />
							) : (
								<Texto pesoTexto="negrita" style={{ width: 20, textAlign: 'center' }}>
									{i + 1}
								</Texto>
							)}
							<Texto style={{ flex: 1 }} suave={p.hecho}>
								{p.texto}
							</Texto>
						</View>
					))}
					<Boton texto="Completar en Cuenta" variante="secundario" onPress={() => router.push('/cuenta')} />
				</Tarjeta>
			)}
		</Pantalla>
	);
}
