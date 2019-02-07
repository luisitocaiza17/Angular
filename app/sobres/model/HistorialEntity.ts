import { SobreEntity } from "./SobreEntity";

export class HistorialEntity {
    constructor(
        public idHistorial? : number,
        public Accion?: string,
        public Objeto?: number,
        public FechaModificacion?:string,
        public HoraModificacion?:string,
        public DatosAnteriores?:string,
        public IdDocumento?:string,
        public UsuarioModificacion?:string,
        public Sobre?:SobreEntity,
    ){}}