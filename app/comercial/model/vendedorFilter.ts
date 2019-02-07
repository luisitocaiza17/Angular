export class VendedorFilter {
    constructor(
        public Nombres?: string,
        public CodigoAgente?: number,
        public UserLogin?: string,
        public VendedoresSeleccionados?: number[],
        public UsuarioAutenticado?: string,

        public CodigoDirector?: number,
        public CodigoVendedor?: number,
        public Estado?: string,
        public Region?: string
    ) { }
}