import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { api, exigir, ProblemaApi } from '@/api/cliente';
import { claves, useConsentimientos, useTextosConsentimiento, vigentes } from '@/api/consultas';
import { router } from 'expo-router';
import { useRegion } from '@/region/region';
import { useSesion, useUsuario } from '@/sesion/sesion';
import { espacio, type PreferenciaTema, useTema } from '@/tema';
import {
	Aviso,
	Boton,
	Cabecera,
	Campo,
	Cargando,
	ErrorApi,
	IconoRedondo,
	Insignia,
	Opcion,
	Pantalla,
	Pila,
	Tarjeta,
	TarjetaEnlace,
	Texto,
	TextoCabecera,
	Titulo,
} from '@/ui';
import { NIVEL_IDENTIDAD } from '@/utiles/etiquetas';
import { formatoFechaHora } from '@/utiles/fechas';

export default function Cuenta() {
	const usuario = useUsuario();
	const { cerrarSesion } = useSesion();
	const consentimientos = useConsentimientos();
	const cerrarTodas = useMutation({
		mutationFn: () => exigir(api.POST('/v1/auth/sesiones/cerrar-todas')),
		onSettled: () => cerrarSesion(),
	});
	const datosAceptados = vigentes(consentimientos.data).has('datos_personales');

	return (
		<Pantalla
			cabecera={
				<Cabecera antetitulo="Mi cuenta" titulo={`${usuario.nombres} ${usuario.apellidos}`}>
					<TextoCabecera>{NIVEL_IDENTIDAD[usuario.nivelIdentidad]}</TextoCabecera>
				</Cabecera>
			}
		>
			<Consentimientos />
			{usuario.nivelIdentidad === 'N0' &&
				(datosAceptados ? <DeclararIdentidad /> : <Aviso tipo="informacion">Para registrar tu documento, primero acepta el tratamiento de tus datos personales.</Aviso>)}
			{usuario.nivelIdentidad === 'N1' && (
				<Aviso tipo="informacion" titulo="Falta la verificación de la IPRESS">
					La IPRESS confirmará tu identidad por teléfono o cuando acudas al establecimiento. Mientras tanto puedes usar la teleorientación.
				</Aviso>
			)}
			<MiRegion />
			<SelectorTema />
			<Tarjeta>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: espacio[3] }}>
					<IconoRedondo nombre="seguridad" />
					<Titulo nivel={2}>Seguridad</Titulo>
				</View>
				<Texto suave>Si perdiste tu celular o crees que alguien usó tu cuenta, cierra la sesión en todos tus dispositivos.</Texto>
				<ErrorApi error={cerrarTodas.error} />
				<Boton
					texto="Cerrar sesión en todos los dispositivos"
					variante="secundario"
					ocupado={cerrarTodas.isPending}
					onPress={() =>
						Alert.alert('¿Cerrar todas las sesiones?', 'Tendrás que volver a ingresar en este y en tus otros dispositivos.', [
							{ text: 'Volver', style: 'cancel' },
							{ text: 'Sí, cerrar todas', style: 'destructive', onPress: () => cerrarTodas.mutate() },
						])
					}
				/>
				<Boton texto="Salir de esta cuenta" icono="salir" variante="texto" onPress={() => void cerrarSesion()} />
			</Tarjeta>
		</Pantalla>
	);
}

function Consentimientos() {
	const usuario = useUsuario();
	const textos = useTextosConsentimiento();
	const lista = useConsentimientos();
	const cliente = useQueryClient();
	const [leyendo, setLeyendo] = useState<string | null>(null);
	const otorgar = useMutation({
		mutationFn: (t: { tipo: 'datos_personales' | 'telemedicina'; version: string }) => exigir(api.POST('/v1/consentimientos', { body: t })),
		onSuccess: async () => {
			setLeyendo(null);
			await cliente.invalidateQueries({ queryKey: claves.consentimientos });
		},
	});
	const revocar = useMutation({
		mutationFn: (id: string) => exigir(api.POST('/v1/consentimientos/{id}/revocar', { params: { path: { id } } })),
		onSuccess: () => cliente.invalidateQueries({ queryKey: claves.consentimientos }),
	});

	if (textos.isPending || lista.isPending) return <Cargando />;
	if (textos.error || lista.error) return <ErrorApi error={textos.error ?? lista.error} />;

	return (
		<Tarjeta>
			<Titulo nivel={2}>Consentimientos</Titulo>
			{textos.data.map((t) => {
				const vigente = lista.data.find((c) => c.tipo === t.tipo && c.revocadoEn === null);
				const bloqueado = t.tipo === 'telemedicina' && usuario.nivelIdentidad !== 'N2';
				return (
					<Pila key={t.tipo} separacion={espacio[2]}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: espacio[2], flexWrap: 'wrap' }}>
							<Texto pesoTexto="seminegrita">{t.titulo}</Texto>
							<Insignia texto={vigente ? 'Aceptado' : 'Pendiente'} tono={vigente ? 'exito' : 'neutro'} />
						</View>
						{t.version.startsWith('borrador') && (
							<Texto variante="sm" suave>
								Texto en borrador: debe aprobarlo el área legal antes del piloto.
							</Texto>
						)}
						{leyendo === t.tipo ? (
							<Pila separacion={espacio[2]}>
								<Aviso tipo="informacion">{t.texto}</Aviso>
								<ErrorApi error={otorgar.error} />
								<Boton texto="Leí y acepto" ocupado={otorgar.isPending} onPress={() => otorgar.mutate({ tipo: t.tipo, version: t.version })} />
								<Boton texto="Ahora no" variante="secundario" onPress={() => setLeyendo(null)} />
							</Pila>
						) : vigente ? (
							<>
								<Texto variante="sm" suave>
									Desde el {formatoFechaHora(vigente.otorgadoEn)}
								</Texto>
								<Boton
									texto="Revocar"
									variante="texto"
									onPress={() =>
										Alert.alert('¿Revocar el consentimiento?', 'Sin este consentimiento no podrás usar los servicios que dependen de él.', [
											{ text: 'Volver', style: 'cancel' },
											{ text: 'Sí, revocar', style: 'destructive', onPress: () => revocar.mutate(vigente.id) },
										])
									}
								/>
							</>
						) : bloqueado ? (
							<Texto suave>Disponible cuando la IPRESS verifique tu identidad.</Texto>
						) : (
							<Boton texto="Leer" variante="secundario" onPress={() => setLeyendo(t.tipo)} />
						)}
					</Pila>
				);
			})}
			<ErrorApi error={revocar.error} />
		</Tarjeta>
	);
}

