//UIO SOLO LO USAMOS A NIVEL DE PANTALLA
export class CreateFunKey {
    constructor(
        public Region?: string,
        public CodigoSucursal?: number,
        public FunInicial?: number,
        public FunFinal?: number,
        public FechaEntrega?: Date,
        public FechaCierre?: Date,
        public Porcentaje?: number,
        public Receptor?: string,
        public Observaciones?: string,

        //UIO
        public NombreReceptor?: string
    ) { }
}