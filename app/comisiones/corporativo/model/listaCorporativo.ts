export class ListaCorporativoFilter {
    constructor(
        public RazonSocial?: string,
        public EmpresaNumero?: number,
        public SucursalNombre?:string,
        public SucursalEmpresa?:number,
        public NombreSucursal?:string
         

    ) { }
}
export class ListaCorporativoEntity {
    constructor(
        public NewKey?: boolean,
        public SucursalEmpresa?:number,
        public EmpresaNumero?: number,
        public RazonSocial?: string,
        public SucursalNombre?:string,
        public RepresentanteNombresSucursal?: string,
        public RepresentanteApellidosSucursal?: string, 
        public RepresentanteCargoSucursal?: string, 
        public RepresentanteCedulaSucursal?: string, 
        public SucursalRegion?: number, 
        public SucursalTelefono?: string, 
        public NombreDuenioCuenta?: string, 
        public FacturarARuc?: string, 
        public FechaInicioSucursal?: Date, 
        public FechaFinSucursal?: Date, 
        public HastaUltimoPeriodo?: Date, 
        public NumeroOdas?: number, 
        public FechaModificacion?: Date, 
        public SucursalZona?: String, 
        public NumeroContratos?: number, 
        public CodigoProducto?: string, 
        public NombreUnidad?: string, 
        public NombreRegionUnidad?: string,
        public Bloqueado?: number, 
        public FechaBloqueo?: Date 
 
    ) {
        this.NewKey = true;
     }
}

export class ListaCorporativoKey{
    constructor(
    public NewKey?: boolean,
    public SucursalEmpresa?:number,
    public EmpresaNumero?: number, 
    public unsuscribe?: boolean,
    public Region?:string,
    public ContratoNumero?:number,
    public CodigoProducto?:string,
    public VentaFamiliar?: number,
    public PerteneceCompetancia?:number,
    public PorcentajeDirectorReferidor?: number,
    public PorcentajeReferidor?: number,
    public CodigoReferidor?: number


 ){
    this.NewKey = true;
 }
 
}

export class InsertarPlanKey{
    public CodigoProducto?:string;
    public CodigoPlan?:string;
    public CodigoTarifario?:number;
    public VersionPlan?:number;
    public Region?:string;
    public PrecioBase?:number;
    public EdadFacturacion?:number;
    public EdadTope?:number;
    public PorcentajeEdadTope?:number
    public EdadDependientes?:number;
    public NumeroBeneficiarios?:number;
    public NivelReferencia?:number;
    public FechaInicio?:Date;
    public FechaFin?:Date;
    public FechaDigitacion?:Date;
    public MontoCoaseguro?:number;
    public PorcentajeCoaseguro?:number;
    public CubreCongenitas?:number;
    public CubrePreexistencia?:number;
    public Maternidad?:number;
    public DiasAlcance?:number;
    public DiasReclamo?:number;
    public DiasCarenciaAmbulatorio?:number;
    public DiasCarenciaHospitalario?:number;
    public EmpresaNumero?:number;
    public SucursalEmpresa?:number;
    public MontoCoparticipacion?:number;
    public PorcentajeCoparticipacion?:number;
    public unsubscribe?:boolean;
    public PorcentajeMontoCoparticipacion?:number;
    constructor(
    ){

    }
   
}
