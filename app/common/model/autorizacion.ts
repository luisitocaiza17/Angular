import { ContratoKey } from './contrato';
import { Diagnostico } from './diagnostico';
import { Catalogo } from './catalogo';
import { DetalleProcedimiento } from './DetalleProcedimiento';
import { MotivoDiagnosticoNoCubierto } from './motivoDiagnosticoNoCubierto';

export class AutorizacionFilter {
    constructor(
        public IdAutorizacion?: number,
        public NumeroAutorizacion?: number,
        public CodigoContrato?: number,
        public NumeroPersona?: number,

        // for report
        public FechaDesde?: Date,
        public FechaHasta?: Date,
        public Region?: string,
        public TipoAplicacion?: string,
        public PrestadorTipo?: string,
        public ClienteImpago?: boolean,
        public EstadoCobertura?: string,

        //for report In Situ
        public TipoFecha?: string,
        public Estado?: number,
        public TipoSolicitud?: string,
        public Autorizacion?: string,
        public OrdenadoPor?: string,
        public Producto?: string

    ) { }
}

export class AutorizacionValidacionKey {
    constructor(
        public VersioPlan?: number,
        public EstadoConvenio?: number,
        public Region?: string,
        public CodProducto?: string,
        public CodigoPlan?: string,
        public TipoConvenio?: string,
        public TipoSolicitud?: string,
        public CabeceraDiagnostico?: string,
        public ContratoNumero?: number,
        public CodigoContrato?: number,
        public PersonaNumero?: number,
        public CodigoDiagnostico?: string,
        public Diagnostico?: string,
    ) { }
}

export class AutorizacionKey {
    constructor(
        public autorizacionSeleccionado?: Autorizacion
    ) { }
}

export class Autorizacion {
    constructor(
        public Id?: number,
        public NumeroAutorizacion?: number,
        public AutorizadoPor?: string,
        public FechaAutorizacion?: Date,
        public TipoSolicitud?: string,
        public FechaCreacion?: Date,
        public FechaRequerimiento?: Date,
        public FechaCreacionText?: string,
        public NumeroObservacion?: number,
        public Observaciones?: string,
        public ObservacionHistoriaClinica?: string,
        public CodigoEjecutivo?: number,
        public MontoAutorizado?: number,
        public FechaHospitalizacion?: Date,
        public Canal?: string,
        public PersonaNumero?: number,
        public CedulaTitular?: string,

        public CodigoContrato?: number,
        public ContratoNumero?: number,
        public ContratoEstado?: string,
        public Region?: string,
        public CodigoProducto?: string,
        public NombreEmpresa?: string,
        public NumeroEmpresa?: number,
        public SucursalEmpresa?: number,
        public NombreSucursalEmpresa?: string,
        public TipoAplicacion?: string,
        public Estado?: Catalogo,
        public EstadoCobertura?: string,
        public MotivoNoCubierto?: MotivoDiagnosticoNoCubierto,
        public DetalleMotivoNoCubierto?: string,
        public TipoCobertura?: string,

        public CodigoParentesco?: number,
        public NombreContacto?: string,
        public OtroParentesco?: string,

        public FechaLlamada?: Date,
        public HoraLlamada?: Date,
        public ResponsableLlamada?: string,
        public ComentarioLlamada?: string,
        public PrestadorTipo?: string,
        public CodigoPrestador?: number,
        public NombrePrestador?: string,
        public CodigoPrestadorEmpresa?: number,
        public NombrePrestadorEmpresa?: string,
        public RegionPrestadorEmpresa?: string,
        public PorcentajeCobertura?: number,
        public ClausulaArticuloId?: number,
        public NumeroAlcance?: number,
        public NumeroReclamo?: number,
        public TipoReclamo?: string,
        public TipoProcedimiento?: string,
        public CodigoProcedimiento?: string,
        public MedicoTratante?: string,
        public LugarAtencion?: string,
        public FechaAlta?: Date,
        public TipoHospitalizacion?: string,
        public TipoTratamientoHospitalario?: string,
        public FormaPagoHospitalizacion?: string,
        public NivelPrestador?: string,
        public NivelPrestadorEmpresa?: string,
        public NombreBeneficiario?: string,
        public CedulaBeneficiario?: string,

        public NumeroHistoriaPersona?: number,
        public CupoPersona?: number,
        public EdadPersona?: number,
        public GeneroPersona?: string,
        public EstadoPersona?: string,
        public FechaExclusionPersona?: Date,
        public LiberarLiquidacion?: string,
        public NombreTitular?: string,
        public EmailTrabajo?: string,
        public EmailDomicilio?: string,
        public CiudadAutorizacion?: string,
        public ClienteImpago?: boolean,

        public DetallesProcedimientos?: DetalleProcedimiento[],
        public Diagnosticos?: Diagnostico[],
        public UsuarioCreacion?: string,
        public Alcance?: boolean,

        public FechaAutorizacionText?: string,
        public FechaHospitalizacionText?: string,

        // for UI only
        public FechaVigencia?: string,
        public CodigoPlan?: string,
        public NivelReferencia?: number,
        public ObservacionesContrato?: string,
        public CeroTramites?: string,
        public Transicion?: boolean,
        public TipoDocumento?: string,
        public Garantia?: boolean,
        public Deducible?: boolean,
        public isEditable?: boolean,
        public isHabilitarMotivo?: boolean,
        public CantidadExclusiones?: number,
        public CantidadAutorizaciones?: number,
        public VersionPlan?: number,
        public NumeroEstadoConvenio?: number,
        public TipoConvenio?: string,
        public Selected?: boolean,
        public Vadidar?: boolean,

        public Nombre?: string,
        public Apellido?: string,

        public NumeroCaso?: number,
        public FechaAnulacion?: Date,
        public Excepcion?: boolean,
        public DetalleExcepcion?: string
    ) {
        if (this.isEditable == undefined)
            this.isEditable = true;
        if (this.isHabilitarMotivo == undefined)
            this.isHabilitarMotivo = true;
        if (this.CantidadExclusiones == undefined)
            this.CantidadExclusiones = 0;
        if (this.CantidadAutorizaciones == undefined)
            this.CantidadAutorizaciones = 0;
    }
}