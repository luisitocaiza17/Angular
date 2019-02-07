export class LogError {
    constructor(
        public FechaInicioProceso?: string,
        public HoraInicioProceso?: string,
        public HoraFinProceso?: string,
        public NumeroProceso?: number,
        public TotalErrores?: number,
        public TotalLeidos?: number,
        public TotalNoProcesados?: number,
        public TotalProcesados?: number,
        public UsuarioSigmepProceso?: string,
        public Selected?: boolean
    ) { }
}

export class LogErrorFilter {
    constructor(
        public FechaInicioProcesoDesde?: Date,
        public FechaInicioProcesoHasta?: Date,
        public NumeroProceso?: number
    ) { }
}

export class LogErrorDetalleFilter {
    constructor(
        public NumeroProceso?: number,
        public TotalRegistros?: number
    ) { }
}

export class LogErrorDetalle {
    constructor(
        UsuarioSigmepProceso?: string,
        NumeroFactura?: string,
        TipoDocumento?: string,
        DetalleError?: string,
        EstadoError?: string,
        NumeroError?: number,
        NumeroProceso?: number,
        ReferenciaError?: string,
        EmpresaNumero?: number,
        SucursalEmpresa?: string,
        Region?: string,
        CodigoProducto?: string,
        ContratoNumero?: number,
        OficinaSerie?: number,
        SerieFactura?: number,
        Secuencial?: number
    ) { }
}
