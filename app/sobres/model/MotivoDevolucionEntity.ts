export class MotivoDevolucionEntity {
    constructor(
        public IdMotivoDevolucion?: number,
        public NombreMotivo?: string,
        public IdTipoCarta?: number,
        public IdClausulas?: number[]
    ) { }
}