import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  /** Alerta de éxito con temporizador */
  success(mensaje: string, titulo: string = '¡Éxito!'): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  /** Alerta de éxito con HTML y temporizador */
  successHtml(mensaje: string, titulo: string = '¡Completado!'): void {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  /** Alerta de error */
  error(mensaje: string, titulo: string = 'Error'): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
      confirmButtonColor: '#3085d6'
    });
  }

  /** Alerta de advertencia */
  warning(mensaje: string, titulo: string = 'Advertencia'): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      confirmButtonColor: '#3085d6'
    });
  }

  /** Alerta de advertencia con HTML */
  warningHtml(html: string, titulo: string = 'Advertencia'): void {
    Swal.fire({
      title: titulo,
      html: html,
      icon: 'warning',
      confirmButtonColor: '#3085d6'
    });
  }

  /** Confirmación de eliminación */
  confirmDelete(
    nombre: string,
    onConfirm: () => void,
    tipo: string = 'entidad'
  ): void {
    Swal.fire({
      title: `¿Eliminar ${tipo}?`,
      html: `¿Está seguro de eliminar <strong>${nombre}</strong>?<br><small class="text-muted">Esta acción no se puede deshacer</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  /** Confirmación de eliminación múltiple */
  confirmDeleteMultiple(
    cantidad: number,
    onConfirm: () => void,
    tipo: string = 'entidad'
  ): void {
    Swal.fire({
      title: `¿Eliminar ${cantidad} ${tipo}(es)?`,
      html: `Está a punto de eliminar <strong>${cantidad}</strong> ${tipo}(es).<br><small class="text-muted">Esta acción no se puede deshacer</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, eliminar ${cantidad > 1 ? 'todas' : 'todo'}`,
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  /** Alerta de completado con errores */
  completedWithErrors(html: string): void {
    Swal.fire({
      title: 'Completado con errores',
      html: html,
      icon: 'warning',
      confirmButtonColor: '#3085d6'
    });
  }
}
