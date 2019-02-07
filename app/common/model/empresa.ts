export class Empresa {
    constructor(
        public Nombre?: string,
        public Numero?: number,
        public NombreSucursal?: string,
        public NumeroSucursal?: number,
        public FormaPago?: number,
        public PeriodoPago?: number,
        public CodigoBanco?: number,
        public TipoCuenta?: number,
        public NumeroCuenta?: string,
        public Moneda?: string,
        public FacturaRuc?: string,
        public FacturaCedula?: string,
        public NombreDuenioCuenta?: string,
        public FechaFinTarjeta?: Date,

        // //PARA CONVENIOS
        public EmpresaNumero?: number,
        public RucEmpresa?: string,
        public RazonSocial?: string,
        public GrupoNumero?: number,
        public CodigoCiudad?: number,
        public CodigoActividad?: number,
        public TipoSociedad?: string,
        public EmpresaCalle?: string,
        public EmpresaZona?: string,
        public EmpresaTelefono?: string,
        public EmpresaEmail?: string,
        //representante legal
        public RepresentanteCedula?: string,
        public RepresentanteCargo?: string,
        public RepresentanteNombres?: string,
        public RepresentanteApellidos?: string,
        public RepresentanteRelacion?: string,
        //financiero de la empresa
        public FinancieroCedula?: string,
        public FinancieroCargo?: string,
        public FinancieroNombres?: string,
        public FinancieroApellidos?: string,

        //para variables de entorno
        public CiudadEntorno?: number,

        //UIO
        public Selected?: boolean


    ) { }
}


export class EmpresaFilter {
    constructor(
        public RucEmpresa?: string,
        public RazonSocial?: string
    ) { }
}