import { router, useLocalSearchParams } from 'expo-router';
import { establecimientosDe, fechaCorteRenipress } from '@/contenido/establecimientos';
import { regionPorId } from '@/contenido/regiones';
import { ListaEstablecimientos } from '@/region/establecimientos';
import { Boton, Cabecera, Pantalla, Texto, TextoCabecera } from '@/ui';
import { formatoDia } from '@/utiles/fechas';

/** Hospitales y centros de salud de una región. Pública: no necesita cuenta. */
export default function EstablecimientosDeRegion() {
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
				<Cabecera volver antetitulo="Hospitales y centros de salud" titulo={region.nombre}>
					<TextoCabecera>
						{establecimientosDe(region.id).length} establecimientos públicos, de EsSalud y de las sanidades. Registro oficial de Susalud al{' '}
						{formatoDia(fechaCorteRenipress)}.
					</TextoCabecera>
				</Cabecera>
			}
		>
			<ListaEstablecimientos region={region} />
		</Pantalla>
	);
}
