import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { type ReactNode, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	type ColorValue,
	Linking,
	Pressable,
	type PressableProps,
	ScrollView,
	StyleSheet,
	Text,
	type TextProps,
	TextInput,
	type TextInputProps,
	View,
	type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProblemaApi } from '../api/cliente';
import { linea113, numerosPrincipales } from '../contenido/emergencias';
import { type Colores, espacio, interlineado, objetivoTactil, peso, radio, tamano, useTema } from '../tema';
import type { Tono } from '../utiles/etiquetas';
import { iconos, type NombreIcono } from './iconos';

export type { NombreIcono } from './iconos';

type Peso = keyof typeof peso;
const pesoNativo = (p: Peso) => peso[p] as '400' | '500' | '600' | '700' | '800';

// ------------------------------------------------------------------ íconos

/** Ícono decorativo: los lectores de pantalla lo ignoran (el texto de al lado da el significado). */
export function Icono({ nombre, color, medida = 20, grosor = 2 }: { nombre: NombreIcono; color: ColorValue; medida?: number; grosor?: number }) {
	const Componente = iconos[nombre];
	return (
		<View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
			<Componente color={color} size={medida} strokeWidth={grosor} />
		</View>
	);
}

const colorDeTono = (color: Colores, tono: Tono): { fondo: string; texto: string; borde: string } =>
	({
		marca: { fondo: color.fondo.marca, texto: color.texto.marca, borde: color.accion.primaria.fondo },
		aviso: color.aviso,
		exito: color.exito,
		alerta: { fondo: color.emergencia.fondoSuave, texto: color.emergencia.textoSuave, borde: color.emergencia.borde },
		informacion: color.informacion,
		neutro: { fondo: color.fondo.hundido, texto: color.texto.base, borde: color.borde.fuerte },
	})[tono];

export function IconoRedondo({ nombre, tono = 'marca' }: { nombre: NombreIcono; tono?: Tono }) {
	const { color } = useTema();
	const c = colorDeTono(color, tono);
	return (
		<View style={[estilos.iconoRedondo, { backgroundColor: c.fondo }]}>
			<Icono nombre={nombre} color={c.texto} medida={22} />
		</View>
	);
}

// ------------------------------------------------------------------ texto

export function Texto({
	variante = 'base',
	suave,
	pesoTexto = 'normal',
	style,
	...props
}: TextProps & { variante?: keyof typeof tamano; suave?: boolean; pesoTexto?: Peso }) {
	const { color } = useTema();
	const t = tamano[variante];
	return (
		<Text
			{...props}
			style={[
				{
					color: suave ? color.texto.suave : color.texto.base,
					fontSize: t,
					lineHeight: t * interlineado.base,
					fontWeight: pesoNativo(pesoTexto),
				},
				style,
			]}
		/>
	);
}

export function Titulo({ children, nivel = 1 }: { children: ReactNode; nivel?: 1 | 2 | 3 }) {
	const variante = nivel === 1 ? '2xl' : nivel === 2 ? 'xl' : 'lg';
	const t = tamano[variante];
	return (
		<Texto
			accessibilityRole="header"
			variante={variante}
			pesoTexto={nivel === 1 ? 'extra' : 'negrita'}
			style={{ lineHeight: t * interlineado.ajustado, letterSpacing: nivel === 1 ? -0.4 : -0.2 }}
		>
			{children}
		</Texto>
	);
}

/** Título de sección con una acción opcional a la derecha ("Ver todas", "Cambiar"). */
export function Seccion({ titulo, accion, children }: { titulo: string; accion?: { texto: string; onPress: () => void }; children: ReactNode }) {
	const { color } = useTema();
	return (
		<View style={{ gap: espacio[3] }}>
			<View style={estilos.seccionCabeza}>
				<Titulo nivel={2}>{titulo}</Titulo>
				{accion && (
					<Pressable accessibilityRole="button" onPress={accion.onPress} hitSlop={8} style={estilos.seccionAccion}>
						<Text style={{ color: color.texto.enlace, fontWeight: pesoNativo('seminegrita'), fontSize: tamano.sm }}>{accion.texto}</Text>
					</Pressable>
				)}
			</View>
			{children}
		</View>
	);
}

