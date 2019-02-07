import {pcRol} from './pcRol';

export class pcUsuarioRol {
    // los permisos se administran en el portal corredores
    // los termincos y condiciones se administran en otra ventana
    constructor(public Id?: number,
                public Cedula?: string,
                public NombreApellido?: string,
                public Email?: string,
                public Telefono?: string,
                public NombreUsuario?: string,
                public Contrasena?: string,
                public IdCorredor?: number,
                public IdGrupo?: number,
                public TelefonoFijo?: string,
                public Extension?: string,
                public TipoDocumento?: string,
                public RucEmpresa?: string,
                public Estado?: boolean,
                public Region?: string,
                public fechaNacimiento?:Date,
                public rol?:pcRol[]) {
    }
}

