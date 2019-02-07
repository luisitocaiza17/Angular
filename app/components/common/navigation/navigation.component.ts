import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { correctHeight } from '../../../app.helpers';

import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'navigation',
    templateUrl: 'navigation.template.html'
})

export class NavigationComponent {

    accessConsulta: boolean;

    accessCrudAutorizaciones: boolean;
    accessTrackingAutorizaciones: boolean;
    accessReporteAutorizaciones: boolean;
    accessReporteInSituAutorizaciones: boolean;

    accessODAS: boolean;
    accessTransacciones: boolean;
    accessMovimientosReportes: boolean;
    accessAuditorias: boolean;
    accessAdmin: boolean;
    accessAdministracionUsuarios: boolean;
    accessAdministracionRoles: boolean;

    accessPrestadoresConsultar: boolean;
    accessActualizaConvenio: boolean;
    accessInsertarConvenio: boolean;
    accessPrestadoresAgendarCita: boolean;
    accessCalificacionPrestadores: boolean;

    accessCatalogosDiagnostico: boolean;
    accessCatalogosProcedimiento: boolean;
    accessCatalogosValorPunto: boolean;

    accessSobresPorContrato: boolean;
    accessSobresReportes: boolean;
    accessSobresAsignar: boolean;
    accessSobresConsultor: boolean;
    accessSobresDevolucion: boolean;
    accessAutorizarSobres: boolean;
    accessSimuladorConstitucion: boolean;

    accessCreditoPorContrato: boolean;
    accessCreditoReportes: boolean;
    accessCreditoAsignar: boolean;
    accessCreditoConsultor: boolean;
    accessCreditoAutorizar: boolean;

    accessRetencionConsulta: boolean;
    accessInformacionRetencion: boolean;
    accessRetencionReporte: boolean;
    accessRetencionParametroDescuento: boolean;
    accessRetencionAprobacion: boolean;

    accessCorporativoConsultar: boolean;
    accessCorporativoCrear: boolean;
    accessCorporativoGrupo: boolean;
    accessCorporativoGrupoCorp: boolean;
    accesoCorporativoUsuarioSalud: boolean;
    accessReporteVendedores: boolean;
    //CORREDORES
    accesoCorredores: boolean;
    accesoCorredoresTerminosCondiciones: boolean;
    accesoCorredoresGrupoAgentes: boolean;
    accesoCorredoresReasignacion:boolean;
    accesoCorredoresReporteReasignacion:boolean;

    accessEjecutivoComercial: boolean;
    accessAdministracionFun: boolean;

    acccessLogErrores: boolean;
    accessProcesoFacturacion: boolean;
    accessDevolucionSaldos: boolean;
    accessNotasCredito: boolean;
    accessRecaudosSaludpay: boolean;
    accessRecaudosCajaPich: boolean;
    accessReporteMorosoCobrar: boolean;
    accessReporteFacturasEmitidas: boolean
    accessGenerarArchivosDebitosInstituciones: boolean;
    accessConsultaDocumentosElectronicosDirectoSri: boolean;
    accessIngresoCaja: boolean;

    accessAgendarCitas: boolean;
    accessConsultasCitasSolicitud: boolean;

    accesConsultarCorporativoPlanes: boolean;
    accesModificarCorporativoPlanes: boolean;
    accesPortalClientes: boolean;
    accessCorporativoTerminosCondiciones: boolean;
    accessCobranzasFull: boolean;


    //PATALLAS DEL JULIAN 
    accessAgendarCentrosMedico: boolean;
    accessSolicitarCitas: boolean;
    acessConsultarSolicitudes: boolean;
    accessConsultarCitas: boolean;
    accessComisionesGrupo: boolean;
    accessComisionesAuditoria: boolean;
    accessComisionesAgenteVenta: boolean;
    accessComisionesBecas: boolean;
    accessComisionesTipo: boolean;
    accessComisionesRegion: boolean;
    accessComisionesMontoVenta: boolean;
    accessComisionesTipoVendedor: boolean;
    accessComisionesBono: boolean;
    accessComisionesCategoria: boolean;
    accessComisionesBonoMensual: boolean;
    accessComisionesBonoPlanCarro: boolean;
    accessComisionesEstado: boolean;
    accessComisionesPeriodo: boolean;
    accessComisionesPlanCarroEjecutivo: boolean;
    accessComisionesBonoMPCG: boolean;
    accessComisionesDirectores: boolean;
    accessPremioOncare: boolean;
    accessComisionesVacaciones: boolean;
    accessComisionesPremiosJefesAgencias: boolean;
    accessComisionesPremios: boolean;
    accessComisionesPremioDirectores: boolean;
    accessComisionesPremiosRequisitos: boolean;
    accessComisionesGrupoVendedor: boolean;

