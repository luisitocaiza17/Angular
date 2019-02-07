export class Ciudad {
    public static values: Ciudad[] = [
        { Codigo: "1", Nombre: "Quito" },
        { Codigo: "2", Nombre: "Guayaquil" },
        { Codigo: "3", Nombre: "Cuenca" },
    ];
    constructor(
        public Codigo?: string,
        public Nombre?: string
    ) { }
}

export class CiudadEntity{
    constructor(
        public idCiudad?: string,
        public Nombre?: string
    ) { }
}
