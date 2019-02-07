export class ListaPlanesCorporativoFilter {
    constructor(
        public RazonSocial?: string,
        public EmpresaNumero?: number,
        public SucursalNombre?:string,
        public SucursalEmpresa?:number 

    ) { }
}
export class ListaPlanesCorporativoEntity {
    constructor(
        public EmpresaNumero?: number,
        public RazonSocial?: string,
        public CodigoProducto?: string,
        public SucursalNombre?:string,
        public FechaInicio?:Date,
        public FechaFin?:Date,
        public EmpresaEmail?:string,
        public EmpresaTelefono?:string,
        public EmpresaZona?:string,
        public Estado?:number,
        
        public RucEmpresa?:string, 
        public NumeroContratos?:number,
        public NumeroCuenta?:string,
        public PeriodoPago?:number,
        public SucursalEmail?:string,
        public SucursalTelefono?:string,
        public SucursalRegion?:number,
        public SucursalZona?:string,
        public TipoCuenta?:number,
        public Cobertura?:string,
        public CodigoHomologacion?:string,
        public CodigoPlan?:string,
        public CodigoTarifario?:number,
        public NombrePlan?:string,
        public PrecioBase?:number,
        public Region?:string,
        public VersionPlan?:number,
        public SucursalEmpresa?:number,

        public NumeroBeneficiarios?:number,
        public NivelReferrencia?:number,
        public FechaDigitacion?:Date,
        public MontoCoaseguro?:number,
        public PorcentajeCoaseguro?:number,
        public CubreCongenitas?:number,
        public CubrePreexistencias?:number,
        public EdadTope?:number,
        public EdadFacturacion?:number,
        public PorcentajeEdadTope?:number,
        public MatNuevosBeneficios?:number,
        public DiasCarenciaAmbulatorio?:number,
        public DiasCarenciaHospitalario?:number,
        public DiasReclamo?:number,
        public DiasAlcance?:number,
        public EstadoPlan?:boolean,
        public DiasPreexistencia?:number,
        public EdadDependientes?:number, 

        //For selection on table
        public Selected?: boolean
    ) { }
}

export class ListaPlanesKey{
    constructor(
    public NewKey?: boolean,
    public EmpresaNumero?: number,
    public RazonSocial?: string,
    public CodigoProducto?: string,
    public SucursalNombre?:string,
    public FechaInicio?:Date,
    public FechaFin?:Date,
    public unsuscribe?: boolean,
    public EmpresaEmail?:string,
    public EmpresaTelefono?:string,
    public EmpresaZona?:string,
    public Estado?:number,
    
    public RucEmpresa?:string, 
    public NumeroContratos?:number,
    public NumeroCuenta?:string,
    public PeriodoPago?:number,
    public SucursalEmail?:string,
    public SucursalTelefono?:string,
    public SucursalRegion?:number,
    public SucursalZona?:string,
    public TipoCuenta?:number,
    public Cobertura?:string,
    public CodigoHomologacion?:string,
    public CodigoPlan?:string,
    public CodigoTarifario?:number,
    public NombrePlan?:string,
    public PrecioBase?:number,
    public Region?:string,
    public VersionPlan?:number,
    public SucursalEmpresa?:number,

    public NumeroBeneficiarios?:number,
    public NivelReferrencia?:number,
    public FechaDigitacion?:Date,
    public MontoCoaseguro?:number,
    public PorcentajeCoaseguro?:number,
    public CubreCongenitas?:number,
    public CubrePreexistencias?:number,
    public EdadTope?:number,
    public EdadFacturacion?:number,
    public PorcentajeEdadTope?:number,
    public MatNuevosBeneficios?:number,
    public DiasCarenciaAmbulatorio?:number,
    public DiasCarenciaHospitalario?:number, 
    public DiasReclamo?:number,
    public DiasAlcance?:number,
    public EstadoPlan?:boolean,
    public DiasPreexistencia?:number,
    public EdadDependientes?:number,
    public unsubscribe?:boolean

 ){
    this.NewKey = true;
 } 
   
}

export class UltimoPlanCorporativoFilter {
    constructor(
        public SucursalEmpresa?:number 
    ) { }
}

export class EmpresaDataKey{
    constructor(
    public NewKey?: boolean,
    public EmpresaNumero?: number,
    public RazonSocial?: string,
    public SucursalNombre?:string,
    public SucursalEmpresa?:number,
    public unsuscribe?: boolean
 ){
    this.NewKey = true;
 } 
}
