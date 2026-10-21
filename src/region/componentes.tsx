import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { linea113 } from '../contenido/emergencias';
import {
	type ClaveFuente,
	ENFERMEDADES,
	FUENTES,
	fechaConsultaRegional,
	type Nivel,
	type Region,
	REGIONES,
	riesgosDeRegion,
	tieneSamu,
	validacionRegional,
	type Zona,
	ZONAS,
} from '../contenido/regiones';
import { espacio, objetivoTactil, radio, useTema } from '../tema';
import { Aviso, BotonLlamar, Campo, Icono, IconoRedondo, Insignia, type NombreIcono, Pila, Seccion, Tarjeta, TarjetaEnlace, Texto, Titulo } from '../ui';
import type { Tono } from '../utiles/etiquetas';
import { formatoDia } from '../utiles/fechas';

export const ICONO_PELIGRO: Record<'lluvias' | 'sequia' | 'mixto', NombreIcono> = { lluvias: 'clima', sequia: 'sol', mixto: 'mixto' };
const TEXTO_PELIGRO = { lluvias: 'Lluvias e inundaciones', sequia: 'Falta de lluvias', mixto: 'Lluvias y zonas secas' } as const;
const TONO_PELIGRO: Record<'lluvias' | 'sequia' | 'mixto', Tono> = { lluvias: 'informacion', sequia: 'aviso', mixto: 'informacion' };

export const NIVELES: Array<{ nivel: Nivel; titulo: string; descripcion: string; tono: Tono }> = [
	{ nivel: 'frecuente', titulo: 'Frecuentes en tu región', descripcion: 'Muchos casos en 2026: es probable encontrarlas.', tono: 'alerta' },
	{ nivel: 'ocasional', titulo: 'Ocasionales', descripcion: 'Hay casos, pero menos frecuentes.', tono: 'aviso' },
	{ nivel: 'raro', titulo: 'Raras, pero graves', descripcion: 'Pocos casos o antecedentes en la región: conviene reconocerlas.', tono: 'informacion' },
];
const ETIQUETA_NIVEL: Record<Nivel, string> = { frecuente: 'Frecuente', ocasional: 'Ocasional', raro: 'Rara' };

/** "Dengue, Leptospirosis" (sin los paréntesis de los nombres largos). */
export const nombresFrecuentes = (r: Region) =>
	riesgosDeRegion(r)
		.filter((x) => x.nivel === 'frecuente')
		.map((x) => {
			const nombre = ENFERMEDADES[x.enfermedad].nombre;
			return nombre.split(' (')[0] ?? nombre;
		});

export function AvisoBorrador() {
	if (validacionRegional.estado === 'validado') return null;
	return (
		<Aviso tipo="aviso" titulo="Borrador: pendiente de validación médica">
			Las cifras son oficiales, pero los textos de orientación todavía no fueron revisados por un profesional de la salud.
		</Aviso>
	);
}

/** Fuentes con enlace (se abren en el navegador). Las de prensa se marcan como secundarias. */
export function ListaFuentes({ claves }: { claves: ClaveFuente[] }) {
	const { color } = useTema();
	return (
		<Pila separacion={espacio[2]}>
			<Titulo nivel={3}>Fuentes</Titulo>
			{[...new Set(claves)].map((c) => {
				const f = FUENTES[c];
				return (
					<Pressable
						key={c}
						accessibilityRole="link"
						accessibilityHint="Abre la fuente en el navegador"
						onPress={() => void Linking.openURL(f.url)}
						style={estilos.fuente}
					>
						<Icono nombre="enlaceExterno" color={color.texto.enlace} medida={16} />
						<Texto variante="sm" style={{ flex: 1 }}>
							<Texto variante="sm" style={{ color: color.texto.enlace, textDecorationLine: 'underline' }}>
								{f.nombre}
							</Texto>
							{`. ${f.institucion}, ${formatoDia(f.fecha)}.${f.oficial ? '' : ' Fuente secundaria.'}`}
						</Texto>
					</Pressable>
				);
			})}
			<Texto variante="sm" suave>
				Consultadas el {formatoDia(fechaConsultaRegional)}.
			</Texto>
		</Pila>
	);
}

