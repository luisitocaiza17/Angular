import { Movimiento } from './movimiento';
import { Oda } from './reclamo';
import { GraphicItem, GraphicDateItem } from './graphicItem';

export class ContratoEntityFilter {
    public filterByEmpresa?: boolean;
    public filterByLiquidacion?: boolean;
    public filterByAutorizacion?: boolean;
    //Anadido filtrar por numero de sobre
    public filterByNumeroSobre?: boolean;
    constructor(
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public NumeroCedula?: string,
        public Pasaporte?: string,
        public NombrePersona?: string,
        public ApellidoPersona?: string,
        public NumeroCuenta?: string,
        public RazonSocial?: string,
        public NumeroEmpresa?: string,
        public NumeroReclamo?: number,
        public NumeroAlcance?: number,
        public NumeroSobre?: string,
        public NumeroAutorizacion?: number,
        public NumeroCaso?: number,
        public Usuario?: string,
        public TipoPermiso?: string
    ) {
        this.filterByEmpresa = false;
        this.filterByLiquidacion = false;
        this.filterByAutorizacion = false;
        this.filterByNumeroSobre = false;
    }
}

export class ContratoEntityList {
    constructor(
        public CodigoContrato?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public ContratoCodigoEstado?: number,
        public CodigoMotivoAnulacion?: number,
        public CodigoSucursal?: number,

        public NumeroContrato?: number,
        public CodigoPlan?: string,
        public CodigoBanco?: number,
        public CodigoBancoCredito?: number,
        public EstadoContrato?: string,
        public FechaInicio?: string,
        public FechaInicioDate?: Date,
        public FechaFin?: string,
        public FechaFinDate?: Date,
        public FechaFinOriginal?: Date,
        public FechaVigencia?: string,
        public EsMoroso?: boolean,
        public MontoMora?: number,
        public NumeroCuenta?: string,
        public Cedula?: string,
        public Pasaporte?: string,
        public NumeroPersona?: number,
        public NombresApellidos?: string,
        public EmailTrabajo?: string,
        public EmailDomicilio?: string,
        public RazonSocial?: string,
        public NumeroEmpresa?: string,
        public Sucursal?: string,
        public SucursalBloqueada?: boolean,
        public RucEmpresa?: string,
        public TipoSociedad?: string,
        public GrupoEmpresa?: string,
        public CiudadEmpresa?: string,
        public NumeroSucursal?: string,
        public NumeroPersonaReclamo?: number,
        public Transicion?: boolean,
        public NivelReferencia?: number,
        public Observaciones?: string,
        public CeroTramites?: string,
        public Garantia?: boolean,
        public Deducible?: boolean,
        public VersionPlan?: number,
        public CarenciasAmbulatorias?: number,
        public OdasDisponibles?: number,
        public OdasConsumidas?: number,
        public PeriodoPago?: number,
        public Usuario?: string,
        public TipoUsuario?: string,
        public GarantiaText?: string,
        public TelefonosTrabajo?: string,

        public DireccionPe?: string,
        public PagoInteligente?: boolean,
        public NumeroCuentaCredito?: string,
        public TipoCuentaCredito?: number,
        public Celular?: string,
        public EnvioPi?: number,
        public NombreBancoPI?: string,

        public FormaPago?: number,
        public TipoCuenta?: number,
        public FacturarRuc?: string,
        public FacturarCedula?: string,
        public NombreDuenioCuenta?: string,
        public FechaFinTarjeta?: string,
        public FechaFinTarjetaDate?: Date,
        public FacturarPasaporte?: string,

        //CAMBIO PLAN
        public CodigoDescuento?: number,
        public AFavor?: number,
        public NumeroCuota?: number,
        public NombrePlan?: string,

        //EMISION TARJETAS
        public TitularBeneficios?: boolean,
        public TarjetasAdicionales?: number,
        public CobrandoTarjetasAdicionales?: boolean,
        public ValorTarjetasAdicionales?: number,

        //MODIFICA BENEFICIARIO
        public PrecioBase?: number,

        public CobradoGastoAdministrativo?: boolean,
        public MontoGastosAdministrativos?: number,
        public ValorRenovacion?: number,

        //Cobranzas 
        public DomicilioCalle?: string,
        public TrabajoCalle?: string,
        public CalleCorrespondencia?: string,
        public DomicilioTelefono1?: string,
        public DomicilioTelefono2?: string,

        public Nombres?: string, 
        public Apellidos?: string,

    ) { }
}

