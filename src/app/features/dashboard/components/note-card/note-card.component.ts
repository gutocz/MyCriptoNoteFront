import { Component, input, output } from '@angular/core';
import { NoteListItem } from '../../../../core/models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss'
})
export class NoteCardComponent {
  note = input.required<NoteListItem>();
  clicked = output<void>();

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString();
  }
}
