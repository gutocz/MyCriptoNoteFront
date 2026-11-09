import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { FolderGrantsService } from './folder-grants.service';
import { environment } from '../../../environments/environment';
import { FolderListItem, CreateFolderRequest, UnlockFolderRequest } from '../models/folder.model';

@Injectable({ providedIn: 'root' })
export class FoldersService {
  private readonly base = `${environment.apiUrl}/folders`;

  constructor(private http: HttpClient, private grants: FolderGrantsService) {}

  getAll(): Observable<FolderListItem[]> {
    return this.http.get<FolderListItem[]>(this.base);
  }

  create(req: CreateFolderRequest): Observable<FolderListItem> {
    return this.http.post<FolderListItem>(this.base, req);
  }

  unlock(id: string, req: UnlockFolderRequest): Observable<void> {
    return this.http.post<{ grant: string }>(`${this.base}/${id}/unlock`, req).pipe(
      tap(response => this.grants.remember(id, response.grant)), map(() => undefined)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
