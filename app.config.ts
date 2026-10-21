import type { ExpoConfig } from 'expo/config';
import tokens from './src/tema/tokens.json';

/**
 * Configuración de la app. Los colores de íconos y pantalla de inicio salen de los tokens
 * (@doktur/tokens, sincronizados con `npm run sincronizar`): si cambia la paleta, cambian aquí.
 *
 * La URL de la API se define al compilar con EXPO_PUBLIC_DOKTUR_API_URL (nunca secretos: todo lo
 * que va en la app es público). En desarrollo, la API en la computadora (http solo para depurar).
 */
const marca = tokens.temas.claro.accion.primaria.fondo;
const fondoClaro = tokens.temas.claro.fondo.base;
const fondoOscuro = tokens.temas.oscuro.fondo.base;

const configuracion: ExpoConfig = {
	name: 'Doktur',
	slug: 'doktur',
	scheme: 'doktur',
	version: '0.1.0',
	orientation: 'portrait',
	userInterfaceStyle: 'automatic',
	backgroundColor: fondoClaro,
	primaryColor: marca,
	ios: {
		// Identificador provisional: definirlo con la entidad legal antes de publicar (D-020).
		bundleIdentifier: 'pe.doktur.demo',
		supportsTablet: true,
		infoPlist: {
			NSMicrophoneUsageDescription: 'Doktur usa el micrófono para que hables con el profesional durante tu consulta.',
			NSCameraUsageDescription: 'Doktur usa la cámara solo si tú la enciendes durante una videoconsulta.',
			UIBackgroundModes: ['audio', 'voip'],
		},
		privacyManifests: { NSPrivacyTracking: false, NSPrivacyTrackingDomains: [] },
	},
	android: {
		package: 'pe.doktur.demo',
		// Sin copia de seguridad: el token de sesión vive en el Keystore y no debe restaurarse en otro equipo.
		allowBackup: false,
		adaptiveIcon: { backgroundColor: marca },
		permissions: [
			'android.permission.RECORD_AUDIO',
			'android.permission.CAMERA',
			'android.permission.MODIFY_AUDIO_SETTINGS',
			'android.permission.BLUETOOTH_CONNECT',
		],
		blockedPermissions: ['android.permission.ACCESS_FINE_LOCATION', 'android.permission.ACCESS_COARSE_LOCATION', 'android.permission.READ_CONTACTS'],
	},
	plugins: [
		'expo-router',
		'expo-secure-store',
		['expo-splash-screen', { backgroundColor: marca, dark: { backgroundColor: fondoOscuro } }],
		'@livekit/react-native-expo-plugin',
		'@config-plugins/react-native-webrtc',
		['expo-build-properties', { android: { minSdkVersion: 24, usesCleartextTraffic: false } }],
	],
	experiments: { typedRoutes: true },
	extra: {
		apiUrl: process.env.EXPO_PUBLIC_DOKTUR_API_URL ?? 'http://10.0.2.2:3180',
	},
};

export default configuracion;
