export class SucursalDeRegion {
    constructor(
        public CodigoSucursal?: number,
        public NombreSucursal?: string
    ) {

    }
}

export class OficinaerieFActuraEntity {
    constructor(
        public iofSerie?: number,
        public iserieFactura?: number,
        public varRuc?: string,
        public inroAutorizacion?: number,
        public dfechaValidez?: Date,
        public cdireccion?: string,
        public strheader?: string,
        public error?: string
    ) { }
}

export class TipoIdentificacionEntity {
    public static values: TipoIdentificacionEntity[] = [
        { Id: "R", Nombre: "RUC" },
        { Id: "C", Nombre: "CEDULA" },
        { Id: "P", Nombre: "PASAPORTE" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}

export class TipoIdCuenta {
    public static values: TipoIdentificacionEntity[] = [
        { Id: "R", Nombre: "R" },
        { Id: "C", Nombre: "C" },
        { Id: "P", Nombre: "P" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}


export class EstadoCivilEntity {
    public static values: EstadoCivilEntity[] = [
        { Id: "Casado", Nombre: "Casado" },
        { Id: "Divorciado", Nombre: "Divorciado" },
        { Id: "Soltero", Nombre: "Soltero" },
        { Id: "Unión Libre", Nombre: "Unión Libre" },
        { Id: "Viudo", Nombre: "Viudo" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}

export class TipoEstadoEntity {
    public static values: TipoEstadoEntity[] = [
        { Id: 1, Nombre: "ACTIVO" },
        { Id: 2, Nombre: "SDE" },
        { Id: 3, Nombre: "PASIVO" }
    ];
    constructor(
        public Id?: number,
        public Nombre?: string
    ) { }
}

export class TipoContribuyenteEntity {
    public static values: TipoContribuyenteEntity[] = [
        { Id: 1, Nombre: "Pública" },
        { Id: 2, Nombre: "Pesona Natural" },
        { Id: 3, Nombre: "Org. sin fines de Lucro" },
        { Id: 2, Nombre: "Sociedades" },
        { Id: 2, Nombre: "Extranjero" }
    ];
    constructor(
        public Id?: number,
        public Nombre?: string
    ) { }
}

export class TipoCuentaEntity {
    public static values: TipoCuentaEntity[] = [
        { Id: "Ahorro", Nombre: "Ahorro" },
        { Id: "Corriente", Nombre: "Corriente" },
        { Id: "Tarjeta", Nombre: "Tarjeta" },
        { Id: "Cta. Virtual", Nombre: "Cta. Virtual" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}

export class ComboSiNo {
    public static values: ComboSiNo[] = [
        { Id: true, Nombre: "Si" },
        { Id: false, Nombre: "No" }
    ];
    constructor(
        public Id?: boolean,
        public Nombre?: string
    ) { }
}

export class ComboSiNoInt {
    public static values: ComboSiNoInt[] = [
        { Id: 1, Nombre: "No" },
        { Id: 2, Nombre: "Si" }
    ];
    constructor(
        public Id?: number,
        public Nombre?: string
    ) { }
}


export class TipoConvenioEntity {
    public static values: TipoConvenioEntity[] = [
        { Id: "Aliado", Nombre: "Aliado" },
        { Id: "Alto", Nombre: "Alto" },
        { Id: "Axxis", Nombre: "Axxis" },
        { Id: "Bajo", Nombre: "Bajo" },
        { Id: "Centros", Nombre: "Centros" },
        { Id: "Común", Nombre: "Común" },
        { Id: "Específico", Nombre: "Específico" },
        { Id: "Otros", Nombre: "Otros" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}

export class TipoContribEspecialEntity {
    public static values: TipoContribEspecialEntity[] = [
        { Id: 1, Nombre: "ESPECIAL" },
        { Id: 2, Nombre: "OTROS" },
        { Id: 3, Nombre: "RISE" },
    ];
    constructor(
        public Id?: number,
        public Nombre?: string
    ) { }
}

export class RegionEntity {
    public static values: RegionEntity[] = [
        { Id: "Sierra", Nombre: "Sierra" },
        { Id: "Costa", Nombre: "Costa" },
        { Id: "Austro", Nombre: "Austro" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}

export class PersonaGenero {
    public static values: PersonaGenero[] = [
        { Id: false, Nombre: "Femenino" },
        { Id: true, Nombre: "Masculino" }
    ];
    constructor(
        public Id?: boolean,
        public Nombre?: string
    ) { }
}

export class TipoSociedadEntity {
    public static values: TipoSociedadEntity[] = [
        { Id: "Anónima", Nombre: "Anónima" },
        { Id: "Limitada", Nombre: "Limitada" },
        { Id: "Fundación", Nombre: "Fundación" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}


export class ZonaEntity {
    public static values: ZonaEntity[] = [
        { Id: "Norte", Nombre: "Norte" },
        { Id: "Centro", Nombre: "Centro" },
        { Id: "Sur", Nombre: "Sur" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}

export class RelacionEnity {
    public static values: RelacionEnity[] = [
        { Id: "Socio", Nombre: "Socio" },
        { Id: "Dueño", Nombre: "Dueño" },
        { Id: "Accionista", Nombre: "Accionista" },
        { Id: "Ejecutivo", Nombre: "Ejecutivo" },
        { Id: "Otros", Nombre: "Otros" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}


export class VariableEntornoCiudad {
    public static values: VariableEntornoCiudad[] = [
        { Id: 1, Nombre: "Quito" },
        { Id: 2, Nombre: "Guayaquil" },
        { Id: 3, Nombre: "Cuenca" }
    ];
    constructor(
        public Id?: number,
        public Nombre?: string
    ) { }
}

export class ProductosReporteMorosoEntity {
    public static values: ProductosReporteMorosoEntity[] = [
        { Id: "IND", Nombre: "Individual" },
        { Id: "XPR", Nombre: "Experience" },
        { Id: "ONC", Nombre: "Oncológico" }
    ];
    constructor(
        public Id?: string,
        public Nombre?: string
    ) { }
}

export class FiltroFechaDesdeHasta {
    constructor(
        public FechaDesde?: Date,
        public FechaHasta?: Date
    ) { }
}

export class BancoEntity {
    constructor(
        public NombreBanco?: string,
        public CodigoBanco?: number,
        public RucBanco?: string,
        public NombreArchivo?: string,
        public TipoArchivo?: string,
        public Cabecera?: number,
        public NumeroCuenta?: string,

        public Selected?: boolean
    ) {

    }
}

export class FilterBancos {
    constructor(
        public Estado?: number
    ) { }
}

export class FilterBancoTarjeta {
    constructor(
        public CodigoBanco: number,
        public NombreBanco: string
    ) { }
}

export class FormatoFecha{ 
    constructor(
        public Codigo?: number, 
        public Formato?: string,
    ){

    }
}
