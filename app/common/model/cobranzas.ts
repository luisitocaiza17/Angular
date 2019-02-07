

export class CitaCliente{
    constructor(
        public CitaPeriodica?: number, 
        public CodigoSucursal?: number, 
        public Contacto?: string, 
        public Cumplida?: number, 
        public DireccionCita?: string, 
        public Direccion1?: string, 
        public Direccion2?: string, 
        public Direccion3?: string, 
        public Estado?: number, 
        public FechaCita?: Date, 
        public FechaPlanificacion?: Date, 
        public GrupalIndividual?: string, 
        public Hora?: string, 
        public MesesACobrar?: number,
        public MesesCobro?: number, 
        public MesesDetalle?: string, 
        public Monto?: number, 
        public MontoACobrar?: number, 
        public MontoMensual?: number, 
        public NombreCliente?: string, 
        public NumC?: number, 
        public Observacion?: string, 
        public ObservacionCita?: string, 
        public RealizadoPor?: string, 
        public Region?: string, 
        public Ruta?: number, 
        public Sector?: string, 
        public Tipo?: string , 

        //UI 
        public Selected?: boolean 
    ){
        this.FechaPlanificacion = new Date(); 
        this.MesesDetalle = ''; 
        this.MesesACobrar = 0; 
        this.CitaPeriodica = 0; 
    }
}

export class CitaClienteFilter { 
    constructor(
        public Region?: string, 
        public FechaDesde?: Date, 
        public FechaHasta?: Date, 
        public RealizadoPor?: string, 
        public OrderBy?: string, 
        public Turno?: string, 
        public Sector?: string, 
        public CodigoSucursal?: string, 
    ){
        
    }
}