// ------------------------------------------------------------------ botones

type Variante = 'primario' | 'secundario' | 'emergencia' | 'texto';

export function Boton({
	texto,
	variante = 'primario',
	icono,
	ocupado,
	disabled,
	onPress,
	accessibilityHint,
	...props
}: Omit<PressableProps, 'children' | 'style'> & { texto: string; variante?: Variante; icono?: NombreIcono; ocupado?: boolean }) {
	const { color } = useTema();
	const inactivo = disabled || ocupado;
	const paleta: Record<Variante, { fondo: string; fondoPresionado: string; texto: string; borde?: string }> = {
		primario: { fondo: color.accion.primaria.fondo, fondoPresionado: color.accion.primaria.fondoHover, texto: color.accion.primaria.texto },
		secundario: {
			fondo: color.accion.secundaria.fondo,
			fondoPresionado: color.accion.secundaria.fondoHover,
			texto: color.accion.secundaria.texto,
			borde: color.accion.secundaria.borde,
		},
		emergencia: { fondo: color.emergencia.fondo, fondoPresionado: color.emergencia.fondoHover, texto: color.emergencia.texto },
		texto: { fondo: 'transparent', fondoPresionado: color.fondo.sutil, texto: color.texto.enlace },
	};
	const p = paleta[variante];
	const colorTexto = inactivo ? color.accion.deshabilitada.texto : p.texto;
	return (
		<Pressable
			{...props}
			accessibilityRole="button"
			accessibilityState={{ disabled: !!inactivo, busy: !!ocupado }}
			accessibilityHint={accessibilityHint}
			disabled={inactivo}
			onPress={onPress}
			style={({ pressed }) => [
				estilos.boton,
				{
					backgroundColor: inactivo ? color.accion.deshabilitada.fondo : pressed ? p.fondoPresionado : p.fondo,
					borderColor: inactivo ? color.accion.deshabilitada.fondo : (p.borde ?? 'transparent'),
				},
			]}
		>
			{ocupado ? <ActivityIndicator color={colorTexto} /> : icono && <Icono nombre={icono} color={colorTexto} />}
			<Text style={[estilos.botonTexto, { color: colorTexto }]}>{texto}</Text>
		</Pressable>
	);
}

/** Enlace telefónico: abre el marcador del teléfono. */
export function BotonLlamar({ numero, texto, variante = 'emergencia' }: { numero: string; texto: string; variante?: Variante }) {
	return (
		<Boton
			texto={texto}
			variante={variante}
			icono="telefono"
			accessibilityRole="link"
			accessibilityHint={`Llama al ${numero}`}
			onPress={() => void Linking.openURL(`tel:${numero}`)}
		/>
	);
}

// ------------------------------------------------------------------ contenedores

export function Tarjeta({ children, tipo = 'normal', estilo }: { children: ReactNode; tipo?: 'normal' | 'destacada' | 'alerta'; estilo?: ViewStyle }) {
	const { color } = useTema();
	const fondo = tipo === 'destacada' ? color.fondo.marca : tipo === 'alerta' ? color.emergencia.fondoSuave : color.fondo.elevado;
	const borde = tipo === 'destacada' ? color.accion.primaria.fondo : tipo === 'alerta' ? color.emergencia.borde : color.borde.base;
	return <View style={[estilos.tarjeta, sombra(color), { backgroundColor: fondo, borderColor: borde }, estilo]}>{children}</View>;
}

/** Tarjeta que lleva a otra pantalla: ícono, título, descripción y flecha. */
export function TarjetaEnlace({
	icono,
	tono = 'marca',
	titulo,
	descripcion,
	onPress,
}: {
	icono: NombreIcono;
	tono?: Tono;
	titulo: string;
	descripcion?: string;
	onPress: () => void;
}) {
	const { color } = useTema();
	return (
		<Pressable
			accessibilityRole="link"
			accessibilityLabel={descripcion ? `${titulo}. ${descripcion}` : titulo}
			onPress={onPress}
			style={({ pressed }) => [
				estilos.tarjeta,
				estilos.tarjetaEnlace,
				sombra(color),
				{ backgroundColor: pressed ? color.fondo.sutil : color.fondo.elevado, borderColor: color.borde.base },
			]}
		>
			<IconoRedondo nombre={icono} tono={tono} />
			<View style={{ flex: 1, gap: 2 }}>
				<Texto pesoTexto="negrita">{titulo}</Texto>
				{descripcion && (
					<Texto variante="sm" suave>
						{descripcion}
					</Texto>
				)}
			</View>
			<Icono nombre="chevron" color={color.texto.suave} />
		</Pressable>
	);
}

