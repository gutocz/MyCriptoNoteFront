import { Component, input, output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FolderListItem } from '../../../../core/models/folder.model';

@Component({
  selector: 'app-folder-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './folder-card.component.html',
  styleUrl: './folder-card.component.scss'
})
export class FolderCardComponent {
  folder = input.required<FolderListItem>();
  refresh = output<void>();

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString();
  }
}
