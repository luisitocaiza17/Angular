export class FiltroReportes {
    oficina: string
    region: string
    fecha: Date

    constructor() {
        this.oficina =  "";
        this.region = "";
        this.fecha = new Date();
    }
}

export class FiltroReportesFacturasEmitidas {
    FechaDesde: Date
    FechaHasta: Date
    TipoDocumento: string

    constructor() {
        this.FechaDesde =  new Date();;
        this.FechaHasta =new Date();;
        this.TipoDocumento ="";
    }
}

export type Reporte = {
    campo: string
}
