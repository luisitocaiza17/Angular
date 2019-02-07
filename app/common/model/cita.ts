export class CitaFilter {
    constructor(
        public ConvenioPmf?: string,
        public IdIntervalo?: string,
        public IdPaciente?: string,
        public NumeroContrato?: string,
        public NumeroPersona?: string
    ) { }
}

export class Cita {
    constructor(
        public Codigo?: string,
        public Mensaje?: string,
        public Causa?: string
    ) { }
}

export class CitaMedicaFilter {
    constructor(
        public CodigoCiudad?: string,
        public CodigoEspecialidad?: string,
        public Fecha?: Date,
        public CodigoCentroMedico?: number,
        public CodigoContrato?: number,
        public NumeroContrato?: number,
        public NumeroCedula?: string,
        public CodigoMedico?: string,
        public CodigoProducto?: string,
        public CodigoPlan?: string,
        public Genero?: string,
        public FechaNacimiento?: Date,
        public Nivel?: number
        
    ) { }
}

export class MedicosEntity {
    constructor(

        public idCentroMedico?: number,
        public nombreCentroMedico?: string,
        public codigoMedico?: string,
        public tipoIdentificacion?: string,
        public numeroIdentificacion?: string,
        public nombreMedico?: string,
        public primerNombre?: string,
        public segundoNombre?: string,
        public primerApellido?: string,
        public segundoApellido?: string,
        public especialidad?: string,
        public nacionalidad?: string,
        public ciudad?: string,
        public codigoSucursalCentroMedico?: number,
        public sucursal?: string,
        public horario?: string,
        public diasAtencion?: string,
        public valorCopago?: number,
        public geolocalizacionLatitud?: number,
        public geolocalizacionLongitud?: number

    ) { }
}

export class HorarioMedicoEntity {
    constructor(

        public idHorarioDisponible?: string,
        public idTurno?: string,
        public codigoEspecialidad?: string,
        public nombreEspecialidad?: string,
        public codigoCentroMedico?: number,
        public nombreCentroMedico?: string,
        public codigoSucursal?: string,
        public nombreSucursal?: string,
        public codigoMedico?: string,
        public nombreMedico?: string,
        public fecha?: Date,
        public horaInicio?: string,
        public horaFin?: string,
        public costoServicio?: number,
        public codigoCiudad?: string,
        public nombreCiudad?: string,
        public geolocalizacionLatitud?: number,
        public geolocalizacionLongitud?: number
    ) { }
}

export class AgendarCitaKey {
    constructor(
        public numeroTitularContrato?: number,
        public codigoContrato?: number,
        public numeroContrato?: number,
        public IdPersona?: string,
        public numeroPersonaPaciente?: number,
        public nombrePaciente?: string,
        public idCentroMedico?: number,
        public nombreSucursalCentroMedico?: string,
        public codigoMedico?: string,
        public nombreMedicoPrestador?: string,
        public codigoSucursal?: string,
        public idHorarioDisponible?: string,
        public idTurno?: string,
        public fecha?: string,
        public hora?: string,
        public duracion?: number,
        public codigoPlataforma?: number,
        public codigoEspecialidad?: string,
        public costoCita?: number,
        public registradoPor?: string,
        public correoNotificacion?: string,

        public fechaDate?: Date
    ) { }
}


export class MedicoDestacadoEntity {
    constructor(
        public EsStaff?: boolean,
        public EsCeroTramites?: boolean,
        public Especialidad?: string,
        public Subespecialidad?: string,
        public CentroMedico?: string,
        public ValorConsultaParticular?: number,
        public Nacionalidad?: string,
        public Ranking?: number,
        public ValorCopagoConsulta?: number,
        public ValorCobertura?: number,
        public ValorTotalConsulta?: number,
        public EsPrestadorAfiliado?: boolean,
        public CodigoEspecialidad?: string,
        public ObservacionesValorOda?: string,
        public PermiteSolicitarCita?: boolean,
        public Numero?: number,
        public RazonSocial?: string,
        public NumeroRuc?: string,
        public TipoPrestador?: string,
        public NivelDesde?: number,
        public NivelHasta?: number,
        public Ciudad?: string,
        public Sector?: string,
        public Direccion?: string,
        public Latitud?: number,
        public Longitud?: number,
        public Telefono?: string,
        public Telefono2?: string,
        public Celular?: string,
        public Email?: string,
        public HorarioAtencion?: string,
        public EsActivo?: boolean,
        public TipoConvenio?: string,
        public PaginaWeb?: string,
        public EsFavorito?: boolean,
        public EsRecomendado?: boolean,
        public EmiteOdas?: boolean
    ) { }
}

export class SolicitarCitaDestacadoKey {
    constructor(
        public id?: number,
        public codigoContrato?: number,
        public numeroContrato?: number,
        public numeroPersonaPaciente?: number,
        public convenioMedicoPrestador?: number,
        public correoElectronico?: string,
        public telefono?: string,
        public telefonoCelular?: string,
        public fechaDesde?: Date,
        public fechaHasta?: Date,
        public jornada?: number,
        public observaciones?: string,
        public numeroTitularContrato?: number,
        public codigoEspecialidad?: string
    ) { }
}

export class SolicitudDestacadoEntity {
    constructor(

        public id?: number,
        public codigoContrato?: number,
        public numeroContrato?: number,
        public numeroBeneficiario?: number,
        public cedulaBeneficiario?: string,
        public nombreBeneficiario?: string,
        public correoElectronicoBeneficiario?: string,
        public telefonoBeneficiario?: string,
        public telefonoCelularBeneficiario?: string,
        public convenioMedicoPrestador?: number,
        public nombreMedicoPrestador?: string,
        public codigoEspecialidad?: string,
        public telefonoMedicoPrestador?: string,
        public correoMedicoPrestador?: string,
        public fechaDesde?: Date,
        public fechaHasta?: Date,
        public jornada?: string,
        public observaciones?: string,
        public estadoSolicitud?: number,
        public descripcionEstadoSolicitud?: string,
        public motivoRechazo?: string,
        public canal?: string,
        public fechaRegistro?: Date,
        public registradoPor?: string
    ) { }
}





