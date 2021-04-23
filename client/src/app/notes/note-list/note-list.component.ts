import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notepad } from 'src/app/core/models/notepad';
import { AlertService } from 'src/app/core/services/alert.service';
import { NotepadService } from 'src/app/core/services/notepad.service';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
  notes?: Notepad[];

  constructor(
    private notesSer: NotepadService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private router: Router
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.notes = [];
    this.bindNotepadList();
  }

  private bindNotepadList(): void {
    this.notesSer.getNotepadsByUserId(this.mainRepo.loggedInUser.id)
    .subscribe((res: Notepad[]) => {
      this.notes = res;
      console.log(this.notes);
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  onCreateBtnClicked(): void {
    this.router.navigate(['/notes/new']);
  }

  onUpdateBtnClicked(id: number): void {
    this.router.navigate(['/notes/edit', id]);
  }

  onDeleteBtnClicked(id: number): void {
    this.notesSer.deleteNotepad(id)
    .subscribe((res: void) => {
      this.alertify.presentAlert('Message', 'Notepad deleted successfully.');
    }, error => {
      this.alertify.presentAlert('Error', error);
    }, () => {
      this.bindNotepadList();
    });
  }
}
