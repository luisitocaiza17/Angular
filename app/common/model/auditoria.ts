import { Field } from './field';

export class AuditoriaAutorizacionFilter {
    constructor(
        public CodigoCobertura?: number,
        public Accion?: string,
        public EstadoId?: number,
        public FechaDesde?: string,
        public FechaHasta?: string,
        public IdTrackingMail?: string,
        public Usuario?: string
    ) { }
}

export class AuditoriaEntity {
    fields: Field[];
    constructor(
        public Id?: number,
        public NombreUsuario?: string,
        public NombreCompleto?: string,
        public IdentificacionUsuario?: string,
        public Accion?: string,
        public Fecha?: string,
    ) {
        this.fields = [];
    }

    public convertToFieldArrray(json): Field[] {
        var array: Field[] = [];
        array = JSON.parse(json);
        return array;
    }    
}

export class AuditoriaAutorizacion extends AuditoriaEntity {
    constructor(
        Id?: number,
        NombreUsuario?: string,
        NombreCompleto?: string,
        IdentificacionUsuario?: string,
        Accion?: string,
        Fecha?: string,

        public IdEntidad?: string,
        public Estado?: string,
        public DatosCompletos?: string,
        public ValorOriginalCamposModificados?: string,
        public ValorActualizadoCamposModificados?: string,
        public CodigoCobertura?: number,
        public NumeroMovimiento?: number,
        public IdTrackingMail?: string,
        public TipoDocumento?: string,
        public Documento?: string,
        public Datos?: Field[],
        public CamposOriginales?: Field[],
        public CamposModificados?: Field[],

        // UI
        public Selected?: boolean
    ) {
        super(Id, NombreUsuario, NombreCompleto, IdentificacionUsuario, Accion, Fecha);
    }
}

export class AuditoriaSistema extends AuditoriaEntity {
    constructor(
        Id?: number,
        NombreUsuario?: string,
        NombreCompleto?: string,
        IdentificacionUsuario?: string,
        Accion?: string,
        Fecha?: string,
        public Entidad?: string,
        public DatosGenerales?: string,
        public DatosComplementarios?: string,
        public Generales?: Field[],
        public Complementarios?: Field[],        
        // UI
        public Selected?: boolean
    ) {
        super(Id, NombreUsuario, NombreCompleto, IdentificacionUsuario, Accion, Fecha);
    }
}

export class AccionAuditable {
    constructor(
        public EMISION_AUTORIZACION?: string,
        public MODIFICACION_AUTORIZACION?: string,
        public ENVIO_CORREO_ELECTRONICO?: string,
        public ENVIO_FTP?: string,
        public CORTE_FTP?: string,
        public CONSULTA?: string
    ) {
        this.EMISION_AUTORIZACION = "EMISIÓN AUTORIZACIÓN";
        this.MODIFICACION_AUTORIZACION = "MODIFICACIÓN AUTORIZACIÓN";
        this.ENVIO_CORREO_ELECTRONICO = "ENVÍO CORREO ELECTRÓNICO";
        this.ENVIO_FTP = "ENVÍO FTP";
        this.CORTE_FTP = "CORTE FTP";
        this.CONSULTA = "CONSULTA"
    }
}

export class TipoDocumento {
    constructor(
        public CORTE_FTP?: string,
    ) {
        this.CORTE_FTP = "Corte_Ftp";
    }
}