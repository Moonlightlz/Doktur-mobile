/** Pruebas unitarias y de componentes (jest-expo). Sin dispositivo ni emulador. */
module.exports = {
	preset: 'jest-expo',
	testMatch: ['<rootDir>/pruebas/**/*.test.ts?(x)'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		// Metro usa la versión ESM de cada ícono; en Jest se usa la CommonJS equivalente del mismo paquete.
		'^lucide-react-native/icons/(.*)$': '<rootDir>/node_modules/lucide-react-native/dist/cjs/icons/$1.js',
	},
};
