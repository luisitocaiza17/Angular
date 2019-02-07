import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Tipo } from "../../tipo/model/Tipo";
import { TipoService } from "../../tipo/service/tipo.service";
import { SubtipoService } from "../../subtipo/service/subtipo.service";
import { Subtipo } from "../../subtipo/model/subtipo";
import { ActivatedRoute } from "@angular/router";
import { DetallePremio } from "../model/DetallePremio";
import { DetallePremioService } from "../service/detallePremio.service";
import { AuthService } from "../../../seguridad/auth.service";
import { Subscription } from "rxjs";


@Component({
    templateUrl: './detallePremio.component.html'
})
export class DetallePremioComponent implements OnInit {

    listaTipos: Tipo[];
    idtipo: number;
    listaSubtipos: Subtipo[];
    idsubtipo: number;
    idSucursal: number;
    idCanal: number;

    detallePremio: DetallePremio;
    detallesPremios: DetallePremio[];
    //detalleEditar: DetallePremio;
    interval: any;
    subscription: Subscription;

    constructor(private tipoService: TipoService, private changeDetector: ChangeDetectorRef,
        private subtipoService: SubtipoService, private activatedRoute: ActivatedRoute,
        private detallePremioService: DetallePremioService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.detallePremio = new DetallePremio();
        this.detallesPremios = [];
        this.recuperarParametros();
        this.cargarTipos();
        this.cargarDetallesPremios();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }

    cargarTipos() {
        this.tipoService.getAllTipos().subscribe((result) => {
            this.listaTipos = result;
        });
    }

    cargarSubtipo(event: any) {
        this.idtipo = event.target.value;
        this.subtipoService.getSubtipoByTipos(this.idtipo).subscribe((result) => {
            this.listaSubtipos = result;
        })
    }

    recuperarParametros() {
        this.detallePremio.IdTablaPremio = this.activatedRoute.snapshot.params['idPremio'];
    }

    crearDetallePremio() {
        if (this.detallePremio.ValorMinimo > 0 && this.detallePremio.Desde >= 0 && this.detallePremio.Hasta > 0) {
            if (this.detallePremio.Desde < this.detallePremio.Hasta) {
                this.detallePremioService.createDetallePremio(this.detallePremio).subscribe((result) => {
                    this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
                    this.cargarDetallesPremios();
                    this.limpiar();
                });
            } else {
                this.authService.showErrorPopup("Por favor revise los intervalos");
            }
        } else {
            this.authService.showErrorPopup("No se puede ingresar números negativos");
        }

    }

    cargarDetallesPremios() {
        this.subscription = this.detallePremioService.getDetallePremioByPremio(this.detallePremio.IdTablaPremio).subscribe(
            (result) => {
                this.detallesPremios = result;
            });
    }

    borrarPremio(detallePremio: DetallePremio) {
        clearInterval(this.interval);
        swal({
            title: "¿Está seguro?",
            text: "Va a eliminar el detalle del premio!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0266b1",
            confirmButtonText: "Si, eliminar"
        }, confirmed => {
            if (confirmed) {
                detallePremio.Estado = false;
                this.detallePremioService.updateDetallePremio(detallePremio).subscribe(result => {
                    if (result) {
                        this.interval = setInterval(() => {
                            this.changeDetector.detectChanges();
                            this.changeDetector.detach();
                        }, 100);
                        this.authService.showSuccessPopup("Registro Eliminado Exitosamente");
                        this.cargarDetallesPremios();
                    } else {
                        this.authService.showErrorPopup("Ocurrió un error al eliminar el detalle del premio");
                    }
                });
            }
        });
    }

    limpiar(): void {
        this.detallePremio = new DetallePremio();
    }

}