export class ContratoPrestadorEntityList {
    constructor(
        public Convenio?: string,
        public NombreMedico?: string,
        public RucPrestador?: string,
        public CodigoRegion?: string,
        public Oda?: string,
        public NumeroContrato?: number,
        public NombresApellidosTitular?: string,
        public NombreBeneficiario?: string,
        public CodigoPlan?: string,
        public VersionPlan?: string,
        public Especialidad?: string,
        public NivelPrestadorDesde?: string,
        public NivelPrestadorHasta?: string,
        public RegionCliente?: string,
        public Calificacion?: string,
        public Comentario?: string,
        public FechaCalificacion?: string,



        public CodigoContrato?: number,
        public CodigoProducto?: string,
        public ContratoCodigoEstado?: number,
        public CodigoMotivoAnulacion?: number,
        public CodigoSucursal?: number,
        public CodigoBanco?: number,
        public EstadoContrato?: string,
        public FechaInicio?: string,
        public FechaInicioDate?: Date,
        public FechaFin?: string,
        public FechaFinDate?: Date,
        public FechaFinOriginal?: Date,
        public FechaVigencia?: string,
        public EsMoroso?: boolean,
        public MontoMora?: number,
        public NumeroCuenta?: string,
        public Cedula?: string,
        public NumeroPersona?: number,
        public NombresApellidos?: string,
        public EmailTrabajo?: string,
        public EmailDomicilio?: string,
        public RazonSocial?: string,
        public NumeroEmpresa?: string,
        public Sucursal?: string,
        public SucursalBloqueada?: boolean,
        public RucEmpresa?: string,
        public TipoSociedad?: string,
        public GrupoEmpresa?: string,
        public CiudadEmpresa?: string,
        public NumeroSucursal?: string,
        public NumeroPersonaReclamo?: number,
        public Transicion?: boolean,
        public NivelReferencia?: number,
        public Observaciones?: string,
        public CeroTramites?: string,
        public Garantia?: boolean,
        public Deducible?: boolean,
        public CarenciasAmbulatorias?: number,
        public OdasDisponibles?: number,
        public OdasConsumidas?: number,
        public PeriodoPago?: number,
        public Usuario?: string,
        public TipoUsuario?: string,
        public GarantiaText?: string,
        public TelefonosTrabajo?: string
    ) { }
}


