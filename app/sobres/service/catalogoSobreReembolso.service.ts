import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable, BehaviorSubject } from 'rxjs';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { Catalogo } from '../../common/model/catalogo';
import { TipoCoberturaEntity } from '../model/TipoCoberturaEntity';
import { TipoDevolucionEntity } from '../model/TipoDevolucionEntity';
import { Region } from '../../common/model/region';
import { MotivoDevolucionEntity } from '../model/MotivoDevolucionEntity';
import { ClasulaEntity } from '../model/ClausulaEntity';

@Injectable()
export class CatalogoSobreReembolsoService extends PaginationService {

    private catalogoSobresUrl = 'catalogoSobres';


    public establecimientos = new BehaviorSubject<Catalogo[]>(new Array);
    selectEstablecimientos$: Observable<Catalogo[]> = this.establecimientos.asObservable();

    public tiposCobertura = new BehaviorSubject<TipoCoberturaEntity[]>(new Array);
    selectTiposCobertura$: Observable<TipoCoberturaEntity[]> = this.tiposCobertura.asObservable();

    public tiposDevolucion = new BehaviorSubject<TipoDevolucionEntity[]>(new Array);
    selecttiposDevolucion$: Observable<TipoDevolucionEntity[]> = this.tiposDevolucion.asObservable();

    public tiposCarta = new BehaviorSubject<Catalogo[]>(new Array);
    selecttiposCarta$: Observable<Catalogo[]> = this.tiposCarta.asObservable();

    public regiones = new BehaviorSubject<Region[]>(new Array);
    selectRegiones$: Observable<Region[]> = this.regiones.asObservable();

    public motivosDevolucion = new BehaviorSubject<MotivoDevolucionEntity[]>(new Array);
    selectMotivosDevolucion$: Observable<MotivoDevolucionEntity[]> = this.motivosDevolucion.asObservable();

    public motivosNegativa = new BehaviorSubject<MotivoDevolucionEntity[]>(new Array);
    selectMotivosNegativa$: Observable<MotivoDevolucionEntity[]> = this.motivosNegativa.asObservable();

    public clausulas = new BehaviorSubject<ClasulaEntity[]>(new Array);
    selectClausulas$: Observable<ClasulaEntity[]> = this.clausulas.asObservable();

    public novedad = new BehaviorSubject<Catalogo[]>(new Array);
    selectNovedad$: Observable<Catalogo[]> = this.novedad.asObservable();

    public estados = new BehaviorSubject<Catalogo[]>(new Array);
    selectEstados$: Observable<Catalogo[]> = this.estados.asObservable();

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.catalogoSobresUrl = constantService.API_ENDPOINT + this.catalogoSobresUrl;
    }

    obtenerEstablecimientos(): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerEstablecimientos", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerEstadosSobre(tipoDocumento: number): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerEstadosSobre/" + tipoDocumento, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerRegiones(): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerRegionesSobre", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerConsultores(): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerConsultores", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerTiposDeCobertura(): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerTiposDeCobertura", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerTiposDeDevolucion(): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerTiposDeDevolucion", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerTiposCarta(): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerTiposCarta", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerMotivosDevolucion(tipoCarta: number): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerMotivosDevolucion/" + tipoCarta, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerNovedades(): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerNovedades", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerClausula(): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerClausula", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerAuditoresLiquidadoresCredito(): Observable<any> {
        return this.authHttp.get(this.catalogoSobresUrl + "/ObtenerAuditoresLiquidadoresCredito", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }


    setTiposCobertura(tiposCobertura: TipoCoberturaEntity[]) {
        this.tiposCobertura.next(tiposCobertura);
    }

    setTiposDevolucion(tiposDevolucion: TipoDevolucionEntity[]) {
        this.tiposDevolucion.next(tiposDevolucion);
    }

    setTiposCarta(tiposCarta: Catalogo[]) {
        this.tiposCarta.next(tiposCarta);
    }

    setRegiones(regiones: Region[]) {
        this.regiones.next(regiones);
    }

    setEstablecimientos(establecimientos: Catalogo[]) {
        this.establecimientos.next(establecimientos);
    }

    setMotivosDevolucion(motivosDevolucion: MotivoDevolucionEntity[]) {
        this.motivosDevolucion.next(motivosDevolucion);
    }

    setMotivosNegativa(motivosNegativa: MotivoDevolucionEntity[]) {
        this.motivosNegativa.next(motivosNegativa);
    }

    setClausulas(clausulas: ClasulaEntity[]) {
        this.clausulas.next(clausulas);
    }

    setNovedad(novedad: Catalogo[]) {
        this.novedad.next(novedad);
    }

    setEstados(estados: Catalogo[]) {
        this.estados.next(estados);
    }


}