export function Pila({ children, separacion = espacio[4] }: { children: ReactNode; separacion?: number }) {
	return <View style={{ gap: separacion }}>{children}</View>;
}

/**
 * Cabecera con el degradado de marca (tokens `destacado`). Va al inicio de la pantalla, de borde a borde.
 * Con `volver` muestra un botón para regresar (o ir al inicio si se abrió desde un enlace); si es una
 * función, la usa en lugar de la navegación (pasos dentro de una misma pantalla).
 */
export function Cabecera({
	antetitulo,
	titulo,
	volver,
	textoVolver = 'Volver',
	children,
}: {
	antetitulo?: string;
	titulo: string;
	volver?: boolean | (() => void);
	textoVolver?: string;
	children?: ReactNode;
}) {
	const { color } = useTema();
	const regresar = typeof volver === 'function' ? volver : () => (router.canGoBack() ? router.back() : router.replace('/'));
	return (
		<LinearGradient colors={[color.destacado.fondoInicio, color.destacado.fondoFin]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={estilos.cabecera}>
			{volver && (
				<Pressable accessibilityRole="button" accessibilityLabel={textoVolver} onPress={regresar} style={estilos.volver} hitSlop={8}>
					<Icono nombre="atras" color={color.destacado.texto} />
					<Text style={{ color: color.destacado.texto, fontSize: tamano.sm, fontWeight: pesoNativo('seminegrita') }}>{textoVolver}</Text>
				</Pressable>
			)}
			{antetitulo && <Text style={{ color: color.destacado.textoSuave, fontSize: tamano.sm, fontWeight: pesoNativo('seminegrita') }}>{antetitulo}</Text>}
			<Text
				accessibilityRole="header"
				style={{
					color: color.destacado.texto,
					fontSize: tamano['2xl'],
					lineHeight: tamano['2xl'] * interlineado.ajustado,
					fontWeight: pesoNativo('extra'),
					letterSpacing: -0.4,
				}}
			>
				{titulo}
			</Text>
			{children}
		</LinearGradient>
	);
}

/** Texto secundario dentro de la cabecera (sobre el degradado). */
export function TextoCabecera({ children }: { children: ReactNode }) {
	const { color } = useTema();
	return <Text style={{ color: color.destacado.textoSuave, fontSize: tamano.base, lineHeight: tamano.base * interlineado.base }}>{children}</Text>;
}

/** Botón de contorno para usar sobre la cabecera con degradado. */
export function BotonCabecera({ texto, icono, onPress, accessibilityLabel }: { texto: string; icono?: NombreIcono; onPress: () => void; accessibilityLabel?: string }) {
	const { color } = useTema();
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			onPress={onPress}
			style={({ pressed }) => [estilos.botonCabecera, { borderColor: color.destacado.textoSuave, backgroundColor: pressed ? color.destacado.fondoFin : 'transparent' }]}
		>
			{icono && <Icono nombre={icono} color={color.destacado.texto} medida={18} />}
			<Text style={{ color: color.destacado.texto, fontWeight: pesoNativo('seminegrita'), fontSize: tamano.sm }}>{texto}</Text>
		</Pressable>
	);
}

