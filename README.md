# Agente Virtual

Aplicación web piloto para los Consultorios Jurídicos de la Universidad de Costa Rica. Permite conversar con un agente virtual en dos modalidades:

- **Agente con Avatar y Voz**: Dify genera la respuesta y HeyGen LiveAvatar la presenta con video y voz.
- **Agente solo Texto**: chat escrito conectado directamente con Dify.

El proyecto está construido con Next.js App Router, React, TypeScript y Tailwind CSS.

## Funcionalidades Actuales

- Pantalla inicial para seleccionar el modo de atención.
- Chat de texto conectado a Dify.
- Experiencia con avatar en tiempo real usando HeyGen LiveAvatar.
- Entrada por voz en el modo avatar cuando el navegador soporta `SpeechRecognition`.
- Envío de mensajes con botón o presionando `Enter`.
- Salto de línea en el campo de texto con `Shift + Enter`.
- API routes internas para no exponer llaves privadas en el navegador.
- Manejo básico de errores para Dify y LiveAvatar.
- Pruebas unitarias para servicios y helpers principales.

## Flujo General

```txt
Usuario
  ↓
Interfaz Next.js
  ↓
API routes internas
  ↓
Dify /chat-messages
  ↓
Respuesta del agente
  ↓
Modo texto: se muestra en pantalla
Modo avatar: LiveAvatar dice la respuesta con video y voz
```

En el modo avatar, Dify conserva el control conversacional. LiveAvatar se usa para iniciar la sesión, mostrar el video y reproducir en voz la respuesta generada por Dify.

## Rutas De La App

- `/`: página inicial con selector de modo.
- `/text-agent`: chat de texto conectado a Dify.
- `/avatar-agent`: chat con panel de LiveAvatar, video y controles de sesión.

## API Routes

- `POST /api/dify/chat`: envía el mensaje del usuario a Dify y devuelve la respuesta.
- `POST /api/heygen/session`: crea un session token para iniciar LiveAvatar.
- `POST /api/heygen/stop`: detiene una sesión activa de LiveAvatar.

## Componentes Principales

- `AgentModeCard`: tarjeta reutilizable para seleccionar un modo de agente.
- `AvatarPanel`: controla la sesión de LiveAvatar, el video, estados de conexión y reproducción de voz.
- `ChatInput`: campo compartido de escritura, envío con `Enter`, botón de enviar y dictado opcional.
- `ChatWindow`: muestra los mensajes de usuario y asistente.
- `LoadingIndicator`: indicador visual simple mientras se espera respuesta.

## Servicios Y Utilidades

- `src/lib/dify.ts`: cliente servidor para llamar a Dify.
- `src/lib/heygen.ts`: cliente servidor para crear y detener sesiones LiveAvatar.
- `src/lib/http.ts`: parser común de respuestas externas y errores HTTP.
- `src/lib/env.ts`: helpers para variables de entorno requeridas u opcionales.
- `src/lib/liveavatar-errors.ts`: mensajes amigables para errores comunes de LiveAvatar.
- `src/lib/liveavatar-state.ts`: mapeo de estados del SDK a estados de la interfaz.
- `src/lib/types.ts`: tipos compartidos del proyecto.

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre:

```txt
http://localhost:3000
```

## Variables De Entorno

Configura `.env.local` con tus valores reales:

```env
DIFY_API_URL=
DIFY_API_KEY=
DIFY_USER_ID=

HEYGEN_API_KEY=
HEYGEN_AVATAR_ID=
HEYGEN_VOICE_ID=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Opcionales:

```env
HEYGEN_CONTEXT_ID=
HEYGEN_SANDBOX=false
```

Notas:

- Si `HEYGEN_AVATAR_ID` queda vacío, la app usa el avatar sandbox de LiveAvatar.
- Si usas un avatar propio, no actives `HEYGEN_SANDBOX=true`.
- `DIFY_API_KEY` y `HEYGEN_API_KEY` solo se usan en el servidor.
- No subas `.env.local` al repositorio.

## Comandos

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm test
```

Ejecuta las pruebas unitarias con Vitest.

```bash
npm run lint
```

Revisa reglas de ESLint.

```bash
npm run build
```

Compila la aplicación para producción.

## Estructura Del Proyecto

```txt
src/
  app/
    api/
      dify/chat/
      heygen/session/
      heygen/stop/
    avatar-agent/
    text-agent/
    page.tsx
  components/
  lib/
```

## Seguridad

- Las llaves de Dify y HeyGen nunca se envían al navegador.
- El frontend llama a API routes internas.
- `.env.local` está ignorado por Git.
- `.env.example` solo debe contener valores de ejemplo o campos vacíos.

## Skills De LiveAvatar

El proyecto incluye documentación local de los skills oficiales de LiveAvatar:

```txt
.agents/skills/liveavatar-integrate
.agents/skills/liveavatar-debug
.agents/skills/liveavatar-feedback
```

Sirven como referencia para integración, depuración y retroalimentación del uso de LiveAvatar.
