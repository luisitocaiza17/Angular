import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalasComponent } from './salas/component/ingresar/salas.component';
import { comisionesRouting } from './comisiones.routing';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { CustomFormsModule } from 'ng2-validation';
import { SalasService } from './salas/service/salas.service';
import { ConsultarSalasComponent } from './salas/component/consultar/consultarSalas.component';
import { EditarSalasComponent } from './salas/component/editar/editarSalas.component';
import { ConstantesComisiones } from './utils/ConstantesComisiones';
import { HistorialSalasComponent } from './salas/component/historial/historialSalas.component';
import { ConsultarTipoComponent } from './tipo/component/consultar/consultarTipo.component';
import { EditarTipoComponent } from './tipo/component/editar/editarTipo.component';
import { HistorialTipoComponent } from './tipo/component/historial/historialTipo.component';
import { IngresarTipoComponent } from './tipo/component/ingresar/ingresarTipo.component';
import { EditarSubtipoComponent } from './subtipo/component/editar/editarSubtipo.component';
import { HistorialSubtipoComponent } from './subtipo/component/historial/historialSubtipo.component';
import { IngresarSubtipoComponent } from './subtipo/component/ingresar/ingresarSubtipo.component';
import { ConsultarSubtipoComponent } from './subtipo/component/consultar/consultarSubtipo.component';
import { SubtipoService } from './subtipo/service/subtipo.service';
import { InsertarNivelesComponent } from './niveles/component/insertar/insertarNiveles.component';
import { ConsultarNivelesComponent } from './niveles/component/consultar/consultarNiveles.component';
import { EditarNivelesComponent } from './niveles/component/editar/editarNiveles.component';
import { HistorialNivelesComponent } from './niveles/component/historial/historialNiveles.component';
import { NivelesService } from './niveles/service/niveles.service';
import { TipoService } from './tipo/service/tipo.service';
import { ConsultarCanalesComponent } from './canales/component/consultar/consultarCanales.component';
import { EditarCanalesComponent } from './canales/component/editar/editarCanales.component';
import { HistorialCanalesComponent } from './canales/component/historial/historialCanales.component';
import { InsertarCanalesComponent } from './canales/component/insertar/insertarCanales.component';
import { CanalesService } from './canales/service/canales.service';
import { ConsultarRangosComponent } from './rangos/component/consultar/consultarRangos.component';
import { EditarRangosComponent } from './rangos/component/editar/editarRangos.component';
import { HistorialRangosComponent } from './rangos/component/historial/historialRangos.component';
import { IngresarRangosComponent } from './rangos/component/ingresar/ingresarRangos.component';
import { RangosService } from './rangos/services/rangos.service';
import { GenericosService } from '../common/servicios/genericos.service';
import { ConsultarPresupuestoVendedorComponent } from './presupuesto-vendedor/component/consultar/consultarPresupuestoVendedor.component';
import { PresupuestoVendedor } from './presupuesto-vendedor/model/presupuestoVendedor';
import { PresupuestoVendedorService } from './presupuesto-vendedor/services/presupuesto-vendedor.service';
import { PresupuestoDirectorService } from './presupuesto-director/services/presupuesto-director.service';
import { ConsultarPresupuestoDirectorComponent } from './presupuesto-director/component/consultar/consultarPresupuestoDirector.component';
import { IngresarPresupuestoVendedorComponent } from './presupuesto-vendedor/component/ingresar/ingresarPresupuestoVendedor.component';
import { EditarPresupuestoVendedorComponent } from './presupuesto-vendedor/component/editar/editarPresupuestoVendedor.component';
import { EditarPresupuestoDirectorComponent } from './presupuesto-director/component/editar/editarPresupuestoDirector.component';
import { IngresarPresupuestoDirectorComponent } from './presupuesto-director/component/ingresar/ingresarPresupuestoDirector.component';
import { BusquedaComponent } from './corporativo/component//busqueda/busqueda.component';
import { CorporativoService } from './corporativo/services/corporativo.service';
import { ReferidosComponent } from './corporativo/component/referidos/referidos.component';
import { HistorialPresupuestoDirectorComponent } from './presupuesto-director/component/historial/historialPresupuestoDirector.component';
import { HistorialPresupuestoVendedorComponent } from './presupuesto-vendedor/component/historial/historialPresupuestoVendedor.component';
import { ConsultasComisionesComponent } from './consultasComisiones/component/consultas/consultasComisiones.component';
import { menuParametrizacionComisionesComponent } from './menuParametrizacion/menuParametrizacionComisiones.component';
import { ConsultaPresupuestoRangosDirectorComponent } from './presupuestoRangosDirector/component/consultar/consultaPresupuestoRangosDirector.component';
import { IngresarPresupuestoRangosDirectorComponent } from './presupuestoRangosDirector/component/ingresar/ingresarPresupuestoRangosDirector.component';
import { SemaforoService } from './semaforo/service/semaforo.service';
import { EditarPresupuestoRangosDirectorComponent } from './presupuestoRangosDirector/component/editar/editarPresupuestoRangosDirector.component';
import { SemaforoComponent } from './semaforo/component/semaforo.component';
import { PremiosBonosComponent } from './premiosBonos/components/premiosBonos.component';
import { IndicadoresComponent } from './premiosBonos/components/indicadores/indicadores.component';
import { UtilsComponent } from './utils/Utils.component';
import { PremioComponent } from './premios/component/premio.component';
import { MovimientoComisionManualComponent } from './movimientoComisionManual/gestionSimpleMovimientosManuales/movimientoComisionManual.component';
import { CrearMovimientoComisionManualComponent } from './movimientoComisionManual/gestionSimpleMovimientosManuales/crearMovimientoComisionManual.component';
import { menuMovimientosManualesComponent } from './movimientoComisionManual/menuMovimientosManuales/menuMovimientosManuales.component';
import { CargaLoteMovimientosManualesComponent } from './movimientoComisionManual/gestionLoteMovimientosManuales/cargaLoteMovimientosManuales.component';
import { CargaArchivosMovimientosManualesComponent } from './movimientoComisionManual/cargaArchivos/cargaArchivosMovimientosManuales.component';
import { PremioService } from './premios/service/premio.service';
import { IndicadoresService } from './premiosBonos/services/indicadores.service';
import { DetallePremioComponent } from './premios/component/detallePremio.component';
import { AgenciaCompetenciaService } from './premios/service/agenciaCompetencia.service';
import { DetallePremioService } from './premios/service/detallePremio.service';
import { ValorPremioComponent } from './premios/component/valorPremio.component';
import { ValorPremioService } from './premios/service/ValorPremio.service';
import { BonosComisionesComponent } from './menuParametrizacion/bonos/bonosComisiones.component';
import { GestionBonoComisionComponent } from './menuParametrizacion/bonos/gestionBonoComision.component';