    accessEditValorPunto: boolean;

    accessServiciosAdicionalesBases: boolean;
    accessServiciosAdicionalesAdmin: boolean;
    accessTareasProgramadasFacturacion: boolean;
    accessCotizacionesPrincipal: boolean;
    accessDescuentoParametro: boolean;

    accessReservas: boolean;
    accessCargaPCA: boolean;

    constructor(private router: Router, public authService: AuthService) {
        this.accessConsulta = false;

        this.setPermisosAutorizaciones(false);

        this.accessODAS = false;
        this.accessTransacciones = false;
        this.accessAuditorias = false;
        this.accessAdmin = false;
        this.accessAdministracionUsuarios = false;
        this.accessAdministracionRoles = false;

        this.accessSimuladorConstitucion = false;
        this.accessSobresPorContrato = false;
        this.accessSobresReportes = false;
        this.accessSobresAsignar = false;
        this.accessSobresConsultor = false;
        this.accessSobresDevolucion = false;
        this.accessAutorizarSobres = false;

        this.accessCreditoPorContrato = false;
        this.accessCreditoReportes = false;
        this.accessCreditoAsignar = false;
        this.accessCreditoConsultor = false;
        this.accessCreditoAutorizar = false;

        this.accessMovimientosReportes = false;

        this.accessRetencionConsulta = false;
        this.accessInformacionRetencion = false;
        this.accessRetencionReporte = false;
        this.accessRetencionParametroDescuento = false;
        this.accessRetencionAprobacion = false;

        this.accessReporteVendedores = false;
        this.accessEjecutivoComercial = false;
        this.accessAdministracionFun = false;


        this.accessDevolucionSaldos = false;
        this.acccessLogErrores = false;
        this.accessProcesoFacturacion = false;
        this.accessNotasCredito = false;
        this.accessRecaudosSaludpay = false;
        this.accessRecaudosCajaPich = false;
        this.accessGenerarArchivosDebitosInstituciones = false;
        this.accessReporteMorosoCobrar = false;
        this.accessReporteFacturasEmitidas = false;
        this.accessConsultaDocumentosElectronicosDirectoSri = false;
        this.accessIngresoCaja = false;

        this.accessAgendarCitas = false;
        this.accessConsultasCitasSolicitud = false;

        this.accesConsultarCorporativoPlanes = false;
        this.accesModificarCorporativoPlanes = false;

        this.accessCobranzasFull = false;

        this.accessAgendarCentrosMedico = false;
        this.accessSolicitarCitas = false;
        this.acessConsultarSolicitudes = false;
        this.accessConsultarCitas = false;

        this.accessEditValorPunto = false;
        this.accessActualizaConvenio = false;
        this.accessInsertarConvenio = false;

        this.accessTareasProgramadasFacturacion = false;
        this.accessCotizacionesPrincipal = false;
        this.accessDescuentoParametro = false;

        this.accessReservas = false;
        this.accessCargaPCA = false;

        this.setPermisosAdministracionClientes(false);

        this.setPermisosPrestadores(false);

        this.setPermisosCorporativo(false)

        this.setPermisosCorredores(false); //CORREDORES

        this.setPermisosCatalogos(false);

        this.setPermisosComisiones(false);

        this.setPermisosServiciosAdicionales(false);

        this.verificarPermisos();
    }

    ngAfterViewInit() {
        jQuery('#side-menu').metisMenu();

        jQuery('.metismenu a').click(() => {
            setTimeout(() => {
                correctHeight();
            }, 300)
        });
    }

