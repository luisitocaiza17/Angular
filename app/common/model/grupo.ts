export class Grupo {
    constructor(
        public Numero?: number,
        public Nombre?: string
    ) { }
}

export class GrupoSearch {
    constructor(
        public Numero?: number,
        public Nombre?: string
    ) { }

    NumeroLleno(): boolean {
        return !(this.Numero === 0);
    }

    NombreLleno(): boolean {
        return !(this.Nombre === '');
    }
}

export class GrupoKey {
    constructor(
        public Numero?: number,
        public Nombre?: string,
        public NewKey?: boolean,
        public unsuscribe?: boolean
    ) {
        this.NewKey = true;
    }
}