function DeclararIdentidad() {
	const { refrescar } = useSesion();
	const [tipoDocumento, setTipo] = useState<'DNI' | 'CE' | 'PASAPORTE' | 'SIN_DOCUMENTO'>('DNI');
	const [numeroDocumento, setNumero] = useState('');
	const [fechaNacimiento, setFecha] = useState('');
	const declarar = useMutation({
		mutationFn: () =>
			exigir(
				api.POST('/v1/paciente/identidad', {
					body: { tipoDocumento, fechaNacimiento, ...(tipoDocumento !== 'SIN_DOCUMENTO' ? { numeroDocumento } : {}) },
				}),
			),
		onSuccess: () => refrescar(),
	});
	const errorDe = (campo: string) => (declarar.error instanceof ProblemaApi ? declarar.error.campos.find((c) => c.campo === campo)?.mensaje : undefined);
	const opciones = [
		['DNI', 'DNI'],
		['CE', 'Carné de extranjería'],
		['PASAPORTE', 'Pasaporte'],
		['SIN_DOCUMENTO', 'No tengo documento'],
	] as const;
	return (
		<Tarjeta>
			<Titulo nivel={2}>Tu documento de identidad</Titulo>
			<Texto suave>Se guarda cifrado. La IPRESS lo usa para verificar que eres tú.</Texto>
			{opciones.map(([valor, texto]) => (
				<Opcion key={valor} tipo="radio" marcada={tipoDocumento === valor} titulo={texto} alPresionar={() => setTipo(valor)} />
			))}
			{tipoDocumento !== 'SIN_DOCUMENTO' && (
				<Campo
					etiqueta="Número de documento"
					keyboardType={tipoDocumento === 'DNI' ? 'number-pad' : 'default'}
					maxLength={20}
					error={errorDe('numeroDocumento')}
					value={numeroDocumento}
					onChangeText={setNumero}
				/>
			)}
			<Campo
				etiqueta="Fecha de nacimiento"
				ayuda="Formato AAAA-MM-DD, por ejemplo 1985-04-12."
				keyboardType="numbers-and-punctuation"
				maxLength={10}
				error={errorDe('fechaNacimiento')}
				value={fechaNacimiento}
				onChangeText={setFecha}
			/>
			<ErrorApi error={declarar.error} />
			<Boton texto="Guardar" ocupado={declarar.isPending} onPress={() => declarar.mutate()} />
		</Tarjeta>
	);
}

/** La región se guarda solo en el teléfono; aquí se puede cambiar u olvidar. */
function MiRegion() {
	const { region, olvidar } = useRegion();
	if (!region) {
		return <TarjetaEnlace icono="region" titulo="Elige tu región" descripcion="Para ver la información de salud de donde vives." onPress={() => router.push('/region')} />;
	}
	return (
		<Tarjeta>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: espacio[3] }}>
				<IconoRedondo nombre="region" />
				<View style={{ flex: 1 }}>
					<Titulo nivel={2}>Mi región</Titulo>
					<Texto suave>{region.nombre}</Texto>
				</View>
			</View>
			<Texto variante="sm" suave>
				Se guarda solo en este teléfono. No se envía a Doktur ni queda en tu cuenta.
			</Texto>
			<Boton texto="Cambiar región" variante="secundario" onPress={() => router.push('/regiones')} />
			<Boton texto="Olvidar mi región" variante="texto" onPress={() => void olvidar()} />
		</Tarjeta>
	);
}

function SelectorTema() {
	const { preferencia, setPreferencia } = useTema();
	const opciones: Array<[PreferenciaTema, string]> = [
		['sistema', 'Como el teléfono'],
		['claro', 'Claro'],
		['oscuro', 'Oscuro'],
	];
	return (
		<Tarjeta>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: espacio[3] }}>
				<IconoRedondo nombre="apariencia" />
				<Titulo nivel={2}>Apariencia</Titulo>
			</View>
			{opciones.map(([valor, texto]) => (
				<Opcion key={valor} tipo="radio" marcada={preferencia === valor} titulo={texto} alPresionar={() => setPreferencia(valor)} />
			))}
		</Tarjeta>
	);
}
