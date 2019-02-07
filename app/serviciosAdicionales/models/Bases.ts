export class Proveedor {
    Id: number;
    Nombre: string;
    PersonaContacto: string;
    CorreoElectronicoContacto: string;
    FechaConvenio: Date;
}

export class Estado {
    Id: number;
    Descripcion: string;
}

export class Base {
    Id: number;
    FechaGeneracion: Date;
    PeriodoDesde: Date;
    PeriodoHasta: Date;
    EstadoCatalogoId: number;
    EstadoDescripcion: string;
    PolizaNumero: string;
    PolizaVersion: number;
    DescripcionServicio: string;
    Cantidad: number;
    Tarifado: number;
    Movimientos: number;
    GAP: number;
    Errores: number;
}
