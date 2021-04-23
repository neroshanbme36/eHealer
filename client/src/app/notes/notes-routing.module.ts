import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoteFormComponent } from './note-form/note-form.component';
import { NoteListComponent } from './note-list/note-list.component';

const routes: Routes = [
  {
    path: '', children:[
      { path: '', redirectTo: '/notes/list', pathMatch: 'full' },
      { path: 'list', component: NoteListComponent},
      { path: 'new', component: NoteFormComponent },
      { path: 'edit/:id', component: NoteFormComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesRoutingModule {}
