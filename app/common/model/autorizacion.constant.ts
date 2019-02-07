export class RegionPrestadorEmpresa {
    public static COSTA: string = "Costa";
    public static SIERRA: string = "Sierra";

    public static values: string[] = [RegionPrestadorEmpresa.COSTA, RegionPrestadorEmpresa.SIERRA];
}

export class ProductoContrato {
    public static COR: string = "COR";
    public static IND: string = "IND";
    public static ONC: string = "ONC";
    public static POO: string = "POO";

    public static values: string[] = [ProductoContrato.COR, ProductoContrato.IND, ProductoContrato.ONC, ProductoContrato.POO];
}

// CONSTANTES MAIL Y FTP
export class CiudadAutorizacion {
    public static values: string[] = ["Quito", "Guayaquil", "Cuenca"];
}

export class TipoPdf {
    constructor(
        public CUBIERTO?: string,
        public NO_CUBIERTO?: string,
        public ADENDUM?: string,
        public ALCANCE?: string,
    ) {
        this.CUBIERTO = "Cubierto";
        this.NO_CUBIERTO = "No_Cubierto";
        this.ADENDUM = "Adendum";
        this.ALCANCE = "Alcance";
    }
}

// CONSTANTES INCLUIR AUTORIZACION
export class Canal {
    public static VELADAS: string = "Veladas";
    public static values: string[] = ["Contact Center", "Presencial", "Web", "In Situ"];
}

export class TipoAplicacion {
    public static SELECCIONE: string = undefined;
    public static MATERNIDAD: string = "Maternidad";
    public static REEMBOLSO: string = "Reembolso";
    public static CREDITO: string = "Credito";

    public static values: string[] = [TipoAplicacion.REEMBOLSO, TipoAplicacion.CREDITO];
}

export class TipoSolicitud {
    public static PROGRAMADA: string = "Programada";
    public static EMERGENTE: string = "Emergente";
    public static ACCIDENTES: string = "Accidentes";
    public static DR_SALUD_URGENCIAS: string = "Dr Salud Urgencias";
    public static values: string[] = ["Programada", "Emergente", "Accidentes", "Dr Salud Urgencias"];
}

export class EstadoCobertura {
    public static CUBIERTO = "Cubierto";
    public static NO_CUBIERTO = "No Cubierto";

    public static values: string[] = [EstadoCobertura.CUBIERTO, EstadoCobertura.NO_CUBIERTO];

    constructor(
        public Cubierto?: string,
        public NoCubierto?: string
    ) {
        this.Cubierto = EstadoCobertura.CUBIERTO;
        this.NoCubierto = EstadoCobertura.NO_CUBIERTO;
    }
}

export class TipoCobertura {
    public static HOSPITALARIA: string = "Hospitalaria";
    public static AMBULATORIO: string = "Ambulatorio";
    public static HOSPITAL_DIA: string = "Hospital del Día";
    public static ATENCION_DOMICILIARIA_PALCARE: string = "Atención Domiciliaria Palcare";
    public static OBSERVACION: string = "Observación";

    public static values: string[] = [
        TipoCobertura.HOSPITALARIA,
        TipoCobertura.AMBULATORIO,
        TipoCobertura.HOSPITAL_DIA,
        TipoCobertura.ATENCION_DOMICILIARIA_PALCARE,
        TipoCobertura.OBSERVACION];
}

// CONSTANTES MODIFICAR AUTORIZACION
export class TipoEnfermedad {
    public static values: string[] = ["Crónica", "Aguda", "Accidente", "Embarazo", "Sano"];
}

export class LugarAtencionIND {
    public static values: string[] = ["Consulta Externa", "Emergencia", "Domicilio", "Hospital", "Hospital del Día"];
}

export class LugarAtencionCOR {
    public static values: string[] = ["Consulta Externa", "Emergencia", "Punto Médico", "Hospital", "Hospital del Día"];
}

export class TipoTratamiento {
    public static values: string[] = ["Clínico", "Quirúrgico"];
}

export class TipoHospitalizacionIND {
    public static values: string[] = ["Programada", "Emergente", "Accidente"];
}

export class TipoHospitalizacionCOR {
    public static values: string[] = ["Programada", "Emergente"];
}

export class FormaDePago {
    public static values: string[] = ["Contado", "Credito"];
}

export class TipoLiberarLiquidacion {
    public static values: string[] = ["AUTORIZADO", "NO AUTORIZADO"];
}

//Constantes Generales
export class ContantesAutorizacion {
    constructor(
        public ESTADO_ANULADO?: string,
        public ESTADO_AUTORIZADO?: string,
        public NO?: string,
    ) {
        this.ESTADO_ANULADO = "Anulado";
        this.ESTADO_AUTORIZADO = "AUTORIZADO";
        this.NO = "No";
    }
}