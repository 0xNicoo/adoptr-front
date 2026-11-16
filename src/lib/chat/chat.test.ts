import { describe, expect, it } from "vitest";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { Species } from "@/lib/api/models/adoption/species";
import { ChatMessage, ChatRole, Conversation } from "@/lib/api/models/chat/chat";
import { ProfileType } from "@/lib/api/models/profile/profile-type";
import { chatsHref, conversationHref, parseChatQuery } from "./chat-query";
import {
  applyIncomingMessage,
  chatErrorMessage,
  counterpartSubtitle,
  groupByPublication,
  lastMessagePreview,
  mergeMessages,
  publicationStatusLabel,
  readOnlyReason,
  unreadTotal,
} from "./inbox";
import { brokerUrl, sseEvent } from "./sse";
import { formatMessageTime, todayInArgentina } from "./time";

const message = (id: number, conversationId: number, senderRole: ChatRole, createdAt = `2026-11-15T10:${String(id).padStart(2, "0")}:00`): ChatMessage => ({
  id, conversationId, senderRole, body: `mensaje ${id}`, createdAt,
});

function conversation(id: number, role: ChatRole, publicationId: number, last: number, unreadCount = 0): Conversation {
  const lastMessage = message(last, id, ChatRole.INTERESTED);
  return {
    id, role, unreadCount, readOnly: false,
    publication: { id: publicationId, type: "ADOPTION", petName: `Mascota ${publicationId}`, species: Species.DOG, status: AdoptionStatus.AVAILABLE, coverPhotoUrl: null, deleted: false },
    counterpart: { profileId: 100 + id, displayName: `Persona ${id}`, profileType: ProfileType.PERSON, photoUrl: null },
    lastMessage, lastMessageAt: lastMessage.createdAt, createdAt: "2026-11-15T09:00:00",
  };
}

describe("parseChatQuery / chatsHref", () => {
  it("lee bandeja, mascota y chat; la mascota solo vale en «Mis publicaciones»", () => {
    expect(parseChatQuery({ tab: "mine", pet: "74", chat: "14" })).toEqual({ tab: "mine", pet: 74, chat: 14 });
    expect(parseChatQuery(new URLSearchParams("tab=others&pet=74&chat=9"))).toEqual({ tab: "others", pet: null, chat: 9 });
  });

  it("ignora valores inválidos", () => {
    expect(parseChatQuery({ tab: "todas", pet: "-1", chat: "abc" })).toEqual({ tab: null, pet: null, chat: null });
    expect(parseChatQuery({ tab: "mine", pet: "0" }).pet).toBeNull();
  });

  it("arma la URL y lleva cada conversación a su bandeja", () => {
    expect(chatsHref({})).toBe("/chats");
    expect(chatsHref({ tab: "others", pet: 3, chat: 9 })).toBe("/chats?tab=others&chat=9");
    expect(conversationHref(conversation(14, ChatRole.OWNER, 74, 1))).toBe("/chats?tab=mine&pet=74&chat=14");
    expect(conversationHref(conversation(9, ChatRole.INTERESTED, 74, 1))).toBe("/chats?tab=others&chat=9");
  });
});

describe("groupByPublication", () => {
  it("junta a las personas de cada mascota, suma no leídos y ordena por actividad", () => {
    const groups = groupByPublication([
      conversation(1, ChatRole.OWNER, 74, 1, 2),
      conversation(2, ChatRole.OWNER, 80, 5),
      conversation(3, ChatRole.OWNER, 74, 3, 1),
    ]);
    expect(groups.map((group) => group.publication.id)).toEqual([80, 74]);
    expect(groups[1].conversations.map((c) => c.id)).toEqual([3, 1]);
    expect(groups[1].unreadCount).toBe(3);
  });
});

describe("unreadTotal", () => {
  it("suma todo o solo una bandeja", () => {
    const list = [conversation(1, ChatRole.OWNER, 74, 1, 2), conversation(2, ChatRole.INTERESTED, 80, 2, 1)];
    expect(unreadTotal(list)).toBe(3);
    expect(unreadTotal(list, ChatRole.INTERESTED)).toBe(1);
  });
});

