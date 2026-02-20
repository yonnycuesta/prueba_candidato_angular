import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ContactosService } from './services/contactos.service';
import { EntidadesService } from '../entidades/services/entidades.service';
import { Contacto, ContactoForm } from './interfaces/contacto';
import { AlertService } from '../utils/alert.service';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    TooltipModule
  ],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css',
  providers: [MessageService]
})
export default class ContactosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private alertService = inject(AlertService);
  public contactosService = inject(ContactosService);
  public entidadesService = inject(EntidadesService);
  
  total = computed(() => this.contactosService.contactos().length);
  selectedContactos = signal<Contacto[]>([]);
  dialogVisible = signal<boolean>(false);
  dialogTitle = signal<string>('Nuevo Contacto');
  isEditing = signal<boolean>(false);
  currentContactId = signal<number | null>(null);
  submitting = signal<boolean>(false);
  viewDialogVisible = signal<boolean>(false);
  viewContacto = signal<Contacto | null>(null);

  contactoForm: FormGroup;
  entidadesOptions = computed(() => {
    return this.entidadesService.entidades().map(ent => ({
      label: ent.ent_nombre,
      value: ent.ent_id
    }));
  });

  constructor() {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(191)]],
      identificacion: ['', [Validators.required, Validators.maxLength(191)]],
      email: ['', [Validators.email, Validators.maxLength(191)]],
      telefono: ['', [Validators.maxLength(191)]],
      direccion: ['', [Validators.maxLength(191)]],
      notas: [''],
      fecha_nacimiento: ['', [this.dateBeforeOrEqualTodayValidator()]],
      entidad_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  openNew(): void {
    this.isEditing.set(false);
    this.dialogTitle.set('Nuevo Contacto');
    this.currentContactId.set(null);
    this.contactoForm.reset();
    this.dialogVisible.set(true);
  }

  viewContactoDetails(contacto: Contacto): void {
    if (!contacto.cont_id) return;
    
    this.contactosService.getById(contacto.cont_id).subscribe({
      next: (data) => {
        if (data) {
          this.viewContacto.set(data);
          this.viewDialogVisible.set(true);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la información del contacto',
            life: 3000
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Error al cargar el contacto',
          life: 3000
        });
      }
    });
  }

  closeViewDialog(): void {
    this.viewDialogVisible.set(false);
    this.viewContacto.set(null);
  }

  editFromView(): void {
    const contacto = this.viewContacto();
    if (contacto) {
      this.closeViewDialog();
      this.edit(contacto);
    }
  }

  edit(contacto: Contacto): void {
    if (!contacto.cont_id) return;
    
    this.isEditing.set(true);
    this.dialogTitle.set('Editar Contacto');
    this.currentContactId.set(contacto.cont_id);
    
    this.contactoForm.patchValue({
      nombre: contacto.cont_nombre,
      identificacion: contacto.cont_identificacion,
      email: contacto.cont_email,
      telefono: contacto.cont_telefono,
      direccion: contacto.cont_direccion,
      notas: contacto.cont_notas,
      fecha_nacimiento: contacto.cont_fecha_nacimiento,
      entidad_id: contacto.cont_entidad_id
    });
    
    this.dialogVisible.set(true);
  }

  hideDialog(): void {
    this.dialogVisible.set(false);
    this.contactoForm.reset();
    this.submitting.set(false);
  }

  saveContacto(): void {
    if (this.contactoForm.invalid) {
      this.markFormGroupTouched(this.contactoForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor, complete todos los campos correctamente',
        life: 3000
      });
      return;
    }

    this.submitting.set(true);
    const formValue = this.contactoForm.value;
    
    const formData: ContactoForm = {
      ...formValue
    };

    const request = this.isEditing()
      ? this.contactosService.update(this.currentContactId()!, formData)
      : this.contactosService.create(formData);

    request.subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message,
          life: 3000
        });
        this.hideDialog();
      },
      error: (error) => {
        this.submitting.set(false);
        if (error.error?.errors) {
          const errorMessages = Object.entries(error.error.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Validación',
            detail: errorMessages,
            life: 5000
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al guardar el contacto',
            life: 3000
          });
        }
      }
    });
  }

  deleteContact(contacto: Contacto): void {
    if (!contacto.cont_id) return;

    this.alertService.confirmDelete(contacto.cont_nombre, () => {
      this.contactosService.delete(contacto.cont_id!).subscribe({
        next: (response) => {
          this.alertService.success(response.message, '¡Eliminado!');
        },
        error: (error) => {
          this.alertService.error(error.error?.message || 'Error al eliminar el contacto');
        }
      });
    }, 'contacto');
  }

  deleteSelected(): void {
    const selected = this.selectedContactos();
    if (selected.length === 0) {
      this.alertService.warning('Debe seleccionar al menos un contacto');
      return;
    }

    this.alertService.confirmDeleteMultiple(selected.length, () => {
      const ids = selected.filter(c => c.cont_id).map(c => c.cont_id!);
      
      this.contactosService.deleteMultiple(ids).subscribe({
        next: (result: { completed: number; errors: number }) => {
          this.selectedContactos.set([]);
          if (result.errors > 0) {
            const mensaje = `<strong>${result.completed}</strong> eliminados correctamente<br><strong>${result.errors}</strong> con errores`;
            this.alertService.completedWithErrors(mensaje);
          } else {
            this.alertService.success(`${result.completed} contacto(s) eliminados correctamente`, '¡Eliminados!');
          }
        },
        error: () => {
          this.alertService.error('Error al eliminar los contactos');
        }
      });
    }, 'contacto');
  }

  getFieldError(fieldName: string): string {
    const control = this.contactoForm.get(fieldName);
    if (!control || !control.touched || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['email']) return 'Ingrese un email válido';
    if (errors['dateInFuture']) return 'La fecha no puede ser futura';
    
    return '';
  }

  getToday(): Date {
    return new Date();
  }

  getTodayString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private dateBeforeOrEqualTodayValidator() {
    return (control: any) => {
      if (!control.value) return null; // nullable, no valida si está vacío
      
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Fin del día de hoy
      
      if (selectedDate > today) {
        return { dateInFuture: true };
      }
      return null;
    };
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
