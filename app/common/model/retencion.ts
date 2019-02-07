import { PlanContrato } from '../../common/model/plan';

export type RetencionKey = {
    Region: string
    CodigoProducto: string
    NumeroContrato: number
    IdDesc: number
}


export class GetRetencionKey {
    constructor(
        public Region?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public IdDesc?: number,
    ) { }
}

export type RetencionMovimientosKey = {
    Region: string
    CodigoProducto: string
    NumeroContrato: number
    IdDesc: number
    identificador: string
}

/*export type Retencion = {
    CodigoPlan: string
    CodigoRegion: string
    Incremento: number
    Nivel: number
    NombrePersona: string
    NombrePlan: string
    NumeroContrato: number
    PorcentajeIncremento: number
    Siniestralidad: string
    ValorActual: number
    ValorAnterior: number
    categoriaCliente: string
    NombreTitular: string
    NombreCiudad: string
    LogCambios: string
    LlaveAcceso: string
    NombreBroker: string
    CorreoBroker: string

    SiniestralidadNumber: number
}*/

export class Retencion {
    constructor(
        public CodigoPlan?: string,
        public CodigoRegion?: string,
        public Incremento?: number,
        public Nivel?: number,
        public NombrePersona?: string,
        public NombrePlan?: string,
        public NumeroContrato?: number,
        public PorcentajeIncremento?: number,
        public Siniestralidad?: string,
        public ValorActual?: number,
        public ValorAnterior?: number,
        public categoriaCliente?: string,
        public NombreTitular?: string,
        public NombreCiudad?: string,
        public LogCambios?: string,
        public LlaveAcceso?: string,
        public NombreBroker?: string,
        public CorreoBroker?: string,
        public CodigoContrato?: number,

        public SiniestralidadNumber?: number,
        public FechaFin?: string,
        public EsMoroso?: boolean,
        public NombrePeriodoPago?: string

    ) { }
}



export type DescuentoCliente = {
    NombreRelacion: string
    NombrePersona: string
    Edad: number
    NumeroContrato: number
    CodigoPlan: string
    PorcentajeDescAnterior: number
    ValorDescuentoAnterior: number
    PorcentajeDesc: number
    ValorDescuento: number
    DescuentoDisponible: number
    PorcentajeDescNuevo: number
    ValorDesNuevo: number
    Sexo: boolean
    MedicinaPrepagada: number
    ServiciosAdicionales: number
    GastoAdministrativo: number
    Nivel: number
    NombreProducto: string
    TipoMovimiento: string
}
export class ReporteRetencionFilter {
    IdOficina: number
    Region: string
    FechaDesde: Date
    FechaHasta: Date
    Estado: number
}

export type DescuentosPendiente = {
    Id: number
    Estado: number
    UsuarioGestion: string
    UsuarioAprobador: string
    RolGestion: string
    FechaGestion: Date
    CodigoRegion: string
    CodigoProducto: string
    NumeroContrato: number
    DescuentosRetencionCliente: DescuentoCliente[]
    CambioPlanCliente: PlanContrato
    IdOficina: number
    NombreOficina: string
    SSC: number
    TipoMovimiento: string
}


export type Beneficiario = {
    NombreRelacion: string
    Nombres: string
    Apellidos: string
    PrecioBeneficiario: number
    PrecioAnterior: number
    Incremento: number
    Siniestralidad: number
    ValorMinimo: number
    ValorMaximo: number
    Salto: string
    PersonaNumero: number
    Secuencial: number
    PrecioServicios: number
    ValorDescuento: number
    SubtotalPrecioIncremento: number
    ValorGastoAdministrativo: number
    PorcentajeSubtotalIncremento: number
    PrecioServiciosAnterior: number
    Descuento: number
    SubtotalPrecioAnterior: number
    ValorDescuentoAnterior: number
    PorcentajeSubtotalAnterior: number
    ValorMedicinaPrepagadaActual: number
    ValorMedicinaPrepagadaAnterior: number
    DescuentoAnterior: number
    PorcentajeDescuentoAnterior: number
    RangoEdadMinimoMaximo: number
    LogCambios: string
    DetalleLog: string
    Edad: number

    IncrementoDolares: number
    IncrementoPorcentaje: number
    MostrarLog: boolean
}

export type ServiciosKey = {
    Region: string
    CodigoProducto: string
    NumeroContrato: number
    PersonaNumero: number
    Secuencial: number
}

