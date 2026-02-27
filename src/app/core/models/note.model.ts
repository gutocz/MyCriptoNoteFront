export interface NoteListItem {
  id: string;
  title: string;
  folderId: string | null;
  createdAt: string;
}

export interface UnlockedNote {
  id: string;
  title: string;
  content: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  password: string;
  folderId?: string | null;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  password: string;
}

export interface UnlockNoteRequest {
  password: string;
}

export interface MoveToFolderRequest {
  folderId: string;
}
