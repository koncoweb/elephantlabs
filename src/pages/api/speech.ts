import type { APIRoute } from 'astro';
import { homeVoices } from '../../data/voices';

export const prerender = false;

const MODEL = 'deepgram/flux-tts:free';
const AUTH_URL = import.meta.env.PUBLIC_NEON_AUTH_URL as string | undefined;

/** 3 suara home bebas dipakai anonim; sisanya wajib login. */
const HOME_VOICE_IDS = new Set(homeVoices.map((v) => v.id));

/** Verifikasi sesi via managed Neon Auth (forward cookie browser). */
async function hasSession(request: Request): Promise<boolean> {
  if (!AUTH_URL) return false;
  try {
    const res = await fetch(`${AUTH_URL}/get-session`, {
      headers: { cookie: request.headers.get('cookie') ?? '' }
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { session?: unknown };
    return Boolean(data?.session);
  } catch {
    return false;
  }
}

const ALLOWED_VOICES = new Set([
  'flux-alexis-en',
  'flux-bree-en',
  'flux-brittany-en',
  'flux-brooke-en',
  'flux-bruce-en',
  'flux-cliff-en',
  'flux-cole-en',
  'flux-colin-en',
  'flux-conor-en',
  'flux-donovan-en',
  'flux-drew-en',
  'flux-elise-en',
  'flux-gemma-en',
  'flux-haley-en',
  'flux-hannah-en',
  'flux-heather-en',
  'flux-jack-en',
  'flux-kai-en',
  'flux-kelsey-en',
  'flux-kit-en',
  'flux-maeve-en',
  'flux-marcelo-en',
  'flux-marcus-en',
  'flux-meena-en',
  'flux-meghan-en',
  'flux-miles-en',
  'flux-naveen-en',
  'flux-paige-en',
  'flux-priya-en',
  'flux-rufus-en',
  'flux-sean-en',
  'flux-sharon-en',
  'flux-sienna-en',
  'flux-tanner-en',
  'flux-wade-en',
  'flux-wes-en'
]);

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.OPENROUTER_API_KEY as string | undefined;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { code: 500, message: 'OPENROUTER_API_KEY belum diset di .env' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body: { input?: unknown; voice?: unknown; response_format?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: { code: 400, message: 'Body harus JSON valid' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const input = typeof body.input === 'string' ? body.input.trim() : '';
  const voice = typeof body.voice === 'string' && body.voice ? body.voice : 'flux-alexis-en';
  const response_format = body.response_format === 'pcm' ? 'pcm' : 'mp3';

  if (!input) {
    return new Response(JSON.stringify({ error: { code: 400, message: 'Field "input" wajib diisi' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (input.length > 2000) {
    return new Response(
      JSON.stringify({ error: { code: 400, message: 'Maksimal 2000 karakter per request' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (!ALLOWED_VOICES.has(voice)) {
    return new Response(JSON.stringify({ error: { code: 400, message: `Voice "${voice}" tidak didukung` } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (!HOME_VOICE_IDS.has(voice) && !(await hasSession(request))) {
    return new Response(
      JSON.stringify({
        error: { code: 401, message: 'Login dengan akun koncoweb untuk memakai suara ini' }
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch('https://openrouter.ai/api/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:4321',
        'X-Title': 'ElephantLabs'
      },
      body: JSON.stringify({ model: MODEL, input, voice, response_format })
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: { code: 502, message: 'Gagal menghubungi OpenRouter' } }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!upstream.ok) {
    let message = `Upstream error ${upstream.status}`;
    try {
      const errJson = (await upstream.json()) as { error?: { message?: string } };
      if (errJson?.error?.message) message = errJson.error.message;
    } catch {
      /* body bukan JSON — pakai status text */
    }
    return new Response(JSON.stringify({ error: { code: upstream.status, message } }), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const audioBuffer = await upstream.arrayBuffer();
  const contentType = upstream.headers.get('content-type') ?? (response_format === 'pcm' ? 'audio/pcm' : 'audio/mpeg');
  const generationId = upstream.headers.get('x-generation-id') ?? '';

  return new Response(audioBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'X-Generation-Id': generationId,
      'Cache-Control': 'no-store'
    }
  });
};
