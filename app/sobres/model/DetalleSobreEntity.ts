import { DetalleSobreLiteralEntity } from "./DetalleSobreLiteralEntity";

export class DetalleSobreEntity {
    constructor(

        public IdDetalleSobre?: number,
        public IdSobre?: number,
        public FechaIngresoDetalle?: Date,
        public IdTipoCobertura?: number,
        public Novedad?: boolean,
        public IdNovedad?: number,
        public IdTipoDevolucion?: number,
        public IdTipoCarta?: number,
        public IdMotivoDevolucion?: number,
        public IdMotivoNegativa?: number,
        public IdMotivoGestion?: number,
        public NumeroPersona?: number,
        public ValorPresentadoDetalle?: number,
        public NumeroSolicitudDetalle?: string,
        public ObservacionesConsultor?: string,
        public ObservacionesGestion?: string,
        public IdEstado?: number,
        public NumeroQpra?: string,
        public FechaCambioEstado?: Date,
        public IdClausulaDevolucion?: number,
        public IdClausulaNegativa?: number,

        //PARA EL REPORTE DE RESERVAS
        public NumeroReclamo?: number,
        public NumeroAlcance?: number,
        public FechaPresentacionReclamo?: Date,
        public EstadoReclamo?: number,
        public MontoPresentado?: number,
        public FechaLiquidacionReclamo?: Date,
        public FechaPagoReclamo?: Date,
        public MontoBonificado?: number,
        public SecuencialConstitucion?: string,
        public Migrado?: boolean,
        public IdConstitucion?: number,

        public Literales?: DetalleSobreLiteralEntity[],

        //PARA CLAUSULAS DE SOBRES ANTERIORES
        public ClausulaDevolucion?: string,
        public ClausulaNegativa?: string,

        //DESCRIPCIONES ID
        public NombreBeneficiario?: string,
        public DescripcionEstado?: string,
        public DescripcionTipoCobertura?: string,
        public DescripcionNovedad?: string,
        public DescripcionTipoDevolucion?: string,
        public DescripcionTipoCarta?: string,
        public DescripcionMotivoDevolucion?: string,
        public DescripcionMotivoNegativa?: string,
        public DescripcionMotivoGestion?: string,

        public TituloClausulaDevolucion?: string,
        public TituloClausulaNegativa?: string,
        public DetalleClausulaDevolucion?: string,
        public DetalleClausulaNegativa?: string,

        //UIO
        public NombrePersona?: string,
        public TipoDocumento?: string,
        public DocumentoPersona?: string,
        public EstadoPersona?: string,
        public GeneroPersona?: string
    ) { }
}




