import { Rangos } from "../../rangos/model/Rangos";
import { Tipo } from "../../tipo/model/Tipo";
import { Subtipo } from "../../subtipo/model/subtipo";

export class PresupuestoVendedor{
    constructor(
        public Porcentaje?:number,
        public Desde?:number,
        public Hasta?:number,
        public Comodin?:boolean,
        public CodigoRango?:number,
        public Estado?:boolean,
        public Selected?:boolean,
        public Codigo?:number,
        public CodigoTipo?:number,
        public CodigoSubtipo?:number,
        public TipoPresupuesto?:number,
        public rangosEntity?:Rangos,
        public CodigoSucursal?:number,
        public CodigoRegion?:string,
        public NombreProducto?:string,
        public NombreSucursal?:string,
        public DescripcionTipoPresupuesto?:string
    ){}
}