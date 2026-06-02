# Dify chatflow

Este directorio se utiliza para guardar el archivo DSL exportado desde Dify con la configuracion del chatflow utilizado por este proyecto.

El archivo esperado para este proyecto es:

```text
Agente-Virtual-RAG.yaml
```

Mantener este archivo dentro del repositorio permite llevar control de versiones de los cambios realizados en el flujo del agente.

## Levantar Dify con Docker Compose

Estas instrucciones resumen el flujo recomendado en la documentacion oficial de Dify para un entorno local con Docker Compose:

https://docs.dify.ai/en/self-host/quick-start/docker-compose

## Requisitos

- Docker Desktop instalado y en ejecucion.
- Docker Compose 2.24.0 o superior.
- Al menos 2 CPU y 4 GiB de RAM disponibles. En macOS, Dify recomienda configurar Docker Desktop con al menos 2 CPU y 8 GiB de memoria.

Puedes verificar Docker Compose con:

```bash
docker compose version
```

## 1. Clonar Dify

Desde una carpeta fuera de este proyecto, clona el repositorio oficial de Dify usando la ultima version publicada:

```bash
git clone --branch "$(curl -s https://api.github.com/repos/langgenius/dify/releases/latest | jq -r .tag_name)" https://github.com/langgenius/dify.git
```

Luego entra al directorio de Docker:

```bash
cd dify/docker
```

## 2. Preparar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Para una instalacion local de prueba normalmente puedes iniciar con los valores por defecto. Si necesitas personalizar puertos, dominios, almacenamiento, proveedores o integraciones, edita este archivo antes de levantar los contenedores.

## 3. Levantar Dify

Inicia los servicios:

```bash
docker compose up -d
```

Verifica que los contenedores esten corriendo:

```bash
docker compose ps
```

Los servicios principales deberian aparecer como `Up` o `healthy`.

## 4. Crear el usuario administrador

Cuando los contenedores esten listos, abre la pagina de instalacion:

```text
http://localhost/install
```

Completa el formulario para crear el usuario administrador inicial.

## 5. Ingresar a Dify

Despues de crear el usuario administrador, ingresa a Dify en:

```text
http://localhost
```

Usa el usuario y contrasena que acabas de configurar.

## 6. Importar el DSL del chatflow

Cuando el archivo `Agente-Virtual-RAG.yaml` este disponible en este directorio:

1. Ingresa a Dify.
2. Ve al area donde administras o creas aplicaciones.
3. Usa la opcion **Import DSL file**.
4. Selecciona el archivo:

```text
dify/Agente-Virtual-RAG.yaml
```

5. Revisa la configuracion importada y guarda la aplicacion.

## 7. Obtener `DIFY_API_URL` y `DIFY_API_KEY`

La aplicacion Next.js necesita conectarse al chatflow importado mediante la API de Dify. Para eso debes configurar estas variables en `.env.local`:

```env
DIFY_API_URL=http://localhost/v1
DIFY_API_KEY=
```

### `DIFY_API_URL`

Si estas usando Dify local con Docker Compose, usa:

```env
DIFY_API_URL=http://localhost/v1
```

Si estas usando Dify Cloud, usa:

```env
DIFY_API_URL=https://api.dify.ai/v1
```

La aplicacion Next.js agrega internamente el endpoint `/chat-messages`, por eso la URL debe terminar en `/v1` y no en `/chat-messages`.

### `DIFY_API_KEY`

Para generar la API key del chatflow:

1. Ingresa a Dify.
2. Abre la aplicacion importada desde `Agente-Virtual-RAG.yaml`.
3. En el menu lateral, entra a **API Access**.
4. Crea una nueva credencial o API key para esta integracion.
5. Copia el valor generado y pegalo en `.env.local`:

```env
DIFY_API_KEY=tu_api_key_de_dify
```

Guarda esta llave solo en `.env.local`. No la subas al repositorio.

Puedes confirmar que la configuracion funciona iniciando esta app y enviando un mensaje desde `/text-agent`.

## Comandos utiles

Detener Dify:

```bash
docker compose down
```

Reiniciar Dify despues de cambios en `.env`:

```bash
docker compose down
docker compose up -d
```

Ver logs:

```bash
docker compose logs
```

Ver logs de un servicio especifico:

```bash
docker compose logs api
```

## Nota para este proyecto

Este directorio no contiene la instalacion completa de Dify. Solo guarda el DSL del chatflow que se usa como configuracion versionada del agente.

La aplicacion Next.js de este repositorio se conecta a Dify usando las variables definidas en `.env.local`, como `DIFY_API_URL` y `DIFY_API_KEY`.
