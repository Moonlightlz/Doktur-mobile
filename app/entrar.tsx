import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ProblemaApi } from '@/api/cliente';
import { useSesion } from '@/sesion/sesion';
import { Aviso, Boton, Cabecera, Campo, ErrorApi, Pantalla, Pila, Tarjeta, TarjetaEnlace, Texto, TextoCabecera } from '@/ui';

export default function Entrar() {
	const { iniciarSesion, expirada } = useSesion();
	const [identificador, setIdentificador] = useState('');
	const [contrasena, setContrasena] = useState('');
	const [error, setError] = useState<unknown>(null);
	const [enviando, setEnviando] = useState(false);

	async function enviar() {
		setError(null);
		setEnviando(true);
		try {
			await iniciarSesion({ identificador, contrasena });
		} catch (e) {
			// El personal de salud usa el portal web (con segundo factor).
			setError(
				e instanceof ProblemaApi && e.codigo === 'requiere_totp'
					? new ProblemaApi(401, 'solo_portal', 'Esta app es para pacientes. El personal de salud ingresa por el portal web.')
					: e,
			);
		} finally {
			setEnviando(false);
		}
	}

	return (
		<Pantalla
			cabecera={
				<Cabecera antetitulo="Doktur" titulo="Ingresar">
					<TextoCabecera>Con tu número de celular y tu contraseña.</TextoCabecera>
				</Cabecera>
			}
		>
			{expirada && <Aviso tipo="aviso">Tu sesión terminó. Vuelve a ingresar para continuar.</Aviso>}
			<Tarjeta>
				<Pila>
					<Campo
						etiqueta="Celular"
						keyboardType="phone-pad"
						autoComplete="tel"
						textContentType="telephoneNumber"
						value={identificador}
						onChangeText={setIdentificador}
					/>
					<Campo
						etiqueta="Contraseña"
						secureTextEntry
						autoComplete="current-password"
						textContentType="password"
						value={contrasena}
						onChangeText={setContrasena}
						onSubmitEditing={enviar}
					/>
					<ErrorApi error={error} />
					<Boton texto="Ingresar" ocupado={enviando} onPress={enviar} />
				</Pila>
			</Tarjeta>
			<Link href="/registro" asChild>
				<Boton texto="Crear una cuenta" variante="texto" />
			</Link>
			<Texto variante="sm" suave>
				Sin cuenta también puedes ver:
			</Texto>
			<TarjetaEnlace icono="region" titulo="Salud en tu región" descripcion="Enfermedades frecuentes y clima donde vives." onPress={() => router.push('/regiones')} />
			<TarjetaEnlace
				icono="tendencia"
				tono="informacion"
				titulo="Qué puede pasar con El Niño"
				descripcion="Escenarios para tu salud de aquí a mayo de 2027."
				onPress={() => router.push('/pronostico')}
			/>
		</Pantalla>
	);
}
