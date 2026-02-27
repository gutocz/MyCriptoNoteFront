import { Component, input, output, signal, inject, effect, untracked } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotesService } from '../../../../core/services/notes.service';
import { FoldersService } from '../../../../core/services/folders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './create-modal.component.html',
  styleUrl: './create-modal.component.scss'
})
export class CreateModalComponent {
  private fb = inject(FormBuilder);
  private notesService = inject(NotesService);
  private foldersService = inject(FoldersService);
  private toast = inject(ToastrService);
  private translate = inject(TranslateService);

  type = input<'folder' | 'note'>('note');
  isOpen = input<boolean>(false);
  closed = output<void>();
  created = output<void>();

  loading = signal(false);

  constructor() {
    effect(() => {
      const open = this.isOpen();
      untracked(() => {
        if (open) {
          this.folderForm.reset();
          this.noteForm.reset();
          this.loading.set(false);
        }
      });
    });
  }

  folderForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  noteForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    content: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  hide(): void {
    this.closed.emit();
  }

  submitFolder(): void {
    if (this.folderForm.invalid) return;
    this.loading.set(true);
    this.foldersService.create(this.folderForm.getRawValue()).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('toasts.folderCreated'));
        this.hide();
        this.created.emit();
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false)
    });
  }

  submitNote(): void {
    if (this.noteForm.invalid) return;
    this.loading.set(true);
    this.notesService.create(this.noteForm.getRawValue()).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('toasts.noteCreated'));
        this.hide();
        this.created.emit();
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false)
    });
  }
}
