export class DetalleProcedimiento {
    constructor(
        public Id?: number,
        public CodigoPlan?: string,
        public CodigoVersion?: number,
        public NivelPlan?: number,
        public CodigoProcedimiento?: string,
        public NombreProcedimiento?: string,
        public NumeroDetalleProcedimiento?: string,
        public Puntaje?: number,
        public Porcentaje?: number,
        public Cantidad?: number,
        public Funcion?: string,
        public CodigoPrestador?: number,
        public NombrePrestador?: string,
        public ValorPorPuntos?: number,
        public ValorUnitario?: number,
        public ValorAPagar?: number,
        public ValorAFacturar?: number,
        public AutorizacionId?: number,

        // for ui        
        public Nuevo?: boolean,
        public Edicion?: boolean,
        public Deshabilitado?: boolean,
        public AplicarCambios?: boolean
    ) {
        if (Nuevo == undefined)
            Nuevo = false;
        if (Edicion == undefined)
            Edicion = false;
    }
}