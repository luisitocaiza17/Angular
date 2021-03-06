import {pcUsuarioRol} from './pcUsuarioRol';
import {Sucursal} from './sucursal';

export class AgenteVentaCorredoresEntity{
    constructor(
        public   CodigoVendedor?:string ,
        public   Codigo?:number ,
        public   NumeroPersona?:number ,
        public   Persona?:string ,
        public   NumeroEmpresa?:number ,
        public   Empresa?:string ,
        public   CodigoSucursal?:number ,
        public   Sucursal?:string ,
        public   Tipo?:string ,
        public   CodigoDirector?:number ,
        public   Director?:string ,
        public   NumeroVendedores?:number ,
        public   FechaIngreso?:Date ,
        public   FechaSalida?:Date ,
        public   Region?:string ,
        public   CodigoGrupo?:number ,
        public   Grupo?:string ,
        public   Nombre?:string ,
        public   GrupoVenta?:string ,
        public   PorcentajeComision?:number ,
        public   NumeroCuentaContable?:string ,
        public   CodigoEstadoAgente?:number ,
        public   EstadoAgente?:number ,
        public   ComisionRenovacion?:number ,
        public   CodigoEstado?:number ,
        public   Estado?:string ,
        public   FechaModificacion?:Date ,
        public   DigitadorModificacion?:string ,
        public   HoraCreacion?:string ,
        public   HoraModificacion?:string ,
        public   ProgramaModificacion ?:string,
        public   FechaCreacion?:Date ,
        public   DigitadorCreacion?:string ,
        public   ProgramaCreacion?:string ,
        public   FechaAnulacion?:Date ,
        public   DigitadorAnulacion?:string ,
        public   HoraAnulacion?:string ,
        public   RazonSocialBroker?:string ,
        public   RucBroker?:string ,
        public   ProgramaAnulacion?:string ,
        public   UsuarioWeb?:string ,
        public   ClaveWeb?:string ,
        public   EmailBroker?:string ,
        public   CodigoTipoContribuyente?:number ,
        public   tipo_contribuyente?:string,
        public   TipoContribuyente?:number ,
        public   Nivel?:number ,
        public   CodigoTipo?:number ,
        public   EsImpresionDocumento?:boolean ,
        public   EsPermiso?:boolean ,
        public   LoginUsuario?:string ,
        public   AplicaPool?:boolean ,
        public   AplicaCorporativo?:boolean ,
        public   AplicaIndividual?:boolean ,
        public   EmailRenovacion?:string,
        public   UsuarioDirectorioActivo?:string ,
        public   representante_legal?:string ,
        public   contacto_nombre?:string ,
        public  Usuarios?:pcUsuarioRol[],
        public  contratoAgenciamiento?: string,
        public comunicacionesEmail?:string,
        public Mensaje?:string
    ) { }
}

export class ContratoEntityFilterBroker
{
    constructor(
    public NumeroContrato ?:number,
    public  NumeroCedula ?:string,
    public  NombrePersona ?:string,
    public  RUCEmpresa ?:string,
    public  RazonSocial ?:string,
    public  NumeroEmpresa ?:string,
    public  NumeroSucursal ?:string,
    public  CodigoPlan ?:string,
    public  Brokers ?:Array<number>,
    public  lstProductos?: Array<string>,
    public  SoloActivos ?:boolean,
    public SoloIndividual?:boolean
    ){}
}

export class EmpresaList{
    constructor(
        public  RazonSocial ?:string,
        public  NumeroEmpresa?:number,
        public  RUCEmpresa ?:string,
        public  Region ?:string,
        public  NombreSucursal ?:string,
        public  AliasSucursal ?:string,
        public  NumeroSucursal ?:number,
        public  Grupo ?:string,
        public  CodigoProducto ?:string,
        public  NumeroContratos ?:number,
        public  FechaInicioSucursal ?:string,
        public  FechaInicioSucursalDate ?:Date,
        public  FechaFinSucursal ?:string,
        public  FechaFinSucursalDate ?:Date,
        public  PendientePago ?:boolean,
        public  Bloqueado ?:boolean,
        public  CodigoAgenteVenta ?:number,
        public  NombreAgenteVenta ?:string,
        public  FechaDigitacionEmpresa ?:Date,
        public  NumeroAfiliados ?:number,
        public  NumeroBeneficiarios ?:number,
        public  TotalUsuarios ?:number,
        public  EstadoSucursal ?:number,
        public  EstadoDesc ?:string,
        public  CodigoEjecutivoVenta ?:string,
        public  EjecutivoVenta ?:string,
        public  SmartPlan?:boolean,
        public esSeleccionado?:boolean,
        public Comision?:number
    ){}
}

