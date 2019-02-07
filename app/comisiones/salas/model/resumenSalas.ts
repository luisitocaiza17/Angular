export class ResumenSalas {
  constructor(
      public Codigo?: number,
      public Nombre?: string,
      public Abreviacion?: string,
      public Director?:string,
      public TotalVentas?: number,
      public TotalAnulaciones?: number, 
      public Selected?: boolean
  ) { }
}