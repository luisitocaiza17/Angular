export class DirectorVendedorEntity {
    constructor(
        public CodigoVendedor?: string,
        public Codigo?: number,
        public NumeroPersona?: number,
        public NumeroEmpresa?: number,
        public CodigoSucursal?: number,
        public CodigoSala?: number,
        public Tipo?: string,
        public CodigoDirector?: number,
        public NumeroVendedores?: number,
        public FechaIngreso?: Date,
        public FechaSalida?: Date,
        public Region?: string,
        public CodigoGrupo?: number,
        public Nombre?: string,
        public GrupoVenta?: string,
        public PorcentajeComision?: number,
        public NumeroCuentaContable?: string,
        public EstadoAgente?: number,
        public ComisionRenovacion?: number,
        public Estado?: number,
        public FechaModificacion?: Date,
        public DigitadorModificacion?: string,
        public HoraCreacion?: string,
        public HoraModificacion?: string,
        public ProgramaModificacion?: string,
        public FechaCreacion?: Date,
        public DigitadorCreacion?: string,
        public ProgramaCreacion?: string,
        public FechaAnulacion?: Date,
        public DigitadorAnulacion?: string,
        public HoraAnulacion?: string,
        public RazonSocialBroker?: string,
        public RucBroker?: string,
        public ProgramaAnulacion?: string,
        public UsuarioWeb?: string,
        public ClaveWeb?: string,
        public EmailBroker?: string,
        public CodigoTipoContribuyente?: number,
        public Nivel?: number,
        public CodigoTipo?: number,
        public CodigoSubtipo?: string,
        public EsImpresionDocumento?: boolean,
        public EsPermiso?: boolean,
        public LoginUsuario?: string,
        public AplicaPool?: boolean,
        public AplicaCorporativo?: boolean,
        public AplicaIndividual?: boolean,
        public UsuarioDirectorioActivo?: string,
        public RenovacionEmailBroker?: string,
        public Cedula?: string,
        public FechaProduccion?: Date,
        public TipoAgenteVenta?: string,
        //UIO
        public Selected?: boolean,
        public TipoTransaccion?: string,

        public PorcentajePersistencia?:number,
        public FechaProduccionAgente ?:Date,
        public CodigoRango?:number,
        public CumplimientoQueja ?:number,

        public NombreTipo?:string,
        public NombreSubtipo?:string

    ) { }
}

export class InputCambioDirectores
{ 
    constructor(
        public DirectorNuevo?: DirectorVendedorEntity, 
        public DirectorAntiguo?: DirectorVendedorEntity, 
    ){ 

    }
}