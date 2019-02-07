export class OficinaLiquidacion {

    public static values: OficinaLiquidacion[] = [
        { Nombre: "Quito", Codigo: "11" },
        { Nombre: "Guayaquil", Codigo: "121" }
    ];

    constructor(
        public Nombre?: string,
        public Codigo?: string
    ) { }
}

