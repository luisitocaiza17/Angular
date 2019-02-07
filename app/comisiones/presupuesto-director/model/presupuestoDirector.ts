import { Salas } from "../../salas/model/salas";

export class PresupuestoDirector{
    constructor(
        public Monto?:number,
        public Comodin?:boolean,
        public CodigoSala?:number,
        public Estado?:boolean,
        public Selected?:boolean,
        public Codigo?:number,
        public CodigoRegion?:string,
        public CodigoSucursal?:number,
        public CodigoProducto?:string,
        public salasEntity?:Salas,
        public NombreProducto?:string,
        public NombreSucursal?:string
    ){}
}