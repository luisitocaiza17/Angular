import { Injectable, Compiler } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { tokenNotExpired, JwtHelper, AuthHttp, AuthHttpError } from 'angular2-jwt';

import { Usuario, Permiso } from './usuario';

import { ConstantService } from '../utils/constant.service';

import { CustomQueryEncoderHelper } from '../utils/helpers';
import {CorredoresReasignacionListComponent} from '../corredores/corredoresReasignacion.list.component';

@Injectable()
export class AuthService {

    private authUrl = 'token';
    public usuarioUrl = 'usuario';
    public token: any;
    jwtHelper: JwtHelper = new JwtHelper();
    public nombreCompleto: string;
    public nombreUsuario: string;
    public tipoPermiso: string;
    public clientId: String;
    public numeroNotificaciones: number;

    constructor(private http: Http, private compiler: Compiler, private authHttp: AuthHttp,
        private constantService: ConstantService) {
        this.authUrl = constantService.AUTH_ENDPOINT + this.authUrl;
        this.usuarioUrl = constantService.API_ENDPOINT + this.usuarioUrl;
        this.clientId = constantService.CLIENT_ID;
        let userData = localStorage.getItem("user_data");
        this.numeroNotificaciones = 0;
        this.cargarDatosUsuario(userData);

    }

