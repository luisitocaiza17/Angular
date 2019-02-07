import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../seguridad/auth.service';
import { Router } from '@angular/router';
import { Opcion, SetComentario } from '../../common/model/retencion';
import { RetencionService } from '../../common/servicios/retencion.service';
import { GestionRetencionCliente } from '../../common/model/retencion';
import { Catalogo } from '../../common/model/catalogo';
import { ContratoKey } from '../../common/model/contrato';

import { AnulacionFormComponent } from '../contrato/anulacion.form.component';
import { PdfService } from "../../common/servicios/pdf.service";
import { TransaccionesState } from '../services/transacciones.state';

@Component({
    providers: [AnulacionFormComponent, PdfService],
    templateUrl: 'comentario.movimiento.template.html',
    styles: ['.text-primary { color: #337ab7!important; }']
})

export class ComentarioMovimientosComponent implements OnInit {
    setComentario: SetComentario;
    ListaDesicionCliente: Opcion[];
    ListaContactabilidad: Opcion[];
    listaOficinas: Catalogo[];
    txtComentario: string;
    aplicaAprobacion: GestionRetencionCliente;

    _contratoKey: ContratoKey;
    suscription: any;

    constructor(private router: Router, private retencionService: RetencionService, private authService: AuthService,
        public trasaccionesState: TransaccionesState) {
        this.txtComentario = "";
        this.setComentario = new SetComentario();
        this.listaOficinas = [];
        this._contratoKey = new ContratoKey();
        this.loadOpciones();

    }

    loadOpciones() {
        this.retencionService.obtenerOpciones().subscribe(opciones => {
            this.ListaDesicionCliente = opciones.ListaDesicionCliente;
            this.ListaContactabilidad = opciones.ListaContactabilidad;
            this.ListaDesicionCliente.push
            if (this.ListaDesicionCliente != undefined) {
                this.ListaDesicionCliente.filter(x => x.Estado == true);
            }
            if (this.ListaContactabilidad != undefined) {
                this.ListaContactabilidad.filter(x => x.Estado == true);
            }
            this.loadOficinas();
        });

    }

    loadOficinas() {
        this.retencionService.obtenerOficinas().subscribe(result => {
            this.listaOficinas = result;
        });
    }

    ngOnInit() {
        //console.log(this.trasaccionesState.getMotivo() + '-' + this.trasaccionesState.getComentarioMotivo());
        this._contratoKey = this.trasaccionesState.getContratoKey();
        this._contratoKey.NombreMotivoAnulacion = this.trasaccionesState.getMotivo();
        console.log(this._contratoKey);
    }

    ngOnDestroy(): void {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }

    enviar() {
        const usrData = this.authService.getDatosUsuarioAutenticado();
        this.setComentario.NombreUsuario = usrData.NombreUsuario;
        this.setComentario.Region = this._contratoKey.CodigoRegion;
        this.setComentario.CodigoProducto = this._contratoKey.CodigoProducto;
        this.setComentario.NumeroContrato = this._contratoKey.NumeroContrato;

        this.setComentario.Comentario = "ANULADO POR " + this._contratoKey.NombreMotivoAnulacion + " DETALLE MOTIVO: " + this._contratoKey.Comentario + " DETALLE GESTION: " + this.txtComentario;
        this.retencionService.setComentario(this.setComentario)
            .subscribe(res => {
                if (res.Estado) {
                    this.authService.showSuccessPopup("Se ha enviado el comentario");
                    this.router.navigate(['/transacciones/list']);
                } else {
                    this.authService.showErrorPopup(res.Mensaje);
                }
            });
    }

    regresar() {
        this.router.navigate(['/transaccion/list']);
    }

}
