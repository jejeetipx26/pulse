import { randomInt } from "crypto";

// tanpa I, O, 0, 1 supaya tidak salah baca
const ABJAD = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function buatKode() {
  let s = "";
  for (let i = 0; i < 8; i++) s += ABJAD[randomInt(ABJAD.length)];
  return `ASP-${s}`;
}

export const POLA_KODE = /^ASP-[A-Z0-9]{8}$/;
