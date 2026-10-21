import { router } from 'expo-router';
import { useState } from 'react';
import { api, exigir, ProblemaApi } from '@/api/cliente';
import { useSesion } from '@/sesion/sesion';
import { Aviso, Boton, Cabecera, Campo, ErrorApi, Pantalla, Pila, Tarjeta, TextoCabecera } from '@/ui';

export default function Registro() {
	const { verificarTelefono } = useSesion();
	const [paso, setPaso] = useState<'datos' | 'codigo'>('datos');
	const [datos, setDatos] = useState({ nombres: '', apellidos: '', telefono: '', contrasena: '' });
	const [codigo, setCodigo] = useState('');
	const [error, setError] = useState<unknown>(null);
	const [enviando, setEnviando] = useState(false);
	const errorDe = (campo: string) => (error instanceof ProblemaApi ? error.campos.find((c) => c.campo === campo)?.mensaje : undefined);

	async function registrar() {
		setError(null);
		setEnviando(true);
		try {
			await exigir(api.POST('/v1/auth/registro', { body: datos }));
			setPaso('codigo');
		} catch (e) {
			setError(e);
		} finally {
			setEnviando(false);
		}
	}

	async function verificar() {
		setError(null);
		setEnviando(true);
		try {
			await verificarTelefono({ telefono: datos.telefono, codigo });
		} catch (e) {
			setError(e);
		} finally {
			setEnviando(false);
		}
	}

	if (paso === 'codigo') {
		return (
			<Pantalla
				cabecera={
					<Cabecera volver={() => setPaso('datos')} textoVolver="Cambiar el número" antetitulo="Paso 2 de 2" titulo="Revisa tu celular">
						<TextoCabecera>Te enviamos un código de 6 números por SMS al {datos.telefono}.</TextoCabecera>
					</Cabecera>
				}
			>
				<Aviso tipo="informacion">En esta demostración el SMS no se envía: el código aparece en la consola del servidor.</Aviso>
				<Tarjeta>
					<Pila>
						<Campo
							etiqueta="Código"
							keyboardType="number-pad"
							autoComplete="sms-otp"
							textContentType="oneTimeCode"
							maxLength={6}
							value={codigo}
							onChangeText={(t) => setCodigo(t.replace(/\D/g, ''))}
						/>
						<ErrorApi error={error} />
						<Boton texto="Confirmar" ocupado={enviando} onPress={verificar} />
					</Pila>
				</Tarjeta>
			</Pantalla>
		);
	}

	return (
		<Pantalla
			cabecera={
				<Cabecera volver textoVolver="Ya tengo cuenta" antetitulo="Paso 1 de 2" titulo="Crear una cuenta">
					<TextoCabecera>Para reservar citas y recibir orientación de un profesional de salud.</TextoCabecera>
				</Cabecera>
			}
		>
			<Tarjeta>
				<Pila>
					<Campo etiqueta="Nombres" autoComplete="given-name" maxLength={80} error={errorDe('nombres')} value={datos.nombres} onChangeText={(t) => setDatos({ ...datos, nombres: t })} />
					<Campo etiqueta="Apellidos" autoComplete="family-name" maxLength={80} error={errorDe('apellidos')} value={datos.apellidos} onChangeText={(t) => setDatos({ ...datos, apellidos: t })} />
					<Campo
						etiqueta="Celular"
						ayuda="9 dígitos, empieza con 9."
						keyboardType="phone-pad"
						autoComplete="tel"
						error={errorDe('telefono')}
						value={datos.telefono}
						onChangeText={(t) => setDatos({ ...datos, telefono: t })}
					/>
					<Campo
						etiqueta="Contraseña"
						ayuda="Al menos 8 caracteres, o un PIN de 6 o más números que no sea fácil de adivinar."
						secureTextEntry
						autoComplete="new-password"
						textContentType="newPassword"
						error={errorDe('contrasena')}
						value={datos.contrasena}
						onChangeText={(t) => setDatos({ ...datos, contrasena: t })}
					/>
					<ErrorApi error={error} />
					<Boton texto="Enviar código por SMS" ocupado={enviando} onPress={registrar} />
				</Pila>
			</Tarjeta>
			<Boton texto="Ya tengo cuenta" variante="texto" onPress={() => router.back()} />
		</Pantalla>
	);
}
