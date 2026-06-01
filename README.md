# Agente Virtual

Aplicación web moderna con Next.js App Router, React, TypeScript y Tailwind CSS para elegir entre dos modos de agente:

- `Agente con Avatar y Voz`: Dify genera la respuesta y HeyGen LiveAvatar la presenta con video y voz.
- `Agente solo Texto`: chat directo contra Dify.

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

## Variables De Entorno

```env
DIFY_API_URL=
DIFY_API_KEY=
DIFY_USER_ID=
HEYGEN_API_KEY=
HEYGEN_AVATAR_ID=
HEYGEN_VOICE_ID=
NEXT_PUBLIC_APP_URL=
```

Opcionales:

```env
HEYGEN_CONTEXT_ID=
HEYGEN_SANDBOX=false
```

Si no configuras `HEYGEN_AVATAR_ID`, la app usa el avatar sandbox de LiveAvatar y activa sandbox automáticamente. Si configuras tu propio avatar, la app usa modo producción por defecto; no actives `HEYGEN_SANDBOX=true` con un avatar propio porque LiveAvatar lo rechazará.

`DIFY_API_KEY` y `HEYGEN_API_KEY` solo se usan en API routes y servicios de servidor. No se exponen al navegador.

## Flujo

```txt
Usuario
  ↓
Next.js Frontend
  ↓
API Routes internas
  ↓
Dify /chat-messages
  ↓
Respuesta del agente
  ↓
Modo texto: se muestra en chat
Modo avatar: se envía al Web SDK de LiveAvatar con session token
```

El modo avatar usa el patrón recomendado por `liveavatar-integrate`: Dify conserva el control conversacional y LiveAvatar se usa en FULL mode para sesión, video, voz y `repeat()` de la respuesta generada externamente.

## Rutas

- `/`: selector de modo.
- `/text-agent`: chat de texto con Dify.
- `/avatar-agent`: sesión LiveAvatar con chat y entrada por voz del navegador si está disponible.
- `POST /api/dify/chat`: proxy seguro a Dify `/chat-messages`.
- `POST /api/heygen/session`: crea un session token de LiveAvatar.
- `POST /api/heygen/stop`: detiene una sesión con bearer session token.

## HeyGen LiveAvatar Skills

Se instalaron los skills oficiales en:

```txt
.agents/skills/liveavatar-integrate
.agents/skills/liveavatar-debug
.agents/skills/liveavatar-feedback
```

Para instalarlos en otro entorno:

```bash
npx skills add heygen-com/liveavatar-agent-skills
```

## Verificación

```bash
npm test
npm run build
```
