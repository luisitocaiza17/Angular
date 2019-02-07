export class Calificacion {
    public static values: Calificacion[] = [
        { Codigo: "1", Nombre: "1" },
        { Codigo: "2", Nombre: "2" },
        { Codigo: "3", Nombre: "3" },
        { Codigo: "4", Nombre: "4" },
        { Codigo: "5", Nombre: "5" }
    ];
    constructor(
        public Codigo?: string,
        public Nombre?: string
    ) { }
}