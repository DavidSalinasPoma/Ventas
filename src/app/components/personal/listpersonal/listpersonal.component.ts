import { Component, OnInit, ViewChild } from '@angular/core';

// Angular material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Servicio personal
import { PersonalService } from '../../../services/personal.service';

// Modelo personal
import { ModeloPersonal } from '../../../models/modelo';

// Sweetalert2
import Swal from 'sweetalert2';

// Ngx-Toastr
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-listpersonal',
  templateUrl: './listpersonal.component.html',
  styleUrls: ['./listpersonal.component.css']
})
export class ListpersonalComponent implements OnInit {
  // Atributos para la lista de datos
  displayedColumns: string[] = ['id_personal', 'nombres', 'ap_paterno', 'ap_materno', 'c_identidad', 'telefono', 'email', 'direccion', 'accion'];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public personal: ModeloPersonal = new ModeloPersonal();

  // Metodo constructor
  constructor(private servicioPersonal: PersonalService, private toastrServicio: ToastrService) { }

  ngOnInit() {
    this.listaPersonal();
  }

  // Filtro del dataTable de angular material
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  // Recuperando datos de PersonalComponent
  public listaPersonal() {
    this.servicioPersonal.listaPersonal().subscribe(resultPhp => {
      // Creacion de objeto dataSource
      this.dataSource = new MatTableDataSource();
      // Guardamos la lista en el Data
      this.dataSource.data = resultPhp['lista'];
      // console.log(this.dataSource.data);
      // Ordenar acendente y decendente en material
      this.dataSource.sort = this.sort;
      // Paginador de paginas en material
      this.dataSource.paginator = this.paginator;
    });
  }

  /**
   * Selecionar perfil
   */
  public seleccionarPerfil(idPerfil: number) {

    // Hacemos una selección del registro para su modificacion
    this.servicioPersonal.selectPersonal(idPerfil).subscribe(selectPersonal => {

      selectPersonal['lista'].forEach(element => {
        this.personal.idPersonal = element.id_personal;
        this.personal.nombress = element.nombres;
        this.personal.carnet = element.c_identidad;
        this.personal.paterno = element.ap_paterno;
        this.personal.materno = element.ap_materno;
        this.personal.telefono = element.telefono;
        this.personal.direccion = element.direccion;
        this.personal.email = element.email;
      });

    });
  }

  /**
   * modificarPersonal
   */
  public modificarPersonal() {
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
        this.servicioPersonal.modificarPersonal(this.personal).subscribe(editPersonal => {
          if (editPersonal['mensaje'] === 'correcto') {
            this.toastrServicio.success('El Registro se Modificó Correctamente!!');
            this.listaPersonal();
            Swal.fire(
              'Modificado',
              'El registro ha sido modificado.',
              'success'
            );
          } else {
            // this.toastrServicio.warning('Error al modificar el registro; El perfil ya Existe!!');
            this.toastrServicio.error(editPersonal['mensaje']);
          }
        });
      }
    });

  }

  /****Metodo eliminar perfil */
  // Metodo Eliminar perfil
  public borrarPersonal(idPersonal: number) {

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
        this.servicioPersonal.eliminarPersonal(idPersonal).subscribe(elimPersonal => {
          if (elimPersonal['mensaje'] === 'correcto') {
            this.toastrServicio.success('El registro se eliminó correctamente!!');
            this.listaPersonal();
            Swal.fire(
              'Eliminado',
              'El Registro ha sido Eliminado..',
              'success'
            );
          } else {
            this.toastrServicio.error('Actualmente esta registrado como usuario del sistema.',
              'El personal selecionado no se puede eliminar');
          }
        });
      }
    });
  }

  /****Fin metodo eliminar perfil */

}
