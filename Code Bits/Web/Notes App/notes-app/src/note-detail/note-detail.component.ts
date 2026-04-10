import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NOTES } from '../notes';

@Component({
  selector: 'app-note-detail',
  standalone: true,
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.css',
  imports: [RouterModule],
})
export class NoteDetailComponent {
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  id = Number(this.activeRoute.snapshot.paramMap.get('id'));
  note = NOTES.find((i) => i.id === this.id);

  deleteNote() {
    this.router.navigateByUrl('');

    if (!this.note) return;

    let toRemoveIdx = NOTES.indexOf(this.note, 0);
    NOTES.splice(toRemoveIdx, 1);
  }
}
