export class ModeloTablaErrores { 

    public tableSettings: object; 

    constructor(){ 
        this.tableSettings =
        {
            columns: {
                UsuarioSigmepProceso: {
                title: 'Usuario',
                width: '90px'
              },
                NumeroError: {
                title: 'Numero Error',
                width: '90px'
              },
                NumeroFactura: {
                title: 'Numero Factura',
                width: '200px'
              },
                TipoDocumento: {
                title: 'Tipo Documento',
                width: '90px'
              }, 
                DetalleError: {
                title: 'Detalle Error'
              },
                ReferenciaError: {
                title: 'Referencia Error'
              }
            }, 
            actions: {
                add: false, 
                edit: false, 
                delete: false, 
                position: false
            }, 
            pager: {
                perPage: 20
            }, 
            attr: {
                class: 'table table-bordered'
            }
        };
    }
}