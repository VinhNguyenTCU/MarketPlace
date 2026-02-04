type ServiceOk<T> = { ok: true; data: T };
type ServiceErr = { ok: false; status: number; error: string };

export type { ServiceOk, ServiceErr };