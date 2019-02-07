export class SerieFunFilter {
    constructor(
        public Numero?: number,
        public Region?: string,
        public AdUsuarioEmisor?: string,
        public AdUsuarioReceptor?: string,
        public FechaCreacionDesde?: Date,
        public FechaCreacionHasta?: Date,

        //UIO
        public NombreUsuarioEmisor?: string,
        public NombreUsuarioReceptor?: string
    ) { }
}