import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { tamano, useTema } from '@/tema';
import { Icono, type NombreIcono } from '@/ui';

const icono =
	(nombre: NombreIcono) =>
	({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => <Icono nombre={nombre} color={color} medida={size} grosor={focused ? 2.4 : 2} />;

export default function Pestanas() {
	const { color } = useTema();
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: color.texto.marca,
				tabBarInactiveTintColor: color.texto.suave,
				tabBarStyle: { backgroundColor: color.fondo.elevado, borderTopColor: color.borde.base },
				tabBarLabelStyle: { fontSize: tamano.xs, fontWeight: '600' },
			}}
		>
			<Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: icono('inicio') }} />
			<Tabs.Screen name="region" options={{ title: 'Mi región', tabBarIcon: icono('region') }} />
			<Tabs.Screen name="signos" options={{ title: 'Alarma', tabBarIcon: icono('alarma') }} />
			<Tabs.Screen name="citas" options={{ title: 'Citas', tabBarIcon: icono('calendario') }} />
			<Tabs.Screen name="cuenta" options={{ title: 'Cuenta', tabBarIcon: icono('cuenta') }} />
		</Tabs>
	);
}
