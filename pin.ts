const PIN_HASH_KEY = "refleksi_pin_hash";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text + "refleksi_salt_v1");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function savePin(pin: string): Promise<void> {
  const hash = await sha256(pin);
  localStorage.setItem(PIN_HASH_KEY, hash);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = localStorage.getItem(PIN_HASH_KEY);
  if (!stored) return false;
  const hash = await sha256(pin);
  return hash === stored;
}

export function hasPin(): boolean {
  return !!localStorage.getItem(PIN_HASH_KEY);
}

export function removePin(): void {
  localStorage.removeItem(PIN_HASH_KEY);
}
