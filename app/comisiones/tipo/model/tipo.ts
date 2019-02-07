import { Niveles } from "../../niveles/model/Niveles";

export class Tipo{
    constructor(
        public Codigo?:number,
        public Nombre?:string,
        public EstadoTipo?:boolean,
        public Region?:string,
        public CodigoSubtipo?:number,
        public Descripcion?:string,
        public CodigoNivel?:number,
        public Selected?:Boolean,
        public nombres?:string,
        public Niveles?:Niveles
    ){}
}
