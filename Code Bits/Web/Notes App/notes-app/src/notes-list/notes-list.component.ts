import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NOTES } from '../notes';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css',
  imports: [RouterModule],
})
export class NotesListComponent {
  notes = NOTES;

  show(title: string) {
    alert(title);
  }
}