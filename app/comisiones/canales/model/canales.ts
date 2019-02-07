export class Canales{
    constructor(
        public Codigo?:number,
        public Nombre?:string,
        public Estado?:boolean,
        public Descripcion?: string,
        public Selected?:Boolean,
        public nombres?:string[]
    ){}   
}

export class CanalesMostrar {
    constructor(
        public Codigo?: number,
        public Estado?: boolean,
        public Nombre?:string
        
    ) { }
}