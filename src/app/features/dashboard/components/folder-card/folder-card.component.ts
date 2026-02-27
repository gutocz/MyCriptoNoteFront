import { Component, input, output } from '@angular/core';
import { FolderListItem } from '../../../../core/models/folder.model';

@Component({
  selector: 'app-folder-card',
  standalone: true,
  imports: [],
  templateUrl: './folder-card.component.html',
  styleUrl: './folder-card.component.scss'
})
export class FolderCardComponent {
  folder = input.required<FolderListItem>();
  refresh = output<void>();
  openFolder = output<void>();

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString();
  }
}
