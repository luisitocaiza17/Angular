export class CORP_PreFactura {
    constructor(
        public IDPreFactura?: number,
        public IDEmpresa?: number,
        public IDEmpresaSucursal?: number,
        public NombreEmpresa?: string,
        public NombreSucursal?: string,
        public FechaRegistro?: Date,
        public PeriodoFactInicio?: Date,
        public PeriodoFactFin?: Date,
        public IDPlan?: string,
        public ValorTarifa?: number,
        public AjusteTarifas?: number,
        public SubTotal?: number,
        public SeguroCampesino?: number,
        public Total?: number,
        public Aprobado?: boolean,
        public Estado?: number,
        // public CORP_PreFacturaDetalle?: CORP_PreFacturaDetalle[],
        public isCheck?: boolean
    ) { }
}
export class CORP_PreFacturaDetalle {
    constructor(
        public IDPreFacturaDetalle?: number,
        public IDPreFactura?: number,
        public CodTarifa?: string,
        public ValorTarifa?: number,
        public NumAfiliadosAnterior?: number,
        public NumAfiliadosActual?: number,
        public ValorResultante?: number,
        public Estado?: number,
        public CORP_PreFactura?: CORP_PreFactura
    ) { }
}