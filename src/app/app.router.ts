import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importar componentes para el sistemma de rutas
import { PersonalComponent } from './components/personal/personal.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ListpersonalComponent } from './components/personal/listpersonal/listpersonal.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ProductosComponent } from './components/productos/productos.component';
import { AgregarusuarioComponent } from './components/usuario/agregarusuario/agregarusuario.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { ListaproductosComponent } from './components/productos/listaproductos/listaproductos.component';




const ROUTES: Routes = [
    { path: 'components/personal', component: PersonalComponent },
    { path: 'components/usuario', component: UsuarioComponent },
    { path: 'components/inicio', component: InicioComponent },
    { path: 'components/productos', component: ProductosComponent },
    { path: 'components/agregarusuario', component: AgregarusuarioComponent },
    { path: 'components/personal/listpersonal', component: ListpersonalComponent },
    { path: 'components/login', component: LoginComponent },
    { path: 'components/admin', component: AdminComponent },
    { path: 'components/productos/listaproductos', component: ListaproductosComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'components/inicio' }
];

@NgModule({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
