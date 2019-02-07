import { Component, OnInit } from '@angular/core';
import { FiltroMovimientoComisionEntity, MovimientoComisionEntity } from '../../consultasComisiones/model/consultasComisiones.model';
import { MovimientoComisionService } from '../../consultasComisiones/service/movimientoComision.service';
import { AuthService } from '../../../seguridad/auth.service';
import { Mes } from '../../consultasComisiones/model/mes';
import { UtilsComponent } from '../../utils/Utils.component';

@Component({
  selector: 'app-movimientoComisionManual',
  templateUrl: './movimientoComisionManual.component.html',
  providers: [MovimientoComisionService]
})

export class MovimientoComisionManualComponent implements OnInit {

    filtroMovimientos: FiltroMovimientoComisionEntity; 
    componenteActivo: string; 
    movimientos: MovimientoComisionEntity[];
    movimientoSelected: MovimientoComisionEntity;

    anios: number[];
	meses: Mes[];

    constructor(
        public movimientoComisionService: MovimientoComisionService, 
        public authService: AuthService, 
        private utils: UtilsComponent
    ) {
    }

    ngOnInit() {
        this.anios = this.utils.obtenerAnios();
		this.meses = this.utils.obtenerMeses();
        this.movimientos = []; 
        this.movimientoSelected = new MovimientoComisionEntity(); 
        this.componenteActivo = 'consulta';
        this.filtroMovimientos = new FiltroMovimientoComisionEntity(); 
        this.filtroMovimientos.TipoMovimiento = 'M'; 
    }
    
    openModal(modalName: string) {
        $(modalName).modal();
    }

    limpiar(){ 
        this.filtroMovimientos = new FiltroMovimientoComisionEntity(); 
        this.movimientos = []; 
        this.movimientoSelected = new MovimientoComisionEntity(); 
    }

    setearComponenteActivo(componenteActivo: string){ 
        this.componenteActivo = componenteActivo; 
    }

    cargarMovimientos(){ 
		this.movimientoComisionService.GetMovimientosComisionByFiltersPaginated(this.filtroMovimientos)
		.subscribe(res => { 
            this.movimientos = res;
		}, error => { 
			this.authService.showErrorPopup(error);
		});
    }
    
    pageChangedMovimientos(): void {
		this.cargarMovimientos(); 
    }
    
    seleccionarMovimiento(movimiento: MovimientoComisionEntity): void {		
		this.movimientoSelected = new MovimientoComisionEntity();

		if (this.movimientos != undefined) {
			this.movimientos.forEach(element => {
				element.Selected = false;
			});
		}
		movimiento.Selected = true;

		this.movimientoSelected = movimiento;
    }
    
    eliminarMovimiento(movimiento: MovimientoComisionEntity){
        this.movimientoComisionService.eliminarMovimientoComisionManual(movimiento).subscribe(
            res => { 
                if(res === true){
                    this.authService.showSuccessPopup('Registro eliminado con exito');
                    this.cargarMovimientos(); 
                }           
                else
                    this.authService.showErrorPopup('Ha ocurrido un problema');
            }, 
            error => { 
                this.authService.showErrorPopup('Ha ocurrido un problema : ' + error);
            }
        );
    }
}
