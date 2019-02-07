import { LiteralClausulaEntity } from "./LiteralClausulaEntity";

export class ClasulaEntity {
    constructor(
        public IdClausula?: number,
        public TituloClausula?: string,
        public DetalleClausula?: string,
        public Literales?: LiteralClausulaEntity[],


        //UIO
        public IdMotivo?: number

    ) { }
}