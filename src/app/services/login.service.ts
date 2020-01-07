import { Injectable } from '@angular/core';
// Para utilizar los metodos de Http get post put delete etc
import { HttpClient } from '@angular/common/http';
// ModeloLogin
import { ModeloLogin } from '../models/modelo';



@Injectable({
  providedIn: 'root'
})
export class LoginService {


  // Definimos la url de la API de PHP
  apiUrl: string = 'http://localhost/admintLte/API%20PHP/login%20php/';

  // Constructor de la clase.
  constructor(private http: HttpClient) {
    // console.log('ya se puede utilizar el servicio personal');
  }
  // Metodos que comunican Angular con PHP
  /**
   * Insertar contacto metodo de comunicacion con php
   */
  public userLogin(modeloLogin: ModeloLogin) {
    // Lo que llega de angular para php
    console.log(modeloLogin);
    return this.http.get(`${this.apiUrl}loginUser.php?usuario=${modeloLogin.nameUser}&password=${modeloLogin.passUser}`);
  }
}
