import { useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import {
	CATEGORIA,
	type Establecimiento,
	establecimientosDe,
	fechaCorteRenipress,
	fuenteRenipress,
	GRUPOS,
	grupoDe,
	INSTITUCION,
	validacionEstablecimientos,
} from '../contenido/establecimientos';
import { linea113 } from '../contenido/emergencias';
import { type Region, tieneSamu } from '../contenido/regiones';
import { espacio } from '../tema';
import { Aviso, Boton, BotonLlamar, Campo, Insignia, Pila, Seccion, Tarjeta, Texto, Titulo } from '../ui';
import { formatoDia } from '../utiles/fechas';
import { sinTildes } from './componentes';

const LIMITE_INICIAL = 30;

/** Abre la ubicación en la app de mapas del teléfono (no se envía nada hasta que la persona lo toca). */
function abrirMapa(e: Establecimiento) {
	if (e.lat === undefined || e.lon === undefined) return;
	const nombre = encodeURIComponent(e.nombre);
	const url = Platform.OS === 'ios' ? `https://maps.apple.com/?ll=${e.lat},${e.lon}&q=${nombre}` : `geo:${e.lat},${e.lon}?q=${e.lat},${e.lon}(${nombre})`;
	void Linking.openURL(url);
}

function TarjetaEstablecimiento({ e }: { e: Establecimiento }) {
	return (
		<Tarjeta>
			<Texto pesoTexto="negrita" variante="lg">
				{e.nombre}
			</Texto>
			<View style={estilos.etiquetas}>
				<Insignia texto={`${CATEGORIA[e.categoria].nombre} · ${e.categoria}`} tono={grupoDe(e.categoria) === 'general' ? 'marca' : 'informacion'} />
				<Insignia texto={INSTITUCION[e.institucion]} />
			</View>
			<Texto>
				{e.direccion}, {e.distrito}
			</Texto>
			{e.horario && (
				<Texto variante="sm" suave>
					Horario registrado: {e.horario}
				</Texto>
			)}
			{e.tel ? (
				<BotonLlamar numero={e.tel} texto={`Llamar: ${e.telefono}`} variante="secundario" />
			) : (
				e.telefono && (
					<Texto variante="sm" suave>
						Teléfono registrado: {e.telefono}
					</Texto>
				)
			)}
			{e.lat !== undefined && <Boton texto="Cómo llegar" icono="region" variante="texto" accessibilityHint="Abre la app de mapas" onPress={() => abrirMapa(e)} />}
		</Tarjeta>
	);
}

/** Hospitales y centros de salud con camas de una región (Renipress), con buscador. */
export function ListaEstablecimientos({ region }: { region: Region }) {
	const [busqueda, setBusqueda] = useState('');
	const [todos, setTodos] = useState(false);
	const ordenGrupo = (e: Establecimiento) => GRUPOS.findIndex((g) => g.grupo === grupoDe(e.categoria));
	const filtro = sinTildes(busqueda.trim());
	const lista = establecimientosDe(region.id)
		.filter((e) => !filtro || [e.nombre, e.distrito, e.provincia].some((t) => sinTildes(t).includes(filtro)))
		.sort((a, b) => a.provincia.localeCompare(b.provincia) || ordenGrupo(a) - ordenGrupo(b) || a.nombre.localeCompare(b.nombre));
	const visibles = todos || filtro ? lista : lista.slice(0, LIMITE_INICIAL);
	const provincias = [...new Set(visibles.map((e) => e.provincia))];
	const samu = tieneSamu(region);

	return (
		<>
			{validacionEstablecimientos.estado !== 'validado' && (
				<Aviso tipo="aviso" titulo="Borrador: pendiente de revisión">
					Los datos son del registro oficial, pero los textos de orientación todavía no fueron revisados.
				</Aviso>
			)}
			<Tarjeta tipo="alerta">
				<Titulo nivel={2}>Si es una emergencia</Titulo>
				<Texto>
					{samu
						? 'Llama al 106 (SAMU) o ve a la emergencia más cercana.'
						: `En la lista oficial de gob.pe, el SAMU 106 no figura para ${region.nombre}: ve a la emergencia más cercana.`}{' '}
					Por ley, todo establecimiento de salud debe atender una emergencia (Ley N.° 27604).
				</Texto>
				{samu && <BotonLlamar numero="106" texto="Llamar al 106 (SAMU)" />}
				<BotonLlamar numero={linea113.numero} texto={`Línea ${linea113.numero} Salud`} variante="secundario" />
			</Tarjeta>
			<Aviso tipo="informacion" titulo="Si puedes, llama antes de ir">
				Los teléfonos y horarios son los que cada establecimiento registró en Susalud y pueden haber cambiado. No incluye clínicas privadas ni puestos de salud sin camas.
			</Aviso>
			<Campo etiqueta="Buscar por nombre, distrito o provincia" autoCorrect={false} value={busqueda} onChangeText={setBusqueda} returnKeyType="search" />
			{lista.length === 0 && <Texto suave>No encontramos establecimientos con ese nombre o lugar.</Texto>}
			{provincias.map((p) => (
				<Seccion key={p} titulo={`Provincia de ${p}`}>
					{visibles
						.filter((e) => e.provincia === p)
						.map((e) => (
							<TarjetaEstablecimiento key={e.codigo} e={e} />
						))}
				</Seccion>
			))}
			{visibles.length < lista.length && <Boton texto={`Mostrar todos (${lista.length})`} variante="secundario" onPress={() => setTodos(true)} />}
			<Pila separacion={espacio[1]}>
				<Texto variante="sm" suave>
					Fuente: {fuenteRenipress.nombre}. {fuenteRenipress.institucion}. Datos al {formatoDia(fechaCorteRenipress)}. Licencia: {fuenteRenipress.licencia}.
				</Texto>
				<Boton texto="Ver la fuente" icono="enlaceExterno" variante="texto" onPress={() => void Linking.openURL(fuenteRenipress.url)} />
			</Pila>
		</>
	);
}

const estilos = StyleSheet.create({
	etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio[2] },
});