    activeRoute(routename: string): boolean {
        return this.router.url.indexOf(routename) > -1;
    }

    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            if (admin != undefined) {
                this.accessConsulta = true;
                this.setPermisosAutorizaciones(true);
                this.accessODAS = true;
                this.accessTransacciones = true;
                this.accessMovimientosReportes = true;
                this.accessAuditorias = true;
                this.accessAdmin = true;
                this.accessAdministracionUsuarios = true;
                this.accessAdministracionRoles = true;

                this.accessSimuladorConstitucion = true;
                this.accessSobresPorContrato = true;
                this.accessSobresReportes = true;
                this.accessSobresAsignar = true;
                this.accessSobresConsultor = true;
                this.accessSobresDevolucion = true;
                this.accessAutorizarSobres = true;

                //Creditos
                this.accessCreditoPorContrato = true;
                this.accessCreditoReportes = true;
                this.accessCreditoAsignar = true;
                this.accessCreditoConsultor = true;
                this.accessCreditoAutorizar = true;


                this.accessRetencionConsulta = true;
                this.accessInformacionRetencion = true;
                this.accessRetencionReporte = true;
                this.accessRetencionParametroDescuento = true;
                this.accessRetencionAprobacion = true;
                this.accessReporteVendedores = true;
                this.accessEjecutivoComercial = true;
                this.accessAdministracionFun = true;


                this.accessNotasCredito = true;

                this.accessEditValorPunto = true;
                this.accessActualizaConvenio = true;
                this.accessInsertarConvenio = true;


                this.setPermisosPrestadores(true);
                this.setPermisosCatalogos(true);
                this.setPermisosCorporativo(true);
                this.setPermisosCorredores(true); //CORREDORES
                this.setPermisosAdministracionClientes(true);
                this.setPermisosComisiones(true);
                this.accessDevolucionSaldos = true;
                this.acccessLogErrores = true;
                this.accessProcesoFacturacion = true;
                this.accessRecaudosSaludpay = true;
                this.accessRecaudosCajaPich = true;
                this.accessGenerarArchivosDebitosInstituciones = true;
                this.accessReporteMorosoCobrar = true;
                this.accessReporteFacturasEmitidas = true;
                this.accessConsultaDocumentosElectronicosDirectoSri = true;
                this.accessIngresoCaja = true;

                this.accessAgendarCitas = true;
                this.accessConsultasCitasSolicitud = true;

                this.accesConsultarCorporativoPlanes = true;
                this.accesModificarCorporativoPlanes = true;
                this.accessCobranzasFull = true;

                this.accessAgendarCentrosMedico = true;
                this.accessSolicitarCitas = true;
                this.acessConsultarSolicitudes = true;
                this.accessConsultarCitas = true;

                this.accessTareasProgramadasFacturacion = true;
                this.accessCotizacionesPrincipal = true;
                this.accessDescuentoParametro = true;

                this.accessReservas = true;

                this.setPermisosServiciosAdicionales(true);
                this.accessCargaPCA = true;
            }
            else {
                // consultas
                var consultasFull = listaPermisos.find(p => p == Permiso.CONSULTA_FULL || p == Permiso.CONSULTA_VENDEDOR || p == Permiso.CONSULTA_EXTERNA);
                if (consultasFull != undefined)
                    this.accessConsulta = true;

                // autorizaciones
                var auth = listaPermisos.find(p => p == Permiso.AUTORIZACIONES_FULL);
                if (auth != undefined)
                    this.setPermisosAutorizaciones(true);
                else {
                    auth = listaPermisos.find(p => p == Permiso.AUTORIZACIONES_CRUD);
                    if (auth != undefined)
                        this.accessCrudAutorizaciones = true;

                    auth = listaPermisos.find(p => p == Permiso.AUTORIZACIONES_TRACKING);
                    if (auth != undefined)
                        this.accessTrackingAutorizaciones = true;

                    auth = listaPermisos.find(p => p == Permiso.AUTORIZACIONES_REPORTE);
                    if (auth != undefined)
                        this.accessReporteAutorizaciones = true;

                    auth = listaPermisos.find(p => p == Permiso.AUTORIZACIONES_REPORTE_IN_SITU);
                    if (auth != undefined)
                        this.accessReporteInSituAutorizaciones = true;
                }

                auth = listaPermisos.find(p => p == Permiso.ODAS);
                if (auth != undefined)
                    this.accessODAS = true;

                auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES);
                if (auth != undefined)
                    this.accessTransacciones = true;

