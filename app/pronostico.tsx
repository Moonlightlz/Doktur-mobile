import { router } from 'expo-router';
import { Linking, Pressable, View } from 'react-native';
import { type Afirmacion, ETIQUETA_EVIDENCIA, type Evidencia, PERIODOS, pronosticoActualizado } from '@/contenido/pronostico';
import { type ClaveFuente, FUENTES } from '@/contenido/regiones';
import { AvisoBorrador, ListaFuentes, TarjetaZona } from '@/region/componentes';
import { useRegion } from '@/region/region';
import { espacio, objetivoTactil, useTema } from '@/tema';
import { Aviso, Cabecera, IconoRedondo, Insignia, Pila, Seccion, Tarjeta, TarjetaEnlace, Texto, TextoCabecera, Titulo, Pantalla } from '@/ui';
import type { Tono } from '@/utiles/etiquetas';
import { formatoDia } from '@/utiles/fechas';

const TONO_EVIDENCIA: Record<Evidencia, Tono> = { hecho: 'exito', pronostico: 'informacion', estimacion: 'aviso', hipotesis: 'neutro' };
const SIGNIFICADO: Record<Evidencia, string> = {
	hecho: 'ya ocurrió y está documentado.',
	pronostico: 'lo anuncia una institución oficial (ENFEN, Senamhi).',
	estimacion: 'lo esperable según los datos y Niños anteriores.',
	hipotesis: 'podría pasar; se vigila, no se afirma.',
};

/**
 * Qué puede pasar con El Niño 2026-2027. NO es un pronóstico oficial: cada afirmación muestra su nivel
 * de evidencia y su fuente. Pública: no necesita cuenta.
 */
export default function Pronostico() {
	const { region } = useRegion();
	const todas: ClaveFuente[] = PERIODOS.flatMap((p) => [...p.clima, ...p.salud].flatMap((a) => a.fuentes));
	return (
		<Pantalla
			cabecera={
				<Cabecera volver antetitulo="El Niño 2026-2027" titulo="Qué puede pasar">
					<TextoCabecera>Escenarios para tu salud de aquí a mayo de 2027. Actualizado el {formatoDia(pronosticoActualizado.fecha)}.</TextoCabecera>
				</Cabecera>
			}
		>
			<Aviso tipo="informacion" titulo="Esto no es un pronóstico oficial">
				{`Son escenarios preparados con los comunicados del ENFEN, los datos del Ministerio de Salud y lo que pasó en Niños anteriores. El clima puede cambiar: los revisamos con cada comunicado oficial. Próxima revisión: ${formatoDia(pronosticoActualizado.proximaRevision)}.`}
			</Aviso>
			<AvisoBorrador />

			{region ? (
				<Seccion titulo={`En ${region.nombre}`} accion={{ texto: 'Ver mi región', onPress: () => router.push({ pathname: '/regiones/[id]', params: { id: region.id } }) }}>
					{region.zonas.map((z) => (
						<TarjetaZona key={z} zona={z} />
					))}
				</Seccion>
			) : (
				<TarjetaEnlace icono="region" titulo="Elige tu región" descripcion="Para ver lo que se espera donde vives." onPress={() => router.push('/regiones')} />
			)}

			<Tarjeta>
				<Titulo nivel={3}>Qué significa cada etiqueta</Titulo>
				{(Object.keys(SIGNIFICADO) as Evidencia[]).map((e) => (
					<View key={e} style={{ gap: espacio[1] }}>
						<Insignia texto={ETIQUETA_EVIDENCIA[e]} tono={TONO_EVIDENCIA[e]} />
						<Texto variante="sm">{SIGNIFICADO[e]}</Texto>
					</View>
				))}
			</Tarjeta>

			{PERIODOS.map((p) => (
				<Pila key={p.id}>
					<View style={{ gap: espacio[1] }}>
						<Titulo nivel={2}>{p.titulo}</Titulo>
						<Texto suave>{p.resumen}</Texto>
					</View>
					<BloqueAfirmaciones titulo="Clima" icono="clima" tono="informacion" afirmaciones={p.clima} />
					<BloqueAfirmaciones titulo="Salud" icono="actividad" tono="marca" afirmaciones={p.salud} />
					<Tarjeta tipo="destacada">
						<Titulo nivel={3}>Qué puedes hacer</Titulo>
						{p.queHacer.map((q) => (
							<Texto key={q}>• {q}</Texto>
						))}
					</Tarjeta>
				</Pila>
			))}

			<ListaFuentes claves={todas} />
		</Pantalla>
	);
}

function BloqueAfirmaciones({ titulo, icono, tono, afirmaciones }: { titulo: string; icono: 'clima' | 'actividad'; tono: Tono; afirmaciones: Afirmacion[] }) {
	const { color } = useTema();
	return (
		<Tarjeta>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: espacio[3] }}>
				<IconoRedondo nombre={icono} tono={tono} />
				<Titulo nivel={3}>{titulo}</Titulo>
			</View>
			{afirmaciones.map((a) => (
				<View key={a.texto} style={{ gap: espacio[1] }}>
					<Insignia texto={ETIQUETA_EVIDENCIA[a.evidencia]} tono={TONO_EVIDENCIA[a.evidencia]} />
					<Texto>{a.texto}</Texto>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: espacio[3] }}>
						{a.fuentes.map((f) => (
							<Pressable
								key={f}
								accessibilityRole="link"
								accessibilityLabel={`Fuente: ${FUENTES[f].nombre}`}
								onPress={() => void Linking.openURL(FUENTES[f].url)}
								style={{ minHeight: objetivoTactil.minimo, justifyContent: 'center' }}
							>
								<Texto variante="sm" style={{ color: color.texto.enlace, textDecorationLine: 'underline' }}>
									{FUENTES[f].institucion}
								</Texto>
							</Pressable>
						))}
					</View>
				</View>
			))}
		</Tarjeta>
	);
}
