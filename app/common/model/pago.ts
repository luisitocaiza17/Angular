export class CabeceraPagoEntity {
    constructor(
        public TipoDocumento?: string,
        public SucursalNombre?: string,
        public ValorAplicado?: number,
        public FechaCaja?: Date,
        public LugarPago?: string,
        public ValorAfavorAplicado?: number,

        public NumeroPago?: number,
        public CuotasAplicadas?: number,
        public ValorRecibido?: number,
        public EsGrupal?: boolean,
        public FacturadoDesde?: Date,
        public FacturadoHasta?: Date,
        public NumeroCuota?: number,
        public NumeroRemesa?: number,
        public NumeroFactura?: number,

        //UIO
        public Selected?: boolean
    ) { }
}

export class DetallePagoEntity {
    constructor(
        public NumeroPago?: number,
        public NumeroLineaPago?: number,
        public NumeroCuota?: number,
        public NumeroFactura?: number,
        public SerieFactura?: number,
        public OfSerie?: number,
        public NumeroRemesa?: number,
        public TotalAbonado?: number,
        public ValorRemitido?: number,
        public Nota?: string,
        public ValorNota?: number,
        public TotalCuota?: number,
        public FechaCaja?: Date,
        public Region?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public TipoDocumento?: string,
        public NombreEstado?: string,
        public FacturadoDesde?: Date,
        public FacturadoHasta?: Date,

        //UIO
        public Selected?: boolean
    ) { }
}

export class DetallePagoFilter {
    constructor(
        public NumeroPago?: number,
        public NumeroContrato?: number,
        public Region?: string,
        public CodigoProducto?: string,
        public EmpresaNumero?: number
    ) { }
}

export class EmitirNotaEntity {
    constructor(
        public Region?: string,
        public CodigoProducto?: string,
        public ContratoNumero?: number,
        public TipoDocumento?: string,
        public NumeroCuota?: number,
        public MotivoNota?: string,
        public MotivoSalud?: string,
        public FormaPago?: number,
        public ValorAcreditado?: number,
        public GMaximo?: number,
        public NumeroPago?: number,
        public NumeroLineaPago?: number,
        public EmisionReplica?: boolean,
        public Ciudad?: number,
        public Oficina?: string,
        public RegionFacturacion?: string,
        public Archivo?: FormData


    ) { }
}

