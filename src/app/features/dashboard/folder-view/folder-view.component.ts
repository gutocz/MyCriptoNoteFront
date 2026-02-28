import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NotesService } from '../../../core/services/notes.service';
import { FoldersService } from '../../../core/services/folders.service';
import { NoteListItem } from '../../../core/models/note.model';
import { FolderListItem } from '../../../core/models/folder.model';
import { DashboardHeaderComponent } from '../components/dashboard-header/dashboard-header.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { NoteCardComponent } from '../components/note-card/note-card.component';
import { NoteModalComponent } from '../components/note-modal/note-modal.component';
import { CreateModalComponent } from '../components/create-modal/create-modal.component';

@Component({
  selector: 'app-folder-view',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    DashboardHeaderComponent,
    SearchBarComponent,
    NoteCardComponent,
    NoteModalComponent,
    CreateModalComponent
  ],
  templateUrl: './folder-view.component.html',
  styleUrl: './folder-view.component.scss'
})
export class FolderViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notesService = inject(NotesService);
  private foldersService = inject(FoldersService);

  folder = signal<FolderListItem | null>(null);
  folders = signal<FolderListItem[]>([]);
  notes = signal<NoteListItem[]>([]);
  search = signal('');
  folderId = '';

  filteredNotes = computed(() => {
    const q = this.search().toLowerCase();
    const list = this.notes();
    if (!q) return list;
    return list.filter((n) => n.title.toLowerCase().includes(q));
  });

  selectedNote = signal<NoteListItem | null>(null);
  noteModalOpen = signal(false);

  createOpen = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/notes']);
      return;
    }
    this.folderId = id;
    this.loadData();
  }

  private loadData(): void {
    this.foldersService.getAll().subscribe((list) => {
      this.folders.set(list);
      const f = list.find((x) => x.id === this.folderId);
      this.folder.set(f ?? null);
    });
    this.notesService.getAll().subscribe((list) => {
      this.notes.set(list.filter((n) => n.folderId === this.folderId));
    });
  }

  openNote(note: NoteListItem): void {
    this.selectedNote.set(note);
    this.noteModalOpen.set(true);
  }

  closeNoteModal(): void {
    this.noteModalOpen.set(false);
    this.selectedNote.set(null);
  }

  onRefresh(): void {
    this.loadData();
  }

  onSearch(value: string): void {
    this.search.set(value);
  }

  openCreateNote(): void {
    this.createOpen.set(true);
  }

  closeCreateNote(): void {
    this.createOpen.set(false);
  }

  onNoteCreated(): void {
    this.createOpen.set(false);
    this.loadData();
  }
}
