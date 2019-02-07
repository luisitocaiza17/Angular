export class ObservacionRangos{
    constructor(
        public Codigo?:number,
        public Nombre?:string,
        public Descripcion?:string,
        public CodigoRangos?:number,
        public FechaInicio?:Date,
        public FechaFin?:Date,
        public Usuario?:string,
        public Estado?:boolean
        ){}
}