/** Franjas de TODAS las pantallas: aviso de demostración y números de emergencia. */
export function FranjaEmergencia() {
	const { color } = useTema();
	const samu = numerosPrincipales.find((n) => n.numero === '106');
	const enlace = { color: color.emergencia.texto, fontWeight: pesoNativo('negrita'), textDecorationLine: 'underline' } as const;
	return (
		<View>
			<View style={[estilos.franja, { backgroundColor: color.aviso.fondo, borderBottomColor: color.aviso.borde }]}>
				<Text style={{ color: color.aviso.texto, fontSize: tamano.xs, textAlign: 'center' }}>
					<Text style={{ fontWeight: pesoNativo('negrita') }}>Demostración con datos ficticios.</Text> No ingreses datos reales de salud.
				</Text>
			</View>
			<View style={[estilos.franjaEmergencia, { backgroundColor: color.emergencia.fondo }]} accessibilityRole="summary" accessibilityLabel="Emergencias">
				<Text style={{ color: color.emergencia.texto, fontSize: tamano.sm }}>¿Emergencia?</Text>
				{samu && (
					<Pressable
						accessibilityRole="link"
						accessibilityLabel={`Llamar al ${samu.numero}, ${samu.nombre}`}
						onPress={() => void Linking.openURL(`tel:${samu.numero}`)}
						style={estilos.enlaceFranja}
					>
						<Icono nombre="telefono" color={color.emergencia.texto} medida={16} />
						<Text style={enlace}>
							{samu.nombre} {samu.numero}
						</Text>
					</Pressable>
				)}
				<Pressable
					accessibilityRole="link"
					accessibilityLabel={`Llamar a la Línea ${linea113.numero} Salud`}
					onPress={() => void Linking.openURL(`tel:${linea113.numero}`)}
					style={estilos.enlaceFranja}
				>
					<Icono nombre="telefonoLlamada" color={color.emergencia.texto} medida={16} />
					<Text style={enlace}>Línea {linea113.numero}</Text>
				</Pressable>
			</View>
		</View>
	);
}

/** Pantalla con desplazamiento, márgenes seguros y las franjas de emergencia. */
export function Pantalla({ children, sinFranjas, cabecera }: { children: ReactNode; sinFranjas?: boolean; cabecera?: ReactNode }) {
	const { color } = useTema();
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: color.fondo.sutil }} edges={['top', 'left', 'right']}>
			{!sinFranjas && <FranjaEmergencia />}
			<ScrollView contentContainerStyle={{ paddingBottom: espacio[12] }} keyboardShouldPersistTaps="handled">
				{cabecera}
				<View style={estilos.contenido}>{children}</View>
			</ScrollView>
		</SafeAreaView>
	);
}

// ------------------------------------------------------------------ avisos

type TipoAviso = 'informacion' | 'aviso' | 'error' | 'exito';
const ICONO_AVISO: Record<TipoAviso, NombreIcono> = { informacion: 'informacion', aviso: 'alerta', error: 'error', exito: 'correcto' };

export function Aviso({ tipo = 'informacion', titulo, children }: { tipo?: TipoAviso; titulo?: string; children?: ReactNode }) {
	const { color } = useTema();
	const c = colorDeTono(color, tipo === 'error' ? 'alerta' : tipo);
	return (
		<View
			accessibilityRole={tipo === 'error' ? 'alert' : 'text'}
			accessibilityLiveRegion={tipo === 'error' ? 'assertive' : 'polite'}
			style={[estilos.aviso, { backgroundColor: c.fondo, borderColor: c.borde }]}
		>
			<Icono nombre={ICONO_AVISO[tipo]} color={c.texto} />
			<View style={{ flex: 1, gap: espacio[1] }}>
				{titulo && <Text style={{ color: c.texto, fontWeight: pesoNativo('negrita'), fontSize: tamano.base }}>{titulo}</Text>}
				{typeof children === 'string' ? <Text style={{ color: c.texto, fontSize: tamano.base, lineHeight: tamano.base * interlineado.base }}>{children}</Text> : children}
			</View>
		</View>
	);
}

export function ErrorApi({ error }: { error: unknown }) {
	if (!error) return null;
	const p = error instanceof ProblemaApi ? error : null;
	return (
		<Aviso tipo="error" titulo={p?.titulo ?? 'Ocurrió un error inesperado. Inténtalo de nuevo.'}>
			{p && p.campos.length > 0 ? p.campos.map((c) => `• ${c.mensaje}`).join('\n') : undefined}
		</Aviso>
	);
}