describe("applyIncomingMessage", () => {
  const list = [conversation(1, ChatRole.OWNER, 74, 1), conversation(2, ChatRole.OWNER, 80, 2, 1)];

  it("actualiza el último mensaje, sube la conversación y suma no leídos de la otra persona", () => {
    const next = applyIncomingMessage(list, message(9, 1, ChatRole.INTERESTED), false)!;
    expect(next.map((c) => c.id)).toEqual([1, 2]);
    expect(next[0].lastMessage?.id).toBe(9);
    expect(next[0].unreadCount).toBe(1);
  });

  it("con el chat abierto y a la vista no suma; un mensaje propio deja todo leído", () => {
    expect(applyIncomingMessage(list, message(9, 2, ChatRole.INTERESTED), true)![0].unreadCount).toBe(0);
    expect(applyIncomingMessage(list, message(9, 2, ChatRole.OWNER), false)![0].unreadCount).toBe(0);
  });

  it("ignora un mensaje repetido o más viejo que el último", () => {
    expect(applyIncomingMessage(list, message(2, 2, ChatRole.INTERESTED), false)).toBe(list);
  });

  it("devuelve null si la conversación es nueva: hay que recargar la bandeja", () => {
    expect(applyIncomingMessage(list, message(9, 77, ChatRole.INTERESTED), false)).toBeNull();
  });
});

describe("mergeMessages", () => {
  it("no repite el que llegó por el POST y por el tiempo real, y ordena por id", () => {
    const a = message(1, 1, ChatRole.OWNER);
    const b = message(2, 1, ChatRole.OWNER);
    const c = message(3, 1, ChatRole.OWNER);
    expect(mergeMessages([a, c], [c, b]).map((m) => m.id)).toEqual([1, 2, 3]);
  });
});

describe("textos", () => {
  const owned = conversation(1, ChatRole.OWNER, 74, 1);

  it("vista previa con autor", () => {
    expect(lastMessagePreview({ ...owned, lastMessage: { ...message(1, 1, ChatRole.INTERESTED), body: "Hola\n  ¿sigue?" } })).toBe(
      "Persona 1: Hola ¿sigue?",
    );
    expect(lastMessagePreview({ ...owned, lastMessage: message(1, 1, ChatRole.OWNER) })).toBe("Vos: mensaje 1");
    expect(lastMessagePreview({ ...owned, lastMessage: null })).toBe("");
  });

  it("estado, solo lectura y subtítulo", () => {
    expect(publicationStatusLabel(owned.publication)).toBe("En adopción");
    expect(publicationStatusLabel({ ...owned.publication, status: AdoptionStatus.ADOPTED })).toBe("Ya tiene familia");
    expect(publicationStatusLabel({ ...owned.publication, deleted: true })).toBe("Dada de baja");
    expect(readOnlyReason({ ...owned.publication, deleted: true })).toMatch(/fue dada de baja/);
    expect(counterpartSubtitle(owned)).toBe("Le interesa Mascota 74");
    expect(counterpartSubtitle({ ...owned, role: ChatRole.INTERESTED })).toBe("Publicó a Mascota 74");
  });

  it("errores por code, con un texto genérico para el resto", () => {
    expect(chatErrorMessage("CHAT_READ_ONLY")).toMatch(/ya no está en adopción/);
    expect(chatErrorMessage("CUALQUIERA")).toMatch(/Revisá tu conexión/);
  });
});

describe("formatMessageTime", () => {
  it("hoy solo la hora, esta semana con el día, antes con la fecha", () => {
    expect(formatMessageTime("2026-11-15T15:20:48.523514882", "2026-11-15")).toBe("15:20");
    expect(formatMessageTime("2026-11-10T15:20:00", "2026-11-15")).toBe("Mar 15:20");
    expect(formatMessageTime("2026-11-08T09:05:00", "2026-11-15")).toBe("08/11 09:05");
    expect(formatMessageTime("2025-12-31T23:59:00", "2026-01-02")).toBe("Mié 23:59");
    expect(formatMessageTime("2025-11-30T23:59:00", "2026-01-02")).toBe("30/11/2025 23:59");
  });

  it("«hoy» se calcula en hora de Argentina", () => {
    expect(todayInArgentina(new Date("2026-11-16T02:00:00Z"))).toBe("2026-11-15");
  });
});

describe("sse", () => {
  it("un evento por bloque, en una sola línea de datos", () => {
    expect(sseEvent("message", { body: "a\nb" })).toBe('event: message\ndata: {"body":"a\\nb"}\n\n');
  });

  it("la URL del WebSocket sale de API_URL", () => {
    expect(brokerUrl("http://localhost:8081")).toBe("ws://localhost:8081/ws");
    expect(brokerUrl("https://api.adoptr.ar/")).toBe("wss://api.adoptr.ar/ws");
  });
});
