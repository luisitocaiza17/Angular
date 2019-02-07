export class Ambientes {
    public static values: Ambientes[] = [
        { Codigo: "PROD", Nombre: "Producción" },
        { Codigo: "PRUE", Nombre: "Pruebas" },
    ];
    constructor(
        public Codigo?: string,
        public Nombre?: string
    ) { }
}