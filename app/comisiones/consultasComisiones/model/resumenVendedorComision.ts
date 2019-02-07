export class ResumenVendedorComision{
  constructor(
      public Nombre?: string, 
      public CodigoAgenteVenta?: number, 
      public Tipo?: string,
      public Subtipo?: string, 
      public Rango?: string,
      public PorcentajeComision?: number,
      public TotalComision?: number,
      public Selected?: boolean
  ){

  }
}