export function TarjetaZona({ zona }: { zona: Zona }) {
	const c = ZONAS[zona];
	return (
		<Tarjeta>
			<View style={estilos.fila}>
				<IconoRedondo nombre={ICONO_PELIGRO[c.peligro]} tono={TONO_PELIGRO[c.peligro]} />
				<View style={{ flex: 1, gap: espacio[1] }}>
					<Titulo nivel={3}>{c.nombre}</Titulo>
					<Insignia texto={TEXTO_PELIGRO[c.peligro]} tono={TONO_PELIGRO[c.peligro]} />
				</View>
			</View>
			<Texto>
				<Texto pesoTexto="negrita">Ahora: </Texto>
				{c.ahora}
			</Texto>
			<Texto>
				<Texto pesoTexto="negrita">Próximos meses: </Texto>
				{c.proximosMeses}
			</Texto>
			<Texto variante="sm" suave>
				Puede aumentar: {c.saludEsperada.join(', ')}.
			</Texto>
		</Tarjeta>
	);
}

/** Contenido de una región (lo usan la pestaña "Mi región" y la pantalla pública /regiones/[id]). */
export function DetalleRegion({ region }: { region: Region }) {
	const riesgos = riesgosDeRegion(region);
	const samu = tieneSamu(region);
	const fuentes: ClaveFuente[] = [
		...region.zonas.flatMap((z) => ZONAS[z].fuentes),
		...riesgos.map((r) => ENFERMEDADES[r.enfermedad].fuente),
		'diarreas',
		'neumonias',
	];
	return (
		<>
			<AvisoBorrador />
			<Seccion titulo="El clima en tu región">
				{region.zonas.map((z) => (
					<TarjetaZona key={z} zona={z} />
				))}
			</Seccion>

			<Seccion titulo="Enfermedades a vigilar">
				<Texto variante="sm" suave>
					Cifras oficiales del CDC-Minsa del 1 de enero a la semana 38 de 2026 (mediados de setiembre). El nivel se calcula con los casos por cada 100 mil habitantes.
				</Texto>
				{NIVELES.map(({ nivel, titulo, descripcion, tono }) => {
					const lista = riesgos.filter((r) => r.nivel === nivel);
					if (lista.length === 0) return null;
					return (
						<Pila key={nivel} separacion={espacio[3]}>
							<View style={{ gap: 2 }}>
								<Titulo nivel={3}>{titulo}</Titulo>
								<Texto variante="sm" suave>
									{descripcion}
								</Texto>
							</View>
							{lista.map((r) => {
								const e = ENFERMEDADES[r.enfermedad];
								return (
									<Tarjeta key={r.enfermedad}>
										<View style={estilos.filaEntre}>
											<Texto pesoTexto="negrita" variante="lg" style={{ flex: 1 }}>
												{e.nombre}
											</Texto>
											<Insignia texto={ETIQUETA_NIVEL[nivel]} tono={tono} />
										</View>
										<Texto variante="sm" suave>
											{r.motivo}
										</Texto>
										<Texto>{e.queEs}</Texto>
										<Texto>
											<Texto pesoTexto="negrita">Qué hacer: </Texto>
											{e.prevencion}
										</Texto>
									</Tarjeta>
								);
							})}
						</Pila>
					);
				})}
				<Tarjeta>
					<Titulo nivel={3}>En todas las regiones</Titulo>
					<Texto>
						Las diarreas y las infecciones respiratorias son las enfermedades más comunes del país. Suben cuando falta agua segura, después de inundaciones y en las temporadas de frío.
					</Texto>
				</Tarjeta>
			</Seccion>

			<Tarjeta tipo="alerta">
				<Titulo nivel={2}>Si es una emergencia en {region.nombre}</Titulo>
				<Texto>
					{samu
						? `Según la lista oficial de gob.pe, el SAMU 106 atiende en ${region.nombre}. Llama al 106 o acude al establecimiento de salud más cercano.`
						: `En la lista oficial de gob.pe, el SAMU 106 no figura para ${region.nombre}. Acude al establecimiento de salud más cercano.`}
				</Texto>
				{samu && <BotonLlamar numero="106" texto="Llamar al 106 (SAMU)" />}
				<BotonLlamar numero={linea113.numero} texto={`Línea ${linea113.numero} Salud (orientación gratis)`} variante="secundario" />
			</Tarjeta>

			<TarjetaEnlace
				icono="hospital"
				titulo="Hospitales y centros de salud"
				descripcion={`Dirección, teléfono y horario en ${region.nombre}, según el registro oficial.`}
				onPress={() => router.push({ pathname: '/establecimientos/[id]', params: { id: region.id } })}
			/>

			<TarjetaEnlace
				icono="tendencia"
				tono="informacion"
				titulo="Qué puede pasar con El Niño"
				descripcion="Escenarios para tu salud de aquí a mayo de 2027."
				onPress={() => router.push('/pronostico')}
			/>
			<ListaFuentes claves={fuentes} />
		</>
	);
}

