import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Notepad } from 'src/app/core/models/notepad';
import { AlertService } from 'src/app/core/services/alert.service';
import { NotepadService } from 'src/app/core/services/notepad.service';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {
  notepad: Notepad;
  isNewForm: boolean;

  constructor(
    private route: ActivatedRoute,
    private notepadSer: NotepadService,
    private alertify: AlertService,
    private router: Router,
    private mainRepo: RepositoryService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    const path = this.route.snapshot.routeConfig.path;
    this.isNewForm = path.trim().toLowerCase() === 'new' ? true : false;
    this.notepad = new Notepad();
    if (!this.isNewForm) {
      const notepadId = this.route.snapshot.params.id;
      this.bindNotepad(notepadId);
    }
  }

  private bindNotepad(id: number): void {
    this.notepadSer.getNotepad(id)
    .subscribe((res: Notepad) => {
      if(res) {
        this.notepad = res;
        console.log(this.notepad);
      } else {
        this.router.navigate(['']);
      }
    }, error => {
      this.alertify.presentAlert('Error', error);
      this.router.navigate(['']);
    });
  }

  onSubmitBtnClicked(): void {
    if (this.isNewForm) {
      this.notepad.user = this.mainRepo.loggedInUser.id;
      this.notepadSer.createNotepad(this.notepad)
      .subscribe((res: Notepad) => {
        this.notepad = res;
        this.alertify.presentAlert('Message', 'Note saved successfully.');
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    } else {
      this.notepadSer.updateNotepad(this.notepad)
      .subscribe((res: Notepad) => {
        this.notepad = res;
        this.alertify.presentAlert('Message', 'Note updated successfully.');
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    }
  }
}