                auth = listaPermisos.find(p => p == Permiso.MOVIMIENTOS_REPORTE);
                if (auth != undefined)
                    this.accessMovimientosReportes = true;

                auth = listaPermisos.find(p => p == Permiso.AUDITORIAS);
                if (auth != undefined)
                    this.accessAuditorias = true;

                // CORPORATIVO
                auth = listaPermisos.find(p => p == Permiso.CORPORATIVO_FULL);
                if (auth != undefined)
                    this.setPermisosCorporativo(true);
                else {
                    auth = listaPermisos.find(p => p == Permiso.CORPORATIVO_EMPRESA);
                    if (auth != undefined)
                        this.accessCorporativoConsultar = true;

                    auth = listaPermisos.find(p => p == Permiso.CORPORATIVO_CREAR);
                    if (auth != undefined)
                        this.accessCorporativoCrear = true;

                    auth = listaPermisos.find(p => p == Permiso.CORPORATIVO_GRUPO);
                    if (auth != undefined) {
                        this.accessCorporativoGrupo = true;
                        this.accessCorporativoGrupoCorp = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.CORPORATIVO_TERMINOSCONDICIONES);
                    if (auth != undefined)
                        this.accessCorporativoTerminosCondiciones = true;

                    auth = listaPermisos.find(p => p == Permiso.CORPORATIVO_USUARIOSALUDADM);
                    if (auth != undefined)
                        this.accesoCorporativoUsuarioSalud = true;
                }

                //CORREDORES
                
                auth = listaPermisos.find(p => p == Permiso.FULL_BRO);
                if (auth != undefined)
                    this.setPermisosCorredores(true);
                else{
                    auth = listaPermisos.find(p => p == Permiso.CREA_BRO);
                    if (auth != undefined)
                        this.accesoCorredoresTerminosCondiciones=true;
                    auth = listaPermisos.find(p => p == Permiso.TC_BRO);
                    if (auth != undefined)
                        this.accesoCorredores=true;
		    auth = listaPermisos.find(p => p == Permiso.GRUP_BRO);
                    if (auth != undefined)
                        this.accesoCorredoresGrupoAgentes = true;
                    auth = listaPermisos.find(p => p == Permiso.REASIG_BRO);
                    if (auth != undefined)
                        this.accesoCorredoresReasignacion = true;
                    auth = listaPermisos.find(p => p == Permiso.REP_REASIG_BRO);
                    if (auth != undefined)
                        this.accesoCorredoresReporteReasignacion = true;
                }

                // PRESTADORES
                auth = listaPermisos.find(p => p == Permiso.PRESTADORES_FULL);
                if (auth != undefined)
                    this.setPermisosPrestadores(true);
                else {
                    auth = listaPermisos.find(p => p == Permiso.PRESTADORES_CONSULTAR);
                    if (auth != undefined)
                        this.accessPrestadoresConsultar = true;

                    auth = listaPermisos.find(p => p == Permiso.PRESTADORES_AGENDAR_CITA);
                    if (auth != undefined)
                        this.accessPrestadoresAgendarCita = true;

                    auth = listaPermisos.find(p => p == Permiso.PRESTADORES_CALIFICACION);
                    if (auth != undefined)
                        this.accessCalificacionPrestadores = true;

                    auth = listaPermisos.find(p => p == Permiso.ACTUALIZAR_CONVENIO);
                    if (auth != undefined)
                        this.accessActualizaConvenio = true;

                    auth = listaPermisos.find(p => p == Permiso.INGRESAR_CONVENIO);
                    if (auth != undefined)
                        this.accessInsertarConvenio = true;
                }

                // CATALOGOS
                auth = listaPermisos.find(p => p == Permiso.CATALOGOS_FULL);
                if (auth != undefined)
                    this.setPermisosCatalogos(true);
                else {
                    auth = listaPermisos.find(p => p == Permiso.CATALOGOS_DIAGNOSTICO);
                    if (auth != undefined)
                        this.accessCatalogosDiagnostico = true;

                    auth = listaPermisos.find(p => p == Permiso.CATALOGOS_PROCEDIMIENTO);
                    if (auth != undefined)
                        this.accessCatalogosProcedimiento = true;

                    auth = listaPermisos.find(p => p == Permiso.CATALOGOS_VALOR_PUNTO);
                    if (auth != undefined)
                        this.accessCatalogosValorPunto = true;

                    auth = listaPermisos.find(p => p == Permiso.CATALOGOS_EDIT_VALOR_PUNTO);
                    if (auth != undefined)
                        this.accessEditValorPunto = true;
                }

