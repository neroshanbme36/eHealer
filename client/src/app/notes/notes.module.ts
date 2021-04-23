import { NgModule } from '@angular/core';
import { NotesRoutingModule } from './notes-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteFormComponent } from './note-form/note-form.component';

@NgModule({
  imports: [
    SharedModule,
    NotesRoutingModule
  ],
  declarations: [
    NoteListComponent,
    NoteFormComponent
  ]
})
export class NotesModule {}
