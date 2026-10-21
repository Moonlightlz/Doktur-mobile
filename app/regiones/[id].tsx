import { router, useLocalSearchParams } from 'expo-router';
import { regionPorId, ZONAS } from '@/contenido/regiones';
import { DetalleRegion } from '@/region/componentes';
import { Boton, BotonCabecera, Cabecera, Pantalla, Texto, TextoCabecera } from '@/ui';

/** Salud en una región. Pública: no necesita cuenta. */
export default function SaludEnRegion() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const region = regionPorId(id);
	if (!region) {
		return (
			<Pantalla cabecera={<Cabecera volver titulo="No encontramos esa región" />}>
				<Texto>Elige tu región de la lista.</Texto>
				<Boton texto="Elegir mi región" icono="region" onPress={() => router.replace('/regiones')} />
			</Pantalla>
		);
	}
	return (
		<Pantalla
			cabecera={
				<Cabecera volver antetitulo="Salud en tu región" titulo={region.nombre}>
					<TextoCabecera>
						Capital: {region.capital} · {region.zonas.map((z) => ZONAS[z].nombre).join(' y ')}
					</TextoCabecera>
					<BotonCabecera icono="region" texto="Cambiar región" onPress={() => router.replace('/regiones')} />
				</Cabecera>
			}
		>
			<DetalleRegion region={region} />
		</Pantalla>
	);
}
