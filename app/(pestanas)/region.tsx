import { router } from 'expo-router';
import { ZONAS } from '@/contenido/regiones';
import { DetalleRegion, ListaRegiones } from '@/region/componentes';
import { useRegion } from '@/region/region';
import { BotonCabecera, Cabecera, Cargando, Pantalla, TextoCabecera } from '@/ui';

/** Pestaña "Mi región": la información de la región guardada, o el selector si aún no hay una. */
export default function MiRegion() {
	const { region, cargando, elegir } = useRegion();
	if (cargando) {
		return (
			<Pantalla>
				<Cargando />
			</Pantalla>
		);
	}
	if (!region) {
		return (
			<Pantalla
				cabecera={
					<Cabecera antetitulo="Personaliza la información" titulo="Elige tu región">
						<TextoCabecera>
							Te mostramos las enfermedades más frecuentes donde vives y lo que se espera del clima con El Niño. Tu región se guarda solo en este teléfono.
						</TextoCabecera>
					</Cabecera>
				}
			>
				<ListaRegiones alElegir={(r) => void elegir(r.id)} />
			</Pantalla>
		);
	}
	return (
		<Pantalla
			cabecera={
				<Cabecera antetitulo="Tu región" titulo={region.nombre}>
					<TextoCabecera>
						Capital: {region.capital} · {region.zonas.map((z) => ZONAS[z].nombre).join(' y ')}
					</TextoCabecera>
					<BotonCabecera icono="region" texto="Cambiar región" onPress={() => router.push('/regiones')} />
				</Cabecera>
			}
		>
			<DetalleRegion region={region} />
		</Pantalla>
	);
}
