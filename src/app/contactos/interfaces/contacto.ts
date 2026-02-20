export interface Contacto {
    cont_id?: number;
    cont_nombre: string;
    cont_identificacion: string;
    cont_email: string;
    cont_telefono: string;
    cont_direccion: string;
    cont_notas: string;
    cont_fecha_nacimiento: string;
    cont_created_at?: string;
    cont_entidad_id: number;
    cont_entidad_nombre?: string;
}

export interface ContactoForm {
    nombre: string;
    identificacion: string;
    email: string;
    telefono: string;
    direccion: string;
    notas: string;
    fecha_nacimiento: string;
    entidad_id: number;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
    error_code?: number;
    errors?: { [key: string]: string[] };
}
