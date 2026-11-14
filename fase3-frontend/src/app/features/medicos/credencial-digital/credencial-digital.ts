import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credencial-digital',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credencial-digital.html',
  styleUrl: './credencial-digital.css'
})
export class CredencialDigital {

  @Input() medico: any;

  fechaActual = new Date();

}