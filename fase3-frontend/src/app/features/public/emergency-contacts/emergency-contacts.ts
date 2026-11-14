import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-emergency-contacts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './emergency-contacts.html',
  styleUrl: './emergency-contacts.css'
})
export class EmergencyContacts {

  contactoForm: FormGroup;
  mensaje = '';

  constructor(private fb: FormBuilder) {

    this.contactoForm = this.fb.group({
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{8}$/)
        ]
      ]
    });

  }

  actualizar(): void {

    this.mensaje = '';

    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    const telefono =
      this.contactoForm.get('telefono')?.value;

    localStorage.setItem(
      'telefonoEmergencia',
      telefono
    );

    this.mensaje =
      'Número de emergencia actualizado correctamente.';
  }

}