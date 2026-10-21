import { router } from 'expo-router';
import { useCitas } from '@/api/consultas';
import { Boton, BotonCabecera, Cabecera, Cargando, ErrorApi, Insignia, Pantalla, Pila, Tarjeta, Texto, Titulo, useAhora } from '@/ui';
import { TarjetaCita } from '@/ui/tarjeta-cita';
import { ESTADO_CITA, SERVICIO } from '@/utiles/etiquetas';
import { formatoFechaHora } from '@/utiles/fechas';

export default function Citas() {
	const citas = useCitas();
	const ahora = useAhora();
	const cabecera = (
		<Cabecera antetitulo="Teleorientación y teleconsulta" titulo="Mis citas">
			<BotonCabecera icono="citaNueva" texto="Reservar una cita" onPress={() => router.push('/reservar')} />
		</Cabecera>
	);
	if (citas.isPending) return <Pantalla cabecera={cabecera}><Cargando /></Pantalla>;
	if (citas.error) return <Pantalla cabecera={cabecera}><ErrorApi error={citas.error} /></Pantalla>;
	const proximas = citas.data.filter((c) => ['programada', 'en_curso'].includes(c.estado)).sort((a, b) => a.inicio.localeCompare(b.inicio));
	const anteriores = citas.data.filter((c) => !['programada', 'en_curso'].includes(c.estado));
	return (
		<Pantalla cabecera={cabecera}>
			<Pila>
				<Titulo nivel={2}>Próximas</Titulo>
				{proximas.length === 0 ? <Texto suave>No tienes citas programadas.</Texto> : proximas.map((c) => <TarjetaCita key={c.id} cita={c} ahora={ahora} />)}
			</Pila>
			{anteriores.length > 0 && (
				<Pila>
					<Titulo nivel={2}>Anteriores</Titulo>
					{anteriores.map((c) => (
						<Tarjeta key={c.id}>
							<Texto>
								{formatoFechaHora(c.inicio)} · {SERVICIO[c.servicio]} · {c.profesional.apellidos}
							</Texto>
							<Insignia texto={ESTADO_CITA[c.estado].texto} tono={ESTADO_CITA[c.estado].tono} />
							<Boton texto="Ver" variante="secundario" onPress={() => router.push(`/cita/${c.id}`)} />
						</Tarjeta>
					))}
				</Pila>
			)}
		</Pantalla>
	);
}
