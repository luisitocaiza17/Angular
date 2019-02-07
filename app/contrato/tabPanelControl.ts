export class TabPanelControl {

    static TAB_DASHBOARD?: string = "dashboardTab";
    static TAB_DATOS_GENERALES?: string = "detalleContratoTab";
    static TAB_BENEFICIARIOS?: string = "beneficiariosTab";

    static TAB_BENEFICIARIOS_RESUMEN?: string = "beneficiariosResumenTab";
    static TAB_BENEFICIARIOS_DETALLE?: string = "detalleBeneficiarioTab";
    static TAB_BENEFICIARIOS_RECLAMOS?: string = "beneficiariosReclamosTab";
    static TAB_BENEFICIARIOS_AUTORIZACION?: string = "autorizacionesTab";
    static TAB_BENEFICIARIOS_EXCLUSIONES?: string = "beneficiariosExclusionesTab";
    static TAB_BENEFICIARIOS_SERVICIOS_ADICIONALES?: string = "beneficiariosServiciosAdicionalesTab";
    static TAB_BENEFICIARIOS_COBERTURAS?: string = "coberturasTab";

    static TAB_COTIZACIONES?: string = "cotizacionesTab";
    static TAB_SINIESTRAL?: string = "siniestralTab";
    static TAB_PLANES?: string = "planesTab";
    static TAB_COBRANZAS?: string = "cobranzasTab";
    static TAB_MOVIMIENTOS?: string = "movimientosTab";
    static TAB_SOBRES?: string = "sobresTab";
    static TAB_CARENCIAS?: string = "carenciasTab";

    loaded: boolean;
    tabId: string;

    constructor(tabIdentifier?: string) {
        if (tabIdentifier != undefined && tabIdentifier != '')
            this.tabId = tabIdentifier;
        else
            this.tabId = TabPanelControl.TAB_DATOS_GENERALES;
        this.loaded = false;
    }

    protected isActive(tabIdentifier: string): boolean {
        return (tabIdentifier != undefined && tabIdentifier != '' && this.tabId == tabIdentifier);
    }
}