export class Resumen {
    ProveedorNombre: string;
    PolizaNum: string;
    ServicioDescripcion: string;
    PeriodoDesde: Date;
    PeriodoHasta: Date;
    TotalInclusiones: number;
    TotalExclusiones: number;
    TotalAltas: number;
    TotalTarifaAltas: number;
    TotalBajas: number;
    TotalTarifaBajas: number;
    TotalCambioCobertura: number;
    TotalTarifaCambioCobertura: number;
    Movimientos: string;
    GAP: string;
}

export class Detalle {
    ContratoId: string;
    BeneficiarioNombre: string;
    BeneficiarioCedula: string;
    BeneficiarioEdad: number;
    MontoCobertura: number;
    Pvp: number;
    Tipo: string;
    Seleccionado: boolean;
}

export class Movimiento extends Detalle {
    FechaEfecto: Date;
}

export class Gap extends Detalle {
    ValorTarifado: number;
    ValorTarifadoAnterior: number;
}
