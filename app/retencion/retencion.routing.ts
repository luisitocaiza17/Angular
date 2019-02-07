import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetencionListComponent } from './retencion.list.component';
import { RetencionShowComponent } from './retencion.show.component';
import { CalificacionRetencionComponent } from './retencion.comentario.component';
import { ComentarioMovimientosComponent } from './comentarioMovimientos/comentario.movimientos.component';
import { ReportesRetencionComponent } from './retencion.reportes.component';
import { RetencionInfoComponent } from './retencion.info.component';
import { DescuentoRetencionListComponent } from './retencion.desc.list.component';
import { DescuentoRetencionShowComponent } from './retencion.desc.show.component';
import { RetencionCambioPlanComponent } from './cambioPlan/retencion.cambio.plan.component';
import { RetencionAnularProductoComponent } from './anularContrato/retencion.anular.producto.component';
import { ReportesDescuentoRetencionComponent } from './retencion.desc.reportes.component';
import { RetencionParametrosComponent } from './retencion.parametros.component';
import { ActivateRoutes } from '../utils/activate.routes';
import { ModificarBeneficiariosComponent } from './modificarBeneficiarios/modificarBeneficiarios.component';
import {RetencionFormaPagoComponent} from './formaPago/formaPago.component';
const RetencionRoutes: Routes = [
    {
        path: 'retencion',
        children: [
            { path: 'list', component: RetencionListComponent },
            { path: 'show/:Region/:CodigoProducto/:NumeroContrato', component: RetencionShowComponent },
            { path: 'comentario/:Region/:CodigoProducto/:NumeroContrato', component: CalificacionRetencionComponent },
            { path: 'comentario/movimiento/:Region/:CodigoProducto/:NumeroContrato/:identificador', component: ComentarioMovimientosComponent },
            { path: 'comentario/:Region/:CodigoProducto/:NumeroContrato/:IdDesc', component: CalificacionRetencionComponent },
            { path: 'comentario/movimiento/:Region/:CodigoProducto/:NumeroContrato/:identificador/:IdDesc', component: ComentarioMovimientosComponent },
            { path: 'reportes', component: ReportesRetencionComponent },
            { path: 'info/ver', component: RetencionInfoComponent },
            { path: 'descuento/list', component: DescuentoRetencionListComponent },
            { path: 'descuento/show/:Region/:CodigoProducto/:NumeroContrato', component: DescuentoRetencionShowComponent },
            { path: 'descuento/show/:Region/:CodigoProducto/:NumeroContrato/:IdDesc', component: DescuentoRetencionShowComponent },
            { path: 'cambio/plan/:Region/:CodigoProducto/:NumeroContrato', component: RetencionCambioPlanComponent },
            { path: 'anular/producto/:Region/:CodigoProducto/:NumeroContrato', component: RetencionAnularProductoComponent },
            { path: 'descuento/reportes', component: ReportesDescuentoRetencionComponent },
            { path: 'descuento/parametros', component: RetencionParametrosComponent },
            { path: 'modificarBeneficiarios/:Region/:CodigoProducto/:NumeroContrato', component: ModificarBeneficiariosComponent },
            { path: 'formaPago/:Region/:CodigoProducto/:NumeroContrato', component: RetencionFormaPagoComponent }
        ]
    }
];

export const RetencionRouting: ModuleWithProviders = RouterModule.forChild(RetencionRoutes);
