export class MovimientoFilter {
    constructor(
        public CodigoContrato?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public ContratoNumero?: number,
        public NumeroMovimiento?: number,
        public CodigoTransaccion?: number
    ) { }
}

export class Movimiento {
    constructor(
        // listado
        public NumeroMovimiento?: number,
        public NumeroDocumento?: number,
        public CodigoTransaccion?: number,
        public Transaccion?: string,
        public FechaMovimiento?: string,
        public FechaMovimientoDate?: Date,
        public FechaEfecto?: string,
        public Digitador?: string,

        // detalles
        public DatoAnterior?: string,
        public NumeroContrato?: string,
        public Persona?: string,
        public FechaModificacion?: string,
        public Campo?: string,
        public Programa?: string,
        public EstadoMovimiento?: string,

        //detallecontrato
        public Plan?: boolean,
        public Servicio?: string,
        public Observacion?: string,
        public TerminalUsuario?: string,
        public FechaFin?: string,
        public SucursalEmpresa?: string,
        public ReferenciaDocumento?: string,

        public PersonaNumero?: number,

        // UI
        public Selected?: boolean

        //GUARDADO
    ) { }
}


export class ReporteMovimientoFilter {
    constructor(
        public FechaMovimientoDesde?: Date,
        public FechaMovimientoHasta?: Date,
        public CodigoProducto?: string,
        public Region?: string,
        public Digitador?: string,
        public ContratoNumero?: number,
        public CodigoTransaccion?: number
    ) { }
}

export class ReporteMovimiento {
    constructor(
        public Titular?: string,
        public ContratoNumero?: string,
        public DatoAnterior?: string,
        public NombreTransaccion?: string,
        public Digitador?: string,
        public FechaMovimiento?: string,
        public FechaEfectoMovimiento?: string,
        public CodigoProducto?: string,
        public Region?: string,
        public Beneficiario?: string
    ) { }
}

export class TipoMovimiento {
    constructor(
        public CodigoTransaccion?: number,
        public NombreTransaccion?: string
    ) { }
}

export class MovimientoWithNombreTransaccion {
    constructor(
        public CodigoTransaccion?: number,
        public FechaMovimiento?: Date,
        public FechaEfectoMovimiento?: Date,
        public Digitador?: string,
        public DatoAnterior?: string,
        public NombreTransaccion?: string,
        public Campo?: string
    ) { }
}