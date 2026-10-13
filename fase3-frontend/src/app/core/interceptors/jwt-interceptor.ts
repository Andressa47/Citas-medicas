import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  // Si existe token, lo agregamos a la petición
  if (token) {

    const requestConToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(requestConToken);
  }

  // Si no existe token, dejamos pasar la petición normal
  return next(req);
};