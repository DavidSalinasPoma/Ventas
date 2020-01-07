import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ModeloUsuario } from 'src/app/models/modelo';

// Servicios
import { UsuarioService } from 'src/app/services/usuario.service';

// Ngx-Toastr
import { ToastrService } from 'ngx-toastr';

// Sweetalert2
import Swal from 'sweetalert2';
import { PersonalService } from 'src/app/services/personal.service';
import { reject } from 'q';
import { resolve } from 'url';

// Declaramos variables jquery
declare let jQuery;
declare let $;

@Component({
  selector: 'app-agregarusuario',
  templateUrl: './agregarusuario.component.html',
  styleUrls: ['./agregarusuario.component.css']
})
export class AgregarusuarioComponent implements OnInit {
  // Formulario Reactivos
  public userFormulario: FormGroup;
  public usuarioAdd: ModeloUsuario = new ModeloUsuario();

  // Etiquetas para javaScript
  public perfilEtiqueta: any;

  // Recupera datos del personal
  public datosPersonal: any[] = [];
  public listaUser: any[] = [];
  public listaPerfil: any[] = [];

  // Promesas en javaScript
  public promesa: any;

  // Metodo constructor
  constructor(private servicioUsuario: UsuarioService, private toastrServicio: ToastrService, private servicioPersonal: PersonalService) {
    // Inicialicacion del objeto usuarioFormulario
    this.userFormulario = new FormGroup({
      idPersonal: new FormControl(null),
      idPerfil: new FormControl(null),
      nameUsuario: new FormControl(null),
      password: new FormControl(null)
    });
  }

  ngOnInit() {
    this.mdBootstrap();
    this.listadoPerfil();
    this.listaUsuarios();
    // this.eventListeners();
    // this.etiquetaPerfil();
  }

  // Metodos de comportamiento
  /**
   * listadoPerfil
   */
  public listadoPerfil() {
    this.servicioUsuario.listarPerfil().subscribe(listaPerfil => {
      this.listaPerfil = listaPerfil['lista'];
    });
  }

  // Recuperando datos de los usuarios no registrados aun de la Base de Datos.
  public listaUsuarios() {
    // Cargar la lista de perfil
    this.datosPersonal = [];
    // this.servicioUsuario.listarPerfil().subscribe(listaPerfilPhp => {
    //   this.datosPerfil = listaPerfilPhp['lista'];
    //   // this.datosPerfilEdit = listaPerfilPhp['lista'];
    // });
    this.servicioUsuario.listaUsuario().subscribe(resultPhp => {

      // Guarda la lista de usuarios que estan ya registrados
      this.listaUser = resultPhp['lista'];

      // Cargar lista de personal
      this.servicioPersonal.listaPersonal().subscribe(listaPersonalPhp => {
        // console.log(listaPersonalPhp['lista']);
        // console.log(this.listaUser);

        listaPersonalPhp['lista'].forEach(personal => {
          const objeto: any = {
            id_personal: personal.id_personal,
            nombres: `${personal.nombres} ${personal.ap_paterno} ${personal.ap_materno}`
          };
          this.datosPersonal.push(objeto);
        });
        const personalSelect: any[] = this.datosPersonal;

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.listaUser.length; i++) {
          // tslint:disable-next-line: prefer-for-of
          for (let j = 0; j < personalSelect.length; j++) {
            if (personalSelect[j].id_personal === this.listaUser[i].id_personal) {
              this.datosPersonal.splice(j, 1);
            }
          }
        }
      });

    });
  }

  // Metodo para insertar nuevos usuarios
  /**
   * insertarUsuario
   */
  public insertarUsuario() {
    // Recuperando datos del formulario y los guardamos en nuestro modelo
    this.usuarioAdd.personalId = this.userFormulario.get('idPersonal').value;
    this.usuarioAdd.perfilId = this.userFormulario.get('idPerfil').value;
    this.usuarioAdd.nameUser = this.userFormulario.get('nameUsuario').value;
    this.usuarioAdd.pass = this.userFormulario.get('password').value;

    // console.log(this.usuarioAdd);

    this.servicioUsuario.insertarUsuario(this.usuarioAdd).subscribe(insertUsuario => {
      if (insertUsuario['resultado'] === 'OK') {
        // Insertar nuevo registro en el data table
        // Mensajes de alerta
        this.listaUsuarios();
        Swal.fire(
          'Registro',
          'El Registro ha sido Satisfactorio...',
          'success'
        );
        this.toastrServicio.success('¡Con Exito..!', 'Datos insertados.');

        // Para rsetear el formulario
        this.borrarFormulario();

      } else {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: `${insertUsuario['mensaje']}`,
          confirmButtonText: 'De acuerdo!',
          footer: 'No se registro en la base de datos.'
        });
      }
    });

  }

  /**
   * borrarFormulario
   */
  public borrarFormulario() {
    const deleteFormulario: any = document.querySelector('#vaciarFormulario');
    deleteFormulario.reset();

    // Etiqueta 1 para agregar
    const activacion1: any = document.querySelector('.acti1');
    const activacion2: any = document.querySelector('.acti2');
    activacion1.classList.remove('active');
    activacion2.classList.remove('active');
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

  // Codigo javaScript
  // Eventos
  public eventListeners() {
    // Promesas
    // tslint:disable-next-line: no-shadowed-variable
    this.promesa = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Iniciando con el Dom
        console.log('Hola');
        // Si termina bien!
        resolve(document.addEventListener('DOMContentLoaded', this.inicioApp));
      }, 1500);
    });

    this.promesa.then(() => {
      // javaScript delegation para el select perfil
      // this.perfilEtiqueta.addEventListener('click', this.subirEtiqueta);
      console.log('Salio Bien');

    }, () => {
      console.log('Todo salió mal');
    });

    // javaScript delegation para el select perfil
    // this.perfilEtiqueta.addEventListener('click', this.subirEtiqueta);
    // console.log(this.perfilEtiqueta);


  }
  // Funciones
  public inicioApp() {
    this.perfilEtiqueta = document.querySelector('.delegation');
    console.log(this.perfilEtiqueta);
  }

  // Funcion subir la etiqueta
  public subirEtiqueta(event) {
    event.preventDefault();
    console.log('click');
  }

}
