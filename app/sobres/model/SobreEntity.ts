import { SeguimientoSobreEntity } from "./SeguimientoSobreEntity";
import { DetalleSobreEntity } from "./DetalleSobreEntity";

export class SobreEntity {
    constructor(

        public IdSobre?: number,
        public IdEstablecimiento?: number,
        public IdEstadoSobre?: number,
        public NumeroContrato?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public CodigoContrato?: number,
        public NumeroSobre?: string,
        public FechaRecepcion?: Date,
        public FechaSobre?: Date,
        public FechaDigitacion?: Date,
        public ValorPresentado?: number,
        public ValorConsultor?: number,
        public PersonaContacto?: string,
        public Celular?: string,
        public UsuarioAsignado?: string,
        public IngresadoPor?: string,
        public FechaAsignacion?: Date,
        public FechaEnvio?: Date,
        public FechaGestion?: Date,
        public FechaCourier?: Date,
        public UsuarioGestion?: string,
        public Devuelto?: boolean,
        public SMSIngreso?: boolean,
        public SMSDevolucion?: boolean,
        public NumeroQpra?: string,
        public Nota1?: boolean,
        public Nota2?: boolean,
        public Nota3?: boolean,
        public Reportado?: boolean,
        public NumeroSolicitud?: string,
        public DetalleSobre?: DetalleSobreEntity[],

        //Descripciones
        public NombreEstablecimiento?: string,
        public NombreEstadoSobre?: string,
        public RegionEstablecimiento?: string,
        public IdRegionEstablecimiento?: number,

        //Datos del Titular
        public NombresTitular?: string,
        public EmailTrabajo?: string,
        public EmailDomicilio?: string,
        public EmailFuncionarioSalud?: string,
        public RenovacionEmailBroker?: string,
        public Ciudad?: number,
        public Empresa?: string,

        //Para Obtener el Ultimo Seguimiento
        public UltimoSeguimiento?: SeguimientoSobreEntity,

        // UI
        public RegionSeleccionada?: string,
        public Selected?: boolean,
        public EnviarMail?: boolean,
        public unsuscribe?: boolean,
        public PendientesUrgente?: boolean,
        public DiasDesdeDigitacion?: number,
        public FechaModificacion?: string,
        public HoraModificacion?: string,
        public UsuarioModificacion?: string,
        public Accion?: string,
        //Empresa
        //Credito
        public TipoDocumento?: number,
        public UsuarioLiquidador?: string,
        public Clinica?: string,
        public IdClinica?: number,
        public FechaFinConsultor?: Date,
        public FechaLiquidador?: Date 

    ) { }
}