export function Insignia({ texto, tono = 'neutro', icono }: { texto: string; tono?: Tono; icono?: NombreIcono }) {
	const { color } = useTema();
	const c = colorDeTono(color, tono);
	return (
		<View style={[estilos.insignia, { backgroundColor: c.fondo, borderColor: c.borde }]}>
			{icono && <Icono nombre={icono} color={c.texto} medida={14} />}
			<Text style={{ color: c.texto, fontSize: tamano.xs, fontWeight: pesoNativo('seminegrita') }}>{texto}</Text>
		</View>
	);
}

export function Cargando({ texto = 'Cargando…' }: { texto?: string }) {
	const { color } = useTema();
	return (
		<View style={estilos.cargando} accessibilityRole="progressbar" accessibilityLabel={texto}>
			<ActivityIndicator color={color.accion.primaria.fondo} />
			<Texto suave>{texto}</Texto>
		</View>
	);
}

// ------------------------------------------------------------------ formularios

export function Campo({ etiqueta, ayuda, error, ...props }: TextInputProps & { etiqueta: string; ayuda?: string; error?: string | undefined }) {
	const { color } = useTema();
	const [foco, setFoco] = useState(false);
	return (
		<View style={{ gap: espacio[1] }}>
			<Texto pesoTexto="seminegrita" nativeID={`etiqueta-${etiqueta}`}>
				{etiqueta}
			</Texto>
			{ayuda && (
				<Texto variante="sm" suave>
					{ayuda}
				</Texto>
			)}
			<TextInput
				{...props}
				accessibilityLabel={etiqueta}
				accessibilityLabelledBy={`etiqueta-${etiqueta}`}
				accessibilityHint={ayuda}
				placeholderTextColor={color.texto.suave}
				onFocus={(e) => {
					setFoco(true);
					props.onFocus?.(e);
				}}
				onBlur={(e) => {
					setFoco(false);
					props.onBlur?.(e);
				}}
				style={[
					estilos.entrada,
					{
						color: color.texto.base,
						backgroundColor: color.fondo.base,
						borderColor: error ? color.emergencia.borde : foco ? color.foco : color.borde.fuerte,
					},
					props.multiline ? { minHeight: 112, textAlignVertical: 'top' } : null,
				]}
			/>
			{error && (
				<Text accessibilityRole="alert" style={{ color: color.emergencia.textoSuave, fontSize: tamano.sm, fontWeight: pesoNativo('seminegrita') }}>
					{error}
				</Text>
			)}
		</View>
	);
}

/** Casilla o botón de opción grande, fácil de tocar. */
export function Opcion({
	marcada,
	alPresionar,
	titulo,
	descripcion,
	tipo = 'casilla',
	alarma,
	deshabilitada,
}: {
	marcada: boolean;
	alPresionar: () => void;
	titulo: string;
	descripcion?: string;
	tipo?: 'casilla' | 'radio';
	alarma?: boolean;
	deshabilitada?: boolean;
}) {
	const { color } = useTema();
	const acento = alarma ? color.emergencia.borde : color.accion.primaria.fondo;
	return (
		<Pressable
			accessibilityRole={tipo === 'casilla' ? 'checkbox' : 'radio'}
			accessibilityState={{ checked: marcada, disabled: !!deshabilitada }}
			accessibilityLabel={descripcion ? `${titulo}. ${descripcion}` : titulo}
			disabled={deshabilitada}
			onPress={alPresionar}
			style={[
				estilos.opcion,
				{
					borderColor: marcada ? acento : color.borde.base,
					backgroundColor: marcada ? (alarma ? color.emergencia.fondoSuave : color.fondo.marca) : color.fondo.base,
					opacity: deshabilitada ? 0.6 : 1,
				},
			]}
		>
			<View
				style={[
					estilos.marca,
					{
						borderRadius: tipo === 'radio' ? radio.pildora : radio.sm,
						borderColor: marcada ? acento : color.borde.fuerte,
						backgroundColor: marcada && tipo === 'casilla' ? acento : 'transparent',
					},
				]}
			>
				{marcada &&
					(tipo === 'radio' ? (
						<View style={[estilos.puntoRadio, { backgroundColor: acento }]} />
					) : (
						<Icono nombre="check" color={color.accion.primaria.texto} medida={16} grosor={3} />
					))}
			</View>
			<View style={{ flex: 1 }}>
				<Texto pesoTexto={descripcion ? 'seminegrita' : 'normal'}>{titulo}</Texto>
				{descripcion && (
					<Texto variante="sm" suave>
						{descripcion}
					</Texto>
				)}
			</View>
		</Pressable>
	);
}

