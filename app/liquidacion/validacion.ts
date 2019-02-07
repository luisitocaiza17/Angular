import { Autorizacion } from '../common/model/autorizacion';
import { TipoCobertura, TipoAplicacion, RegionPrestadorEmpresa, ProductoContrato } from '../common/model/autorizacion.constant';

export class Validacion {

    constructor() { }

    // VELADAS: Es true cuando el Canal es Veladas caso contrario se le coloca false
    public getNumeroObservacion(autorizacion: Autorizacion, diagnosticosPreexistencia: boolean): number {
        if (autorizacion.TipoCobertura != undefined && autorizacion.RegionPrestadorEmpresa != undefined && autorizacion.CodigoProducto != undefined) {
            var veladas = autorizacion.Canal == 'Veladas';
            if (autorizacion.TipoCobertura == TipoCobertura.HOSPITALARIA && autorizacion.TipoAplicacion == TipoAplicacion.SELECCIONE) {
                if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.COSTA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            if (!autorizacion.Garantia)
                                return !veladas ? 1 : 6;
                            else
                                return !veladas ? 2 : 7;

                        case ProductoContrato.IND:
                            if (autorizacion.Garantia) {
                                if (autorizacion.Deducible)
                                    return !veladas ? 3 : 8;
                                else
                                    return !veladas ? 4 : 9;
                            }

                        case ProductoContrato.ONC:
                            if (autorizacion.Garantia)
                                return !veladas ? 5 : 10;
                    }
                } else if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.SIERRA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            return !autorizacion.Garantia ? 41 : 42;

                        case ProductoContrato.IND:
                            if (autorizacion.Garantia)
                                return 45;

                        case ProductoContrato.ONC:
                            if (autorizacion.Garantia)
                                return 47;
                    }
                }
            } else if (autorizacion.TipoCobertura == TipoCobertura.HOSPITALARIA && autorizacion.TipoAplicacion == TipoAplicacion.MATERNIDAD) {
                if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.COSTA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            return !autorizacion.Garantia ? 11 : 12;

                        case ProductoContrato.IND:
                            if (autorizacion.Garantia)
                                return autorizacion.Deducible ? 13 : 14;
                    }
                } else if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.SIERRA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            return !autorizacion.Garantia ? 43 : 44;

                        case ProductoContrato.IND:
                            if (autorizacion.Garantia)
                                return 46;
                    }
                }
            } else if (autorizacion.TipoCobertura == TipoCobertura.HOSPITALARIA && autorizacion.TipoAplicacion == TipoAplicacion.REEMBOLSO) {
                if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.COSTA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            return !autorizacion.Garantia ? 15 : 16;

                        case ProductoContrato.IND:
                            if (autorizacion.Garantia)
                                return autorizacion.Deducible ? 17 : 18;

                        case ProductoContrato.ONC:
                            return 19;
                    }
                } else if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.SIERRA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            return 81;

                        case ProductoContrato.IND:
                            return 82;
                    }
                }
            } else if (autorizacion.TipoCobertura == TipoCobertura.AMBULATORIO && autorizacion.TipoAplicacion == TipoAplicacion.REEMBOLSO) {
                if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.COSTA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            return !autorizacion.Garantia ? 31 : 32;

                        case ProductoContrato.IND:
                            if (autorizacion.Garantia)
                                return autorizacion.Deducible ? 33 : 34;

                        case ProductoContrato.ONC:
                            return 35;
                    }
                }
            } else if (autorizacion.TipoCobertura == TipoCobertura.HOSPITALARIA && diagnosticosPreexistencia) {
                if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.SIERRA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.IND:
                        case ProductoContrato.POO:
                            return 83;
                    }
                }
            } else if (autorizacion.TipoCobertura == TipoCobertura.HOSPITAL_DIA && autorizacion.TipoAplicacion == TipoAplicacion.SELECCIONE) {
                if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.COSTA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            if (!autorizacion.Garantia)
                                return !veladas ? 21 : 26;
                            else
                                return !veladas ? 22 : 27;

                        case ProductoContrato.IND:
                            if (autorizacion.Garantia) {
                                if (autorizacion.Deducible)
                                    return !veladas ? 23 : 28;
                                else
                                    return !veladas ? 24 : 29;
                            }

                        case ProductoContrato.ONC:
                            if (autorizacion.Garantia)
                                return !veladas ? 25 : 30;
                    }
                } else if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.SIERRA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            return 61;

                        case ProductoContrato.IND:
                            if (autorizacion.Garantia)
                                return 63;

                        case ProductoContrato.ONC:
                            if (autorizacion.Garantia)
                                return 64;
                    }
                }
            } else if (autorizacion.TipoCobertura == TipoCobertura.HOSPITAL_DIA && autorizacion.TipoAplicacion == TipoAplicacion.REEMBOLSO) {
                if (autorizacion.RegionPrestadorEmpresa == RegionPrestadorEmpresa.SIERRA) {
                    switch (autorizacion.CodigoProducto) {
                        case ProductoContrato.POO:
                        case ProductoContrato.COR:
                            return 91;

                        case ProductoContrato.IND:
                            return 92;
                    }
                }
            }
        }
        return null;
    }
}