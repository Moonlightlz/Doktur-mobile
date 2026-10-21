import { fireEvent, render, screen } from '@testing-library/react-native';
import { regionPorId } from '@/contenido/regiones';
import { DetalleRegion, ListaRegiones } from '@/region/componentes';
import { ListaEstablecimientos } from '@/region/establecimientos';
import { ProveedorTema } from '@/tema';

const conTema = (ui: React.ReactElement) => render(<ProveedorTema>{ui}</ProveedorTema>);

describe('información por región', () => {
	it('en Piura ofrece llamar al SAMU 106 y muestra el dengue como frecuente', async () => {
		await conTema(<DetalleRegion region={regionPorId('piura')!} />);
		expect(screen.getByRole('button', { name: 'Llamar al 106 (SAMU)' })).toBeTruthy();
		expect(screen.getByText('Frecuentes en tu región')).toBeTruthy();
		expect(screen.getByText('Dengue')).toBeTruthy();
		expect(screen.getByText(/Borrador: pendiente de validación médica/)).toBeTruthy();
	});

	it('en Puno no ofrece el 106 (no figura en la lista de gob.pe) pero sí la Línea 113', async () => {
		await conTema(<DetalleRegion region={regionPorId('puno')!} />);
		expect(screen.queryByRole('button', { name: /Llamar al 106/ })).toBeNull();
		expect(screen.getByText(/el SAMU 106 no figura para Puno/)).toBeTruthy();
		expect(screen.getByRole('button', { name: /Línea 113/ })).toBeTruthy();
	});

	it('lista los establecimientos de la región, con llamada y búsqueda por distrito', async () => {
		await conTema(<ListaEstablecimientos region={regionPorId('lima')!} />);
		expect(screen.getByRole('button', { name: 'Llamar al 106 (SAMU)' })).toBeTruthy();
		// Lima tiene más de 30: al inicio se muestran 30 y un botón para ver todos.
		expect(screen.getByRole('button', { name: /^Mostrar todos \(\d+\)$/ })).toBeTruthy();
		await fireEvent.changeText(screen.getByLabelText('Buscar por nombre, distrito o provincia'), 'barranca');
		expect(screen.getByText('Provincia de Barranca')).toBeTruthy();
		expect(screen.queryByText('Provincia de Cañete')).toBeNull();
		expect(screen.getByText(/Licencia: Open Data Commons Attribution License/)).toBeTruthy();
	});

	it('en Puno no ofrece el 106 en la lista de establecimientos', async () => {
		await conTema(<ListaEstablecimientos region={regionPorId('puno')!} />);
		expect(screen.queryByRole('button', { name: /Llamar al 106/ })).toBeNull();
		expect(screen.getAllByRole('button', { name: /^Llamar: / }).length).toBeGreaterThan(0);
	});

	it('el buscador encuentra regiones sin escribir tildes y marca la elegida', async () => {
		const alElegir = jest.fn();
		await conTema(<ListaRegiones seleccionada="piura" alElegir={alElegir} />);
		expect(screen.getByRole('radio', { name: /^Piura\./, checked: true })).toBeTruthy();
		await fireEvent.changeText(screen.getByLabelText('Buscar región o ciudad'), 'junin');
		expect(screen.queryByRole('radio', { name: /^Piura\./ })).toBeNull();
		await fireEvent.press(screen.getByRole('radio', { name: /^Junín\./ }));
		expect(alElegir).toHaveBeenCalledWith(expect.objectContaining({ id: 'junin' }));
	});
});
