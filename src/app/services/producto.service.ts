import { Injectable } from '@angular/core';
// Para utilizar los metodos de Http get post put delete etc
import { HttpClient } from '@angular/common/http';

// Modelo de datos Producto
import { ModeloProducto, ModelListaProducto } from '../models/modelo';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  // Definimos la url de la API de PHP
  apiUrl: string = 'http://localhost/admintLte/API%20PHP/producto%20php/';

  // Constructor de la clase.
  constructor(private http: HttpClient) {
    // console.log('ya se puede utilizar el servicio personal');
  }

  // Metodos que comunican Angular con PHP
  /**
   * listaProducto
   */
  public listaProducto() {
    return this.http.get(`${this.apiUrl}listaProducto.php`);
  }
  /**
   * Inserta producto en php
   */
  public insertarProducto(modeloProducto: ModeloProducto) {
    // Lo que llega de angular para php
    // console.log(modeloPersonal);
    return this.http.post(`${this.apiUrl}insertProducto.php`, JSON.stringify(modeloProducto));
  }
  /**
   * seleccionarProducto
   */
  public selectProducto(idProducto: number) {
    return this.http.get(`${this.apiUrl}selectProducto.php?codigo=${idProducto}`);
  }
  /**
   * modificarProducto
   */
  public modificarProducto(producto: ModelListaProducto) {
    // console.log(producto);
    return this.http.post(`${this.apiUrl}editProducto.php`, JSON.stringify(producto));
  }
  /**
   * eliminarProducto
   */
  public deleteProducto(idProducto: number) {
    // console.log(idProducto);
    return this.http.get(`${this.apiUrl}deleteProducto.php?codigo=${idProducto}`);
  }
}