                //SOBRES
                auth = listaPermisos.find(p => p == Permiso.SIMULADOR_CONSTITUCION);
                if (auth != undefined)
                    this.accessSimuladorConstitucion = true;

                auth = listaPermisos.find(p => p == Permiso.SOBRES_POR_CONTRATO);
                if (auth != undefined)
                    this.accessSobresPorContrato = true;

                auth = listaPermisos.find(p => p == Permiso.SOBRES_REPORTE);
                if (auth != undefined)
                    this.accessSobresReportes = true;

                auth = listaPermisos.find(p => p == Permiso.SOBRES_ASIGNAR);
                if (auth != undefined)
                    this.accessSobresAsignar = true;

                auth = listaPermisos.find(p => p == Permiso.SOBRES_CONSULTOR);
                if (auth != undefined)
                    this.accessSobresConsultor = true;

                auth = listaPermisos.find(p => p == Permiso.SOBRES_DEVOLUCION);
                if (auth != undefined)
                    this.accessSobresDevolucion = true;

                auth = listaPermisos.find(p => p == Permiso.SOBRES_AUTORIZAR);
                if (auth != undefined)
                    this.accessAutorizarSobres = true;

                //CREDITOS
                auth = listaPermisos.find(p => p == Permiso.INGRESAR_CREDITO);
                if (auth != undefined)
                    this.accessCreditoPorContrato = true;

                auth = listaPermisos.find(p => p == Permiso.REPORTE_CREDITO);
                if (auth != undefined)
                    this.accessCreditoReportes = true;

                auth = listaPermisos.find(p => p == Permiso.ASIGNAR_CREDITO);
                if (auth != undefined)
                    this.accessCreditoAsignar = true;

                auth = listaPermisos.find(p => p == Permiso.CONSULTOR_CREDITO);
                if (auth != undefined)
                    this.accessCreditoConsultor = true;

                auth = listaPermisos.find(p => p == Permiso.AUTORIZAR_CREDITO);
                if (auth != undefined)
                    this.accessCreditoAutorizar = true;


                //ADMINISTRADOR DE USUARIO
                auth = listaPermisos.find(p => p == Permiso.ADMIN_USU_ROL);
                if (auth != undefined)
                    this.accessAdministracionUsuarios = true;

                //ADMINISTRADOR DE RESERVAS
                auth = listaPermisos.find(p => p == Permiso.REPORTE_RESERVAS);
                if (auth != undefined)
                    this.accessReservas = true;

                auth = listaPermisos.find(p => p == Permiso.ADMIN_USU_ROL_ROL);
                if (auth != undefined)
                    this.accessAdministracionRoles = true;


                //RETENCIONES
                auth = listaPermisos.find(p => p == Permiso.RETENCION_CONSULTA);
                if (auth != undefined)
                    this.accessRetencionConsulta = true;

                auth = listaPermisos.find(p => p == Permiso.RETENCION_INFORMACION);
                if (auth != undefined)
                    this.accessInformacionRetencion = true;

                auth = listaPermisos.find(p => p == Permiso.RETENCION_REPORTE);
                if (auth != undefined)
                    this.accessRetencionReporte = true;

                auth = listaPermisos.find(p => p == Permiso.RETENCION_PARAMETRO_DESCUENTO);
                if (auth != undefined)
                    this.accessRetencionParametroDescuento = true;

                auth = listaPermisos.find(p => p == Permiso.RETENCION_APROBACION);
                if (auth != undefined)
                    this.accessRetencionAprobacion = true;





                //COMERCIAL
                auth = listaPermisos.find(p => p == Permiso.DIRECTOR_VENTAS);
                if (auth != undefined)
                    this.accessReporteVendedores = true;

                auth = listaPermisos.find(p => p == Permiso.GERENTE_COMERCIAL);
                if (auth != undefined)
                    this.accessReporteVendedores = true;

                auth = listaPermisos.find(p => p == Permiso.EJECUTIVO_COMERCIAL);
                if (auth != undefined)
                    this.accessEjecutivoComercial = true;

