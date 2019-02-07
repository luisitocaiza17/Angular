export class ExclusionFilter {
    constructor(
        public NumeroContrato?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public NumeroPersona?: number
    ) { }
}

export class ExclusionEntityList {
    constructor(
        public NombreEstado?: string,
        public Nombre?: string,
        public Diagnostico?: string,
        public DiasCarenciaDiagnostico?: number,
        public EsCongenito?: boolean,
        public FechaInicio?: string,
        public FechaUltimaDeclaracion?: string,
        public PorcentajeCobertura?: number,
        public MontoCoberturaMaxima?: number,
        public Observaciones?: string,
        public CabeceraDiagnostico?: string,
        public CodigoTipoEnf?: number,
        public TipoExclusion?: string,
        public RiesgoCliente?: string,

        //PARA TRANSACCION DE PREEXITENCIA
        public FechaInicioDate?: Date,
        public FechaFinDate?: Date,
        public FechaDiagnosticoDate?: Date,
        public FechaUltimaDeclaracionDate?: Date,
        public PorcentajeDiscapacidad?: number,
        public CodigoDiagnostico?: string,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public ContratoNumero?: number,
        public CodigoContrato?: number,
        public PersonaNumero?: number,
        public NumeroEmpresa?: string,
        public NumeroSucursal?: string,

        //UIO
        public Selected?: boolean


    ) { }
}