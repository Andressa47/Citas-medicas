import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credencial-digital',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './credencial-digital.html',
  styleUrl: './credencial-digital.css'
})
export class CredencialDigital {

  nombreCompleto = 'Administrador Medular';
  numeroAfiliacion = 'ADM-001';
  clinicaAsignada = 'Clínica Medular';

  fechaActual = new Date();

}