export class ListaCajas {
    public static values: ListaCajas[] = [
        { Codigo: 1, Nombre: "cob" },
        { Codigo: 2, Nombre: "CONTAQ" },
        { Codigo: 3, Nombre: "CONTAQ1" },
        { Codigo: 4, Nombre: "CONTAQ2" },
        { Codigo: 5, Nombre: "contg1" },
        { Codigo: 6, Nombre: "CONTG3" },
        { Codigo: 7, Nombre: "contg4" },
        { Codigo: 8, Nombre: "CONTG5" },
        { Codigo: 9, Nombre: "OPERAGP" },
        { Codigo: 10, Nombre: "Quito" },
        { Codigo: 11, Nombre: "RECUE" },
    ];
    constructor(
        public Codigo?: number,
        public Nombre?: string
    ) { }
}