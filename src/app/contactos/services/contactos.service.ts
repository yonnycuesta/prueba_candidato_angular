import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StateContacto } from '../interfaces/state-contacto';
import { ApiResponse, Contacto, ContactoForm } from '../interfaces/contacto';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  private http = inject(HttpClient);
  private readonly url: string = environment.apiURL;
  
  #state = signal<StateContacto>({
    loading: true,
    contactos: []
  });

  contactos = computed(() => this.#state().contactos);
  loading = computed(() => this.#state().loading);

  constructor() {
    this.refresh();
  }

  /** Método para refrescar los datos */
  refresh(): void {
    this.#state.update(state => ({ ...state, loading: true }));
    
    this.http.get<ApiResponse<Contacto[]>>(`${this.url}contactos`).pipe(
      map(response => response.data),
      tap(contactos => {
        this.#state.set({
          loading: false,
          contactos: contactos,
        });
      }),
      catchError(error => {
        console.error('Error al cargar contactos:', error);
        this.#state.set({ loading: false, contactos: [] });
        return of([]);
      })
    ).subscribe();
  }

  /** Obtener un contacto por ID */
  getById(id: number): Observable<Contacto | null> {
    return this.http.get<ApiResponse<Contacto>>(`${this.url}contactos/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al obtener el contacto:', error);
        return of(null);
      })
    );
  }

  /** Crear un nuevo contacto */
  create(contacto: ContactoForm): Observable<ApiResponse<Contacto>> {
    return this.http.post<ApiResponse<Contacto>>(`${this.url}contactos`, contacto).pipe(
      tap(() => this.refresh()),
      catchError(error => {
        console.error('Error al crear contacto:', error);
        throw error;
      })
    );
  }

  /** Actualizar un contacto existente */
  update(id: number, contacto: ContactoForm): Observable<ApiResponse<Contacto>> {
    return this.http.put<ApiResponse<Contacto>>(`${this.url}contactos/${id}`, contacto).pipe(
      tap(() => this.refresh()),
      catchError(error => {
        console.error('Error al actualizar contacto:', error);
        throw error;
      })
    );
  }

  /** Eliminar un contacto */
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.url}contactos/${id}`).pipe(
      tap(() => this.refresh()),
      catchError(error => {
        console.error('Error al eliminar el contacto:', error);
        throw error;
      })
    );
  }

  /** Eliminar múltiples contactos */
  deleteMultiple(ids: number[]): Observable<any> {
    const deleteObservables = ids.map(id => this.delete(id));
    return new Observable(observer => {
      let completed = 0;
      let errors = 0;

      deleteObservables.forEach(obs => {
        obs.subscribe({
          next: () => {
            completed++;
            if (completed + errors === ids.length) {
              this.refresh();
              observer.next({ completed, errors });
              observer.complete();
            }
          },
          error: () => {
            errors++;
            if (completed + errors === ids.length) {
              this.refresh();
              observer.next({ completed, errors });
              observer.complete();
            }
          }
        });
      });
    });
  }
}