                auth = listaPermisos.find(p => p == Permiso.ADMINISTRADOR_FUN);
                var auth1 = listaPermisos.find(p => p == Permiso.CREA_FUN);
                var auth2 = listaPermisos.find(p => p == Permiso.ASIGNA_FUN);
                var auth3 = listaPermisos.find(p => p == Permiso.ANULA_FUN);
                var auth4 = listaPermisos.find(p => p == Permiso.CONSULTA_FUN);
                if (auth != undefined || auth1 != undefined || auth2 != undefined || auth3 != undefined || auth4 != undefined)
                    this.accessAdministracionFun = true;

                //PESTAÑAS DE FACTURACION

                auth = listaPermisos.find(p => p == Permiso.PROCESO_FACTUARACION);
                if (auth != undefined)
                    this.accessProcesoFacturacion = true;

                auth = listaPermisos.find(p => p == Permiso.CONSULTA_DOCS_ELECTRONICOS_DIRECTO_SRI);
                if (auth != undefined)
                    this.accessConsultaDocumentosElectronicosDirectoSri = true;

                auth = listaPermisos.find(p => p == Permiso.LOG_ERRORES);
                if (auth != undefined)
                    this.acccessLogErrores = true;

                auth = listaPermisos.find(p => p == Permiso.SALDOS_FAVOR);
                if (auth != undefined)
                    this.accessDevolucionSaldos = true;

                auth = listaPermisos.find(p => p == Permiso.NOTAS_CREDITO);
                if (auth != undefined)
                    this.accessNotasCredito = true;

                auth = listaPermisos.find(p => p == Permiso.TAREA_PROGRAMADA_NOTAS_PCA);
                auth1 = listaPermisos.find(p => p == Permiso.TAREA_PROGRAMADA_NOTAS_LOTE);

                if (auth != undefined || auth1 != undefined)
                    this.accessTareasProgramadasFacturacion = true;

                auth = listaPermisos.find(p => p == Permiso.DESCUENTO_PARAMETRO);
                if (auth != undefined)
                    this.accessDescuentoParametro = true;

                //PESTAÑAS DE AGENDAR CITA
                auth = listaPermisos.find(p => p == Permiso.AGENDA_CITA);
                if (auth != undefined)
                    this.accessAgendarCitas = true;

                //PLANES CORPORATIVO
                auth = listaPermisos.find(p => p == Permiso.CONSULTAR_PLANES_COR);
                if (auth != undefined)
                    this.accesConsultarCorporativoPlanes = true;

                auth = listaPermisos.find(p => p == Permiso.MODIFICAR_PLANES_COR);
                if (auth != undefined)
                    this.accesModificarCorporativoPlanes = true;


                auth = listaPermisos.find(p => p == Permiso.PORTAL_CLIENTES);
                if (auth != undefined)
                    this.setPermisosAdministracionClientes(true);

                //COBRANZAS 
                auth = listaPermisos.find(p => p == Permiso.COBRAZAS_FULL);
                if (auth != undefined)
                    this.accessCobranzasFull = true;

                //CITAS MEDICAS
                auth = listaPermisos.find(p => p == Permiso.AGENDAR_CITA_CENTRO_MEDICO);
                if (auth != undefined)
                    this.accessAgendarCentrosMedico = true;

                auth = listaPermisos.find(p => p == Permiso.SOLICITUD_MEDICO_DESTACADO);
                if (auth != undefined)
                    this.accessSolicitarCitas = true;

                auth = listaPermisos.find(p => p == Permiso.CONSULTAR_SOLICITUD);
                if (auth != undefined)
                    this.acessConsultarSolicitudes = true;

                auth = listaPermisos.find(p => p == Permiso.CONSULTAR_CITA);
                if (auth != undefined)
                    this.accessConsultarCitas = true;

                //RECAUDOS
                auth = listaPermisos.find(p => p == Permiso.REACAUDOS_SALUD_PAY);
                if (auth != undefined)
                    this.accessRecaudosSaludpay = true;

                auth = listaPermisos.find(p => p == Permiso.REACAUDOS_BOTON_CAJA_PICHINCHA);
                if (auth != undefined)
                    this.accessRecaudosCajaPich = true;

