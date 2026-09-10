import { createAuthClient } from '@neondatabase/neon-js/auth';

// Neon Auth (Managed Better Auth) milik proyek koncowebportal.
// Base URL bersifat publik — session cookie tetap HttpOnly dan aman.
const baseUrl = import.meta.env.PUBLIC_NEON_AUTH_URL as string | undefined;

if (!baseUrl && typeof window !== 'undefined') {
  console.error('PUBLIC_NEON_AUTH_URL belum diset di .env');
}

export const authClient = createAuthClient(baseUrl ?? '');

export interface SessionUser {
  email: string;
  name?: string | null;
}

/** Ambil sesi aktif; null bila belum login. */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const { data } = await authClient.getSession();
    if (data?.session && data?.user) {
      return { email: data.user.email, name: data.user.name ?? null };
    }
    return null;
  } catch {
    return null;
  }
}
