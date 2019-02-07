import { Stream } from "stream";

export class FilterDocumentoFacturacion{

    valorPorDefectoQueryType: string = 'igual'; 

    constructor(
        public NumeroEnvio?: number,
        public NumeroEnvioQueryType?: string,  
        public SecuencialEnvio?: number, 
        public SecuencialEnvioQueryType?: string,  
        public NumeroEmpresa?: number, 
        public NumeroEmpresaQueryType?: string,  
        public SucursalEmpresa?: number, 
        public SucursalEmpresaQueryType?: string,  
        public Region?: string,
        public CodigoProducto?: string,  
        public ContratoNumero?: number, 
        public ContratoNumeroQueryType?: string,  
        public Establecimiento?: number, 
        public EstablecimientoQueryType?: string,  
        public PuntoEmision?: number, 
        public PuntoEmisionQueryType?: string,  
        public Secuencial?: number, 
        public SecuencialQueryType?: string,  
        public TipoDocumento?: number, 
        public TipoDocumentoQueryType?: string,  
        public IdComprador?: string, 
        public RazonSocial?: string, 
        public TipoIdComprador?: number, 
        public TipoIdCompradorQueryType?: string,  
        public Estado?: number, 
        public EstadoQueryType?: string,  
        public FechaCreacion?: Date, 
        public FechaCreacionQueryType?: string,  
        public DigitadorCreacion?: string, 
        public FechaEmision?: Date, 
        public FechaEmisionQueryType?: string,  
        public FechaEnvio?: Date, 
        public FechaEnvioQueryType?: string,  
        public FechaGestion?: Date, 
        public FechaGestionQueryType?: string,  
        public UsuarioGestion?: string, 
        public FechaRespuesta?: Date, 
        public FechaRespuestaQueryType?: string,  
        public FechaSri?: Date, 
        public FechaSriQueryType?: string ,
        public NoObtenerRetenciones?: boolean, 
        public FechaEmisionDesde?: Date, 
        public FechaEmisionHasta?: Date, 
        public NumeroEnvioDesde?: number, 
        public NumeroEnvioHasta?: number
    ) {
        this.NumeroEnvioQueryType = this.valorPorDefectoQueryType;
        this.ContratoNumeroQueryType = this.valorPorDefectoQueryType; 
        this.EstablecimientoQueryType = this.valorPorDefectoQueryType; 
        this.EstadoQueryType = this.valorPorDefectoQueryType;
        this.FechaCreacionQueryType = this.valorPorDefectoQueryType;
        this.FechaEmisionQueryType = this.valorPorDefectoQueryType;
        this.FechaEnvioQueryType = this.valorPorDefectoQueryType; 
        this.FechaGestionQueryType = this.valorPorDefectoQueryType;
        this.FechaRespuestaQueryType = this.valorPorDefectoQueryType;
        this.FechaSriQueryType = this.valorPorDefectoQueryType;
        this.NumeroEmpresaQueryType = this.valorPorDefectoQueryType;
        this.NumeroEnvioQueryType = this.valorPorDefectoQueryType;
        this.PuntoEmisionQueryType = this.valorPorDefectoQueryType;
        this.SecuencialEnvioQueryType = this.valorPorDefectoQueryType;
        this.SecuencialQueryType = this.valorPorDefectoQueryType;
        this.SucursalEmpresaQueryType = this.valorPorDefectoQueryType;
        this.TipoDocumentoQueryType = this.valorPorDefectoQueryType;
        this.TipoIdCompradorQueryType = this.valorPorDefectoQueryType;
    }
}

