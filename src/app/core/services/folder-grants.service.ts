import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FolderGrantsService {
  private readonly grants = new Map<string, { token: string; expires: number }>();

  remember(folderId: string, token: string): void {
    // The server sets a 15-minute expiry. Keep capabilities only in memory.
    this.grants.set(folderId, { token, expires: Date.now() + 14 * 60 * 1000 });
  }

  has(folderId: string): boolean {
    const grant = this.grants.get(folderId);
    if (!grant || grant.expires <= Date.now()) { this.grants.delete(folderId); return false; }
    return true;
  }

  header(): string {
    return [...this.grants.keys()].filter(id => this.has(id)).map(id => this.grants.get(id)!.token).join(',');
  }

  clear(): void { this.grants.clear(); }
}
