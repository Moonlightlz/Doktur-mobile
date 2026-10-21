import { router } from 'expo-router';
import { View } from 'react-native';
import type { Esquemas } from '../api/cliente';
import { espacio } from '../tema';
import { ESTADO_CITA, SERVICIO } from '../utiles/etiquetas';
import { formatoFechaLarga, formatoHora, salaAbierta } from '../utiles/fechas';
import { Boton, Insignia, Tarjeta, Texto } from './index';

export function TarjetaCita({ cita, ahora }: { cita: Esquemas['CitaResumenDto']; ahora: number }) {
	const abierta = salaAbierta(cita, ahora);
	const e = ESTADO_CITA[cita.estado];
	return (
		<Tarjeta tipo={abierta ? 'destacada' : 'normal'}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: espacio[2], flexWrap: 'wrap' }}>
				<Texto pesoTexto="negrita">
					{formatoFechaLarga(cita.inicio)}, {formatoHora(cita.inicio)}
				</Texto>
				<Insignia texto={e.texto} tono={e.tono} />
			</View>
			<Texto>
				{SERVICIO[cita.servicio]} con {cita.profesional.nombres} {cita.profesional.apellidos}
			</Texto>
			<Texto variante="sm" suave>
				{cita.profesional.especialidad}
			</Texto>
			{abierta && <Boton texto="Entrar a la consulta" icono={cita.modalidad === 'video' ? 'video' : 'telefono'} onPress={() => router.push(`/sala/${cita.id}`)} />}
			<Boton texto="Ver detalle" variante="secundario" onPress={() => router.push(`/cita/${cita.id}`)} />
		</Tarjeta>
	);
}
