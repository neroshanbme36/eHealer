import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { BaseComponent } from './shared/components/base/base.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: BaseComponent,
    // resolve : {
    //             authCustomer : AuthCustomerResolver
    //           },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
     children: [
        { path: 'home' , loadChildren: () => import('./home/home.module').then( m => m.HomePageModule) }
      ]
},
{ path: '**' , redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
