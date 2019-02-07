import { GraphicItem } from '../model/graphicItem';
import { Oda } from '../model/reclamo';
import { ContratoKey } from './contrato';

export class BeneficiarioKey {
    constructor(
        public CodigoContrato?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public CodigoPlan?: string,
        public VersionPlan?: number,
        public NumeroPersona?: number,
        public NumeroEmpresa?: string,
        public filterByLiquidacion?: boolean,
        public filterByAutorizacion?: boolean,
        public NumeroReclamo?: number,
        public NumeroAlcance?: number,
        public NumeroEstado?: number,
        public ActiveTab?: string,
        public NewKey?: boolean,
        public Transicion?: boolean,

        public IdAutorizacion?: number,
        public NumeroAutorizacion?: number,
        public EstadoOrdenPago?: number,

        public OdasMasivas?: boolean,
    ) {
        this.NewKey = true;
        this.filterByLiquidacion = false;
        this.filterByAutorizacion = false;
    }
}

export class Beneficiario {
    constructor(
        public NumeroContrato?: number,
        public NombreCompleto?: string,
        public NumeroCedula?: string,
        public NumeroPasaporte?: string,
        public NumeroPersona?: number,
        public Genero?: string,
        public FechaNacimiento?: string,
        public Edad?: number,
        public EsTitular?: boolean,
        public FechaInclusion?: string,
        public FechaExclusion?: string,
        public RelacionDependiente?: string,
        public Comisiona?: boolean,
        public Estado?: string,
        public PrecioServicios?: string,
        public FechaServicio?: string,
        public PrecioAnterior?: string,
        public PorcentajeDescuento?: string,
        public Descuento?: string,
        public PorcentajeRecargo?: string,
        public DescuentoRecargo?: string,
        public CiudadEmpresa?: string,
        public CodigoProducto?: string,
        public PrecioBeneficiario?: number,
        public PrecioServiciosAnterior?: number,
        public CupoBeneficiario?: number,
        public NumeroHistoria?: number,
        public CantidadExclusiones?: number,
        public CantidadAutorizaciones?: number,

        public TotalFacturado?: number,
        public TotalCubierto?: number,
        public TotalNoCubierto?: number,
        public TotalCopago?: number,
        public TotalBonificado?: number,
        public PorcentajeSiniestralidad?: number,

        public TotalFacturadoVigente?: number,
        public TotalCubiertoVigente?: number,
        public TotalNoCubiertoVigente?: number,
        public TotalCopagoVigente?: number,
        public TotalBonificadoVigente?: number,
        public PorcentajeSiniestralidadVigente?: number,
        public FechaInicioVigente?: string,
        public FechaFinalVigente?: string,
        public FechaExclusionPersona?: Date,
        public Selected?: boolean,
        public CarenciasAmbulatorias?: number,
        public DeducibleDisponible?: number,

        public PrimerNombre?: string,
        public SegundoNombre?: string,
        public PrimerApellido?: string,
        public SegundoApellido?: string,
        public TipoIdentificacion?: string,
        public TelefonoMovil?: string,

        public TarjetaBeneficiario?: boolean,
        public CodigoRelacion?: number,
        public CodigoContrato?: number,

        public Maternidad?: string,
        public Mail?: string,
        public Telefono?: string,

        public Nombres?: string,
        public Apellidos?: string,

        public TelefonoDomicilio?: string,
        public DomicilioMail?: string,
        public TrabajoEmail?: string,
        public FechaNacimientoDate?: Date

    ) { }
}

export class ResumenBeneficiario {
    constructor(
        public TotalDeducible?: number,
        public DeducibleConsumido?: number,
        public DeducibleDisponible?: number,
        public MaximoTotal?: number,
        public MaximoConsumido?: number,
        public MaximoDisponible?: number,
        public Oda?: Oda,

        public TopDiagnosticos?: GraphicItem[],
        public TopPrestadores?: GraphicItem[]
    ) { }
}

