import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Angular material
import { MaterialModule } from './material/material.module';

// Importación del sistema de rutas
import { AppRoutingModule } from './app.router';

// Servicios Comunicación http
import { HttpClientModule } from '@angular/common/http';

// Libreria para utilizar formularios
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Libreria para el manejo del toastr alertas
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { AssideComponent } from './components/shared/asside/asside.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/shared/footer/footer.component';
import { PersonalComponent } from './components/personal/personal.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ListpersonalComponent } from './components/personal/listpersonal/listpersonal.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ProductosComponent } from './components/productos/productos.component';
import { AgregarusuarioComponent } from './components/usuario/agregarusuario/agregarusuario.component';
import { LoginComponent } from './components/login/login.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { AdminComponent } from './components/admin/admin.component';
import { ListaproductosComponent } from './components/productos/listaproductos/listaproductos.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AssideComponent,
    FooterComponent,
    PersonalComponent,
    InicioComponent,
    ListpersonalComponent,
    UsuarioComponent,
    ProductosComponent,
    AgregarusuarioComponent,
    LoginComponent,
    VentasComponent,
    AdminComponent,
    ListaproductosComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
