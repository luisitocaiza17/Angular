export class PaginationResult {
  constructor(
    public pagination: PaginationConstants = new PaginationConstants(),
    public data?: any[]
  ) { }
}

export class PaginationConstants {
  constructor(
    public total?: number,
    public pageNumber: number = 1,
    public pageSize: number = 20,
    public currentPageSize?: number,
  ) { }

  get InitElementPage() {
    if (this.currentPageSize > 0)
      return (this.pageNumber * this.pageSize) - this.pageSize + 1;
    return 0;
  }

  get EndElementPage() {
    return (this.pageNumber * this.pageSize - this.pageSize) + this.currentPageSize;
  }

  get EncabezadoTabla() {
    return "Mostrando de " + this.InitElementPage + " a " + this.EndElementPage + " de " + this.total + " registros";
  }

  get EncabezadoTablaAllResults() {
    return "Mostrando " + this.total + " registros";
  }  
}