/** Quita tildes para buscar "ancash" o "junin" sin escribirlas (sin String.normalize, que Hermes no garantiza). */
export const sinTildes = (t: string) =>
	t
		.toLowerCase()
		.replace(/[áàä]/g, 'a')
		.replace(/[éèë]/g, 'e')
		.replace(/[íìï]/g, 'i')
		.replace(/[óòö]/g, 'o')
		.replace(/[úùü]/g, 'u');

/** Lista de regiones con buscador. La región elegida se marca. */
export function ListaRegiones({ seleccionada, alElegir }: { seleccionada?: string | undefined; alElegir: (r: Region) => void }) {
	const { color } = useTema();
	const [busqueda, setBusqueda] = useState('');
	const filtro = sinTildes(busqueda.trim());
	const lista = REGIONES.filter((r) => !filtro || sinTildes(r.nombre).includes(filtro) || sinTildes(r.capital).includes(filtro));
	return (
		<Pila separacion={espacio[3]}>
			<Campo etiqueta="Buscar región o ciudad" autoCorrect={false} value={busqueda} onChangeText={setBusqueda} returnKeyType="search" />
			{lista.length === 0 && <Texto suave>No encontramos esa región. Revisa cómo se escribe.</Texto>}
			<View accessibilityRole="radiogroup" style={{ gap: espacio[2] }}>
				{lista.map((r) => {
					const marcada = r.id === seleccionada;
					const frecuentes = nombresFrecuentes(r);
					const descripcion = `${ZONAS[r.zonas[0] as Zona].nombre}${frecuentes.length > 0 ? ` · Frecuentes: ${frecuentes.join(', ')}` : ''}`;
					return (
						<Pressable
							key={r.id}
							accessibilityRole="radio"
							accessibilityState={{ checked: marcada }}
							accessibilityLabel={`${r.nombre}. ${descripcion}`}
							onPress={() => alElegir(r)}
							style={({ pressed }) => [
								estilos.region,
								{
									borderColor: marcada ? color.accion.primaria.fondo : color.borde.base,
									backgroundColor: marcada ? color.fondo.marca : pressed ? color.fondo.sutil : color.fondo.elevado,
								},
							]}
						>
							<Icono nombre="region" color={marcada ? color.texto.marca : color.texto.suave} />
							<View style={{ flex: 1 }}>
								<Texto pesoTexto="seminegrita">{r.nombre}</Texto>
								<Texto variante="sm" suave>
									{descripcion}
								</Texto>
							</View>
							{marcada ? <Icono nombre="correcto" color={color.texto.marca} /> : <Icono nombre="chevron" color={color.texto.suave} />}
						</Pressable>
					);
				})}
			</View>
		</Pila>
	);
}

const estilos = StyleSheet.create({
	fila: { flexDirection: 'row', alignItems: 'center', gap: espacio[3] },
	filaEntre: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: espacio[2] },
	fuente: { flexDirection: 'row', alignItems: 'flex-start', gap: espacio[2], minHeight: objetivoTactil.minimo, paddingVertical: espacio[1] },
	region: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: espacio[3],
		borderWidth: 1,
		borderRadius: radio.md,
		paddingHorizontal: espacio[4],
		paddingVertical: espacio[3],
		minHeight: objetivoTactil.comodo,
	},
});
