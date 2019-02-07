export class Catalogo {
    public static ESTADO_AUTORIZACION_ANULADO: number = 1;
    public static ESTADO_AUTORIZACION_PAGADO: number = 2;
    public static ESTADO_AUTORIZACION_FINALIZADO: number = 6;
    public static ESTADO_AUTORIZACION_ANULADO_TEXT: string = "ANULADO";
    public static ESTADO_AUTORIZACION_PAGADO_TEXT: string = "PAGADO";
    public static ESTADO_AUTORIZACION_FINALIZADO_TEXT: string = "FINALIZADO";

    constructor(
        public Id?: number,
        public Codigo?: string,
        public Valor?: string,
        public CodigoProgress?: string,

        //UIO
        public Selected?: boolean
    ) { }
}

export class CatalogoProgressEntity {
    constructor(
        public CodigoCabecera?: number,
        public Codigo?: number,
        public Descripcion?: string
    ) { }

}

export class CatalogoGenericoEntity {
    constructor(
        public IdItem?: number,
        public IdCatalogo?: number,
        public Nombre?: string,
        public Codigo?: string,
        public Descripcion?: string,
        public Estado?: string,
        public Padre?: number
    ) { }
}

export class TraslateCiudades {
    constructor(
        public Id?: number,
        public Name?: string
    ) { }
}