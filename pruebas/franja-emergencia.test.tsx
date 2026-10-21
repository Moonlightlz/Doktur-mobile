import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { ProveedorTema } from '@/tema';
import { FranjaEmergencia } from '@/ui';

describe('franja de emergencia (visible en todas las pantallas)', () => {
	it('llama al 106 y a la Línea 113 con un toque', async () => {
		const abrir = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
		await render(
			<ProveedorTema>
				<FranjaEmergencia />
			</ProveedorTema>,
		);
		expect(screen.getByText(/Demostración con datos ficticios/)).toBeTruthy();
		await fireEvent.press(screen.getByRole('link', { name: /Llamar al 106/ }));
		expect(abrir).toHaveBeenCalledWith('tel:106');
		await fireEvent.press(screen.getByRole('link', { name: /Línea 113/ }));
		expect(abrir).toHaveBeenCalledWith('tel:113');
	});
});
