import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NotesService } from '../../core/services/notes.service';
import { FoldersService } from '../../core/services/folders.service';
import { NoteListItem } from '../../core/models/note.model';
import { FolderListItem } from '../../core/models/folder.model';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FolderCardComponent } from './components/folder-card/folder-card.component';
import { NoteCardComponent } from './components/note-card/note-card.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    DashboardHeaderComponent,
    SearchBarComponent,
    FolderCardComponent,
    NoteCardComponent,
    EmptyStateComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private notesService = inject(NotesService);
  private foldersService = inject(FoldersService);

  search = signal('');
  folders = signal<FolderListItem[]>([]);
  notes = signal<NoteListItem[]>([]);
  loading = signal(true);

  filteredNotes = computed(() => {
    const q = this.search().toLowerCase();
    const list = this.notes();
    if (!q) return list;
    return list.filter((n) => n.title.toLowerCase().includes(q));
  });

  ngOnInit(): void {
    this.foldersService.getAll().subscribe({
      next: (list) => this.folders.set(list),
      error: () => this.loading.set(false)
    });
    this.notesService.getAll().subscribe({
      next: (list) => this.notes.set(list),
      error: () => {},
      complete: () => this.loading.set(false)
    });
  }

  onSearch(value: string): void {
    this.search.set(value);
  }

  onRefresh(): void {
    this.loading.set(true);
    this.foldersService.getAll().subscribe((list) => this.folders.set(list));
    this.notesService.getAll().subscribe({
      next: (list) => this.notes.set(list),
      complete: () => this.loading.set(false)
    });
  }
}
