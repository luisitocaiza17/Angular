export class Beneficio {
    constructor(

        public Region?: string,
        public TipoCobertura?: string,
        public TopaProcedimiento?: number,
        public ValorProcedimiento?: number,
        public VersionPlan?: number,
        public MontoPorExceso?: number,
        public MontoPorPresentacion?: number,
        public PorcentajeConConvenio?: number,
        public PorcentajeExceso?: number,
        public PorcentajeOtrosNoAfiliados?: number,
        public PorcentajeRedEspecifica?: number,
        public PorcentajeSinConvenio?: number,
        public FechaInicioCobertura?: Date,
        public FechaFinCobertura?: Date,
        public CodigoBeneficio?: string,
        public CodigoCobertura?: string,
        public CodigoPlan?: string,
        public CodigoProducto?: string,
        public DiasCarenciaBeneficios?: number,
        public AplicaDeducible?: number,
        public EmpresaNumero?: number,
        public NivelReferencia?: number,
        public NumeroConvenio?: number,
        public ValorFEE?: number,
        public CeroTramites?: number,
        public Estado?: number,
        public TipoPrestador?: string,
        //UIO
        public NombreBeneficio?: string,
        public NombreCobertura?: string,
        //Catalogo
        public Cantidad?: number,
        public CodigoGrupoArancel?: number,
        public DespliegaWeb?: number,
        public DigitadorCreacion?: string,
        public DigitadorModificacion?: string,
        public FechaCreacion?: Date,
        public FechaModificacion?: Date,
        public MostrarDisponible?: number,
        public ProgModificacion?: string,
        public Selected?: boolean,
        public NombreArancel?: string

    ) { }
}