import { describe, expect, it } from "vitest";
import { getLiveAvatarErrorMessage } from "./liveavatar-errors";

describe("getLiveAvatarErrorMessage", () => {
  it("returns a clear message when LiveAvatar has no credits", () => {
    expect(
      getLiveAvatarErrorMessage(new Error("No credits available for start session"))
    ).toBe(
      "LiveAvatar no tiene créditos disponibles para iniciar la sesión. Agrega créditos o usa un avatar sandbox compatible."
    );
  });

  it("falls back to the default connection message", () => {
    expect(getLiveAvatarErrorMessage(new Error("API request failed"))).toBe(
      "No pudimos conectar el avatar. Revisa la configuración de LiveAvatar."
    );
  });
});
