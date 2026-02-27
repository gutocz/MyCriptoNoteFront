import { Component, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotesService } from '../../core/services/notes.service';
import { FoldersService } from '../../core/services/folders.service';
import { NoteListItem } from '../../core/models/note.model';
import { FolderListItem } from '../../core/models/folder.model';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FolderCardComponent } from './components/folder-card/folder-card.component';
import { NoteCardComponent } from './components/note-card/note-card.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { CreateModalComponent } from './components/create-modal/create-modal.component';
import { NoteModalComponent } from './components/note-modal/note-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslateModule,
    DashboardHeaderComponent,
    SearchBarComponent,
    FolderCardComponent,
    NoteCardComponent,
    EmptyStateComponent,
    CreateModalComponent,
    NoteModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private notesService = inject(NotesService);
  private foldersService = inject(FoldersService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  search = signal('');
  folders = signal<FolderListItem[]>([]);
  notes = signal<NoteListItem[]>([]);
  loading = signal(true);
  createModalOpen = signal(false);
  createModalType = signal<'folder' | 'note'>('note');
  fabOpen = signal(false);

  selectedNote = signal<NoteListItem | null>(null);
  noteModalOpen = signal(false);

  folderPasswordOpen = signal(false);
  folderPasswordLoading = signal(false);
  folderPasswordError = signal('');
  selectedFolder = signal<FolderListItem | null>(null);
  folderPasswordForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  filteredNotes = computed(() => {
    const q = this.search().toLowerCase();
    const list = this.notes();
    if (!q) return list;
    return list.filter((n) => n.title.toLowerCase().includes(q));
  });

  filteredFolders = computed(() => {
    const q = this.search().toLowerCase();
    const list = this.folders();
    if (!q) return list;
    return list.filter((f) => f.name.toLowerCase().includes(q));
  });

  ngOnInit(): void {
    this.loadData();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.fabOpen.set(false);
  }

  loadData(): void {
    this.loading.set(true);
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
    this.loadData();
  }

  toggleFab(event: Event): void {
    event.stopPropagation();
    this.fabOpen.update((v) => !v);
  }

  openCreateModal(type: 'folder' | 'note'): void {
    this.fabOpen.set(false);
    this.createModalType.set(type);
    this.createModalOpen.set(true);
  }

  openNoteModal(note: NoteListItem): void {
    this.selectedNote.set(note);
    this.noteModalOpen.set(true);
  }

  closeNoteModal(): void {
    this.noteModalOpen.set(false);
    this.selectedNote.set(null);
  }

  onFolderClick(folder: FolderListItem): void {
    this.selectedFolder.set(folder);
    this.folderPasswordForm.reset();
    this.folderPasswordError.set('');
    this.folderPasswordLoading.set(false);
    this.folderPasswordOpen.set(true);
  }

  closeFolderPassword(): void {
    this.folderPasswordOpen.set(false);
    this.selectedFolder.set(null);
  }

  submitFolderPassword(): void {
    if (this.folderPasswordForm.invalid) return;
    const folder = this.selectedFolder();
    if (!folder) return;

    this.folderPasswordLoading.set(true);
    this.folderPasswordError.set('');
    const password = this.folderPasswordForm.getRawValue().password;

    this.foldersService.unlock(folder.id, { password }).subscribe({
      next: () => {
        this.folderPasswordOpen.set(false);
        this.router.navigate(['/notes/folder', folder.id]);
      },
      error: (err) => {
        this.folderPasswordLoading.set(false);
        if (err.status === 401 || err.status === 400) {
          this.folderPasswordError.set(this.translate.instant('errors.wrongPassword'));
        } else {
          this.folderPasswordError.set(this.translate.instant('errors.network'));
        }
      }
    });
  }
}