export class ContratoEntityListBroker
{
    constructor(
    public CodigoContrato?: number,
    public  CodigoRegion?: string,
    public  CodigoProducto?:string,
    public  CodigoBanco ?:number,
    public  ContratoCodigoEstado ?:number,
    public  CodigoMotivoAnulacion?:number,
    public  CodigoSucursal ?:number,
    public  NumeroContrato ?:number,
    public  CodigoPlan?:string,
    public  EstadoContrato ?:string,
    public  FechaInicio ?:string,
    public  FechaInicioDate ?:Date,
    public  FechaFin ?:string,
    public  FechaFinDate ?:Date,
    public  FechaFinOriginal ?:Date,
    public  FechaVigencia ?:string,
    public  FechaVigenciaDate ?:Date,
    public  EsMoroso ?:boolean,
    public  MontoMora ?:number,
    public  NumeroCuenta ?:string,
    public  Cedula?: string,
    public  NumeroPersona?:number,
    public  NombresApellidos ?:string,
    public  EmailTrabajo?:string,
    public  EmailDomicilio?:string,
    public  RazonSocial ?:string,
    public  NumeroEmpresa ?:string,
    public  Sucursal ?:string,
    public  RucEmpresa ?:string,
    public  TipoSociedad ?:string,
    public  GrupoEmpresa ?:string,
    public  CiudadEmpresa ?:string,
    public  NumeroSucursal ?:string,
    public  SucursalBloqueada ?:boolean,
    public  NumeroPersonaReclamo ?:number,
    public  NivelReferencia ?:number,
    public  Observaciones ?:string,
    public  CeroTramites ?:string,
    public  Transicion ?:boolean,
    public  Garantia ?:boolean,
    public  Deducible?:boolean,
    public  Direccion ?:string,
    public  Telefonos ?:string,
    public  Ciudad ?:string,
    public  VersionPlan ?:number,
    public  CarenciasAmbulatorias ?:number,
    public  OdasDisponibles ?:number,
    public  OdasConsumidas ?:number,
    public  PeriodoPago ?:number,
    public  Usuario ?:string,
    public  TipoUsuario ?:string,
    public  GarantiaText ?:string,
    public  TelefonosTrabajo ?:string,

    public  DireccionPe ?:string,
    public  PagoInteligente ?:boolean,
    public  NumeroCuentaCredito ?:string,
    public  TipoCuentaCredito ?:number,
    public  Celular ?:string,
    public EnvioPi?:number,
    public  NombreBancoPI ?:string,

    public FormaPago ?:number,
    public  TipoCuenta ?:number,
    public  FacturarRuc ?:string,
    public  FacturarCedula ?:string,
    public  NombreDuenioCuenta ?:string,
    public  FechaFinTarjeta ?:string,
    public  FechaFinTarjetaDate ?:Date,
    public  FacturarPasaporte ?:string,
    public  CodigoBancoCredito ?:number,

    public  CodigoDescuento ?:number,
    public  AFavor ?:number,
    public  NumeroCuota ?:number,
    public  NombrePlan ?:string,

    public  TitularBeneficios ?:boolean,
    public  TarjetasAdicionales ?:boolean,
    public  CobrandoTarjetasAdicionales ?:boolean,
    public  ValorTarjetasAdicionales ?:number,

    //MODIFICA BENEFICAIRIO
    public  PrecioBase ?:number,

    //FACTURACION MANUAL
    public CobradoGastoAdministrativo ?:boolean,
    public  MontoGastosAdministrativos ?:number,
    public  ValorRenovacion ?:number,
    public  Nombres ?:string,
    public  Apellidos ?:string,
    public  EjecutivoCuenta ?:string,
    public  CodigoAgenteVenta ?:number,
    // Datos Personales
    public  Antiguedad ?:number,
    public  AntiguedadDesc ?:string,
    public FechaNacimientoDate?:Date,
    public  FechaNacimientoDesc ?:string,
    public  Edad ?:number,
    public  EdadDesc ?:string,
    public  EstadoCivil ?:string,
    public  PendientePago ?:string,
    public esSeleccionado?:boolean,
    ){}
}

export class AgenteVentaCambioFilter
{
    constructor(
        public  Listas ?:number[],
        public  Empresas ?:number[],
    public ComisionNueva ?:number,
    public  UsuarioModifica ?:string,
    public  Contratos ?:number[],
    public  AgenteVentaNuevo ?:number,
    public  NombreAgenteVentaNuevo?:string ,
    public  NombreAgenteVentaAnterior?:string ,
    public  NombreCliente?:string
    ){}
}

export class AgenteReport{
    constructor(
        public  Nombre ?:string,
        public  AgenteVentaId ?:number,
        public  Ruc ?:string,
        public  FechaInicio ?:Date,
        public  FechaFin ?:Date
    ){}
}
export class AgenteReportResult
{
    constructor(
    public  IdMovimiento?: number,
public  movimiento_numero?:number,
public  codigo_producto ?:string,
public  contrato_numero ?:number,
public  region ?:string,
public  persona_numero ?:number,
public  Nombe ?:string,
public  fecha_movimiento ?:Date,
public  fecha_modificacion ?:Date,
public  codigo_transaccion?:number,
public  digitador ?:string,
public  programa ?:string,
public  codigo_contrato ?:number,
public  dato_anterior ?:string,
public  usuario_modificacion?:string,
public  fecha_efecto ?:Date,
public  empresa_numero ?:number,
public  sucursal_empresa ?:number,
public  IdAgenteAnterior ?:number,
public  IdAgenteNuevo ?:number,
public  PorcentajeComisionAnterior?:number,
public  PorcentajeComisionNuevo ?:number,
public  NombreAgenteAnterior ?:string,
public  NombreAgenteNuevo ?:string,
public  NombreModificado?:string
){}
}