export class BeneficiarioPaciente {
    constructor(
        public FechaNacimiento?: string,
        public Mail?: string,
        public NumeroIdentificacion?: string,
        public PrimerApellido?: string,
        public PrimerNombre?: string,
        public SegundoApellido?: string,
        public TelefonoMovil?: string,
        public TipoIdentificacion?: string,
        public Genero?: string
    ) { }
}


export class BeneficiarioList {
    constructor(
        public Nombres?: string,
        public Apellidos?: string,
        public FechaVencimientoTarjeta?: Date,
        public CodigoTarjeta?: number,
        public NombreEstado?: string,
        public Maternidad?: string,
        public Region?: string,
        public NombresApellidos?: string,
        public SexoPersona?: boolean,
        public DescripcionSexo?: string,
        public FechaNacimiento?: Date,
        public Edad?: number,
        public NombreRelacion?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public CodigoContrato?: number,
        public NumeroPersona?: number,
        public TajetaBeneficiario?: boolean,
        public CodigoRelacion?: number,
        public PrecioBeneficiario?: number,
        public PrecioServicios?: number,
        public FechaInclusion?: Date,
        public FechaExlusion?: Date,
        public EstadoBeneficiario?: number,
        public EstadoAux?: number,
        public PorcentajeDescuento?: number,
        public PorcentajeDescHombre?: number,
        public PorcentajeDescMujer?: number,
        public FechaVigenciaDesde?: Date,
        public Titular?: boolean,
        public Factor?: number,
        public ValorDescuento?: number,
        public PrecioAnterior?: number,

        //EMISION TARJETAS
        public TarjetaSolicitada?: string,
        public LogicalCard?: boolean,
        public VitalCard?: boolean,
        public ValorTarjeta?: number,
        public ValorRecargo?: number,
        public HoraCreacion?: string,
        public Motivo?: number,

        //MODIFICACION DE BENEFICIAIOS
        public TipoDocumento?: boolean,
        public Comisiona?: boolean,
        public Reingreso?: boolean,
        public UsuarioModificacion?: string,
        public PrecioSugerido?: number,
        public CodigoTransaccion?: number,

        public CodigoPlan?: string,
        public VersionPlan?: number,
        public InclusionIntrautera?: boolean,


        // UI
        public Selected?: boolean,
        public DescripcionTitular?: string,
        public ModificarMaternidad?: boolean,
        public DescuentoDisponible?: number
    ) { }
}

export class CambioTitularFilter {
    constructor(
        public CodigoRelacion?: number,
        public EsTitular?: boolean,
        public NumeroContrato?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public NumeroPersonaNueva?: number,
        public NumeroPersonaAnterior?: number,
        public CodigoContrato?: number,
        public NumeroSucursal?: string,
        public NumeroEmpresa?: string
    ) { }
}

export class BeneficiarioPrecios {
    constructor(
        //
        public NumeroContrato?: number,
        public NumeroPersona?: number,
        public PrecioServicios?: number,
        public PrecioAnterior?: number,
        public PrecioServiciosAnterior?: number,
        public PorcentajeDescuento?: number,
        public Descuento?: number,
        public PorcentajeRecargo?: number,
        public DescuentoRecargo?: number,
        public PrecioBeneficiario?: number,
        public CodigoContrato?: number,
        public Observacion?: string,
        public EsTitular?: boolean,
        public ContratoKey?: ContratoKey
    ) { }
}

export class BeneficiarioDescuentoTransaccionEntity {
    constructor(
        public PersonaNombre?: string,
        public PersonaApellido?: string,
        public NombreRelacion?: string,
        public PrecioServicios?: number,
        public PrecioBeneficiario?: number,
        public DescuentoDisponible?: number,
        public DescuentoAplica?: number,
        public PorcentajeDescuento?: number,
        public ValorDescuento?: number,
        public PersonaNumero?: number,

        public VistaPorcentajeDescNuevo?: number,
        public PorcentajeDescNuevo?: number,
        public Descuento?: number,
        public ValorDescuentoNuevo?: number,
        public VistaValorDescNuevo?: number

    ) {

    }
}



