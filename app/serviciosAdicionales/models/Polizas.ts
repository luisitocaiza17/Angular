export class Catalogo {
    Id: number;
    Descripcion: string;
    Item: Catalogo[];
}

export class Servicio {
    Id: number;
    Descripcion: string;
    CodigoSigmep: string;
}

export class Poliza {
    Id: number;
    NumeroPoliza: string;
    Version: number;
    VersionFecha: Date;
    DiaProcesamiento: number;
    DiaCorte: number;
    ServicioCatalogoId: number;
    Servicio: string;
    ProveedorId: number;
}

export class Valor {
    Id: number;
    Tipo: number;
    Valor: number;
    Descripcion: string;
    CriterioId: number;
}

export class Criterio {
    Id: number;
    EdadMin: number;
    EdadMax: number;
    CoberturaMin: number;
    CoberturaMax: number;
    CatalogoRegionId: number;
    Region: string;
    CatalogoProductoId: number;
    Producto: string;
    CatalogoRelacionId: number;
    Relacion: string;
    CatalogoGeneroId: number;
    Genero: string;
    CatalogoEsTitularId: number;
    Titular: string;
    TarifaPorContrato: boolean;
    PolizaId: number;
    Valores: Valor[];
    Tasas: number[];
    Primas: number[];
}
