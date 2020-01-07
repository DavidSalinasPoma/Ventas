import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Angular material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Servicio personal
import { PersonalService } from '../../services/personal.service';
import { UsuarioService } from 'src/app/services/usuario.service';

// Modelo personal y usuario
import { ModeloPersonal, ModeloUsuario, ModeloUsuarioEdit } from '../../models/modelo';

// Sweetalert2
import Swal from 'sweetalert2';

// Ngx-Toastr
import { ToastrService } from 'ngx-toastr';

// Declaramos variables jquery
declare let jQuery;
declare let $;

export interface User {
  name: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  // Atributos para la lista de datos
  // DataTablet Angular poner igual a la base de datos
  displayedColumns: string[] = ['id_usuario', 'nom_usuario', 'contraseña', 'nombres', 'ap_paterno', 'ap_materno', 'perfil', 'accion'];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // Inicializando objetos
  public personal: ModeloPersonal = new ModeloPersonal();
  public usuario: ModeloUsuario = new ModeloUsuario();
  public usuarioEdit: ModeloUsuarioEdit = new ModeloUsuarioEdit();

  // Guarda los datos de la lista del perfil y personal
  public datosPerfil: [] = [];
  public datosPersonal: any[] = [];
  public listaUser: any[] = [];
  public datosPerfilEdit: [] = [];

  // Formulario Reactivos
  public usuarioFormulario: FormGroup;
  public usuarioEditar: FormGroup;

  // Atributos para el autocompletar
  myControl = new FormControl();
  options: User[] = [];
  filteredOptions: Observable<User[]>;

  constructor(private servicioUsuario: UsuarioService, private servicioPersonal: PersonalService, private toastrServicio: ToastrService) {
    // Inicialicacion del objeto usuarioFormulario
    this.usuarioFormulario = new FormGroup({
      idPersonal: new FormControl(null),
      idPerfil: new FormControl(null),
      nameUsuario: new FormControl(null),
      password: new FormControl(null)
    });
    // Inicializar edicion de usuario
    this.usuarioEditar = new FormGroup({
      idPersonalEdit: new FormControl(null),
      idPerfilEdit: new FormControl(null),
      nameUsuarioEdit: new FormControl(null),
      passwordEdit: new FormControl(null)
    });
  }

