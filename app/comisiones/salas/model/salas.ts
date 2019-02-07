import { ObservacionSalas } from "./ObservacionSalas";
import { Canales } from "../../canales/model/canales";

export class Salas {
    constructor(
        public Codigo?: number,
        public Region?: string,
        public Abreviacion?: string,
        public Estado?: boolean,
        public Nombre?: string,
        public CumplimientoQueja?: boolean,
        public Queja?: string,
        public PorcentajePersistencia?: number,

        public idObservacion?: number,
        public DescripcionObservacion?: string,
        public CodigoSala?: number,
        public FechaInicio?: Date,
        public FechaFin?: Date,
        public Usuario?: String,
        public EstadoObservacion?: String,
        public Selected?:Boolean,
        public CodigoSucursal?:number,
        public CodigoRegion?:string,
        public CodigoCanal?:number,
        public Canal?:Canales,
        public CodigoProducto?:string ,
        public Sucursal?:string,
        public NombreProducto?:string

        
    ) { }
}
