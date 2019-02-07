export class MovimientoComisionEntity{ 
    constructor(
        public Id?: number, 
        public TipoMovimiento?: string,
        public CodigoTransaccion?: number, 
        public NombreTransaccion?: string, 
        public CodigoProducto?: string,
        public ContratoNumero?: number,
        public Region?: string, 
        public FechaMovimiento?: Date,
        public FechaEfectoMovimiento?: Date, 
        public CodigoAgenteVenta?: number, 
        public NombreAgenteVenta?: string,
        public EmpresaNumero?: number,
        public EmpresaRazonSocial?: string, 
        public SucursalCodigo?: number,
        public SucursalNombre?: string,
        public RemesaEstadoCodigo?: number,
        public RemesaEstadoNombre?: string,
        public CodigoDirector?: number, 
        public NombreDirector?: string, 
        public Selected?: boolean,
        public FechaInicio?: Date,
        public FechaFin?: Date,
        public NumeroBeneficiarios?: number
    ){ 

    }
}

export class FiltroMovimientoComisionEntity{
    constructor(
        public Anio?: number, 
        public Mes?: number, 
        public CodigoAgenteVenta?: number,
        public TipoMovimiento?: string 
    ){

    }
}

export class BeneficiarioComisionEntity{
    constructor(
        public Id?: number,
        public PersonaNumero?: number,
        public PrecioBeneficiario?: number,
        public PrecioCalculo?: number, 
        public Apellidos?: string, 
        public Nombres?: string,
        public Discapacidad?: boolean, 
        public AdultoMayor?: boolean,
        public Comisiona?: boolean,
        public IdMovimientoComision?: number,
        public Selected?: boolean,
        public AltoRiesgo?: boolean,
        public EdadAdultoMayor?: number,
        public PorcentajeDiscapacidad?: number,
    ) { }
}

export class FiltroBeneficiarioComisionEntity{ 
    constructor(
        public IdMovimientoComision?: number
    ){ 

    }
}

export class ServicioAdicionalComisionEntity{
    constructor(
        public Id?: number,
        public Selected?: boolean,
        public CodigoServicio?: number,
        public NombreServicio?: string,
        public PrecioServicio?: number,
        public Comisiona?: boolean,
        public IdBeneficiarioComision?: number,
        public Observacion?: string,
        public ComisionaServicioAdicional?: boolean
    ){

    }
}

export class MovimientoYBeneficiarioComision{
    constructor(
        public MovimientoComision?: MovimientoComisionEntity, 
        public BeneficiarioComision?: BeneficiarioComisionEntity
    ){

    }
}