@NgModule({
  imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
    NKDatetimeModule, CustomFormsModule, comisionesRouting],

  declarations: [SalasComponent, ConsultarSalasComponent, EditarSalasComponent, HistorialSalasComponent, 
    ConsultarTipoComponent, EditarTipoComponent, HistorialTipoComponent, IngresarTipoComponent, 
    EditarSubtipoComponent, HistorialSubtipoComponent, IngresarSubtipoComponent, ConsultarSubtipoComponent, InsertarNivelesComponent, 
    ConsultarNivelesComponent, EditarNivelesComponent, HistorialNivelesComponent, ConsultarCanalesComponent, EditarCanalesComponent, 
    HistorialCanalesComponent, InsertarCanalesComponent, ConsultarRangosComponent, EditarRangosComponent, HistorialRangosComponent, 
    IngresarRangosComponent, ConsultarPresupuestoVendedorComponent, IngresarPresupuestoVendedorComponent, EditarPresupuestoVendedorComponent,
    ConsultarPresupuestoDirectorComponent, IngresarPresupuestoDirectorComponent, EditarPresupuestoDirectorComponent, BusquedaComponent, ReferidosComponent, 
    HistorialPresupuestoDirectorComponent, HistorialPresupuestoVendedorComponent, ConsultasComisionesComponent, menuParametrizacionComisionesComponent,
    ConsultaPresupuestoRangosDirectorComponent, IngresarPresupuestoRangosDirectorComponent, EditarPresupuestoRangosDirectorComponent, 
    MovimientoComisionManualComponent, CrearMovimientoComisionManualComponent, SemaforoComponent, PremiosBonosComponent, IndicadoresComponent, PremioComponent,
    menuMovimientosManualesComponent, CargaLoteMovimientosManualesComponent, CargaArchivosMovimientosManualesComponent,
    DetallePremioComponent, BonosComisionesComponent, GestionBonoComisionComponent, ValorPremioComponent
  ],
  exports: [],
  providers: [SalasService, ConstantesComisiones, SubtipoService, NivelesService, TipoService, CanalesService,
    RangosService, GenericosService, PresupuestoVendedorService, PresupuestoDirectorService, CorporativoService, SemaforoService, CargaArchivosMovimientosManualesComponent,
    PremioService, UtilsComponent, IndicadoresService, AgenciaCompetenciaService, DetallePremioService, ValorPremioService]
})
export class ComisionesModule { }
