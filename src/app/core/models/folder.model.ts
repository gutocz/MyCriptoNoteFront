export interface FolderListItem {
  id: string;
  name: string;
  createdAt: string;
}

export interface CreateFolderRequest {
  name: string;
  password: string;
}
