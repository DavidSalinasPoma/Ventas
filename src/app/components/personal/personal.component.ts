import { Component, OnInit } from '@angular/core';

// Inmportamos el servicio
import { PersonalService } from '../../services/personal.service';

// Modelo de datos Personal
import { ModeloPersonal } from '../../models/modelo';

// Ngx-Toastr
import { ToastrService } from 'ngx-toastr';

// Para el formulario
import { NgForm } from '@angular/forms';

// Sweetalert2
import Swal from 'sweetalert2';




@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  // Atributos de la clase
  public modelPersonal: ModeloPersonal = new ModeloPersonal();

  // Metodo constructor de la clase
  constructor(private servicioPersonal: PersonalService, private toastrServicio: ToastrService) { }

  ngOnInit() {
  }

  // Metodo agregar personal
  /**
   * agregarPersonal
   */
  public agregarPersonal(personalForm: NgForm) {
    // Este es un observable para escuchar en el servidor
    // console.log(typeof (this.modelPersonal.carnet));
    // console.log(this.modelPersonal.materno);
    this.servicioPersonal.insertarContacto(this.modelPersonal).subscribe(personalPHP => {
      if (personalPHP['resultado'] === 'OK') {
        // Mensajes de alerta
        this.toastrServicio.success('¡Con Exito..!', 'Datos insertados.');
        Swal.fire(
          'Registro',
          'El Registro ha sido Satisfactorio...',
          'success'
        );
        // llamada a la funcion limpiar formulario
        this.limpiarFormulario(personalForm);
        this.modelPersonal = new ModeloPersonal();

      } else {
        // this.toastrServicio.error(personalPHP['mensaje']);
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: `${personalPHP['mensaje']}`,
          confirmButtonText: 'De acuerdo!',
          footer: 'No se registro en la base de datos'
        });
        // this.modelPersonal = new ModeloPersonal();
      }
    });
  }
  // Metodos secundarios
  /**
   * limpiarFormulario
   */
  public limpiarFormulario(personalForm: NgForm) {
    personalForm.reset();
  }
}