export type Servicio = {
    EstadoServicio: number
    NombreEstadoServicio: string
    CodigoServicio: number
    DescripcionServicio: string
    FechaInicioServicio: Date
    FechaFinServicio: Date
    PrecioAnterior: number
    PrecioActual: number
    PrecioSinDescuentoActual: number
    PrecioSinDescuentoAnterior: number
    Secuencial: number
}

export class SetComentario {
    IdDesicionCliente: number
    IdContactabilidad: number
    Region: string
    CodigoProducto: string
    NumeroContrato: number
    NombreUsuario: string
    Comentario: string
    IdOficina: number

    PorcentajeDescuento: number
    Expecion1: boolean
    Expecion2: boolean
    Expecion3: boolean
    DetalleExpecion: string
    ValorExcepcion: number
    IdDesc: number

    constructor() {
        this.IdDesicionCliente = undefined;
        this.IdContactabilidad = undefined;
        this.Region = "";
        this.CodigoProducto = "";
        this.NumeroContrato = 0;
        this.NombreUsuario = "";
        this.Comentario = "";
        this.IdOficina = undefined;
        this.PorcentajeDescuento = undefined;
        this.Expecion1 = false;
        this.Expecion2 = false;
        this.Expecion3 = false;
        this.DetalleExpecion = undefined;
        this.ValorExcepcion = undefined;
    }
}

export type OpcionesComentario = {
    ListaDesicionCliente: Opcion[]
    ListaContactabilidad: Opcion[]
}

export type Opcion = {
    Id: number,
    Detalle: string,
    FechaDeCreacion: Date,
    Estado: boolean
}

export type Comentario = {
    id: number
    IdContactabilidad: number
    IdDecisionCliente: number
    Region: string
    CodigoProducto: string
    NumeroContrato: number
    NombreUsuario: string
    FechaComentarioString: string
    Comentario: string
    FechaDeCreacion: Date
}

export class FiltroReportes {
    constructor(
        public NumeroContrato?: number,
        public Estado?: number,
        public IdOficina?: number,
        public Region?: string,
        public FechaDesde?: Date,
        public FechaHasta?: Date,
        public Usuario?: string
    ) { }
}

export type Reporte = {
    NombrePersona: string,
    CodigoRegion: string,
    NumeroContrato: number,
    CodigoPlan: string,
    NombrePlan: string
    Nivel: number,
    Siniestralidad: string,
    ValorAnterior: number,
    ValorActual: number,
    Incremento: number,
    PorcentajeIncremento: number,
    CodigoProducto: string,
    Oficina: string,
    Decision: number,
    Contactabilidad: number,
    UsuarioGestion: string,
    ObservacionesDeGestion: string,
    FechaDeGestion: Date
}

export type Categoria = {
    id: number,
    Descripcion: string,
    FechaDeActualizacion: Date,
    Estado: boolean
}

export type Archivo = {
    id: number,
    NombreOriginal: string,
    NombreHash: string,
    FechaCreacion: Date,
    Estado: boolean,
    Directorio: string,
    idCategoria: number
}

export type Descarga = {
    nombreBuscado: string
    idCategoria: number
}

export type Upload = {

}

export type UploadRes = {

}

export class FiltroMFiles {
    constructor(
        public IdOficina?: number,
        public Region?: string,
        public IdDocumento?: number,
        public IdRegion?: number,
        public ValueRegion?: string,
        public IdProducto?: number,
        public ValueProducto?: string,
        public IdNumeroContrato?: number,
        public ValueNumeroContrato?: string
    ) { }
}

export type ParametroRetencion = {
    Id: number,
    Nombre: string,
    Valor: any,
    RangoAprobacion: boolean
}

export type RespuestaParametroRetencion = {
    Estado: string,
    Mensaje: string,
    IdDesc: number
}

export class GestionRetencionCliente {
    constructor(
        public Id?: number,
        public Region?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public EstadoId?: number,
        public FechaGestion?: Date,
        public DatosGestion?: string,
        public UsuarioGestion?: string,
        public UsuarioAprobador?: string,
        public IdOficina?: number,
        public NombreOficina?: string,
        public TipoMovimiento?: string
    ) { }
}

export class RetencionCambioPlanEntity {
    constructor(
        public PlanAnterior?: string,
        public NuevoPlan?: string
    ) { }
}

