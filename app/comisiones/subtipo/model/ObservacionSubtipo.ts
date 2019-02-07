export class ObservacionSubtipo{
    constructor(
        public Codigo?:number,
        public Nombre?:string,
        public Descripcion?:string,
        public CodigoSubtipo?:number,
        public FechaInicio?:Date,
        public FechaFin?:Date,
        public Usuario?:string,
        public Estado?:boolean
        ){}
}