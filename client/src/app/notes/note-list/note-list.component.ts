import { Component, OnInit } from '@angular/core';
import { Notepad } from 'src/app/core/models/notepad';
import { NotepadService } from 'src/app/core/services/notepad.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
  notes?: Notepad[];

  constructor(
    private notesSer: NotepadService,
  ) { }

  ngOnInit() {
    this.notes = [];
  }

}
