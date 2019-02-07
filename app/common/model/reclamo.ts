import { ContratoKey } from './contrato';

export class ReclamoEntityFilter {
    constructor(
        public NumeroContrato?: number,
        public NumeroReclamo?: number,
        public NumeroAlcance?: number,
        public CodigoContrato?: number,
        public NumeroSobre?: string,
        public TipoReclamo?: string, 

        //ODAS
        public Producto?: string,
        public CodigoPlan?: string,
        public NombreTitular?: string,
        public PersonaNumero?: number,
        public NombreBeneficiario?: string,
        public MontoPresentado?: number,
        public MontoCubierto?: number,
        public MontoBonificado?: number,
        public MontoCopago?: number,
        public MontoArancel?: number,
        public EstadoReclamo?: string,
        public FechaLiquidacion?: string,
        public Region?: string,
        public Prestador?: string,
        public Diagnostico?: string,
        public OficinaLiquidacion?: string,
        public Digitador?: string,
        public NivelPrestadorDesde?: number,
        public NivelPrestadorHasta?: number,
        public NivelCliente?: number,
        public Especialidad?: string,
        public FechaDesde?: Date,
        public FechaHasta?: Date,
        public NumeroPrestador?: number
    ) { }
}

export class ReclamoKey {
    constructor(
        public ReclamoSeleccionado?: Reclamo,
        public ContratoKey?: ContratoKey
    ) { }
}

export class EstadoReclamo {
    constructor(
        public NumeroEstado?: number,
        public NombreEstado?: string
    ) { }
}

export class Reclamo {
    constructor(
        public FormaPagoReclamo?: string,
        public MontoDeducible?: number,
        public NumeroReclamo?: number,
        public NumeroAlcance?: number,
        public TipoReclamo?: string,
        public CodigoDiagnostico?: string,
        public Diagnostico?: string,
        public FechaPresentacionReclamo?: string,
        public EstadoReclamo?: string,
        public MontoNoCubierto?: number,
        public MontoCubierto?: number,
        public MontoCopago?: number,
        public MontoBonificado?: number,
        public Observaciones?: string,
        public ObservacionInterna?: string,
        public Observacion1?: string,
        public Observacion2?: string,
        public Observacion3?: string,
        public NombreBeneficiario?: string,
        public NumeroBeneficiario?: number,
        public FechaPago?: string,
        //Para Oda
        public FechaEmision?: string,
        public FechaVencimiento?: string,
        public Medico?: string,
        public Especialidad?: string,
        public OficinaLiquidacion?: number,
        public PrestadorNumero?: number,
        public CodigoContrato?: number,
        public ContratoNumero?: number,
        public EmailTrabajo?: string,
        public EmailDomicilio?: string,
        public MontoGastoAdministrativo?: number,
        public PrestadorPersonaNumero?: number,
        public PrestadorEmpresaNumero?: number,
        public NumeroConvenio?: number,

        public EstadoOrdenPago?: number,

        public CodigoProducto?: string,
        public CodigoPlan?: string,
        public VersionPlan?: number,

        public Selected?: boolean,
        public isEditable?: boolean
    ) { }
}

export class Oda {
    constructor(
        public OdasConsumidas?: number,
        public OdasDisponibles?: number,
        public  PorBeneficiario?: boolean
    ) { }
}

export class OdaResumen {
    constructor(
        public OdasConsumidas?: number,
        public OdasDisponibles?: number,
        public Meses?:number,
        public  PorBeneficiario?: boolean
    ) { }
}

