import { getStorage } from "firebase-admin/storage";
import { initializeApp, getApps } from "firebase-admin/app";
import { ENV } from "./_core/env";

if (!getApps().length) {
  // If no GOOGLE_APPLICATION_CREDENTIALS, initialize with defaults
  initializeApp({
    storageBucket: "alien-mx.firebasestorage.app"
  });
}

const bucket = getStorage().bucket();

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));
  const file = bucket.file(key);

  const buffer = typeof data === "string" ? Buffer.from(data, "utf-8") : Buffer.from(data);

  await file.save(buffer, {
    contentType,
    public: true,
  });

  const url = `https://storage.googleapis.com/${bucket.name}/${key}`;
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const url = `https://storage.googleapis.com/${bucket.name}/${key}`;
  return { key, url };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const key = normalizeKey(relKey);
  const file = bucket.file(key);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return url;
}
