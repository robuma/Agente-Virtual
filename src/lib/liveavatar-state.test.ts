import { describe, expect, it } from "vitest";
import { toAvatarPanelState } from "./liveavatar-state";

describe("toAvatarPanelState", () => {
  it("maps LiveAvatar SDK connection states to panel states", () => {
    expect(toAvatarPanelState("CONNECTING")).toBe("connecting");
    expect(toAvatarPanelState("CONNECTED")).toBe("connected");
    expect(toAvatarPanelState("DISCONNECTING")).toBe("disconnected");
    expect(toAvatarPanelState("DISCONNECTED")).toBe("disconnected");
    expect(toAvatarPanelState("INACTIVE")).toBe("disconnected");
  });
});
