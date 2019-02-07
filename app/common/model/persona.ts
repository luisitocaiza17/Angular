export class PersonaUnicaEntity {
    constructor(
        public NumeroPersona?: number,
        //INFROMACION PERSONAL
        public TipoDocumento?: string,
        public Cedula?: string,
        public Pasaporte?: string,
        public ApellidoPaterno?: string,
        public ApellidoMaterno?: string,
        public Nombres?: string,
        public FechaNacimiento?: Date,
        public Sexo?: string,
        public Nacionalidad?: string,
        public EmailPersonal?: string,
        public Celular?: string,
        public EmpresaTrabajo?: string,
        public TelefonoTrabajo?: string,
        public TelefonoDomicilio?: string,
        public EstadoCivil?: string,

        //DATOS DOMICILIO
        public ProvinciaDomicilio?: string,
        public CiudadDomicilio?: number,
        public CallePrincipalDomicilio?: string,
        public CalleTransversalDomicilio?: string,
        public NumeracionDomicilio?: string,
        public ReferenciaDomicilio?: string,
        public BarrioDomicilio?: string,
        public DomicilioLatitud?: string,
        public DomicilioLongitud?: string,

        //DATOS TRABAJO
        public ProvinciaTrabajo?: string,
        public CiudadTrabajo?: number,
        public CallePrincipalTrabajo?: string,
        public CalleTransversalTrabajo?: string,
        public NumeracionTrabajo?: string,
        public ReferenciaTrabajo?: string,
        public BarrioTrabajo?: string,
        public EmailTrabajo?: string,
        public TrabajoLatitud?: string,
        public TrabajoLongitud?: string,

        //CORRESPONDENCIA
        public Correspondencia?: string,

        //CASO DE EMERGENCIA
        public NombreContacto?: string,
        public TelefonoContacto?: string,

        //OTROS DATOS
        public RangoIngresos?: string,
        public Ocupacion?: string,
        public Profesion?: string,
        public Vehiculo?: string,
        public CondicionLaboral?: string,
        public AntigueadLaboral?: string,
        public Hobby?: string,

        //VALORES NO NULOS
        public RegistroPrincipal?: boolean,

        //MAS DATOS
        public DomicilioGeoreferencia?: boolean,
        public TrabajoGeorefencia?: boolean,
        public FechaModificacion?: Date,
        public HoraModificacion?: string,
        public UsuarioModificacion?: string,
        public PersonaCodigo?: number,
        public ClienteSalud?: number,
        public LogCambios?: string,
        public OperadoraCelular?: string,
        public HoraContacto?: Date,
        public TelefonoAlterno?: string,
        public EstadoModificacion?: number,
        public Migrado?: boolean,
        public PersonaHis?: number
    ) { }
}

export class TipoPantallaPersonaUnica {
    constructor(
        public NumeroPersona?: number,
        public TipoDocumento?: string,
        public TipoPantalla?: number, //1 Insertar, 2 //Atucalizar
        public Cedula?: string,
        public Pasaporte?: string,
        public Desabilitar?: boolean,
        public PersonaEntity?: PersonaEntity

    ) { }
}

export class PersonaEntity {
    constructor(

        public NumeroPersona?: number,
        public PersonaNombres?: string,
        public PersonaApellidos?: string,
        public CedulaPersona?: string,
        public PersonaFechaNacimiento?: Date,

        public PersonaSexo?: string,
        public PersonaCedula?: string,
        public PersonaPasaporte?: string,
        public PersonaNacionalidad?: boolean,
        public PersonaEstadoCivil?: string,
        public DomicilioCalle?: string,
        public DomicilioCiudad?: number,

        public DomicilioTelefono1?: string,
        public DomicilioTelefono2?: string,
        public DomicilioEmail?: string,
        public NombresCompletos?: string,
        public DescripcionSexo?: string,

        public TrabajoTelefono1?: string,
        public DomicilioBarrio?: string,
        public CodigoActividad?: number,
        public TrabajoEmpresa?: string,
        public TrabajoEmail?: string,

        //UIO
        public Selected?: boolean,

        //para la variable de entorno del sistema
        public CiudadEntorno?: number
    ) { }
}

export class FilterPersona {
    constructor(

        public Cedula?: string,
        public Apellidos?: string,
        public Nombres?: string,
        public PersonaNumero?: number
    ) { }
}

