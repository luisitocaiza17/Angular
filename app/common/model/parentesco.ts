export class Parentesco {
    public static PARENTESCO_SIN_RELACION: number = 0;
    public static PARENTESCO_OTROS: number = 5;

    constructor(
        public Codigo?: number,
        public NombreParentesco?: string,
        public NombresParientes?: string[],
        public NombrePariente?: string
    ) { }
}