import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Angular material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Modelos
import { ModeloProducto } from '../../models/modelo';

// Servicios
import { ProductoService } from '../../services/producto.service';
import { UsuarioService } from '../../services/usuario.service';

// Ngx-Toastr
import { ToastrService } from 'ngx-toastr';

// Sweetalert2
import Swal from 'sweetalert2';


// Declaramos variables jquery
declare let jQuery;
declare let $;

export interface User {
  name: string;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  // Formulario Reactivos
  public formulario: FormGroup;

  // Instancia de un modelo
  public addProducto: ModeloProducto = new ModeloProducto();

  // metodo constructor
  constructor(private servicioUsuario: UsuarioService, private servicioProducto: ProductoService, private toastrServicio: ToastrService) {
    // Inicialicacion del objeto usuarioFormulario
    this.formulario = new FormGroup({
      producto: new FormControl(null),
      cantidad: new FormControl(null),
      precio: new FormControl(null),
      descripcion: new FormControl(null)
    });
  }
  ngOnInit() {
    this.mdBootstrap();
  }

  // Metodos de comportamiento de la clase
  /**
   * insertarProducto
   */
  public insertarProducto() {
    // Recuperando datos del formulario y los guardamos en nuestro modelo
    // Validando entradas en minuscula
    if (this.formulario.get('producto').value != null) {
      this.addProducto.producto = (this.formulario.get('producto').value).toLowerCase();
    } else {
      this.addProducto.producto = this.formulario.get('producto').value;
    }
    this.addProducto.cantidad = this.formulario.get('cantidad').value;
    this.addProducto.precio = this.formulario.get('precio').value;
    this.addProducto.descripcion = this.formulario.get('descripcion').value;
    this.addProducto.idUsuario = 177;
    console.log(this.addProducto);

    // Insertando datos mediante nustro servicio
    this.servicioProducto.insertarProducto(this.addProducto).subscribe(phpProducto => {
      if (phpProducto['resultado'] === 'OK') {
        // Mensajes de alerta
        this.toastrServicio.success('¡Con Exito..!', 'Datos insertados.');
        Swal.fire(
          'Registro',
          'El Registro ha sido Satisfactorio...',
          'success'
        );
        // llamada a la funcion limpiar formulario
        this.borrarFormulario();
        // this.addProducto = new ModeloProducto();
      } else {
        // this.toastrServicio.error(personalPHP['mensaje']);
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: `${phpProducto['mensaje']}`,
          confirmButtonText: 'De acuerdo!',
          footer: 'No se registro en la base de datos'
        });
        // this.modelPersonal = new ModeloPersonal();
      }
    });

  }

  /**
   * borrarFormulario
   */
  public borrarFormulario() {
    const deleteFormulario: any = document.querySelector('#formularioProducto');
    deleteFormulario.reset();
  }
  // MD bootstrap
  /**
   * mdBootstrap
   */
  public mdBootstrap() {
    // Material Select Initialization
    $(document).ready(() => {
      $('.mdb-select').materialSelect();
    });
  }
}