export class ContratoKey {
    constructor(
        public CodigoContrato?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public CodigoSucursal?: number,
        public CodigoPlan?: string,
        public NumeroContrato?: number,
        public ContratoEstado?: string,
        public ContratoCodigoEstado?: number,
        public NumeroPersona?: number,
        public EmailTrabajo?: string,
        public EmailDomicilio?: string,
        public NumeroEmpresa?: string,
        public NombreEmpresa?: string,
        public ActiveTab?: string,
        public NumeroPersonaReclamo?: number,
        public NewKey?: boolean,
        public filterByLiquidacion?: boolean,
        public filterByAutorizacion?: boolean,
        public NumeroReclamo?: number,
        public NumeroAlcance?: number,
        public NumeroAutorizacion?: number,
        public Transicion?: boolean,
        public NumeroSucursal?: string,
        public NombreSucursalEmpresa?: string,
        public SucursalBloqueada?: boolean,
        public NombreTitular?: string,
        public CedulaTitular?: string,
        public VersionPlan?: number,
        public Plan?: string,
        public FechaVigencia?: string,
        public NivelReferencia?: number,
        public EsMoroso?: boolean,
        public MontoMora?: number,
        public Observaciones?: string,
        public CeroTramites?: string,
        public Garantia?: boolean,
        public Deducible?: boolean,
        public CarenciasAmbulatorias?: number,
        public OdasDisponibles?: number,
        public OdasConsumidas?: number,
        public PeriodoPago?: number,
        public RucEmpresa?: string,
        // for suscriptions
        public unsuscribe?: boolean,

        //Anulacion
        public FechaInicio?: Date,
        public FechaFin?: Date,
        public FechaFinOriginal?: Date,
        public FechaEfectoAnulacion?: Date,
        public CodigoMotivoAnulacion?: number,
        public NombreMotivoAnulacion?: string,
        public EstadoMorosidad?: boolean,

        //REACTIVACION
        public CodigoBanco?: number,
        public Ciudad?: number,

        //PagoInteligente
        public DireccionPe?: string,
        public PagoInteligente?: boolean,
        public NumeroCuentaCredito?: string,
        public TipoCuentaCredito?: number,
        public Celular?: string,
        public EnvioPi?: number,
        public CodigoBancoCredito?: number,
        public NombreBancoPI?: string,


        public AuxCodigoBanco?: number,
        public AuxNumeroCuentaCredito?: string,
        public AuxTipoCuentaCredito?: number,
        public AuxEmailTrabajo?: string,
        public AuxEmailDomicilio?: string,
        public AuxDireccionPe?: string,
        public AuxCelular?: string,
        public AuxPagoInteligente?: boolean,

        //FORMA DE PAGO
        public FormaPago?: number,
        public TipoCuenta?: number,
        public NumeroCuenta?: string,
        public FacturarRuc?: string,
        public FacturarCedula?: string,
        public NombreDuenioCuenta?: string,
        public FechaFinTarjeta?: string,
        public FechaFinTarjetaDate?: Date,
        public FacturarPasaporte?: string,
        public Anterior?: string,
        public FechaHasta?: Date,
        public PorcentajeDescuento?: number,
        public AuxNombreBanco?: string,

        //CAMBIO PLAN
        public CodigoDescuento?: number,
        public Retroactivo?: number,
        public PorcentajeDescuentoVT?: number,
        public AFavor?: number,
        public Text?: string,
        public NumeroCuota?: number,
        public NombrePlan?: string,

        //RENOVACION DE CONTRATO 
        public FechaAux?: Date,

        //MATERNIDAD
        public Cerror?: string,
        public Maternidad?: number,

        //EMISIONTARJETAS
        public Valor?: number,
        public Motivo?: number,
        public TitularBeneficios?: boolean,
        public TarjetasAdicionales?: number,
        public CobrandoTarjetasAdicionales?: boolean,
        public ValorTarjetasAdicionales?: number,
        public FiltarTarjetas?: boolean,
        public TipoTarjeta?: number,
        public CostoTarjeta?: number,

        //MODIFICABENEFICIARIOS
        public CodigoServicio?: number,
        public NombreServicio?: string,
        public PrecioBase?: number,

        //INGRESO DESCUENTOS
        public NombreSolicitante?: string,

        //FACTURACION MANUAL
        public Transaccion?: string,
        public CobradoGastoAdministrativo?: boolean,
        public MontoGastosAdministrativos?: number,
        public ValorRenovacion?: number,

        public NombresApellidos?: string,

        //CUANDO HAY BUSQUEDA POR NUMERO SOBRE
        public NumeroSobre?: string,

        //Cobranzas 
        public DomicilioCalle?: string,
        public TrabajoCalle?: string,
        public CalleCorrespondencia?: string,
        public RazonSocial?: string,
        public DomicilioTelefono1?: string,
        public DomicilioTelefono2?: string,

        //Para saber si busca por contraro o cuenta, 
        public buscaPorCuenta?: boolean,

        public CodigoVendedor?: string,
        public CodigoDirector?: number,
        public ComisionVenta?: number,
        public ComisionRenovacion?: number,
        public CodigoAgenteContacto?: string,

        //Para usuario aprobador
        public UsuarioMail?: string,
        //Para comentario
        public Comentario?: string,
        public TipoMovimiento?: string
    ) {
        this.NewKey = true;
        this.filterByLiquidacion = false;
        this.filterByAutorizacion = false;
    }
}

