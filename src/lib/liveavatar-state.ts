export type AvatarPanelState = "disconnected" | "connecting" | "connected";

export function toAvatarPanelState(liveAvatarState: string): AvatarPanelState {
  if (liveAvatarState === "CONNECTING") return "connecting";
  if (liveAvatarState === "CONNECTED") return "connected";
  return "disconnected";
}
