export class UsuarioAdmin {
    constructor(
        public IdUsuario?: number,
        public NombreUsuario?: string,
        public NombreCompleto?: string
    ) { }
}

export class UsuarioAdminKey {
    constructor(
        public IdUsuario?: number,
        public NombreUsuario?: string,
        public NombreCompleto?: string,
        public NewKey?: boolean,
        public unsuscribe?: boolean
    ) { 
        this.NewKey = true;
    }
}

export class RolAdmin {
    constructor(
        public IdRol?: number,
        public NombreRol?: string
    ) { }
}

export class RolAdminKey {
    constructor(
        public IdRol?: number,
        public NombreRol?: string,
        public NewKey?: boolean,
        public unsuscribe?: boolean
    ) { 
        this.NewKey = true;
    }
}

export class UsuarioRolAdmin {
    constructor(
        public IdRol?: number,
        public IdUsuario?: number
    ) { }
}

export class FuncionalidadRolAdmin {
    constructor(
        public IdRol?: number,
        public IdFuncionalidad?: number
    ) { }
}

export class FuncionalidadAdmin {
    constructor(
        public IdFuncionalidad?: number,
        public NombreFuncionalidad?: string,
        public Nemonico?: string
    ) { }

}

export class UsuarioByNombreRol {
    constructor(
        public NombreUsuario?: string
    ) { }
}