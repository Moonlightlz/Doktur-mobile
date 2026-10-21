import { router } from 'expo-router';
import { ListaRegiones } from '@/region/componentes';
import { useRegion } from '@/region/region';
import { Cabecera, Pantalla, TextoCabecera } from '@/ui';

/** Selector de región. Pública: también se abre sin cuenta, desde la pantalla de ingreso. */
export default function ElegirRegion() {
	const { region, elegir } = useRegion();
	return (
		<Pantalla
			cabecera={
				<Cabecera volver antetitulo="Personaliza la información" titulo="Elige tu región">
					<TextoCabecera>Tu región se guarda solo en este teléfono: no se envía a Doktur ni queda en tu cuenta.</TextoCabecera>
				</Cabecera>
			}
		>
			<ListaRegiones
				seleccionada={region?.id}
				alElegir={(r) => {
					void elegir(r.id);
					router.replace({ pathname: '/regiones/[id]', params: { id: r.id } });
				}}
			/>
		</Pantalla>
	);
}
