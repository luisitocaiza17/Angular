export class TipoPrestador {
    public static MEDICO: string = "Médico";
    public static CLINICA_HOSPITAL: string = "Clínica/Hospital";
    public static FARMACIA: string = "Farmacia";
    public static LABORATORIO_CLINICO: string = "Laboratorio Clínico";
    public static LABORATORIO_IMAGEN: string = "Laboratorio Imagen";
    public static ESPECIAL: string = "Especial";
    public static CENTRO_MEDICO: string = "Centro de Médicos";
    public static OTROS: string = "Otros Laboratorios";

    public static values: string[] = [TipoPrestador.MEDICO, TipoPrestador.CLINICA_HOSPITAL, TipoPrestador.FARMACIA, TipoPrestador.LABORATORIO_CLINICO,
    TipoPrestador.LABORATORIO_IMAGEN, TipoPrestador.ESPECIAL, TipoPrestador.CENTRO_MEDICO, TipoPrestador.OTROS];
}


export class ConvenioFilter {
    constructor(
        public Nombre?: string,
        public TipoPrestador?: string,
        public CodigoCiudad?: number,
        public Sector?: string,
        public CodigoEspecialidad?: string,
        public CodigoSubespecialidad?: string,
        public NivelDesde?: number,
        public NivelHasta?: number,
        public CodigoContrato?: number,
        public ValorConsulta?: number,
        public NumeroBeneficiario?: number,
        // consultar prestadores
        public NumeroConvenio?: number,
        public NumeroEmpresa?: number,
        public NumeroPersona?: number,
        public Ruc?: string,
        public EsRecomendado?: number,
        public NombreComercial?:string
    ) { }
}


export class Convenio {
    constructor(
        public TipoPrestador?: string,
        public Numero?: number,
        public Nombre?: string,
        public Estado?: string,
        public NivelPrestadorDesde?: number,
        public NivelPrestadorHasta?: number,
        public Nivel?: number,
        public FechaSuspension?: Date,
        public CodigoCiudad?: number,
        public NumeroEstado?: number,
        public TipoConvenio?: string,
        public Region?: string,

        public Ciudad?: string,
        public Email?: string,
        public Especialidad?: string,
        public Telefonos?: string,
        public Direccion?: string,
        public Horarios?: string,
        public CostoConsultaSalud?: number,
        public ValorCubrirSalud?: number,
        public ValorPagarCliente?: number,
        public Nacionalidad?: string,
        public CargosDestacados?: string,
        public Calificacion?: string,
        public Titulos?: string,

        public Selected?: boolean,
        // consultar prestadores
        public Ruc?: string,
        public FechaInicioConvenio?: Date,
        public FechaFinConvenio?: Date,
        public PersonaNumero?: number,
        public EmpresaNumero?: number,
        public Direccion2?: string,
        public EsStaff?: boolean,

        public Receptor?: string,
        public DescripcionEstaff?: string,
        public TelefonoConsultorio1?: string,
        public TelefonoConsultorio2?: string,
        public TelefonoEmergencia?: string,
        public TelefonoReceptor?: string,
        public ObservacionesValorOda?: string,
        public NombreComercial?:string,
        public EmiteOdas?:boolean,
        //UIO
        public unsuscribe?: boolean

    ) { }
}

export class DetalleConvenioEntity {
    constructor(
        //Datos Iniciales
        public PersonaNumero?: number,
        public EmpresaNumero?: number,
        public NumeroConvenio?: number,
        public TipoPrestador?: string,
        public NombrePrestador?: string,
        public HospitalReferencia?: string,

        //Estudios Realizados
        public TituloGeneral?: string,
        public LugarTituloGeneral?: string,
        public FechaTituloGeneral?: Date,
        public TituloEspecialidad?: string,
        public LugarTituloEspecialidad?: string,
        public FechaTituloEspecialidad?: Date,
        public TituloSubesp?: string,
        public LugarTituloSubespe?: string,
        public FechaTituloSubespe?: Date,
        public Master?: string,
        public LugarMaster?: string,
        public FechaMaster?: Date,

        //Experiencia
        public TrabajoHospital?: boolean,
        public TiempoHospital?: number,
        public TrabajoClinica?: boolean,
        public TiempoClinica?: number,
        public TrabajoConsultorio?: boolean,
        public TiempoConsultorio?: number,
        public SociedaC?: boolean,
        public Investigacion?: boolean,
        public SobreQue?: string,
        public EsRecomendado?: boolean,
        public FechaPermisoFin?: Date,
        public Masivos?: boolean,
        public Staff?: boolean,

        //Ubicacion
        public CodigoCiudad?: number,
        public DireccionConsultorio1?: string,
        public TelefConsultorio1?: string,
        public HorarioConsultorio1?: string,
        public DireccionConsultorio2?: string,
        public TelefConsultorio2?: string,
        public HorarioConsultorio2?: string,
        public Latitud?: number,
        public Longitud?: number,

        //Convenio
        public TipoConvenio?: string,
        public FechaConvenio?: Date,
        public FechaInicioConvenio?: Date,
        public FechaFinConvenio?: Date,
        public NivelPrestadorDesde?: number,
        public NivelPrestadorHasta?: number,
        public DsctoTotalPctje?: number,
        public DsctoProntoPago?: boolean,
        public DsctoRubrosFijos?: boolean,
        public Rucins?: string,
        public ListaEspecialidades?: string,
        public EstadoConvenio?: number,
        public Deposita?: boolean, //PI
        public CodigoBanco?: number,
        public NumeroCuenta?: string,
        public TipoCuenta?: string,
        public IdCuenta?: string,
        public TipoIdCuenta?: string,
        public EmiteOda?: boolean,
        public PlanEspecial?: boolean,
        public NivelEspecial?: number,
        public AgendarCitas?: boolean,
        public EsRedPreferente?: boolean,
        //FATAR TRAMITES

        //RETENCION
        public CorreoElectronicoNotificacion?: string,
        public TipoIdentificacion?: string,
        public SujetoEstado?: number,//estado retencion
        public Contacto?: string,
        public FechaSuspension?: Date,
        public ObligadoContabilidad?: boolean,
        public CorreoContacto?: string,
        public Retencion?: boolean,
        public ContribuyenteEspecial?: number,
        public ActividadEconomica?: string,
        public TipoContribuyente?: number,

        //OCULTOS
        public CodigoMotivoAnulacion?: number,
        public Receptor?: string,

        //VARIABLE DE ENTORMO DEL SISTE,A
        public CiudadEntorno?: number

    ) { }
}