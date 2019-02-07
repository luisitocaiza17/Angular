export class FunFilter {
    constructor(
        public NumeroFun?: number,
        public NumeroSerie?: number,
        public Estado?: number,
        public FechaDesde?: Date,
        public FechaHasta?: Date,
        public CodigoAgenteVenta?: number,
        public UsuarioEmisor?: string,

        //UIO
        public NombreUsuarioEmisor?: string
    ) { }
}