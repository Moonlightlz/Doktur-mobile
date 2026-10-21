import { registerGlobals } from '@livekit/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProblemaApi } from '@/api/cliente';
import { ProveedorRegion } from '@/region/region';
import { ProveedorSesion, useSesion } from '@/sesion/sesion';
import { ProveedorTema, useTema } from '@/tema';

// WebRTC de LiveKit para React Native: debe registrarse antes de crear cualquier sala.
registerGlobals();
void SplashScreen.preventAutoHideAsync();

const consultas = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (intentos, error) => !(error instanceof ProblemaApi && error.estado >= 400 && error.estado < 500) && intentos < 1,
			staleTime: 15_000,
		},
	},
});

export default function Raiz() {
	return (
		<SafeAreaProvider>
			<QueryClientProvider client={consultas}>
				<ProveedorTema>
					<ProveedorSesion>
						<ProveedorRegion>
							<Navegacion />
						</ProveedorRegion>
					</ProveedorSesion>
				</ProveedorTema>
			</QueryClientProvider>
		</SafeAreaProvider>
	);
}

/** Qué pantallas existen según la sesión. La API vuelve a comprobar el rol en cada petición. */
function Navegacion() {
	const { cargando, usuario } = useSesion();
	const { color, oscuro } = useTema();
	useEffect(() => {
		if (!cargando) void SplashScreen.hideAsync();
	}, [cargando]);
	if (cargando) return null;
	const paciente = !!usuario?.roles.includes('paciente');
	return (
		<>
			<StatusBar style={oscuro ? 'light' : 'dark'} />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: color.fondo.sutil },
					headerStyle: { backgroundColor: color.fondo.elevado },
					headerTintColor: color.texto.marca,
					headerTitleStyle: { color: color.texto.base },
				}}
			>
				<Stack.Protected guard={!usuario}>
					<Stack.Screen name="entrar" />
					<Stack.Screen name="registro" />
				</Stack.Protected>
				<Stack.Protected guard={!!usuario && !paciente}>
					<Stack.Screen name="solo-portal" />
				</Stack.Protected>
				<Stack.Protected guard={paciente}>
					<Stack.Screen name="(pestanas)" />
					<Stack.Screen name="reservar" />
					<Stack.Screen name="cita/[id]" options={{ headerShown: true, title: 'Cita' }} />
					<Stack.Screen name="sala/[id]" options={{ headerShown: true, title: 'Consulta', gestureEnabled: false }} />
				</Stack.Protected>
				{/* Información pública (con o sin cuenta). Va al final: sin sesión, la primera pantalla sigue siendo "entrar". */}
				<Stack.Screen name="regiones/index" />
				<Stack.Screen name="regiones/[id]" />
				<Stack.Screen name="pronostico" />
				<Stack.Screen name="establecimientos/[id]" />
			</Stack>
		</>
	);
}
