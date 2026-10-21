// Íconos de Lucide (los mismos trazos que la web). Se importa cada ícono por separado:
// importar desde 'lucide-react-native' metería los ~1700 íconos en el bundle.
import type { LucideIcon } from 'lucide-react-native';
import Activity from 'lucide-react-native/icons/activity';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import Bug from 'lucide-react-native/icons/bug';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import CalendarPlus from 'lucide-react-native/icons/calendar-plus';
import Check from 'lucide-react-native/icons/check';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import CircleAlert from 'lucide-react-native/icons/circle-alert';
import CircleCheck from 'lucide-react-native/icons/circle-check';
import CircleUserRound from 'lucide-react-native/icons/circle-user-round';
import CloudRain from 'lucide-react-native/icons/cloud-rain';
import ExternalLink from 'lucide-react-native/icons/external-link';
import Hospital from 'lucide-react-native/icons/hospital';
import House from 'lucide-react-native/icons/house';
import Info from 'lucide-react-native/icons/info';
import ListChecks from 'lucide-react-native/icons/list-checks';
import LogOut from 'lucide-react-native/icons/log-out';
import MapPin from 'lucide-react-native/icons/map-pin';
import Phone from 'lucide-react-native/icons/phone';
import PhoneCall from 'lucide-react-native/icons/phone-call';
import Search from 'lucide-react-native/icons/search';
import ShieldCheck from 'lucide-react-native/icons/shield-check';
import Siren from 'lucide-react-native/icons/siren';
import Stethoscope from 'lucide-react-native/icons/stethoscope';
import Sun from 'lucide-react-native/icons/sun';
import SunMoon from 'lucide-react-native/icons/sun-moon';
import TriangleAlert from 'lucide-react-native/icons/triangle-alert';
import TrendingUp from 'lucide-react-native/icons/trending-up';
import Video from 'lucide-react-native/icons/video';
import WavesHorizontal from 'lucide-react-native/icons/waves-horizontal';

export type { LucideIcon as TipoIcono };

export const iconos = {
	actividad: Activity,
	alarma: Siren,
	alerta: TriangleAlert,
	apariencia: SunMoon,
	atras: ChevronLeft,
	buscar: Search,
	calendario: CalendarDays,
	check: Check,
	chevron: ChevronRight,
	citaNueva: CalendarPlus,
	clima: CloudRain,
	correcto: CircleCheck,
	cuenta: CircleUserRound,
	enlaceExterno: ExternalLink,
	error: CircleAlert,
	estetoscopio: Stethoscope,
	flecha: ArrowRight,
	hospital: Hospital,
	informacion: Info,
	inicio: House,
	lista: ListChecks,
	mixto: WavesHorizontal,
	region: MapPin,
	salir: LogOut,
	seguridad: ShieldCheck,
	sol: Sun,
	telefono: Phone,
	telefonoLlamada: PhoneCall,
	tendencia: TrendingUp,
	vector: Bug,
	video: Video,
} satisfies Record<string, LucideIcon>;

export type NombreIcono = keyof typeof iconos;
