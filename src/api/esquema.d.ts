// Generado desde Doktur-back/openapi.json por herramientas/openapi/generar-tipos.mjs. NO EDITAR.
export interface paths {
    "/v1/auditoria/eventos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AuditoriaController_eventos"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auditoria/integridad": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AuditoriaController_integridad"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/registro": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["IdentidadController_registro"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/sesiones": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["IdentidadController_iniciarSesion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/sesiones/actual": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["IdentidadController_cerrarSesion"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/sesiones/cerrar-todas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["IdentidadController_cerrarTodas"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/totp/activar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["IdentidadController_activarTotp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/totp/configurar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["IdentidadController_configurarTotp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/verificar-telefono": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["IdentidadController_verificarTelefono"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/yo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["IdentidadController_yo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/citas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CitasController_listar"];
        put?: never;
        post: operations["CitasController_reservar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/citas/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CitasController_detalle"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/citas/{id}/atencion": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CitasController_leerAtencion"];
        put: operations["CitasController_guardarAtencion"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/citas/{id}/cancelar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CitasController_cancelar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/citas/{id}/estado": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CitasController_estado"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/citas/{id}/token-video": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CitasController_tokenVideo"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/consentimientos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PacientesController_listar"];
        put?: never;
        post: operations["PacientesController_otorgar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/consentimientos/{id}/revocar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["PacientesController_revocar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/consentimientos/textos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PacientesController_textos"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/coordinacion/derivaciones": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CoordinacionController_derivaciones"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/coordinacion/derivaciones/{id}/acusar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CoordinacionController_acusar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/coordinacion/derivaciones/{id}/cerrar-seguimiento": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CoordinacionController_cerrar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/coordinacion/llamadas-urgentes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CoordinacionController_llamadas"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/coordinacion/llamadas-urgentes/{id}/atender": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CoordinacionController_atender"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/coordinacion/pacientes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CoordinacionController_pacientes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/coordinacion/pacientes/{id}/verificar-identidad": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CoordinacionController_verificarIdentidad"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/llamadas-urgentes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TriajeController_mias"];
        put?: never;
        post: operations["TriajeController_solicitar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/operaciones/usuarios": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["OperacionesController_usuarios"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/operaciones/usuarios/{id}/bloqueo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["OperacionesController_bloquear"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/operaciones/usuarios/{id}/cerrar-sesiones": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["OperacionesController_cerrarSesiones"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/paciente/identidad": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["PacientesController_declararIdentidad"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/profesional/citas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProfesionalesController_agenda"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/profesional/franjas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProfesionalesController_misFranjas"];
        put?: never;
        post: operations["ProfesionalesController_crearFranjas"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/profesional/franjas/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["ProfesionalesController_eliminarFranja"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/profesional/perfil": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProfesionalesController_perfil"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["ProfesionalesController_actualizarPerfil"];
        trace?: never;
    };
    "/v1/profesionales": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProfesionalesController_listar"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/profesionales/{id}/franjas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ProfesionalesController_franjas"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/salud": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SaludController_salud"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/triaje/evaluar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["TriajeController_evaluar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/triaje/lista": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TriajeController_lista"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/verificacion/profesionales": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VerificacionController_cola"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/verificacion/profesionales/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["VerificacionController_registrar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AtencionDto: {
            /** @default false */
            cerrar?: boolean;
            /** @enum {string} */
            desenlace?: "alta" | "seguimiento" | "derivacion_programada" | "derivacion_urgente";
            evaluacion: string;
            indicaciones?: string;
            motivoConsulta: string;
            plan: string;
        };
        AtencionGuardadaDto: {
            cerrada: boolean;
            guardada: boolean;
        };
        AtencionRespuestaDto: {
            /** Format: date-time */
            actualizadaEn?: string;
            cerradaEn: string | null;
            desenlace: ("alta" | "seguimiento" | "derivacion_programada" | "derivacion_urgente") | null;
            evaluacion?: string;
            indicaciones: string | null;
            motivoConsulta?: string;
            plan?: string;
        };
        AtenderLlamadaDto: {
            /** @enum {string} */
            estado: "en_contacto" | "atendida" | "escalada";
            nota?: string;
        };
        BloqueoDto: {
            bloquear: boolean;
        };
        BloqueoRespuestaDto: {
            bloqueado: boolean;
        };
        CanceladaDto: {
            cancelada: boolean;
        };
        CitaAgendaDto: {
            alertaSignosDeAlarma: boolean;
            atencion: {
                /** Format: date-time */
                cerradaEn: string;
                desenlace: ("alta" | "seguimiento" | "derivacion_programada" | "derivacion_urgente") | null;
            } | null;
            /** @enum {string} */
            estado: "programada" | "en_curso" | "finalizada" | "cancelada" | "no_asistio";
            /** Format: date-time */
            fin: string;
            /** Format: uuid */
            id: string;
            /** Format: date-time */
            inicio: string;
            /** @enum {string} */
            modalidad: "audio" | "video";
            paciente: {
                apellidos: string;
                nombres: string;
            };
            /** @enum {string} */
            servicio: "teleorientacion" | "teleconsulta";
        };
        CitaDto: {
            /** @enum {string} */
            estado: "programada" | "en_curso" | "finalizada" | "cancelada" | "no_asistio";
            /** Format: date-time */
            fin: string;
            /** Format: uuid */
            id: string;
            /** Format: date-time */
            inicio: string;
            /** @enum {string} */
            modalidad: "audio" | "video";
            motivo?: string;
            paciente: {
                apellidos: string;
                nombres: string;
            } | null;
            profesional: {
                apellidos: string;
                especialidad: string;
                nombres: string;
            };
            salaDisponible: boolean;
            /** @enum {string} */
            servicio: "teleorientacion" | "teleconsulta";
        };
        CitaResumenDto: {
            /** @enum {string} */
            estado: "programada" | "en_curso" | "finalizada" | "cancelada" | "no_asistio";
            /** Format: date-time */
            fin: string;
            /** Format: uuid */
            id: string;
            /** Format: date-time */
            inicio: string;
            /** @enum {string} */
            modalidad: "audio" | "video";
            profesional: {
                apellidos: string;
                especialidad: string;
                nombres: string;
            };
            /** @enum {string} */
            servicio: "teleorientacion" | "teleconsulta";
        };
        CodigoTotpDto: {
            codigo: string;
        };
        ConsentimientoDto: {
            /**
             * @default electronica_simple
             * @enum {string}
             */
            metodo?: "electronica_simple" | "asistida_huella";
            /** @enum {string} */
            tipo: "datos_personales" | "telemedicina";
            version: string;
        };
        ConsentimientoOtorgadoDto: {
            /** Format: uuid */
            id: string;
        };
        ConsentimientoRespuestaDto: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            metodo: "electronica_simple" | "asistida_huella";
            /** Format: date-time */
            otorgadoEn: string;
            revocadoEn: string | null;
            /** @enum {string} */
            tipo: "datos_personales" | "telemedicina";
            version: string;
        };
        CrearFranjasDto: {
            /** Format: date-time */
            desde: string;
            duracionMinutos: 15 | 20 | 30 | 45 | 60;
            /** Format: date-time */
            hasta: string;
        };
        DerivacionDto: {
            acusadaEn: string | null;
            /** Format: uuid */
            citaId: string;
            /** Format: date-time */
            creadaEn: string;
            /** @enum {string} */
            estado: "pendiente_acuse" | "acusada" | "seguimiento_cerrado";
            /** Format: uuid */
            id: string;
            paciente: {
                apellidos: string;
                nombres: string;
                telefono: string | null;
            };
        };
        EstadoCitaDto: {
            /** @enum {string} */
            estado: "en_curso" | "finalizada" | "no_asistio";
        };
        EstadoLlamadaDto: {
            /** @enum {string} */
            estado: "en_contacto" | "atendida" | "escalada";
        };
        EstadoRespuestaDto: {
            /** @enum {string} */
            estado: "en_curso" | "finalizada" | "no_asistio";
        };
        EstadoVerificacionDto: {
            /** @enum {string} */
            estado: "pendiente" | "verificado" | "rechazado" | "suspendido";
        };
        EvaluacionDto: {
            acciones: {
                mensaje: string;
                numeros: string[];
                puedeSolicitarLlamada: boolean;
            } | null;
            hayAlarma: boolean;
        };
        EvaluarDto: {
            /** Format: uuid */
            citaId?: string;
            respuestas: {
                [key: string]: boolean;
            };
        };
        EventoAuditoriaDto: {
            accion: string;
            actorId: string | null;
            id: string;
            /** Format: date-time */
            ocurridoEn: string;
            recursoId: string | null;
            recursoTipo: string | null;
            /** @enum {string} */
            resultado: "ok" | "denegado" | "error";
        };
        FranjaDto: {
            /** Format: date-time */
            fin: string;
            /** Format: uuid */
            id: string;
            /** Format: date-time */
            inicio: string;
        };
        FranjaEliminadaDto: {
            eliminada: boolean;
        };
        FranjaPropiaDto: {
            /** @enum {string} */
            estado: "libre" | "reservada" | "cancelada";
            /** Format: date-time */
            fin: string;
            /** Format: uuid */
            id: string;
            /** Format: date-time */
            inicio: string;
        };
        FranjasCreadasDto: {
            creadas: number;
        };
        IdentidadDeclaradaDto: {
            /** Format: date */
            fechaNacimiento: string;
            numeroDocumento?: string;
            /** @enum {string} */
            tipoDocumento: "DNI" | "CE" | "PASAPORTE" | "SIN_DOCUMENTO";
        };
        InicioSesionDto: {
            /** @enum {string} */
            cliente: "web" | "movil";
            codigoTotp?: string;
            contrasena: string;
            identificador: string;
        };
        IntegridadDto: {
            integra: boolean;
            primerRegistroAlterado: string | null;
            registros: number;
        };
        ListaSignosDto: {
            preguntas: {
                grupo: string;
                id: string;
                texto: string;
            }[];
            validada: boolean;
            version: string;
        };
        LlamadaCoordinacionDto: {
            /** Format: date-time */
            creadaEn: string;
            /** @enum {string} */
            estado: "pendiente" | "en_contacto" | "atendida" | "escalada" | "cancelada";
            /** Format: uuid */
            id: string;
            paciente: {
                apellidos: string;
                nombres: string;
                telefono: string | null;
            };
            /** Format: date-time */
            plazoHasta: string;
            vencida: boolean;
        };
        LlamadaDto: {
            atendidaEn: string | null;
            /** Format: date-time */
            creadaEn: string;
            /** @enum {string} */
            estado: "pendiente" | "en_contacto" | "atendida" | "escalada" | "cancelada";
            /** Format: uuid */
            id: string;
            /** Format: date-time */
            plazoHasta: string;
        };
        LlamadaSolicitadaDto: {
            /** Format: uuid */
            id: string;
            /** Format: date-time */
            plazoHasta: string;
            yaSolicitada: boolean;
        };
        MensajeDto: {
            mensaje: string;
        };
        NivelIdentidadDto: {
            /** @enum {string} */
            nivelIdentidad: "N0" | "N1" | "N2";
        };
        OkDto: {
            ok: boolean;
        };
        PacienteCoordinacionDto: {
            apellidos: string;
            /** Format: uuid */
            id: string;
            identidadVerificadaEn: string | null;
            /** @enum {string} */
            nivelIdentidad: "N0" | "N1" | "N2";
            nombres: string;
            telefono: string | null;
            tipoDocumento: string | null;
        };
        PerfilDto: {
            presentacion: string;
        };
        PerfilProfesionalDto: {
            especialidad: string;
            /** @enum {string} */
            estadoVerificacion: "pendiente" | "verificado" | "rechazado" | "suspendido";
            numeroCmp: string;
            numeroRne: string | null;
            presentacion: string | null;
            verificadoEn: string | null;
        };
        PresentacionDto: {
            presentacion: string;
        };
        ProfesionalPendienteDto: {
            apellidos: string;
            especialidad: string;
            /** @enum {string} */
            estado: "pendiente" | "verificado" | "rechazado" | "suspendido";
            /** Format: uuid */
            id: string;
            nombres: string;
            numeroCmp: string;
            numeroRne: string | null;
            organizacion: string;
            /** Format: date-time */
            registradoEn: string;
            verificacionesRegistradas: number;
            yaVerifiqueYo: boolean;
        };
        ProfesionalPublicoDto: {
            apellidos: string;
            especialidad: string;
            /** Format: uuid */
            id: string;
            nombres: string;
            numeroCmp: string;
            numeroRne: string | null;
            presentacion: string | null;
            proximaFranja: string | null;
            verificadoEn: string | null;
        };
        RegistroDto: {
            apellidos: string;
            contrasena: string;
            nombres: string;
            telefono: string;
        };
        ReservaDto: {
            /** Format: uuid */
            franjaId: string;
            /**
             * @default audio
             * @enum {string}
             */
            modalidad?: "audio" | "video";
            motivo?: string;
            /** @enum {string} */
            servicio: "teleorientacion" | "teleconsulta";
        };
        RevocadoDto: {
            revocado: boolean;
        };
        SaludDto: {
            /** @constant */
            datos: "sinteticos";
            /** @constant */
            estado: "ok";
        };
        SesionDto: {
            csrfToken?: string;
            mfaPendiente: boolean;
            token?: string;
            usuario: components["schemas"]["Usuario"];
        };
        SesionesCerradasDto: {
            cerradas: number;
        };
        TextoConsentimientoDto: {
            texto: string;
            /** @enum {string} */
            tipo: "datos_personales" | "telemedicina";
            titulo: string;
            version: string;
        };
        TokenVideoDto: {
            expiraEnSegundos: number;
            /** @enum {string} */
            modalidadSugerida: "audio" | "video";
            token: string;
            url: string;
        };
        TotpConfiguracionDto: {
            secreto: string;
            uri: string;
        };
        Usuario: {
            apellidos: string;
            /** Format: uuid */
            id: string;
            mfaVerificado: boolean;
            /** @enum {string} */
            nivelIdentidad: "N0" | "N1" | "N2";
            nombres: string;
            organizacionId: string | null;
            roles: ("paciente" | "medico" | "coordinador" | "verificador" | "operaciones" | "auditor" | "superadmin")[];
        };
        UsuarioOperacionesDto: {
            apellidos: string;
            correo: string | null;
            /** Format: date-time */
            creadoEn: string;
            /** @enum {string} */
            estado: "pendiente_verificacion" | "activa" | "bloqueada";
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            nivelIdentidad: "N0" | "N1" | "N2";
            nombres: string;
            roles: ("paciente" | "medico" | "coordinador" | "verificador" | "operaciones" | "auditor" | "superadmin")[];
            telefono: string | null;
        };
        UsuarioRespuestaDto: {
            usuario: components["schemas"]["Usuario"];
        };
        VerificacionDto: {
            evidencia: string;
            /** @enum {string} */
            resultado: "aprobado" | "rechazado";
        };
        VerificarIdentidadDto: {
            numeroDocumento?: string;
            /** @enum {string} */
            tipoDocumento: "DNI" | "CE" | "PASAPORTE" | "SIN_DOCUMENTO";
        };
        VerificarTelefonoDto: {
            /** @enum {string} */
            cliente: "web" | "movil";
            codigo: string;
            telefono: string;
        };
        YoDto: {
            csrfToken?: string;
            usuario: components["schemas"]["Usuario"];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AuditoriaController_eventos: {
        parameters: {
            query?: {
                recursoId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventoAuditoriaDto"][];
                };
            };
        };
    };
    AuditoriaController_integridad: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegridadDto"];
                };
            };
        };
    };
    IdentidadController_registro: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegistroDto"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MensajeDto"];
                };
            };
        };
    };
    IdentidadController_iniciarSesion: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InicioSesionDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SesionDto"];
                };
            };
        };
    };
    IdentidadController_cerrarSesion: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    IdentidadController_cerrarTodas: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SesionesCerradasDto"];
                };
            };
        };
    };
    IdentidadController_activarTotp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CodigoTotpDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsuarioRespuestaDto"];
                };
            };
        };
    };
    IdentidadController_configurarTotp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TotpConfiguracionDto"];
                };
            };
        };
    };
    IdentidadController_verificarTelefono: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerificarTelefonoDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SesionDto"];
                };
            };
        };
    };
    IdentidadController_yo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["YoDto"];
                };
            };
        };
    };
    CitasController_listar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CitaResumenDto"][];
                };
            };
        };
    };
    CitasController_reservar: {
        parameters: {
            query?: never;
            header?: {
                /** @description Repetir la petición con la misma clave devuelve la misma cita (8 a 64 caracteres). */
                "idempotency-key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReservaDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CitaDto"];
                };
            };
        };
    };
    CitasController_detalle: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CitaDto"];
                };
            };
        };
    };
    CitasController_leerAtencion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AtencionRespuestaDto"];
                };
            };
        };
    };
    CitasController_guardarAtencion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AtencionDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AtencionGuardadaDto"];
                };
            };
        };
    };
    CitasController_cancelar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CanceladaDto"];
                };
            };
        };
    };
    CitasController_estado: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EstadoCitaDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EstadoRespuestaDto"];
                };
            };
        };
    };
    CitasController_tokenVideo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenVideoDto"];
                };
            };
        };
    };
    PacientesController_listar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConsentimientoRespuestaDto"][];
                };
            };
        };
    };
    PacientesController_otorgar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConsentimientoDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConsentimientoOtorgadoDto"];
                };
            };
        };
    };
    PacientesController_revocar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RevocadoDto"];
                };
            };
        };
    };
    PacientesController_textos: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TextoConsentimientoDto"][];
                };
            };
        };
    };
    CoordinacionController_derivaciones: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DerivacionDto"][];
                };
            };
        };
    };
    CoordinacionController_acusar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OkDto"];
                };
            };
        };
    };
    CoordinacionController_cerrar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OkDto"];
                };
            };
        };
    };
    CoordinacionController_llamadas: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LlamadaCoordinacionDto"][];
                };
            };
        };
    };
    CoordinacionController_atender: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AtenderLlamadaDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EstadoLlamadaDto"];
                };
            };
        };
    };
    CoordinacionController_pacientes: {
        parameters: {
            query?: {
                buscar?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PacienteCoordinacionDto"][];
                };
            };
        };
    };
    CoordinacionController_verificarIdentidad: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerificarIdentidadDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NivelIdentidadDto"];
                };
            };
        };
    };
    TriajeController_mias: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LlamadaDto"][];
                };
            };
        };
    };
    TriajeController_solicitar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LlamadaSolicitadaDto"];
                };
            };
        };
    };
    OperacionesController_usuarios: {
        parameters: {
            query?: {
                buscar?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsuarioOperacionesDto"][];
                };
            };
        };
    };
    OperacionesController_bloquear: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BloqueoDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BloqueoRespuestaDto"];
                };
            };
        };
    };
    OperacionesController_cerrarSesiones: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SesionesCerradasDto"];
                };
            };
        };
    };
    PacientesController_declararIdentidad: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["IdentidadDeclaradaDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NivelIdentidadDto"];
                };
            };
        };
    };
    ProfesionalesController_agenda: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CitaAgendaDto"][];
                };
            };
        };
    };
    ProfesionalesController_misFranjas: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FranjaPropiaDto"][];
                };
            };
        };
    };
    ProfesionalesController_crearFranjas: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CrearFranjasDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FranjasCreadasDto"];
                };
            };
        };
    };
    ProfesionalesController_eliminarFranja: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FranjaEliminadaDto"];
                };
            };
        };
    };
    ProfesionalesController_perfil: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerfilProfesionalDto"];
                };
            };
        };
    };
    ProfesionalesController_actualizarPerfil: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PerfilDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PresentacionDto"];
                };
            };
        };
    };
    ProfesionalesController_listar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfesionalPublicoDto"][];
                };
            };
        };
    };
    ProfesionalesController_franjas: {
        parameters: {
            query?: {
                desde?: string;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FranjaDto"][];
                };
            };
        };
    };
    SaludController_salud: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SaludDto"];
                };
            };
        };
    };
    TriajeController_evaluar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EvaluarDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EvaluacionDto"];
                };
            };
        };
    };
    TriajeController_lista: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ListaSignosDto"];
                };
            };
        };
    };
    VerificacionController_cola: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfesionalPendienteDto"][];
                };
            };
        };
    };
    VerificacionController_registrar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerificacionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EstadoVerificacionDto"];
                };
            };
        };
    };
}
