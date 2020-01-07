import { Component, OnInit, ViewChild } from '@angular/core';

// Angular material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Sweetalert2
import Swal from 'sweetalert2';

// Ngx-Toastr
import { ToastrService } from 'ngx-toastr';

// Servicios
import { ProductoService } from '../../../services/producto.service';

// Formularios
import { FormGroup, FormControl } from '@angular/forms';

// Modelos
import { ModelListaProducto } from '../../../models/modelo';



@Component({
  selector: 'app-listaproductos',
  templateUrl: './listaproductos.component.html',
  styleUrls: ['./listaproductos.component.css']
})
export class ListaproductosComponent implements OnInit {
  // Atributos para la lista de datos
  displayedColumns: string[] = ['id_producto', 'nombre', 'cantidad', 'precio', 'descripcion', 'id_usuario_u1', 'accion'];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public producto: ModelListaProducto = new ModelListaProducto();

  // Formulario Reactivos
  public editForm: FormGroup;

  // Metodo constructor de la clase
  constructor(private servicioProducto: ProductoService, private toastrServicio: ToastrService) {
    // Inicialicacion del objeto usuarioFormulario
    this.editForm = new FormGroup({
      productoEditar: new FormControl(null),
      cantidadEditar: new FormControl(null),
      precioEditar: new FormControl(null),
      descripcionEditar: new FormControl(null)
    });
  }


  ngOnInit() {
    this.listProductos();
  }
  // Metodos de la clase.
  // Filtro del dataTable de angular material
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Recuperando datos de PersonalComponent
  public listProductos() {
    this.servicioProducto.listaProducto().subscribe(resultPhp => {
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
   * seleccionarProducto
   */
  public seleccionarProducto(idProducto: number) {

    // Hacemos una selección del registro para su modificacion
    this.servicioProducto.selectProducto(idProducto).subscribe(selectProducto => {

      selectProducto['lista'].forEach(element => {
        this.producto.idProducto = element.id_producto;
        this.producto.producto = element.nombre;
        this.producto.cantidad = element.cantidad;
        this.producto.precio = element.precio;
        this.producto.descripcion = element.descripcion;
        this.producto.idUsuario = element.id_usuario_u1;
      });
      // console.log(this.producto);
      // Mostrando en la vista lo seleccionado para editar
      this.editForm = new FormGroup({
        productoEditar: new FormControl(this.producto.producto),
        cantidadEditar: new FormControl(this.producto.cantidad),
        precioEditar: new FormControl(this.producto.precio),
        descripcionEditar: new FormControl(this.producto.descripcion)
      });
    });
  }

  /**
   * editarProducto
   */
  public editarProducto() {
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

        // llenamos los nuevos datos que se modifico al modelo
        this.producto.producto = this.editForm.get('productoEditar').value;
        this.producto.cantidad = this.editForm.get('cantidadEditar').value;
        this.producto.precio = this.editForm.get('precioEditar').value;
        this.producto.descripcion = this.editForm.get('descripcionEditar').value;

        this.servicioProducto.modificarProducto(this.producto).subscribe(editProducto => {
          if (editProducto['mensaje'] === 'correcto') {
            this.toastrServicio.success('El Registro se Modificó Correctamente!!');
            this.listProductos();
            Swal.fire(
              'Modificado',
              'El registro ha sido modificado.',
              'success'
            );
          } else {
            // this.toastrServicio.warning('Error al modificar el registro; El perfil ya Existe!!');
            this.toastrServicio.error(editProducto['mensaje']);
          }
        });

      }
    });
  }
  /**
   * deleteProducto
   */
  public deleteProducto(idProducto: number) {
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
        this.servicioProducto.deleteProducto(idProducto).subscribe(deleteProducto => {
          if (deleteProducto['mensaje'] === 'correcto') {
            this.toastrServicio.success('El registro se eliminó correctamente!!');
            this.listProductos();
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
}
