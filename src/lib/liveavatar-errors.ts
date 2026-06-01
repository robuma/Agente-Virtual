const DEFAULT_LIVEAVATAR_ERROR =
  "No pudimos conectar el avatar. Revisa la configuración de LiveAvatar.";

export function getLiveAvatarErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.toLowerCase().includes("no credits available")) {
    return "LiveAvatar no tiene créditos disponibles para iniciar la sesión. Agrega créditos o usa un avatar sandbox compatible.";
  }

  return DEFAULT_LIVEAVATAR_ERROR;
}
