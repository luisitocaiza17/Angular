export type ParametroDescuento = {
      Id: number,
      FechaInicio: Date,
      FechaFin: Date,
      Porcentaje: number,
      TipoProducto: string
}

export type RespuestaParametroDescuento = {
      Estado: string,
      Mensaje: string,
      IdDesc: number
  }