export class Niveles{
    constructor(
        public Codigo?:number,
        public Nombre?:string,
        public Estado?:boolean,
        public Descripcion?: string,
        public CodigoNivel?: number,
        public Selected?:Boolean,
        public NivelPadre?:Niveles    
    ){}   
}
