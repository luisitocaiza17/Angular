import {Rol} from './rol';


export class Usuario {

    /*    constructor(public Id ?: number,
                    public Cedula?: string,
                    public NombreApellido?: string,
                    public Email?: string,
                    public Telefono?: string,
                    public NombreUsuario ?: string,
                    public Contrasena ?: string,
                    public IdEmpresa ?: number,
                    public IdGrupo ?: number,
                    public rol?: Rol,
                    public TelefonoF?: string,
                    public Extension?: string,) {
        }*/

    constructor(public Id?: number,
                public Cedula?: string,
                public NombreApellido?: string,
                public Email?: string,
                public Telefono?: string,
                public NombreUsuario?: string,
                public Contrasena?: string,
                public IdEmpresa?: number,
                public IdGrupo?: number,
                public TelefonoFijo?: string,
                public Extension?: string,
                public RucEmpresa?: string,
                public rol?: Rol) {
    }
}
