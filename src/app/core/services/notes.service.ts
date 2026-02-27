import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  NoteListItem,
  UnlockedNote,
  CreateNoteRequest,
  UpdateNoteRequest,
  UnlockNoteRequest,
  MoveToFolderRequest
} from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly base = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<NoteListItem[]> {
    return this.http.get<NoteListItem[]>(this.base);
  }

  create(req: CreateNoteRequest): Observable<NoteListItem> {
    return this.http.post<NoteListItem>(this.base, req);
  }

  unlock(id: string, req: UnlockNoteRequest): Observable<UnlockedNote> {
    return this.http.post<UnlockedNote>(`${this.base}/${id}/unlock`, req);
  }

  update(id: string, req: UpdateNoteRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  moveToFolder(id: string, req: MoveToFolderRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/move-to-folder`, req);
  }

  removeFromFolder(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/remove-from-folder`, {});
  }
}
