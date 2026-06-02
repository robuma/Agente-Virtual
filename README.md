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

## Configuración De Dify

Antes de iniciar esta aplicación, Dify debe estar levantado y el chatflow debe estar importado. La app depende de Dify para generar las respuestas del agente mediante estas variables:

```env
DIFY_API_URL=
DIFY_API_KEY=
```

El directorio `dify/` contiene la documentación y el espacio para versionar el archivo DSL del chatflow:

```txt
dify/
  README.md
  Agente-Virtual-RAG.yaml
```

Usa [dify/README.md](./dify/README.md) para:

- Levantar Dify localmente con Docker Compose.
- Crear el usuario administrador inicial.
- Importar el archivo DSL `Agente-Virtual-RAG.yaml`.
- Obtener `DIFY_API_URL` y `DIFY_API_KEY` para configurar `.env.local`.

Este paso es importante porque la aplicación Next.js no podrá responder mensajes si Dify no está disponible o si la API key no corresponde al chatflow importado.

## Configuración De HeyGen LiveAvatar

HeyGen LiveAvatar se utiliza únicamente en la modalidad **Agente con Avatar y Voz**. En este proyecto, Dify mantiene el control conversacional y LiveAvatar se encarga de crear la sesión, mostrar el video del avatar y reproducir en voz la respuesta generada por Dify.

La integración usa la API de LiveAvatar:

```txt
https://api.liveavatar.com
```

La documentación oficial de LiveAvatar está disponible en:

https://docs.liveavatar.com/

### Variables requeridas

Configura estas variables en `.env.local`:

```env
HEYGEN_API_KEY=
HEYGEN_AVATAR_ID=
HEYGEN_VOICE_ID=
```

### `HEYGEN_API_KEY`

Es la llave privada para consumir la API de LiveAvatar. Para obtenerla:

1. Ingresa a LiveAvatar con tu cuenta de HeyGen:

```txt
https://app.liveavatar.com
```

2. Ve a la sección de desarrolladores o API keys.
3. Crea o copia tu API key.
4. Pégala en `.env.local`:

```env
HEYGEN_API_KEY=tu_api_key_de_liveavatar
```

Esta llave solo debe vivir en `.env.local`. No debe subirse al repositorio.

### `HEYGEN_AVATAR_ID`

Identifica el avatar que se mostrará en la sesión. Puedes usar un avatar público, un avatar propio o el avatar sandbox para pruebas.

Para obtenerlo:

1. Ingresa a `https://app.liveavatar.com`.
2. Abre la sección de avatars.
3. Selecciona el avatar que quieres usar.
4. Copia su `avatar_id` y configúralo en `.env.local`:

```env
HEYGEN_AVATAR_ID=avatar_id_de_liveavatar
```

Si esta variable queda vacía, la app usa el avatar sandbox configurado en el código para pruebas rápidas.

### `HEYGEN_VOICE_ID`

Define la voz que usará el avatar al reproducir texto. LiveAvatar permite usar voces disponibles en su biblioteca, voces generadas junto con un avatar personalizado o integraciones de TTS compatibles.

Para obtenerlo:

1. Ingresa a `https://app.liveavatar.com`.
2. Revisa la sección de voices o la configuración del avatar.
3. Copia el `voice_id` que quieres usar.
4. Configúralo en `.env.local`:

```env
HEYGEN_VOICE_ID=voice_id_de_liveavatar
```

Si lo dejas vacío, LiveAvatar puede usar la voz por defecto del avatar cuando esté disponible.

### Variables opcionales

```env
HEYGEN_CONTEXT_ID=
HEYGEN_SANDBOX=true
```

### `HEYGEN_CONTEXT_ID`

Un context en LiveAvatar define instrucciones, personalidad y conocimiento para que el avatar pueda conversar por sí mismo.

En este proyecto normalmente se deja vacío porque la conversación, el RAG y las reglas del agente se manejan desde Dify. LiveAvatar no decide qué responder; solo reproduce con voz y video la respuesta que ya generó Dify.

Solo deberías usar `HEYGEN_CONTEXT_ID` si en el futuro quieres que LiveAvatar gestione parte de la conversación directamente.

### `HEYGEN_SANDBOX`

Permite probar LiveAvatar sin consumir créditos. Para pruebas rápidas puedes usar:

```env
HEYGEN_SANDBOX=true
```

En modo sandbox, LiveAvatar usa un avatar de prueba y las sesiones son cortas. Es útil para validar conexión, video y flujo básico antes de usar un avatar real.

Para producción, configura un `HEYGEN_AVATAR_ID` real y usa:

```env
HEYGEN_SANDBOX=false
```

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
DIFY_API_URL=http://localhost/v1
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
HEYGEN_SANDBOX=true
```

Notas:

- Para Dify local con Docker Compose, normalmente `DIFY_API_URL` es `http://localhost/v1`.
- Para Dify Cloud, normalmente `DIFY_API_URL` es `https://api.dify.ai/v1`.
- `DIFY_API_KEY` se obtiene desde la sección **API Access** de la aplicación importada en Dify.
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
dify/
  README.md
  Agente-Virtual-RAG.yaml
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

## Video De Demostración

https://youtu.be/B4yIDfMPnRA
