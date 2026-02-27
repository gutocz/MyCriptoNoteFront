import { Component, input, output, signal, inject, effect, untracked } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotesService } from '../../../../core/services/notes.service';
import { NoteListItem, UnlockedNote } from '../../../../core/models/note.model';
import { FolderListItem } from '../../../../core/models/folder.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

type ModalState = 'locked' | 'unlocked' | 'editing' | 'moving';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ConfirmDialogComponent],
  templateUrl: './note-modal.component.html',
  styleUrl: './note-modal.component.scss'
})
export class NoteModalComponent {
  private fb = inject(FormBuilder);
  private notesService = inject(NotesService);
  private toast = inject(ToastrService);
  private translate = inject(TranslateService);

  note = input.required<NoteListItem>();
  isOpen = input<boolean>(false);
  folders = input<FolderListItem[]>([]);
  closed = output<void>();
  updated = output<void>();
  deleted = output<void>();

  state = signal<ModalState>('locked');
  loading = signal(false);
  unlocked = signal<UnlockedNote | null>(null);
  error = signal('');
  confirmDeleteOpen = signal(false);
  deleteLoading = signal(false);
  moveLoading = signal(false);

  private currentPassword = '';

  passwordForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  editForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    content: ['', Validators.required]
  });

  moveForm = this.fb.nonNullable.group({
    folderId: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      untracked(() => {
        if (open) {
          this.state.set('locked');
          this.loading.set(false);
          this.unlocked.set(null);
          this.error.set('');
          this.currentPassword = '';
          this.passwordForm.reset();
          this.editForm.reset();
          this.moveForm.reset();
          this.confirmDeleteOpen.set(false);
          this.deleteLoading.set(false);
          this.moveLoading.set(false);
        }
      });
    });
  }

  hide(): void {
    this.closed.emit();
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const password = this.passwordForm.getRawValue().password;

    this.notesService.unlock(this.note().id, { password }).subscribe({
      next: (data) => {
        this.currentPassword = password;
        this.unlocked.set(data);
        this.state.set('unlocked');
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401 || err.status === 400) {
          this.error.set(this.translate.instant('errors.wrongPassword'));
        } else {
          this.error.set(this.translate.instant('errors.network'));
        }
      }
    });
  }

  startEditing(): void {
    const data = this.unlocked();
    if (!data) return;
    this.editForm.patchValue({ title: data.title, content: data.content });
    this.state.set('editing');
  }

  cancelEditing(): void {
    this.state.set('unlocked');
  }

  submitEdit(): void {
    if (this.editForm.invalid) return;
    this.loading.set(true);
    const { title, content } = this.editForm.getRawValue();

    this.notesService.update(this.note().id, { title, content, password: this.currentPassword }).subscribe({
      next: () => {
        this.unlocked.set({ ...this.unlocked()!, title, content });
        this.state.set('unlocked');
        this.loading.set(false);
        this.toast.success(this.translate.instant('toasts.noteUpdated'));
        this.updated.emit();
      },
      error: () => {
        this.loading.set(false);
        this.toast.error(this.translate.instant('errors.network'));
      }
    });
  }

  copyContent(): void {
    const content = this.unlocked()?.content;
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      this.toast.success(this.translate.instant('toasts.copiedToClipboard'));
    });
  }

  startMoving(): void {
    this.moveForm.reset();
    this.state.set('moving');
  }

  cancelMoving(): void {
    this.state.set('unlocked');
  }

  get availableFolders(): FolderListItem[] {
    const currentFolderId = this.note().folderId;
    return this.folders().filter((f) => f.id !== currentFolderId);
  }

  removeFromFolder(): void {
    this.moveLoading.set(true);
    this.notesService.removeFromFolder(this.note().id).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('toasts.noteRemovedFromFolder'));
        this.moveLoading.set(false);
        this.hide();
        this.updated.emit();
      },
      error: () => {
        this.moveLoading.set(false);
        this.toast.error(this.translate.instant('errors.network'));
      }
    });
  }

  submitMove(): void {
    if (this.moveForm.invalid) return;
    this.moveLoading.set(true);
    const { folderId } = this.moveForm.getRawValue();

    this.notesService.moveToFolder(this.note().id, { folderId }).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('toasts.noteMoved'));
        this.moveLoading.set(false);
        this.hide();
        this.updated.emit();
      },
      error: () => {
        this.moveLoading.set(false);
        this.toast.error(this.translate.instant('errors.network'));
      }
    });
  }

  askDelete(): void {
    this.confirmDeleteOpen.set(true);
  }

  cancelDelete(): void {
    this.confirmDeleteOpen.set(false);
  }

  confirmDelete(): void {
    this.deleteLoading.set(true);
    this.notesService.delete(this.note().id).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('toasts.noteDeleted'));
        this.confirmDeleteOpen.set(false);
        this.hide();
        this.deleted.emit();
      },
      error: () => {
        this.deleteLoading.set(false);
        this.toast.error(this.translate.instant('errors.network'));
      }
    });
  }
}
