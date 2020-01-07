import { Injectable } from '@angular/core';
// Para utilizar los metodos de Http get post put delete etc
import { HttpClient } from '@angular/common/http';

// Modelo de datos Usuario
import { ModeloUsuarioEdit, ModeloUsuario } from '../models/modelo';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Definimos la url de la API de PHP
  apiUrl: string = 'http://localhost/admintLte/API%20PHP/user%20php/';

  // Definimos la api para la url de perfil
  apiUrlPerfil: string = 'http://localhost/admintLte/API%20PHP/perfil%20php/';

  // Constructor de la clase.
  constructor(private http: HttpClient) {
    // console.log('ya se puede utilizar el servicio personal');
  }

  // Metodos que comunican Angular con PHP
  /**
   * listaPersonal
   */
  public listaUsuario() {
    return this.http.get(`${this.apiUrl}listarUser.php`);
  }

  /**
   * Insertar contacto metodo de comunicacion con php
   */
  public insertarUsuario(modeloUsuario: ModeloUsuario) {
    // Lo que llega de angular para php
    // console.log(modeloUsuario);
    return this.http.post(`${this.apiUrl}crearUser.php`, JSON.stringify(modeloUsuario));

  }

  /**
   * seleccionarPersonal para codigo
   */
  public selectUsuario(idUsuario: number) {

    return this.http.get(`${this.apiUrl}selectUser.php?codigo=${idUsuario}`);
  }

  /**
   * modificarPersonal
   */
  public modificarUsuario(datosUsuario: ModeloUsuarioEdit) {
    // console.log(datosUsuario);

    return this.http.post(`${this.apiUrl}modificarUser.php`, JSON.stringify(datosUsuario));

  }

  /**
   * eliminarUsuario
   */
  public eliminarUsuario(idUser: number) {
    console.log(idUser);

    return this.http.get(`${this.apiUrl}eliminarUser.php?codigo=${idUser}`);
  }

  /** lISTAR PERFIL */
  /**
   * listarPerfil
   */
  public listarPerfil() {
    return this.http.get(`${this.apiUrlPerfil}listarPerfil.php`);
  }
}
