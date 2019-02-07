import { Tipo } from "../../tipo/model/Tipo";

export class Subtipo{
    constructor(
        public Codigo?:number,
        public Nombre?:string,
        public Estado?:boolean,
        public Descripcion?: string,
        public Selected?:Boolean,
        public nombres?:string[],
        public CodigoTipo?:number,
        public Tipo?:Tipo
    ){}   
}

export class SubtipoSoloEntity{
    constructor(
        public Codigo?: number,
        public Nombre?: string, 
        public Estado?: boolean,
        public Descripcion?: string,
        public CodigoTipo?: number
    ){}   
}