export class SolicitudDestacadoFilter {
    constructor(

        public id?: number,
        public numeroContrato?: number,
        public codigoContrato?: number,
        public numeroPersonaPaciente?: number,
        public numeroTitularContrato?: number,
        public numeroMedicoPrestador?: number,
        public codigoEspecialidad?: string,
        public fechaDesde?: Date,
        public fechaHasta?: Date,
        public estadoSolicitud?: number,
        public tipoDocumento?: string,
        public numeroDocumento?: string,

        //PARA ACTUALIZAR ESTADO 
        public motivoRechazo?: string

    ) { }
}

export class ValidarPacienteKey {
    constructor(

        public CodigoCentroMedico?: number,
        public TipoDocumento?: string,
        public NumeroDocumento?: string

    ) { }
}

export class RegistarPacienteKey {
    constructor(

        public idCentroMedico?: number,
        public tipoDocumento?: string,
        public numeroDocumento?: string,
        public primerNombre?: string,
        public segundoNombre?: string,
        public primerApellidos?: string,
        public segundoApellidos?: string,
        public numeroCelular?: string,
        public clave?: string,
        public repetirClave?: string,
        public fechaNacimiento?: Date,
        public correoElectronico?: string,
        public genero?: string,
        public idPaciente?: string

    ) { }
}

export class ConsultarCitaFilter {
    constructor(

        public codigoCitaSaludSA?: number,
        public codigoCitaPrestador?: string,
        public idCentroMedico?: number,
        public codigoSucursalCentroMedico?: string,
        public codigoMedicoCentroMedico?: string,
        public numeroPersonaTitular?: number,
        public numeroPersonaPaciente?: number,
        public fechaDesdeTime?: Date,
        public fechaHastaTime?: Date,
        public fechaRegistroDesde?: Date,
        public fechaRegistroHasta?:Date,
        public estadoAtencionId?: number,
        public medicoDestacado?: boolean,
        public tipoDocumento?: string,
        public numeroDocumento?: string,
        public criterioOrdenamiento?:string,
        public tipoOrdenamiento?:string
    
    ) { }
}


export class CitaMedicaEntity {
    constructor(

        public idCita?: number,
        public idCitaCentroMedico?: string,
        public codigoCentroMedico?: number,
        public nombreCentroMedico?: string,
        public codigoSucursal?: string,
        public nombreSucursal?: string,
        public codigoMedico?: string,
        public nombreMedico?: string,
        public codigoPaciente?: number,
        public nombrePaciente?: string,
        public fecha?: Date,
        public fechaRegistro?: Date,
        public hora?: string,
        public duracion?: string,
        public costo?: number,
        public estadoAtencion?: number,
        public descripcionEstadoAtencion?: string,
        public registradoPor?: string

    ) { }
}

export class Horario {
    public static values: Horario[] = [
        { Codigo: "08:00", Nombre: "08:00" },
        { Codigo: "08:20", Nombre: "08:20" },
        { Codigo: "08:40", Nombre: "08:40" },
        { Codigo: "09:00", Nombre: "09:00" },
        { Codigo: "09:20", Nombre: "09:20" },
        { Codigo: "09:40", Nombre: "09:40" },
        { Codigo: "10:00", Nombre: "10:00" },
        { Codigo: "10:20", Nombre: "10:20" },
        { Codigo: "10:40", Nombre: "10:40" },
        { Codigo: "11:00", Nombre: "11:00" },
        { Codigo: "11:20", Nombre: "11:20" },
        { Codigo: "11:40", Nombre: "11:40" },
        { Codigo: "12:00", Nombre: "12:00" },
        { Codigo: "12:20", Nombre: "12:20" },
        { Codigo: "12:40", Nombre: "12:40" },
        { Codigo: "13:00", Nombre: "13:00" },
        { Codigo: "13:20", Nombre: "13:20" },
        { Codigo: "13:40", Nombre: "13:40" },
        { Codigo: "14:00", Nombre: "14:00" },
        { Codigo: "14:20", Nombre: "14:20" },
        { Codigo: "14:40", Nombre: "14:40" },
        { Codigo: "15:00", Nombre: "15:00" },
        { Codigo: "15:20", Nombre: "15:20" },
        { Codigo: "15:40", Nombre: "15:40" },
        { Codigo: "16:00", Nombre: "16:00" },
        { Codigo: "16:20", Nombre: "16:20" },
        { Codigo: "16:40", Nombre: "16:40" },
        { Codigo: "17:00", Nombre: "17:00" },
        { Codigo: "17:20", Nombre: "17:20" },
        { Codigo: "17:40", Nombre: "17:40" },
        { Codigo: "18:00", Nombre: "18:00" },
        { Codigo: "18:20", Nombre: "18:20" },
        { Codigo: "18:40", Nombre: "18:40" },
        { Codigo: "19:00", Nombre: "18:00" },
        { Codigo: "19:20", Nombre: "19:20" },
        { Codigo: "19:40", Nombre: "19:40" },
        { Codigo: "20:00", Nombre: "20:00" },
        { Codigo: "20:20", Nombre: "20:20" },
        { Codigo: "20:40", Nombre: "20:40" }
    ];
    constructor(
        public Codigo?: string,
        public Nombre?: string
    ) { }
}



