export class ServicioAdicionalPersona {
    constructor(
        public Codigo?: string,
        public Servicio?: string,
        public FechaInicio?: string,
        public FechaFin?: string,
        public PrecioServicios?: number,
        public EstadoServicio?: string,
        public MontoCobertura?: number,
        public PorcentajeDescuento?: number,
        public ValorDescuento?: number
    ) { }
}

export class ServiciosContratoEntity {
    constructor(
        public CodigoServicioAnterior?: number,
        public CodigoServicio?: number,
        public DescripcionServicio?: string,
        public FechaInicio?: Date,
        public FechaFin?: Date,
        public PrecioServicios?: number,
        public EstadoServicio?: number,
        public MontoCobertura?: number,
        public Contador?: number,
        public NivelCobertura?: number,
        public PersonaNumero?: number,
        public NombreEstado?: string,
        public Selected?: boolean
    ) { }
}

export class ServiciosEntity {
    constructor(
        public CodigoServicio?: number,
        public DescripcionServicio?: string,
        public NombreEstado?: string,
        public CodigoEstado?: number,
        public Region?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public NumeroPersona?: number
    ) { }
}

export class PrecioServicioEntity {
    constructor(
        public Factor?: number,
        public Valor?: string,
        //MODIFICA BENEFICIARIOS
        public CodigoServicio?: number,
        public FechaInicio?: Date,
        public FechaFin?: Date,
        public EdadDesde?: number,
        public EdadHasta?: number,
        public TipoProducto?: string,
    ) { }
}

export class FilterSevicio {
    constructor(
        public CodigoServicio?: number,
        public Edad?: number,
        public FechaInicioServicio?: Date,
        public TipoProducto?: string,
        public Nivel?: number,
        public CodigoProducto?: string,
        public CodigoPlan?: string
    ) { }
}

export class DatosServicioEntity {
    constructor(
        public Estado?: boolean,
        public Precio?: number,
        public Mensaje?: string,
        public MontoCobertura?: number
    ) { }
}

export class ValorNivelDescripcion {
    constructor(
        public Nivel?: number,
        public Valor?: number,
        public Descripcion?: string,
    ) { }
}







