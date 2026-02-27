import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NotesService } from '../../../core/services/notes.service';
import { FoldersService } from '../../../core/services/folders.service';
import { FolderPasswordService } from '../../../core/services/folder-password.service';
import { NoteListItem } from '../../../core/models/note.model';
import { FolderListItem } from '../../../core/models/folder.model';
import { DashboardHeaderComponent } from '../components/dashboard-header/dashboard-header.component';

@Component({
  selector: 'app-folder-view',
  standalone: true,
  imports: [RouterLink, TranslateModule, DashboardHeaderComponent],
  templateUrl: './folder-view.component.html',
  styleUrl: './folder-view.component.scss'
})
export class FolderViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private notesService = inject(NotesService);
  private foldersService = inject(FoldersService);
  private folderPassword = inject(FolderPasswordService);

  folder = signal<FolderListItem | null>(null);
  notes = signal<NoteListItem[]>([]);
  folderId = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.folderId = id;
    this.foldersService.getAll().subscribe((list) => {
      const f = list.find((x) => x.id === id);
      this.folder.set(f ?? null);
    });
    this.notesService.getAll().subscribe((list) => {
      this.notes.set(list.filter((n) => n.folderId === id));
    });
  }
}
