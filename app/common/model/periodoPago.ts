export class PeriodoPago {

    public static Values = [
        {Codigo: 1, CantMeses: 1, Texto: 'MENSUAL'},
        {Codigo: 2, CantMeses: 2, Texto: 'BIMESTRAL'},
        {Codigo: 3, CantMeses: 3, Texto: 'TRIMESTRAL'},
        {Codigo: 4, CantMeses: 6, Texto: 'SEMESTRAL'},
        {Codigo: 5, CantMeses: 12, Texto: 'ANUAL'},
        {Codigo: 6, CantMeses: 4, Texto: 'CUATRIMESTRAL'}
    ];

    constructor(
        public Codigo?: number,
        public CantMeses?: number,
        public Texto?: string
    ) { }
}