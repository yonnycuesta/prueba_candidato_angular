import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { EntidadesService } from './services/entidades.service';
import { Entidad, EntidadForm } from './interfaces/entidad';
import { AlertService } from '../utils/alert.service';

@Component({
  selector: 'app-entidades',
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
    TooltipModule
  ],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: [MessageService]
})
export default class EntidadesComponent {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private alertService = inject(AlertService);
  public entidadesService = inject(EntidadesService);
  
  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades = signal<Entidad[]>([]);
  dialogVisible = signal<boolean>(false);
  dialogTitle = signal<string>('Nueva Entidad');
  isEditing = signal<boolean>(false);
  currentEntityId = signal<number | null>(null);
  submitting = signal<boolean>(false);

  entidadForm: FormGroup;

  constructor() {
    this.entidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(191)]],
      nit: ['', [Validators.required, Validators.maxLength(191)]],
      direccion: ['', [Validators.maxLength(191)]],
      telefono: ['', [Validators.maxLength(191)]],
      email: ['', [Validators.email, Validators.maxLength(191)]],
      estado: [1]
    });
  }

  openNew(): void {
    this.isEditing.set(false);
    this.dialogTitle.set('Nueva Entidad');
    this.currentEntityId.set(null);
    this.entidadForm.reset();
    this.dialogVisible.set(true);
  }

  edit(entidad: Entidad): void {
    if (!entidad.ent_id) return;
    
    this.isEditing.set(true);
    this.dialogTitle.set('Editar Entidad');
    this.currentEntityId.set(entidad.ent_id);
    
    this.entidadForm.patchValue({
      nombre: entidad.ent_nombre,
      nit: entidad.ent_nit,
      direccion: entidad.ent_direccion,
      telefono: entidad.ent_telefono,
      email: entidad.ent_email,
      estado: entidad.ent_estado ?? 1
    });
    
    this.dialogVisible.set(true);
  }

  hideDialog(): void {
    this.dialogVisible.set(false);
    this.entidadForm.reset();
    this.submitting.set(false);
  }

  saveEntidad(): void {
    if (this.entidadForm.invalid) {
      this.markFormGroupTouched(this.entidadForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor, complete todos los campos correctamente',
        life: 3000
      });
      return;
    }

    this.submitting.set(true);
    const formData: EntidadForm = this.entidadForm.value;

    const request = this.isEditing()
      ? this.entidadesService.update(this.currentEntityId()!, formData)
      : this.entidadesService.create(formData);

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
            detail: error.error?.message || 'Error al guardar la entidad',
            life: 3000
          });
        }
      }
    });
  }

  deleteEntity(entidad: Entidad): void {
    if (!entidad.ent_id) return;

    this.alertService.confirmDelete(entidad.ent_nombre, () => {
      this.entidadesService.delete(entidad.ent_id!).subscribe({
        next: (response) => {
          this.alertService.success(response.message, '¡Eliminado!');
        },
        error: (error) => {
          this.alertService.error(error.error?.message || 'Error al eliminar la entidad');
        }
      });
    });
  }

  deleteSelected(): void {
    const selected = this.selectedEntidades();
    if (selected.length === 0) {
      this.alertService.warning('Debe seleccionar al menos una entidad');
      return;
    }

    this.alertService.confirmDeleteMultiple(selected.length, () => {
      const ids = selected.filter(e => e.ent_id).map(e => e.ent_id!);
      
      this.entidadesService.deleteMultiple(ids).subscribe({
        next: (result: { completed: number; errors: number; inactivated: number; deleted: number }) => {
          this.selectedEntidades.set([]);
          if (result.errors > 0) {
            const mensaje = `<strong>${result.deleted}</strong> eliminadas, <strong>${result.inactivated}</strong> inactivadas (tienen contactos)<br><strong>${result.errors}</strong> con errores`;
            this.alertService.completedWithErrors(mensaje);
          } else {
            let mensaje = '';
            if (result.deleted > 0 && result.inactivated > 0) {
              mensaje = `${result.deleted} eliminadas y ${result.inactivated} inactivadas (tienen contactos)`;
            } else if (result.inactivated > 0) {
              mensaje = `${result.inactivated} entidad(es) inactivadas (tienen contactos asociados)`;
            } else {
              mensaje = `${result.deleted} entidad(es) eliminadas correctamente`;
            }
            this.alertService.success(mensaje, '¡Completado!');
          }
        },
        error: () => {
          this.alertService.error('Error al eliminar las entidades');
        }
      });
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.entidadForm.get(fieldName);
    if (!control || !control.touched || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['email']) return 'Ingrese un email válido';
    
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