                auth = listaPermisos.find(p => p == Permiso.GENERAR_ARCHIVOS_DEBITOS_INSTITUCIONES);
                if (auth != undefined)
                    this.accessGenerarArchivosDebitosInstituciones = true;

                auth = listaPermisos.find(p => p == Permiso.REPORTE_MOROSOS_POR_COBRAR);
                if (auth != undefined)
                    this.accessReporteMorosoCobrar = true;

                auth = listaPermisos.find(p => p == Permiso.REPORTE_FACTURAS_EMITIDAS);
                if (auth != undefined)
                    this.accessReporteFacturasEmitidas = true;

                auth = listaPermisos.find(p => p == Permiso.INGRESO_CAJA);
                if (auth != undefined)
                    this.accessIngresoCaja = true;

                auth = listaPermisos.find(p => p == Permiso.COTIZACIONES_PRINCIPAL);
                if (auth != undefined)
                    this.accessCotizacionesPrincipal = true;

            }
        }
    }

    setPermisosAutorizaciones(permiso: boolean): void {
        this.accessCrudAutorizaciones = permiso;
        this.accessTrackingAutorizaciones = permiso;
        this.accessReporteAutorizaciones = permiso;
        this.accessReporteInSituAutorizaciones = permiso;
    }

    setPermisosPrestadores(permiso: boolean): void {
        this.accessPrestadoresConsultar = permiso;
        this.accessPrestadoresAgendarCita = permiso;
        this.accessCalificacionPrestadores = permiso;
    }

    setPermisosCorporativo(permiso: boolean): void {
        this.accessCorporativoConsultar = permiso;
        this.accessCorporativoCrear = permiso;
        this.accessCorporativoGrupo = permiso;
        this.accessCorporativoGrupoCorp = permiso;
        this.accessCorporativoTerminosCondiciones = permiso;
        this.accesoCorporativoUsuarioSalud = permiso;
    }

    //CORREDORES
    setPermisosCorredores(permiso: boolean): void {
        this.accesoCorredores = permiso;
        this.accesoCorredoresTerminosCondiciones = permiso;
        this.accesoCorredoresGrupoAgentes = permiso;
        this.accesoCorredoresReasignacion = permiso;
        this.accesoCorredoresReporteReasignacion =permiso;
    }

    setPermisosCatalogos(permiso: boolean): void {
        this.accessCatalogosDiagnostico = permiso;
        this.accessCatalogosProcedimiento = permiso;
        this.accessCatalogosValorPunto = permiso;
    }

    setPermisoSobres(permiso: boolean): void {
        this.accessSobresAsignar = permiso;
    }

    setPermisosAdministracionClientes(permiso: boolean): void {
        this.accesPortalClientes = permiso;
    }

    setPermisosCobranzasFull(permiso: boolean): void {
        this.accessCobranzasFull = permiso;
    }
    setPermisosComisiones(permiso: boolean): void {
        this.accessComisionesGrupo = permiso;
        this.accessComisionesAgenteVenta = permiso;
        this.accessComisionesBecas = permiso;
        this.accessComisionesAuditoria = permiso;
        this.accessComisionesTipo = permiso;
        this.accessComisionesRegion = permiso;
        this.accessComisionesMontoVenta = permiso;
        this.accessComisionesTipoVendedor = permiso;
        this.accessComisionesBono = permiso;
        this.accessComisionesCategoria = permiso;
        this.accessComisionesBonoMensual = permiso;
        this.accessComisionesBonoPlanCarro = permiso;
        this.accessComisionesEstado = permiso;
        this.accessComisionesPeriodo = permiso;
        this.accessComisionesPlanCarroEjecutivo = permiso;
        this.accessComisionesBonoMPCG = permiso;
        this.accessComisionesDirectores = permiso;
        this.accessPremioOncare = permiso;
        this.accessComisionesPremioDirectores = permiso;
        this.accessComisionesPremiosRequisitos = permiso;
        this.accessComisionesVacaciones = permiso;
        this.accessComisionesPremiosJefesAgencias = permiso;
        this.accessComisionesVacaciones = permiso;
        this.accessComisionesPremios = permiso;
        this.accessComisionesGrupoVendedor = permiso;
    }

    setPermisosServiciosAdicionales(permiso: boolean): void {
        this.accessServiciosAdicionalesBases = permiso;
        this.accessServiciosAdicionalesAdmin = permiso;
    }
}