  ngOnInit() {
    this.mdBootstrap();
    this.listaPerfil1();
    this.listaUsuarios();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  // Filtro del dataTable de angular material
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /**
   * listaPerfil
   */
  public listaPerfil() {
    this.servicioUsuario.listarPerfil().subscribe(listaPerfilPhp => {
      // this.datosPerfil = listaPerfilPhp['lista'];
      this.datosPerfilEdit = listaPerfilPhp['lista'];
      // console.log(this.datosPerfilEdit);
    });
  }

  /**
   * listaPerfil1
   */
  public listaPerfil1() {
    this.servicioUsuario.listarPerfil().subscribe(listaPerfilPhp => {
      this.datosPerfil = listaPerfilPhp['lista'];
      // this.datosPerfilEdit = listaPerfilPhp['lista'];
      // console.log(this.datosPerfilEdit);
    });
  }
  // Recuperando datos de Usuarios de la Base de Datoss
  public listaUsuarios() {
    // Cargar la lista de perfil
    this.datosPersonal = [];
    // this.servicioUsuario.listarPerfil().subscribe(listaPerfilPhp => {
    //   this.datosPerfil = listaPerfilPhp['lista'];
    //   // this.datosPerfilEdit = listaPerfilPhp['lista'];
    // });
    this.servicioUsuario.listaUsuario().subscribe(resultPhp => {
      // Creacion de objeto dataSource
      this.dataSource = new MatTableDataSource();
      // Guardamos la lista en el Data
      this.dataSource.data = resultPhp['lista'];
      this.listaUser = resultPhp['lista'];

      // Ordenar acendente y decendente en material
      this.dataSource.sort = this.sort;
      // Paginador de paginas en material
      this.dataSource.paginator = this.paginator;

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
        // this.listaPerfil();
        // this.listaPerfil1();
      });

    });
  }

  /**
   * Insertar Usuario en la base de datos
   */
  public insertarUsuario(borrarUsuario: NgForm) {
    this.usuario.personalId = this.usuarioFormulario.get('idPersonal').value;
    this.usuario.perfilId = this.usuarioFormulario.get('idPerfil').value;
    this.usuario.nameUser = this.usuarioFormulario.get('nameUsuario').value;
    this.usuario.pass = this.usuarioFormulario.get('password').value;

    console.log(this.usuario);

    this.servicioUsuario.insertarUsuario(this.usuario).subscribe(resultPhp => {
      if (resultPhp['resultado'] === 'OK') {
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
          text: `${resultPhp['mensaje']}`,
          confirmButtonText: 'De acuerdo!',
          footer: 'No se registro en la base de datos.'
        });
      }
    });
  }

  /**
   * Selecionar perfil
   */
  public seleccionarUsuario(idUsuario: number) {

    // Hacemos una selección del registro para su modificacion
    this.servicioUsuario.selectUsuario(idUsuario).subscribe(selectUsuario => {

      // devuelve una sola fila
      selectUsuario['lista'].forEach(listUser => {
        this.usuarioEdit.nameComplete = `${listUser.nombres} ${listUser.ap_paterno} ${listUser.ap_materno}`;
        this.usuarioEdit.idPerfil = listUser.id_perfil;
        this.usuarioEdit.idPersonal = listUser.id_personal;
        this.usuarioEdit.idUsuario = listUser.id_usuario;
        this.usuarioEdit.nameUser = listUser.nom_usuario;
        this.usuarioEdit.namePerfil = listUser.perfil;
        this.usuarioEdit.passUser = listUser.contrasenia;
      });
      // Mostrando en la vista lo seleccionado para editar
      this.usuarioEditar = new FormGroup({
        idPersonalEdit: new FormControl({ value: this.usuarioEdit.nameComplete, disabled: true }),
        idPerfilEdit: new FormControl(this.usuarioEdit.namePerfil),
        nameUsuarioEdit: new FormControl(this.usuarioEdit.nameUser),
        passwordEdit: new FormControl(this.usuarioEdit.passUser)
      });
      //  Scripting para el perfil
      (document.querySelector('.ingreso input') as HTMLInputElement).value = this.usuarioEdit.namePerfil;
      const etiqueta2 = document.querySelector('.active2');
      etiqueta2.classList.add('active');
    });
  }

  /**
   * modificarPersonal
   */
  public modificarUsuario() {
    // SweetAlert
    Swal.fire({
      title: 'Estás seguro de modificar?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, Modificar!'
    }).then((result) => {
      // Aqui se cancela la modificcion
      if (result.value) {

        let perfilUser: any;
        // llenamos los nuevos datos que se modifico al modelo
        perfilUser = this.usuarioEditar.get('idPerfilEdit').value;

        if (perfilUser === this.usuarioEdit.namePerfil) {
          // Foreach para encontrar el id del perfil seleccionado
          this.datosPerfil.forEach((element: any) => {
            if (perfilUser === element.perfil) {
              perfilUser = element.id_perfil;
            }
          });
        }
        this.usuarioEdit.idPerfil = perfilUser;
        this.usuarioEdit.nameUser = this.usuarioEditar.get('nameUsuarioEdit').value;
        this.usuarioEdit.passUser = this.usuarioEditar.get('passwordEdit').value;

        this.servicioUsuario.modificarUsuario(this.usuarioEdit).subscribe(editUser => {
          if (editUser['mensaje'] === 'correcto') {
            this.toastrServicio.success('El Registro se Modificó Correctamente!!');
            this.listaUsuarios();
            Swal.fire(
              'Modificado',
              'El registro ha sido modificado.',
              'success'
            );
          } else {
            // this.toastrServicio.warning('Error al modificar el registro; El perfil ya Existe!!');
            this.toastrServicio.error(editUser['mensaje']);
          }
        });

      }
    });

  }

  /**
   * borrarUsuario
   */
  public borrarUsuario(idUsuario: number) {

    Swal.fire({
      title: 'Está Seguro de Eliminar?',
      text: 'No se podra revertir esto!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {

      if (result.value) {
        this.servicioUsuario.eliminarUsuario(idUsuario).subscribe(deleteUser => {
          if (deleteUser['mensaje'] === 'correcto') {
            this.toastrServicio.success('El registro se eliminó correctamente!!');
            this.listaUsuarios();
            Swal.fire(
              'Eliminado',
              'El Registro ha sido Eliminado..',
              'success'
            );
          } else {
            this.toastrServicio.error('Actualmente el usuario tiene procesos en el sistema',
              'El usuario selecionado no se puede eliminar');
          }
        });
      }
    });
  }

  // Componentes para el autocompletado
  public displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) > -1);
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

  // JavaScript
  /**
   * Borrar Formulario
   */
  public borrarFormulario() {
    const formularioAgregar: any = document.querySelector('#myFormAgregar');
    const formularioEdit: any = document.querySelector('#myFormEdit');

    formularioEdit.reset();
    formularioAgregar.reset();
    this.usuario = new ModeloUsuario();

    // Etiqueta 1 para agregar
    const activacion1: any = document.querySelector('.activacion1');
    const activacion2: any = document.querySelector('.activacion2');
    activacion1.classList.remove('active');
    activacion2.classList.remove('active');

    // Etiqueta 1 para editar
    const active1: any = document.querySelector('.active1');
    const active2: any = document.querySelector('.active2');
    activacion1.classList.remove('active');
    activacion2.classList.remove('active');
  }
}
