import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { FolderGrantsService } from '../services/folder-grants.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const grants = inject(FolderGrantsService).header();
  if (req.url.startsWith('/api/')) {
    req = req.clone({ setHeaders: { 'X-MCN-Request': '1' } });
  }
  if (grants && req.url.startsWith('/api/')) {
    req = req.clone({ setHeaders: { 'X-Folder-Grants': grants } });
  }
  return next(req);
};