export class DocumentoFacturacion { 
    constructor(
        public AutomaticaOManual?: number, 
        public BaseImponible?: number, 
        public CicloPago?: string, 
        public ClaveAcceso?: string, 
        public CodigoAgenteVenta?: number, 
        public CodigoImpuesto?: number, 
        public CodigoPorcenataje?: number, 
        public CodigProducto?: string, 
        public CodigoRetencion?: number, 
        public CodigoSustento?: number, 
        public ContactoDocElec?: string, 
        public ContratoNumero?: number, 
        public ContribuyenteEspecial?: string, 
        public DigitadorCreacion?: string, 
        public DireccionCliente?: string, 
        public DireccionEstablecimiento?: string, 
        public DireccionMatriz?: string, 
        public Email?: string, 
        public EmailBrokerDocElec?: string, 
        public EmailContactoDocElec?: string, 
        public EmailSucursalDocElec?: string, 
        public EmpresaNumero?: number, 
        public Establecimiento?: number, 
        public Estado?: number, 
        public FechaAutorizacion?: Date,
        public FechaAfectaFactura?: Date, 
        public FechaCarga?: Date, 
        public FechaCreacion?: Date, 
        public FechaEmision?: Date, 
        public FechaEnvio?: Date,
        public FechaEnvioCliente?: Date, 
        public FechaEnvioSri?: Date, 
        public FechaFacturaPres?: Date, 
        public FechaFtp?: Date, 
        public FechaGestion?: Date, 
        public FechaMigracion?: Date, 
        public FechaModificacion?: Date, 
        public FechaRespuesta?: Date,
        public FechaSri?: Date, 
        public FormaPago?: string, 
        public HoraAutorizacion?: string, 
        public HoraCreacion?: string, 
        public HoraEnvio?: string, 
        public HoraEnvioCliente?: string,  
        public HoraEnvioSri?: string, 
        public HoraFtp?: string, 
        public HoraMigracion?: string, 
        public HoraModificacion?: string, 
        public IdComprador?: string, 
        public ImporteTotal?: number, 
        public IndicadorRechazo?: string, 
        public Linea1?: string, 
        public Linea2?: string, 
        public Linea3?: string, 
        public Moneda?: string, 
        public MotivoNota?: string, 
        public MotivoRechazo?: string, 
        public NombreAgenteVenta?: string,
        public NombreComercial?: string,
        public NumeroAutorizacion?: string,
        public NumeroConvenio?: number,
        public NumeroCuota?: number,
        public NumeroEnvio?: number,
        public NumeroSustento?: string,
        public ObligadoContabilidad?: number,
        public OrigenError?: string,
        public PeriodoPago?: string,
        public PorcentajeRe?: number,
        public ProCreacion?: string,
        public ProgMigracion?: string,
        public PorgModificacion?: string,
        public Propina?: number,
        public PuntoEmision?: number,
        public RazonSocial?: string,
        public RazonSocialComprador?: string,
        public Region?: string,
        public Ruc?: string,
        public Secuencial?: number,
        public SecuencialEnvio?: number,
        public SeguroCampesino?: number,
        public SeguroCampesinoRetroactivo?: number,
        public SucursalEmpresa?: number,
        public Tarifa?: number,
        public Telefono?: string,
        public NombreTipoDocumento?: string,
        public TipoDocumento?: number,
        public TipoIdComprador?: number,
        public TotalDescuento?: number,
        public TotalSinImpuestos?: number,
        public UsuarioCreacion?: string,
        public UsuarioGestion?: string,
        public UsuarioMigracion?: string,
        public UsuarioModificacion?: string,
        public Valor?: number,
        public ValorModificacion?: number,
        public ValorRetenido?: number,
        public Vigencia?: number,
        public Documento?: string, 
        public NombreEstado?: string, 

        //UI
        public Selected?: boolean,

        //Subscriptions
        public Unsuscribe?: boolean, 

        //Para gestion de documento
        public VariableEntornoRegion?: string, 
        public NewTipoIdComprador?: number, 
        public NewIdComprador?: string, 
        public NewRazonSocialComprador?: string, 
        public NewEmail?: string,
        public NewDireccionCliente?: string,
        public NewEmailBrokerDocElec?: string, 
        public NewEmailContactoDocElec?: string, 
        public NewEmailSucursalDocElec?: string 
    ){}
}

export class DetalleDocumentoFe03Filter { 
    constructor(
        public TipoDocumento?: number, 
        public Establecimiento?: number, 
        public PuntoEmision?: number, 
        public Secuencial?: number
    ){}
}

export class DetalleDocumentoFacturacion{ 
    constructor(
        public Establecimiento?: number, 
        public PuntoEmision?: number, 
        public Secuencial?: number, 
        public DescripcionProducto?: string,
        public Cantidad?: number, 
        public PrecioUnitario?: number, 
        public Descuento?: number, 
        public PrecioTotal?: number, 
        public ServiciosAdicionales?: string,  
        public Nombres?: string, 
        public CodigoPrincial?: number, 
        public CodigoAuxiliar?: number, 
        public PorcentajeRe?: number, 
        public ValorRetenido?: number, 
        public FactruaPres?: string, 
        public CodigoImpuesto?: number, 
        public CodigoRetencion?: number,
        public BaseImponible?: number, 
        public FechaFacturaPers?: string, 
        public NumeroReclamo?: number, 
        public NumeroAlcance?: number, 
        public NumeroCheque?: number 
    ){}
}

export class ContadorEstadosDocumentosFacturacion{
    constructor(
        public NumeroAutorizados?: number, 
        public NumeroRechazados?: number, 
        public NumeroGestionados?: number, 
        public NumeroPorEnviar?: number, 
        public NumeroEnviados?: number, 
        public NumeroOtros?: number, 
        public NombreEstadoEnvio?: string
    ){}
}

export class FacturacionPDF{
    constructor(
        public FacturadoA?:string,
        public FechaAutorizacion?:string,
        public FechaEmision?:string,
        public FormaPago?:string,
        public MailNotificacion?:string,
        public NumeroCuenta?:string,
        public NumeroFactura?:string,
        public NumeroFacturaAplica?:string,
        public RazonSocial?:string,
        public TipoDocumento?:string,
        public UrlDescargaPdf?:string,
        public UrlDescargaZip?:string,
        public ValorTotal?:string,
    ){}
}

export class ResultadoFacturarCobrosSaludPay{ 
    constructor(
        public ContadorExitosos?: number, 
        public MontoTotal?: number,
        public LineasArchivo?: string[]
    ){}
}

export class RespuestaCargaArchivoCobros{ 
    constructor(
        public TotalRegistros?: number, 
        public MontoTotal?: number,
        public MensajeRespuesta?: string
    ){}
}

export class ParaReversar{
    constructor(
        public Cr05Reversar?: string
    ){

    }
}

