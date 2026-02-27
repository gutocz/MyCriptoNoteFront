import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FolderListItem, CreateFolderRequest } from '../models/folder.model';

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

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
