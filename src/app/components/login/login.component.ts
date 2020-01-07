import { Component, OnInit } from '@angular/core';
// Formulario reactivo
import { FormControl, FormGroup, NgForm } from '@angular/forms';

// Modelo login
import { ModeloLogin, TokenUser } from 'src/app/models/modelo';

// Servicios
import { LoginService } from '../../services/login.service';

// Sweetalert2
import Swal from 'sweetalert2';

// Para rutas en angular
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Formulario Reactivos
  public loginFormulario: FormGroup;

  public loginUser: ModeloLogin = new ModeloLogin();
  public tokenUser: TokenUser = new TokenUser();

  // Metodo constructor
  constructor(private servicioLogin: LoginService, private router: Router) {
    // Inicialicacion del objeto usuarioFormulario
    this.loginFormulario = new FormGroup({
      nameUser: new FormControl(null),
      passUser: new FormControl(null)
    });
  }

  ngOnInit() {
  }

  // Metodos de la clase
  /**
   * altaUsuario
   */
  public altaUsuario() {
    // Recuperando datos del formulario y los guardamos en nuestro modelo
    this.loginUser.nameUser = this.loginFormulario.get('nameUser').value;
    this.loginUser.passUser = this.loginFormulario.get('passUser').value;
    console.log(this.loginUser);
    this.servicioLogin.userLogin(this.loginUser).subscribe(datosUser => {
      if (datosUser['mensaje'] === 'ok') {

        this.tokenUser.idUser = datosUser['lista'];
        this.tokenUser.nameUser = datosUser['usuario'];
        this.tokenUser.perfilUser = datosUser['perfil'];

        console.log(this.tokenUser);

        // Mensajes de alerta
        Swal.fire(
          'Login Correcto!!',
          `Bienvenid@ ${datosUser['usuario']}`,
          'success'
        );
        // Para pasar de una pagina a otra
        /*setTimeout(() => {
          console.log('holas');
          this.router.navigateByUrl('app/components/admin').then((e) => {
            if (e) {
              console.log('Navigation is successful!');
            } else {
              console.log('Navigation has failed!');
            }
          });

        }, 2000);*/
      } else {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: `${datosUser['mensaje']}`,
          confirmButtonText: 'Aceptar',
          footer: 'Ingrese su usuario y contraseña correctos!!'
        });
      }
    });

  }

}
