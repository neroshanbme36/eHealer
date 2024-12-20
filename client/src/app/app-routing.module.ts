import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthUserResolver } from './core/resolvers/authUser.resolver';
import { BaseComponent } from './core/components/base/base.component';
import { ContactUsFormComponent } from './shared/components/contact-us-form/contact-us-form.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule) },
  { path: 'contact_us_new', component: ContactUsFormComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '', component: BaseComponent,
    resolve : {
        authUser : AuthUserResolver
              },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
     children: [
        { path: 'home' , loadChildren: () => import('./home/home.module').then( m => m.HomePageModule) },
        { path: 'account' , loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule) },
        { path: 'echannel', loadChildren: () => import('./echannel/echannel.module').then( m => m.EchannelModule) },
        { path: 'schedules', loadChildren: () => import('./schedules/schedules.module').then( m => m.SchedulesModule)},
        { path: 'consultation_fee', loadChildren: () =>
          import('./consultation-fee/consultation-fee.module').then( m => m.ConsultationFeeModule)},
        { path: 'appointments', loadChildren: () => import('./appointments/appointments.module').then( m => m.AppointmentsModule)},
        { path: 'chats', loadChildren: () => import('./chats/chats.module').then( m => m.ChatsModule)},
        { path: 'reports', loadChildren: () => import('./reports/reports.module').then( m => m.ReportsModule)},
        { path: 'notes', loadChildren: () => import('./notes/notes.module').then( m => m.NotesModule)},
        { path: 'my_therapists', loadChildren: () => import('./my-therapists/my-therapists.module').then( m => m.MyTherapistsModule)},
        { path: 'administrations', loadChildren: () =>
          import('./administrations/administrations.module').then( m => m.AdministrationsModule)},
      ]
},
{ path: '**' , redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
