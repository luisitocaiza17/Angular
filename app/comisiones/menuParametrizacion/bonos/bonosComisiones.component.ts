import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MovimientoComisionEntity, BeneficiarioComisionEntity, MovimientoYBeneficiarioComision } from '../../consultasComisiones/model/consultasComisiones.model';
import { Salas } from '../../salas/model/salas';
import { ContratoKey, Contrato, ContratoEntityList, ContratoEntityFilter } from '../../../common/model/contrato';
import { RegionEntity, SucursalDeRegion } from '../../../common/model/genericos';
import { GenericosService } from '../../../common/servicios/genericos.service';
import { RegionService } from '../../../common/servicios/region.service';
import { SalasService } from '../../salas/service/salas.service';
import { DirectorVendedorEntity } from '../../../comercial/model/DirectorVendedorEntity';
import { AuthService } from '../../../seguridad/auth.service';
import { ServicioVentasService } from '../../../comercial/service/servicioVentas.service';
import { FiltroAgenteVenta } from '../../model/agenteVenta.model';
import { ConstantesComisiones } from '../../utils/ConstantesComisiones';
import { ContratoService } from '../../../common/servicios/contrato.service';
import { ReclamoService } from '../../../common/servicios/reclamo.service';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { MovimientoComisionService } from '../../consultasComisiones/service/movimientoComision.service';
import { BonoEntity } from '../../model/bonos.model';
import { BonosService } from './services/bonos.service';

@Component({
  selector: 'app-gestionBonos',
  templateUrl: './bonosComisiones.component.html',
  providers: [BonosService]
})

export class BonosComisionesComponent implements OnInit {

    componenteActivo: string; 
    filtroBonos: BonoEntity;
    bonos: BonoEntity[]; 
    bonoSelected: BonoEntity;
    operacion: string;
    idBonoEditar: number;

    constructor(
      public constantes: ConstantesComisiones, 
      public bonosService: BonosService,
      public authService: AuthService
    ) {
        
    }

    ngOnInit() {
        this.filtroBonos = new BonoEntity(); 
        this.bonos = []; 
        this.bonoSelected = new BonoEntity(); 
        this.componenteActivo = 'consulta';
        this.operacion = 'CREAR';
    }
    
    openModal(modalName: string) {
        $(modalName).modal();
    }

    cargarBonos(){ 
        this.bonosService.GetBonosPaginated(this.filtroBonos).subscribe(
            res => { 
                this.bonos = res;
            },
            error =>{ 
                this.authService.showErrorPopup(error);
            }
        );
    }

    setearComponenteActivo(componenteActivo: string){ 
        this.componenteActivo = componenteActivo; 
    }

    CambiarTipoOperacion(operacion: string, idBono: number){ 
        this.operacion = operacion;
        if(this.operacion == 'EDITAR')
            this.idBonoEditar = idBono;
        else 
            this.idBonoEditar = -1;  
    }

    limpiar(){ 
        this.filtroBonos = new BonoEntity(); 
        this.bonoSelected = new BonoEntity(); 
        this.bonos = []; 
    }

    seleccionar(bono: BonoEntity): void {		
		this.bonoSelected = new BonoEntity();

		if (this.bonos != undefined) {
			this.bonos.forEach(element => {
				element.Selected = false;
			});
		}
		bono.Selected = true;

		this.bonoSelected = bono;
    }

    getNombreTipoBono(id: number): string{      
        let nombre = this.constantes.TIPOS_BONO.find(x => x.Id == id).Nombre; 
        return nombre;
    }
}
