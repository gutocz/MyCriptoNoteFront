import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FolderListItem, CreateFolderRequest, UnlockFolderRequest } from '../models/folder.model';

@Injectable({ providedIn: 'root' })
export class FoldersService {
  private readonly base = `${environment.apiUrl}/folders`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FolderListItem[]> {
    return this.http.get<FolderListItem[]>(this.base);
  }

  create(req: CreateFolderRequest): Observable<FolderListItem> {
    return this.http.post<FolderListItem>(this.base, req);
  }

  unlock(id: string, req: UnlockFolderRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/unlock`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
