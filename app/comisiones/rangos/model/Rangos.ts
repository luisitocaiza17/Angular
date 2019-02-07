import { Tipo } from "../../tipo/model/Tipo";
import { Subtipo } from "../../subtipo/model/subtipo";
import { Region } from "../../../common/model/region";

export class Rangos{
    constructor(
        public Codigo?:number,
        public CodigoTipo?:number,
        public CodigoSubtipo?:number,
        public Nombre?:string,
        public Estado?:boolean,
        public Descripcion?: string,
        public PeriodoDesde?:number,
        public PeriodoHasta?:number,
        public Selected?:Boolean,
        public nombres?:string[],
        public CodigoRegion?:string,
        public CodigoSucursal?: number,
        public CodigoCanal?: number,
        public Subtipo?:Subtipo,
        public Rango?:Rangos,
        public AplicaTransporte?:boolean        
    ){}   
}
