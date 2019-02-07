export class CotizacionFilter {
    constructor(
        public CodigoContrato?: number,
        public NumeroCuota?: number
    ) { }
}

export class Cotizacion {
    constructor(
        // listado
        public NumeroCuota?: number,
        public LugarPago?: string,
        public NumeroRemesa?: number,
        public FacturadoDesde?: string,
        public FacturadoHasta?: string,
        public Estado?: string,
        public BancoCaja?: string,
        public ValorRemitido?: number,
        public PeriodoPago?: string,
        public ValorCuota?: number,
        public ValorAdicional?: number,
        public ValorAdministrativo?: number,
        public AFavor?: number,
        public FechaCorte?: string,

        // detalles cotizacion
        public DuennoCuenta?: string,
        public MotivoCreacion?: string,
        public FacturadoA?: string,
        public TipoCuenta?: string,
        public NumeroCuenta?: string,
        public MotivoDevolucion?: string,
        public SerieOficina?: string,
        public SerieFactura?: string,
        public Factura?: string,
        public TipoDocumento?: string,
        public TipoDocumentoNumero?:number,
        public TipoEmision?: string,
        public NumeroLineaRemesa?: string,

        // valores
        public Abono?: number,
        public Saldo?: number,
        public ValorTarjetas?: number,
        public ValorRecargo?: number,
        public ValorSeguroCampesino?: number,
        public ValorSeguroCampesinoRetroactivo?: number,

        //recaudo
        public FechaProcesoAutomatico?: string,
        public FechaCaja?: string,
        public TipoPago?: string,
        public NumeroCuentaCaja?: string,
        public NumeroChequeCaja?: string,
        public TarjetaCaja?: string,
        public NumeroNota?: string,

        // UI
        public Selected ?: boolean,

        //PDF 
        public NumeroFactura?: string,
        public PDFPath?:string,
        public PDFVisible?:boolean


    ) { }
}