    login(usuario: Usuario): Observable<boolean> {
        let urlSearchParams = new URLSearchParams('', new CustomQueryEncoderHelper());
        urlSearchParams.append('grant_type', 'password');
        urlSearchParams.append('client_id', this.clientId.toString());
        urlSearchParams.append('username', usuario.NombreUsuario.toString());
        urlSearchParams.append('password', usuario.Contrasenia.toString());

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.authUrl, urlSearchParams, options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let tokenResponse = response.json();
                if (tokenResponse != null && tokenResponse.access_token) {
                    // set token property
                    this.token = tokenResponse.access_token;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('id_token', this.token);
                    // store the refresh token for future authorize access
                    let refreshToken = response.json().refresh_token;
                    if (refreshToken != null)
                        localStorage.setItem('refresh_token', refreshToken);

                    let userData = response.json().user_data;
                    if (userData != null) {
                        localStorage.setItem('user_data', userData);
                        this.cargarDatosUsuario(userData);
                        this.ipPublica();
                    }

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            }).catch(this.handleError);
    }

    refreshToken(): Observable<boolean> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('grant_type', 'refresh_token');
        urlSearchParams.append('client_id', this.clientId.toString());
        urlSearchParams.append('refresh_token', localStorage.getItem('refresh_token'));

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.authUrl, urlSearchParams, options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let tokenResponse = response.json();
                if (tokenResponse != null && tokenResponse.access_token) {
                    // set token property
                    this.token = tokenResponse.access_token;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('id_token', this.token);
                    // store the refresh token for future authorize access
                    let refreshToken = response.json().refresh_token;
                    if (refreshToken != null)
                        localStorage.setItem('refresh_token', refreshToken);

                    let userData = response.json().user_data;
                    if (userData != null) {
                        localStorage.setItem('user_data', userData);
                        this.cargarDatosUsuario(userData);
                        this.ipPublica();
                    }

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            }).catch(this.handleError);
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.clear();
        this.compiler.clearCache();
        window.location.href = window.location.origin + this.constantService.BASE_REF;
    }

    cargarDatosUsuario(userData: string): void {
        if (userData != null) {
            var usuario: Usuario = JSON.parse(userData);
            if (usuario != null) {
                this.nombreCompleto = usuario.NombreCompleto;
                this.nombreUsuario = usuario.NombreUsuario;
            }
        }
    }

    ipPublica() {
        $.getJSON('https://api.ipify.org?format=jsonp&callback=?', function (data) {
            console.log(data);
            var res = JSON.stringify(data, null, 2);
            var resj = JSON.parse(res);

            localStorage.setItem('ip_publica', resj.ip);
        });
    }

    getDatosUsuarioAutenticado() {
        var usuario: Usuario = null;
        var userData = localStorage.getItem('user_data');
        if (userData != undefined && userData != '') {
            usuario = JSON.parse(userData);
        }

        usuario.Correo = usuario.NombreUsuario + "@saludsa.com.ec";
        return usuario;
    }

    public isAuthorize(routeName: string): boolean {
        if (routeName == '/mainView')
            return true;
        let permisos = this.getPermisos();
        if (permisos != null) {
            // verificando administrador
            var admin = this.verifyAccess(permisos, Permiso.ADMINISTRADOR);
            if (admin)
                return true;

            // verificando acceso a consultas
            var consultaPath = routeName.indexOf("contratos");
            if (consultaPath != -1) {
                var consultaAccess = this.verifyAccess(permisos, Permiso.CONSULTA_FULL);
                if (consultaAccess)
                    return true;

                consultaAccess = this.verifyAccess(permisos, Permiso.CONSULTA_VENDEDOR);
                if (consultaAccess)
                    return true;

                consultaAccess = this.verifyAccess(permisos, Permiso.CONSULTA_EXTERNA);
                if (consultaAccess)
                    return true;
                return false;
            }

            // verificando acceso a autorizaciones
            var authPath = routeName.indexOf("autorizacion");
            var trackingAuthPath = routeName.indexOf("movimientos");
            var reporteAuthPath = routeName.indexOf("reporteAutorizacionesNormal");
            var reporteAuthPathInSitu = routeName.indexOf("reporteAutorizacionesInSitu");

            if (authPath != -1 || trackingAuthPath != -1 || reporteAuthPath != -1 || reporteAuthPathInSitu != -1) {
                var autorizacionFullAccess = this.verifyAccess(permisos, Permiso.AUTORIZACIONES_FULL);
                if (autorizacionFullAccess)
                    return true;
                else {
                    if (authPath != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.AUTORIZACIONES_CRUD);
                        if (authAccess)
                            return true;
                    }
                    if (trackingAuthPath != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.AUTORIZACIONES_TRACKING);
                        if (authAccess)
                            return true;
                    }
                    if (reporteAuthPath != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.AUTORIZACIONES_REPORTE);
                        if (authAccess)
                            return true;
                    }
                    if (reporteAuthPathInSitu != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.AUTORIZACIONES_REPORTE_IN_SITU);
                        if (authAccess)
                            return true;
                    }
                }
            }

            // verificando acceso a odas
            var odasPath = routeName.indexOf("odas");
            if (odasPath != -1) {
                return this.verifyAccess(permisos, Permiso.ODAS)
            }

            // verificando acceso a administracion de usuarios
            var usuarioPath = routeName.indexOf("usuarios");
            if (usuarioPath != -1) {
                return this.verifyAccess(permisos, Permiso.ADMIN_USU_ROL)
            }
            var rolesPath = routeName.indexOf("roles");
            if (rolesPath != -1) {
                return this.verifyAccess(permisos, Permiso.ADMIN_USU_ROL_ROL)
            }

            var reporteOdasPath = routeName.indexOf("reporteOdas");
            if (reporteOdasPath != -1) {
                return this.verifyAccess(permisos, Permiso.ODAS)
            }

            // verificando accceso a corporativo

            var grupoCorporativo = routeName.indexOf("consultarGrupoCorp");
            if (grupoCorporativo != -1) {
                return this.verifyAccess(permisos, Permiso.CORPORATIVO_GRUPO);
            }

            var empresa = routeName.indexOf("EmpresaCorp");
            if (empresa != -1) {
                return this.verifyAccess(permisos, Permiso.CORPORATIVO_CREAR);
            }

            var prefactura = routeName.indexOf("PagosConfCorp");
            if (prefactura != -1) {
                return this.verifyAccess(permisos, Permiso.CORPORATIVO_CREAR);
            }

            var terminosCondiciones = routeName.indexOf("TerminosCondiciones");
            if (terminosCondiciones != -1) {
                return this.verifyAccess(permisos, Permiso.CORPORATIVO_TERMINOSCONDICIONES);
            }

            var usuarioSaludAdm = routeName.indexOf("UsuarioSaludCorp");
            if (usuarioSaludAdm != -1) {
                return this.verifyAccess(permisos, Permiso.CORPORATIVO_USUARIOSALUDADM);
            }

            //verificar Acceso a Corredores
            var grupoCorredores = routeName.indexOf("CorredoresGrupoAgentesListComponent");
            if (grupoCorredores != -1) {
                return this.verifyAccess(permisos, Permiso.GRUP_BRO);
            }

            var adminCorredores = routeName.indexOf("CorredoresAdmnistracionListComponent");
            if (adminCorredores != -1) {
                return this.verifyAccess(permisos, Permiso.CREA_BRO);
            }

            var condicionesCorredores = routeName.indexOf("CorredoresCondicionesListComponent");
            if (condicionesCorredores != -1) {
                return this.verifyAccess(permisos, Permiso.TC_BRO);
            }

            var asignacionCorredores = routeName.indexOf("CorredoresReasignacionListComponent");
            if (asignacionCorredores != -1) {
                return this.verifyAccess(permisos, Permiso.REASIG_BRO);
            }

            var asignacionReporteCorredores = routeName.indexOf("CorredoresReporteReasignacionListComponent");
            if (asignacionReporteCorredores != -1) {
                return this.verifyAccess(permisos, Permiso.REP_REASIG_BRO);
            }

            //verificar Accesso a Reservas
            var txPath = routeName.indexOf("reporteReservas");
            if (txPath != -1) {
                return this.verifyAccess(permisos, Permiso.REPORTE_RESERVAS);
            }
            var txPath = routeName.indexOf("configuracionReservas");
            if (txPath != -1) {
                return this.verifyAccess(permisos, Permiso.REPORTE_RESERVAS);
            }




            // verificando acceso a transacciones
            var txPath = routeName.indexOf("transacciones");
            if (txPath != -1) {
                return this.verifyAccess(permisos, Permiso.TRANSACCIONES);
            }

            var tranRep = routeName.indexOf("reporteMovimientos");
            if (tranRep != -1) {
                return this.verifyAccess(permisos, Permiso.MOVIMIENTOS_REPORTE);
            }

            // verificando acceso a auditorias
            var auditoriasPath = routeName.indexOf("auditoria");
            if (auditoriasPath != -1) {
                return this.verifyAccess(permisos, Permiso.AUDITORIAS);
            }

            // verificando acceso a prestadores
            var prestadoresPath = routeName.indexOf("consultarPrestadores");
            var agendarCitasPath = routeName.indexOf("agendarCitaPrestador");
            var calificacionPrestadorPath = routeName.indexOf("calificacionPrestador");
            if (prestadoresPath != -1 || agendarCitasPath != -1 || calificacionPrestadorPath != -1) {
                var accessPrestadores = this.verifyAccess(permisos, Permiso.PRESTADORES_FULL);
                if (accessPrestadores)
                    return true;
                else {
                    if (prestadoresPath != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.PRESTADORES_CONSULTAR);
                        var authAccess2 = this.verifyAccess(permisos, Permiso.ACTUALIZAR_CONVENIO);
                        var authAccess3 = this.verifyAccess(permisos, Permiso.INGRESAR_CONVENIO);
                        if (authAccess || authAccess2 || authAccess3)
                            return true;
                    }
                    if (agendarCitasPath != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.PRESTADORES_AGENDAR_CITA);
                        if (authAccess)
                            return true;
                    }
                    if (calificacionPrestadorPath != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.PRESTADORES_CALIFICACION);
                        if (authAccess)
                            return true;
                    }
                }
            }


            // verificando acceso a catalogos
            var catalogosDiagnostico = routeName.indexOf("diagnostico");
            var catalogoProcedimiento = routeName.indexOf("procedimiento");
            var catalogoValorPunto = routeName.indexOf("valorPunto");
            if (catalogosDiagnostico != -1 || catalogoProcedimiento != -1 || catalogoValorPunto != -1) {
                var accessCatalogos = this.verifyAccess(permisos, Permiso.CATALOGOS_FULL);
                if (accessCatalogos)
                    return true;
                else {
                    if (catalogosDiagnostico != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.CATALOGOS_DIAGNOSTICO);
                        if (authAccess)
                            return true;
                    }

                    if (catalogoProcedimiento != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.CATALOGOS_PROCEDIMIENTO);
                        if (authAccess)
                            return true;
                    }

                    if (catalogoValorPunto != -1) {
                        var authAccess = this.verifyAccess(permisos, Permiso.CATALOGOS_VALOR_PUNTO);
                        var authAccess2 = this.verifyAccess(permisos, Permiso.CATALOGOS_EDIT_VALOR_PUNTO);
                        if (authAccess || authAccess2)
                            return true;
                    }
                }
            }


            //Verificando Permiso Sobres
            var simuladorConstitucion =  routeName.indexOf("simuladorReporte");
            var sobresPorContrato = routeName.indexOf("sobresPorContrato");
            var sobresReportes = routeName.indexOf("reporteSobres");
            var sobresAsignar = routeName.indexOf("asignarSobres");
            var sobresConsultor = routeName.indexOf("listadoSobresConsultor");
            var sobresDevolucion = routeName.indexOf("devolucionSobres");
            var sobresAutorizar = routeName.indexOf("autorizarSobres");

            if (simuladorConstitucion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SIMULADOR_CONSTITUCION);
                if (authAccess)
                    return true;
            }

            if (sobresPorContrato != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SOBRES_POR_CONTRATO);
                if (authAccess)
                    return true;
            }

            if (sobresAsignar != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SOBRES_ASIGNAR);
                if (authAccess)
                    return true;
            }

            if (sobresReportes != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SOBRES_REPORTE);
                if (authAccess)
                    return true;
            }

            if (sobresConsultor != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SOBRES_CONSULTOR);
                if (authAccess)
                    return true;
            }

            if (sobresConsultor != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SOBRES_CONSULTOR);
                if (authAccess)
                    return true;
            }

            if (sobresDevolucion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SOBRES_DEVOLUCION);
                if (authAccess)
                    return true;
            }

            if (sobresAutorizar != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SOBRES_AUTORIZAR);
                if (authAccess)
                    return true;
            }

            //verificar permisos para creditos
            var creditoPorContrato = routeName.indexOf("creditoPorContrato");
            var creditoReportes = routeName.indexOf("reporteCredito");
            var creditoAsignar = routeName.indexOf("asignarCredito");
            var creditoConsultor = routeName.indexOf("listadoCreditoConsultor");
            var creditoAutorizar = routeName.indexOf("autorizarCreditos");

            if (creditoPorContrato != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.INGRESAR_CREDITO);
                if (authAccess)
                    return true;
            }

            if (creditoReportes != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.REPORTE_CREDITO);
                if (authAccess)
                    return true;
            }

            if (creditoAsignar != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.ASIGNAR_CREDITO);
                if (authAccess)
                    return true;
            }

            if (creditoConsultor != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.CONSULTOR_CREDITO);
                if (authAccess)
                    return true;
            }

            if (creditoAutorizar != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.AUTORIZAR_CREDITO);
                if (authAccess)
                    return true;
            }


            //VERIFICAR PERMISOS DE CITAS MEDICAS
            var agendarCitasSalud = routeName.indexOf("agendarCitasSalud");
            var solicitarCita = routeName.indexOf("solicitarCita");
            var consultaCitasSolicitud = routeName.indexOf("consultaCitasSolicitud");
            // var agendarCitasSalud = routeName.indexOf("agendarCitasSalud"); 

            if (agendarCitasSalud != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.AGENDAR_CITA_CENTRO_MEDICO);
                if (authAccess)
                    return true;
            }

            if (solicitarCita != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SOLICITUD_MEDICO_DESTACADO);
                if (authAccess)
                    return true;
            }

            if (agendarCitasSalud != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.CONSULTAR_SOLICITUD);
                var authAccess2 = this.verifyAccess(permisos, Permiso.CONSULTAR_CITA);
                if (authAccess || authAccess2)
                    return true;
            }

            if (consultaCitasSolicitud != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.CONSULTAR_CITA);
                if (authAccess)
                    return true;
            }





            //Verificando Permiso rETENCIONES
            var retencionConsulta = routeName.indexOf("/retencion/list");
            var retencionInformacion = routeName.indexOf("/informacionRetencion/ver");
            var retencionReporte = routeName.indexOf("/reportes/filtro");
            var retencionDescuento = routeName.indexOf("/retencion/descuento/parametros");
            var retencionAprobacion = routeName.indexOf("/retencion/descuento/reportes");

            if (retencionConsulta != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.RETENCION_CONSULTA);
                if (authAccess)
                    return true;
            }

            if (retencionInformacion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.RETENCION_INFORMACION);
                if (authAccess)
                    return true;
            }

            if (retencionReporte != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.RETENCION_REPORTE);
                if (authAccess)
                    return true;
            }

            if (retencionDescuento != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.RETENCION_PARAMETRO_DESCUENTO);
                if (authAccess)
                    return true;
            }

            if (retencionAprobacion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.RETENCION_APROBACION);
                if (authAccess)
                    return true;
            }


            //COMERCIAL
            var carteraVentas = routeName.indexOf("reporteVendedores");
            var ejecutivoComercial = routeName.indexOf("ejecutivoComercial");
            var administrarFun = routeName.indexOf("administracionFunes");

            if (carteraVentas != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.DIRECTOR_VENTAS);
                if (authAccess)
                    return true;
            }

            if (carteraVentas != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.GERENTE_COMERCIAL);
                if (authAccess)
                    return true;
            }

            if (ejecutivoComercial != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.EJECUTIVO_COMERCIAL);
                if (authAccess)
                    return true;
            }


            if (administrarFun != -1) {
                var authAccess1 = this.verifyAccess(permisos, Permiso.ASIGNA_FUN);
                var authAccess2 = this.verifyAccess(permisos, Permiso.ANULA_FUN);
                var authAccess3 = this.verifyAccess(permisos, Permiso.ADMINISTRADOR_FUN);
                var authAccess4 = this.verifyAccess(permisos, Permiso.CREA_FUN);
                var authAccess5 = this.verifyAccess(permisos, Permiso.CONSULTA_FUN);
                if (authAccess1 || authAccess2 || authAccess3 || authAccess4 || authAccess5)
                    return true;
            }

            //Permisos pestañas facturacion

            var procesoFacturacion = routeName.indexOf("procesoFacturacion");

            if (procesoFacturacion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.PROCESO_FACTUARACION);
                if (authAccess)
                    return true;
            }

            var logErrores = routeName.indexOf("logErrores");

            if (logErrores != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.LOG_ERRORES);
                if (authAccess)
                    return true;
            }


            var saldosFavor = routeName.indexOf("devolucionSaldoFavor");

            if (saldosFavor != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.SALDOS_FAVOR);
                if (authAccess)
                    return true;
            }

            var notasCredito = routeName.indexOf("notasCredito");
            if (notasCredito != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.NOTAS_CREDITO);
                if (authAccess)
                    return true;
            }

            var tareasProgramadasFacturacion = routeName.indexOf("tareasProgramadasFacturacion");
            if (tareasProgramadasFacturacion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.TAREA_PROGRAMADA_NOTAS_LOTE);
                var authAccess1 = this.verifyAccess(permisos, Permiso.TAREA_PROGRAMADA_NOTAS_PCA);
                if (authAccess || authAccess1)
                    return true;
            }

            var reportesFacturacion = routeName.indexOf("reportesFacturacion");
            if (reportesFacturacion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.REPORTE_MOROSOS_POR_COBRAR);
                var authAccess2 = this.verifyAccess(permisos, Permiso.REPORTE_FACTURAS_EMITIDAS);
                var authAccess3 = this.verifyAccess(permisos, Permiso.REPORTE_CONSULTAS_PROBLEMAS);
                if (authAccess || authAccess2)
                    return true;
            }

            var facturacionCotizacion = routeName.indexOf("menuReporteCobranzas");
            if (facturacionCotizacion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.COTIZACIONES_PRINCIPAL);
                if (authAccess)
                    return true;
            }

            var procesoFacturacion = routeName.indexOf("consultaDocumentosFacturacion");
            if (procesoFacturacion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.CONSULTA_DOCS_ELECTRONICOS_DIRECTO_SRI);
                if (authAccess)
                    return true;
            }

            var descParametrizacion = routeName.indexOf("descuentoParametrizacion");
            if (descParametrizacion != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.DESCUENTO_PARAMETRO);
                if (authAccess)
                    return true;
            }

            //Recaudos SALUDPAY

            var recaudosSaludpay = routeName.indexOf("facturarCobros");
            if (recaudosSaludpay != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.REACAUDOS_SALUD_PAY);
                if (authAccess)
                    return true;
            }

            //Recaudos BOTON CAJA PICHINCHA

            var recaudosCajaPich = routeName.indexOf("botonPago");

            if (recaudosCajaPich != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.REACAUDOS_BOTON_CAJA_PICHINCHA);
                if (authAccess)
                    return true;
            }


            //Recaudos BOTON INGRESO CAJA
            var recaudosIngresoCaja = routeName.indexOf("ingresoCaja");
            if (recaudosIngresoCaja != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.INGRESO_CAJA);
                if (authAccess)
                    return true;
            }

            //Recaudos GENERACION ARCHIVOS DEBITOS INSTITUCIONES

            var reacaudosGenerarArchivosDebitosInstituciones = routeName.indexOf("genearArchivosDebitosInstituciones");

            if (reacaudosGenerarArchivosDebitosInstituciones != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.GENERAR_ARCHIVOS_DEBITOS_INSTITUCIONES);
                if (authAccess)
                    return true;
            }

            //Planes corporativo
            var consultaPlanesCorporativos = routeName.indexOf("listaCorporativo");

            if (consultaPlanesCorporativos != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.CONSULTAR_PLANES_COR);
                if (authAccess)
                    return true;
            }

            var adminPortalClientes = routeName.indexOf("portalClientes");

            if (adminPortalClientes != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.PORTAL_CLIENTES);
                if (authAccess)
                    return true;
            }

            //Cobranzas 
            var cobranzasFull = routeName.indexOf("gestionDeCobranzas");

            if (cobranzasFull != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.COBRAZAS_FULL);
                if (authAccess)
                    return true;
            }

            var menuReporteCobranzas = routeName.indexOf("menuReporteCobranzas");
            if (menuReporteCobranzas != -1) {
                var authAccess = this.verifyAccess(permisos, Permiso.REPORTE_COBRANZAS);
                if (authAccess)
                    return true;
            }


        }
        return false;
    }

    private verifyAccess(permisos: string[], permiso: string): boolean {
        var access = permisos.find(p => p == permiso);
        if (access != undefined) {
            this.tipoPermiso = permiso;
            return true;
        }
        return false;
    }

    public isAuthorizeAction(actionName: string): boolean {
        /* var authorize = false;
          let permisos = localStorage.getItem("permisos");
          if (permisos != null) {
              let result = JSON.parse(permisos);
              var permisoWebClient = result.findIndex(p => p.Tipo == 2 && p.NombreEfectivo == actionName);
              authorize = permisoWebClient != -1;
          }
          return authorize;*/
        return true;
    }

    public isAuthorizeRequest(timeout?: number): boolean {
        var isTokenRefreshing = localStorage.getItem('is_token_refreshing');
        if (isTokenRefreshing != null && isTokenRefreshing == 'true') {
            return true;
        }
        else {
            var token = localStorage.getItem('id_token');
            if (token != null) {
                if (!this.jwtHelper.isTokenExpired(token)) {
                    let expirationDateMiliseconds = this.jwtHelper.getTokenExpirationDate(token).getTime();
                    let currentDateMiliseconds = new Date().getTime();
                    if (expirationDateMiliseconds - currentDateMiliseconds <= 7200000) {
                        localStorage.setItem('is_token_refreshing', 'true');
                        this.refreshToken()
                            .subscribe(result => {
                                localStorage.removeItem('is_token_refreshing');
                            });
                        return true;
                    }
                    else
                        return true;
                }
                else {
                    this.showExpiredPopup(timeout);
                    return false;
                }
            }
            else {
                // not token in so logout
                this.logout();
                return false;
            }
        }
    }

    public showExpiredPopup(timeout?: number): void {
        var time = (timeout == undefined || timeout == null) ? 100 : timeout;
        setTimeout(() => {
            swal({
                title: 'Error',
                text: "<h3>Su sesión ha expirado</h3>",
                type: "error",
                confirmButtonColor: "#1a7bb9",
                confirmButtonText: "OK",
                closeOnConfirm: true,
                html: true
            }, () => {
                this.logout();
            }
            );
        }, time);
    }

    public getExpiredError() {
        return Observable.throw(new AuthHttpError('Token expirado'));
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        // Comentar en produccion
        console.error(error);
        return Observable.throw(error);
    }

    public transformarFecha(fechaString: string) {
        if (fechaString != undefined) {
            let fecha = fechaString.split("/");
            var fechaTrasformada = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
            return new Date(fechaTrasformada);
        }
        return undefined;
    }

    public showErrorPopup(error: any) {
        if (error == "" || error == "Token expirado") {
            this.showExpiredPopup(300);
        } else {
            setTimeout(() => {
                swal({
                    title: "",
                    text: "<h3>" + error + "</h3>",
                    html: true,
                    type: "error",
                    confirmButtonColor: "#1a7bb9",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                });
            }, 100);
        }
    }

    public showInfoPopup(ok: any) {
        setTimeout(() => {
            swal({
                title: "",
                text: "<h4>" + ok + "</h4>",
                html: true,
                type: "info",
                confirmButtonColor: "#1a7bb9",
                confirmButtonText: "OK",
                closeOnConfirm: true
            });
        }, 100);
    }

    public showSuccessPopup(ok: any) {
        setTimeout(() => {
            swal({
                title: "",
                text: "<h4>" + ok + "</h4>",
                html: true,
                type: "success",
                confirmButtonColor: "#1a7bb9",
                confirmButtonText: "OK",
                closeOnConfirm: true
            });
        }, 100);
    }

    public showBlobErrorPopup(error: any) {
        if (error._body instanceof Blob) {
            var myBlob = new Blob([error._body], { type: "application/json" });
            var myReader = new FileReader();
            var errMsg = null;
            myReader.addEventListener("loadend", function (e: any) {
                errMsg = e.srcElement.result;
                if (errMsg != undefined)
                    errMsg = JSON.parse(e.srcElement.result).Message;
                else
                    errMsg = "Ha ocurrido un error.";
                swal({
                    title: "",
                    text: "<h3>" + errMsg + "</h3>",
                    html: true,
                    type: "error",
                    confirmButtonColor: "#1a7bb9",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                });

            });
            myReader.readAsText(myBlob);
        }
    }

    public getPermisos(): string[] {
        var result: string[] = [];
        var token = localStorage.getItem('id_token');
        if (token != undefined) {
            var jwtHelper: JwtHelper = new JwtHelper();
            var decode = jwtHelper.decodeToken(token);
            if (decode.role != undefined) {
                if (decode.role instanceof Array)
                    result = decode.role;
                else
                    result.push(decode.role);
            } else {
                var roles = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                if (roles != undefined) {
                    if (roles instanceof Array)
                        result = roles;
                    else
                        result.push(roles);
                }
            }
        }
        return result;
    }
}