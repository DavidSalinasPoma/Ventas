
// Para el manejo de la lista de datos
export class ModeloPersonal {
    idPersonal: number;
    nombress: string = null;
    carnet: number = null;
    paterno: string = null;
    materno: string = '';
    direccion: string = null;
    telefono: string = '';
    email: string = '';
}

// Modelo Usuario
export class ModeloUsuario {

    nameUser: string;
    pass: string;
    personalId: number;
    perfilId: number;

}

// Modelo UsuarioEdit
export class ModeloUsuarioEdit {
    nameComplete: string;
    idUsuario: number;
    idPerfil: number;
    idPersonal: number;
    nameUser: string;
    namePerfil: string;
    passUser: string;
}

// Modelo login Usuario
export class ModeloLogin {
    nameUser: string;
    passUser: string;
}

// Modelo login Usuario
export class TokenUser {
    idUser: number;
    perfilUser: string;
    nameUser: string;
}

// Modelo Producto
export class ModeloProducto {
    producto: string;
    cantidad: string;
    precio: number;
    descripcion: string;
    idUsuario: number;
}

// Lista de modelo Producto
export class ModelListaProducto {
    idProducto: number;
    producto: string;
    cantidad: string;
    precio: number;
    descripcion: string;
    idUsuario: number;
}

