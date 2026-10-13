import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from '../services/auth';


export const roleGuard = (
  rolesPermitidos: string[]
): CanActivateFn => {

  return () => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);


    // ========================================
    // PRIMERO: ¿ESTÁ AUTENTICADO?
    // ========================================

    if (
      !authService.estaAutenticado()
    ) {

      return router.createUrlTree([
        '/login'
      ]);

    }


    // ========================================
    // OBTENER ROL
    // ========================================

    const rol =
      authService.obtenerRol();


    // ========================================
    // ROL PERMITIDO
    // ========================================

    if (
      rol &&
      rolesPermitidos.includes(rol)
    ) {

      return true;

    }


    // ========================================
    // ADMIN INTENTANDO ENTRAR
    // A UNA RUTA NO PERMITIDA
    // ========================================

    if (
      rol === 'ROLE_ADMIN'
    ) {

      return router.createUrlTree([
        '/admin'
      ]);

    }


    // ========================================
    // MÉDICO INTENTANDO ENTRAR
    // A UNA RUTA NO PERMITIDA
    // ========================================

    if (
      rol === 'ROLE_DOCTOR'
    ) {

      return router.createUrlTree([
        '/medico'
      ]);

    }


    // ========================================
    // PACIENTE U OTRO ROL
    // ========================================

    return router.createUrlTree([
      '/login'
    ]);

  };

};
