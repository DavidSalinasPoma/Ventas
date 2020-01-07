import { Injectable } from '@angular/core';
// Para utilizar los metodos de Http get post put delete etc
import { HttpClient } from '@angular/common/http';

// Modelo de datos Personal
import { ModeloPersonal } from '../models/modelo';


@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  // Definimos la url de la API de PHP
  apiUrl: string = 'http://localhost/admintLte/API%20PHP/person%20php/';

  // Constructor de la clase.
  constructor(private http: HttpClient) {
    // console.log('ya se puede utilizar el servicio personal');
  }

  // Metodos que comunican Angular con PHP
  /**
   * listaPersonal
   */
  public listaPersonal() {
    return this.http.get(`${this.apiUrl}listar.php`);
  }

  /**
   * Insertar contacto metodo de comunicacion con php
   */
  public insertarContacto(modeloPersonal: ModeloPersonal) {
    // Lo que llega de angular para php
    // console.log(modeloPersonal);
    return this.http.post(`${this.apiUrl}crear.php`, JSON.stringify(modeloPersonal));
  }
  /**
   * seleccionarPersonal para codigo
   */
  public selectPersonal(idPersonal: number) {
    return this.http.get(`${this.apiUrl}select.php?codigo=${idPersonal}`);
  }


  /**
   * modificarPersonal
   */
  public modificarPersonal(datosPersonal) {
    // console.log(datosPersonal);
    return this.http.post(`${this.apiUrl}editarPersonal.php`, JSON.stringify(datosPersonal));
  }

  /**
   * eliminarPersonal
   */
  public eliminarPersonal(idPersonal: number) {
    // console.log(idPersonal);

    return this.http.get(`${this.apiUrl}eliminar.php?codigo=${idPersonal}`);
  }
}
