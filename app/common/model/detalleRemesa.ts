export class DetalleRemesa {
    constructor(
        public EstadoRemesa?: string,
        public FacturadoHasta?: Date,
        public FechaCreacion?: Date,
        public NumeroRemesa?: string,
        public NumeroLineaRemesa?: string,
        public PeriodoPago?: string,
        public NumeroCuota?: string,
        public TipoCuenta?: string,
        public NumeroCuenta?: string,
        public ValorRemitido?: string,
        public ValorCuota?: string, 
        public EstatusDetalleRemesa?: number, 
        public SaldoCuota?: number, 
        public FacturadoDesde?: Date, 
        public Ofserie?: number, 
        public SerieFactura?: number, 
        public TipoDocumento?: string, 
        public NumeroFactura?: number, 
        public FacturadoA?: string, 
        public NombreDuenioCuenta?: string, 
        public ValorCampesinoRetroactivoRet?: number, 
        public Region?: string, 
        public CodigoProducto?: string, 
        public ContratoNumero?: number, 
        public LugarPago?: string, 
        public ValorAFavor?: number, 
        public ValorSeguroCampesino?: number, 
        public CodigoBanco?: number, 
        public TieneNota?: string, 
        public MotivoCreacion?: string, 
        public ValorSeguroCampesinoRet?: number, 
        public SucursalEmpresa?: number, 
        public EmpresaNumero?: number, 
        public FechaCorte?: Date, 
        public ValorGastoAdministrativo?: number, 
        public EnvioImpresion?: number,
        public PorcentajeSeguroCampesino?: number, 
        public PorcentajeSeguroCampesinoRet?: number, 
        public Impreso?: number,
        public FechaPago?: Date,

        //UI 
        public Selected?: boolean
    ) { }
}

export class DetalleRemesaCuotas {
    constructor(
        public Region?: string,
        public CodigoProducto?: string,
        public ContratoNumero?: number,
        public NumeroCuota?: number,
        public NumeroCuenta?: string,
        public FechaFinTarjeta?: Date,
        public ValorCuota?: number,
        public ValorRemitido?: number,
        public ValorSeguroCampesino?: number,
        public EstatusDetalleRemesa?: number,

        public NumeroRemesa?: number,
        public NumeroLineaRemesa?: number,
        public FacturadoHasta?: Date,
        public PeriodoPago?: string,
        public TipoCuenta?: string,
        public LugarPago?: string,
        public FechaCorte?: Date,
        public OfSerie?: number,
        public SerieFactura?: number,
        public NumeroFactura?: number,
        public TipoDocumento?: string,
        public MotivoCreacion?: string,
        public SaldoCuota?: number,
        public ValorTarjetas?: number,
        public ValorAfavor?: number,
        

        //UI
        public Selected?: boolean
        
    ) { }
}

export class DetalleRemesaFilter{ 
    constructor(
        public ofSerie?: number,
        public serieFactura?: number, 
        public numeroFactura?: number,
        public tipoDocumento?: string,
        public region?: string,
        public codigoProducto?: string,
        public contratoNumero?: number
    ){

    }
}

export class OneDetalleRemesa{
    constructor(
        public NumeroRemesa?: string,
        public NumeroLineaRemesa?: string,
        public CodigoBanco?:number
    ){

    }
}