export class Contrato {
    constructor(
        /** Datos Generales */
        public CodigoContrato?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public CodigoPlan?: string,
        public NombrePlan?: string,
        public FechaDigitacion?: string,
        public VersionPlan?: number,
        public EstadoContrato?: string,
        public NivelReferencia?: number,
        public FechaInicio?: string,
        public FechaFin?: string,
        public EsMoroso?: boolean,
        public MontoMora?: number,
        public TitularBeneficio?: boolean,
        public MotivoAnulacion?: string,
        public Sucursal?: string,
        public AgenteVenta?: string,
        public AgenteContacto?: string,
        public EjecutivoCuenta?: string,
        public Observaciones?: string,

        /** Datos Recaudacion */
        public FacturarCedula?: string,
        public FacturarRUC?: string,
        public FacturarPasaporte?: string,
        public BancoTarjeta?: string,
        public TipoCuenta?: string,
        public NumeroCuenta?: string,
        public FormaPago?: string,
        public PeriodoPago?: string,
        public SaldoFavor?: number,
        public FechaFinTarjeta?: string,
        public NombreDuennoCuenta?: string,

        /** Datos Personales Titular */
        public TipoDocumento?: string,
        public NumeroDocumento?: string,
        public Nombres?: string,
        public Apellidos?: string,
        public FechaNacimiento?: string,
        public Edad?: number,
        public Genero?: string,
        public EstadoCivil?: string,
        public Ecuatoriano?: boolean,

        /** Datos Domicilio Titular */
        public Direccion?: string,
        public Telefonos?: string,
        public Ciudad?: string,
        public Barrio?: string,
        public Zona?: string,
        public Email?: string,
        public Empresa?: string,
        public TelefonoEmpresa?: string,

        /** Datos Siniestralidad */
        public TotalFacturado?: number,
        public TotalBonificado?: number,
        public TotalGastoAdministrativo?: number,
        public PorcentajeSiniestralidad?: number,
        public TotalFacturadoVigente?: number,
        public TotalBonificadoVigente?: number,
        public TotalGastoAdministrativoVigente?: number,
        public PorcentajeSiniestralidadVigente?: number,
        public FechaInicioSiniestalidad?: string,
        public FechaFinSiniestalidad?: string,
        public NumeroLista?: string,
        public EsCuentaBloqueada?: boolean,

        //OTROS
        public NumeroEmpresa?: number

    ) { }
}

export class Resumen {
    constructor(
        public Empresa?: string,
        public Sala?: string,
        public Moroso?: boolean,
        public CodigoPlan?: string,
        public VersionPlan?: string,
        public NombrePlan?: string,
        public NivelReferencia?: number,
        public NumeroContrato?: number,
        public EstadoContrato?: string,
        public Antiguedad?: string,
        public SiniestralidadPeriodoVigente?: number,
        public SiniestralidadPeriodoAcumulado?: number,
        public TotalFacturadoAcumulado?: number,
        public TotalBonificadoAcumulado?: number,
        public TipoCuentaDebito?: string,
        public NumeroCuentaDebito?: string,
        public BancoCuentaDebito?: string,
        public TipoCuentaCredito?: string,
        public NumeroCuentaCredito?: string,
        public BancoCuentaCredito?: string,
        public MontoMora?: number,
        public CarenciasAmbulatorias?: string,
        public CarenciasHospitalarias?: string,
        public NombreTitular?: string,
        public Oda?: Oda,
        public Transicion?: boolean,
        public Movimientos?: Movimiento[],

        public TopDiagnosticos?: GraphicItem[],
        public TopPrestadores?: GraphicItem[],
        public EvolucionPrecio?: EvolucionPrecio,

        public NombreDuenoCuenta?: string,
        public FechaFinTarjeta?: string
    ) { }
}

export class EvolucionPrecio {
    constructor(
        public AnioMinimo?: number,
        public AnioMaximo?: number,
        public MontoMinimo?: number,
        public MontoMaximo?: number,
        public Precios?: GraphicDateItem[]
    ) { }
}

export class CorrespondenciaEntity {
    constructor(
        public EnvioCorrespondencia?: number,

        public DireccionCorrespondencia?: string,
        public BarrioCorrespondencia?: string,
        public TelefonoCorrespondencia?: string,
        public CodigoCiudadCorrespondencia?: number,
        public NombreCiudadCorrespondencia?: string,

        public DireccionDomicilio?: string,
        public BarrioDomicilio?: string,
        public TelefonoDomicilio?: string,
        public CodigoCiudadDomicilio?: number,
        public NombreCiudadDomicilio?: string,

        public DireccionTrabajo?: string,
        public BarrioTrabajo?: string,
        public TelefonoTrabajo?: string,
        public CodigoCiudadTrabajo?: number,
        public NombreCiudadTrabajo?: string,

        //PARA GUARADAR
        public CodigoContrato?: number,
        public Region?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public PersonaNumero?: number,
        public NumeroEmpresa?: string,
        public NumeroSucursal?: string,
        public Anterior?: string

    ) { }
}

export class DatosTitular {
    constructor(
        public Nombres?: string,
        public Apellidos?: string,
        public Telefono?: string,
        public TrabajoEmail?: string,
        public DomicilioEmail?: string,
        public RenovacionEmailBroker?: string,
        public Empresa?: string,
        public EmailBroker?: string

    ) { }
}

export class ClaveContratoEntity {
    constructor(
        public Region?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number
    ) { }
}


