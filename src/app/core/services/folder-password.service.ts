import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FolderPasswordService {
  private store = new Map<string, string>();
  private subject = new BehaviorSubject<Map<string, string>>(new Map());

  set(folderId: string, password: string): void {
    this.store.set(folderId, password);
    this.subject.next(new Map(this.store));
  }

  get(folderId: string): string | undefined {
    return this.store.get(folderId);
  }

  clear(folderId: string): void {
    this.store.delete(folderId);
    this.subject.next(new Map(this.store));
  }

  clearAll(): void {
    this.store.clear();
    this.subject.next(new Map(this.store));
  }

  has(folderId: string): boolean {
    return this.store.has(folderId);
  }
}
