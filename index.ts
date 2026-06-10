import { onRequest } from "firebase-functions/v2/https";
import app from "./server/_core/index"; // Your existing Express app

export const api = onRequest({ cors: true, memory: "1GiB" }, app);
