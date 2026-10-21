import { useSesion } from '@/sesion/sesion';
import { Aviso, Boton, Cabecera, Pantalla, TextoCabecera } from '@/ui';

/** El personal de salud usa el portal web (segundo factor, pantallas de trabajo amplias). */
export default function SoloPortal() {
	const { usuario, cerrarSesion } = useSesion();
	return (
		<Pantalla
			cabecera={
				<Cabecera antetitulo={`Hola, ${usuario?.nombres ?? ''}`} titulo="Usa el portal web">
					<TextoCabecera>Esta app es para pacientes.</TextoCabecera>
				</Cabecera>
			}
		>
			<Aviso tipo="informacion">El personal de salud y de la IPRESS trabaja desde el portal web, que pide el código de tu app de autenticación.</Aviso>
			<Boton texto="Salir" icono="salir" variante="secundario" onPress={() => void cerrarSesion()} />
		</Pantalla>
	);
}