/** Reloj que se actualiza cada `ms` (para plazos y apertura de sala). */
export function useAhora(ms = 30_000): number {
	const [ahora, setAhora] = useState(() => Date.now());
	useEffect(() => {
		const t = setInterval(() => setAhora(Date.now()), ms);
		return () => clearInterval(t);
	}, [ms]);
	return ahora;
}

/** Sombra suave de las tarjetas (en tema oscuro casi no se ve; el borde marca el límite). */
const sombra = (color: Colores): ViewStyle => ({
	shadowColor: color.texto.base,
	shadowOpacity: 0.06,
	shadowRadius: 10,
	shadowOffset: { width: 0, height: 2 },
	elevation: 1,
});

const estilos = StyleSheet.create({
	boton: {
		minHeight: objetivoTactil.comodo,
		paddingHorizontal: espacio[5],
		borderRadius: radio.md,
		borderWidth: 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: espacio[2],
	},
	botonTexto: { fontSize: tamano.base, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
	tarjeta: { borderWidth: 1, borderRadius: radio.lg, padding: espacio[5], gap: espacio[3] },
	tarjetaEnlace: { flexDirection: 'row', alignItems: 'center', gap: espacio[4], padding: espacio[4], minHeight: objetivoTactil.comodo },
	iconoRedondo: { width: 44, height: 44, borderRadius: radio.md, alignItems: 'center', justifyContent: 'center' },
	seccionCabeza: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: espacio[3] },
	seccionAccion: { minHeight: objetivoTactil.minimo, justifyContent: 'center' },
	cabecera: { paddingHorizontal: espacio[5], paddingTop: espacio[5], paddingBottom: espacio[6], gap: espacio[2] },
	volver: { flexDirection: 'row', alignItems: 'center', gap: espacio[1], minHeight: objetivoTactil.minimo, alignSelf: 'flex-start', marginLeft: -espacio[1] },
	botonCabecera: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		gap: espacio[2],
		minHeight: objetivoTactil.minimo,
		paddingHorizontal: espacio[4],
		borderWidth: 1,
		borderRadius: radio.pildora,
	},
	franja: { paddingVertical: espacio[1], paddingHorizontal: espacio[4], borderBottomWidth: 1 },
	franjaEmergencia: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		justifyContent: 'center',
		columnGap: espacio[4],
		paddingHorizontal: espacio[4],
	},
	enlaceFranja: { minHeight: objetivoTactil.minimo, flexDirection: 'row', alignItems: 'center', gap: espacio[1] },
	contenido: { padding: espacio[4], gap: espacio[5] },
	aviso: { flexDirection: 'row', borderWidth: 1, borderLeftWidth: 6, borderRadius: radio.md, padding: espacio[4], gap: espacio[3] },
	insignia: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: espacio[1],
		borderRadius: radio.pildora,
		borderWidth: 1,
		paddingHorizontal: espacio[2],
		paddingVertical: 2,
		alignSelf: 'flex-start',
	},
	cargando: { flexDirection: 'row', alignItems: 'center', gap: espacio[3], paddingVertical: espacio[6] },
	entrada: { minHeight: objetivoTactil.comodo, borderWidth: 2, borderRadius: radio.md, paddingHorizontal: espacio[3], fontSize: tamano.base },
	opcion: { flexDirection: 'row', gap: espacio[3], alignItems: 'flex-start', borderWidth: 2, borderRadius: radio.md, padding: espacio[4], minHeight: objetivoTactil.comodo },
	marca: { width: 24, height: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
	puntoRadio: { width: 12, height: 12, borderRadius: radio.pildora },
});
