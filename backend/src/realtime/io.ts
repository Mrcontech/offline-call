import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { RT_NAMESPACE } from "@nexa/shared";
import { env } from "../config/env.js";
import { pubClient, subClient } from "../config/redis.js";
import { logger } from "../lib/logger.js";
import { socketAuth } from "./auth.js";
import { setIo } from "./emitter.js";
import { registerPresence } from "./presence.js";
import { registerMessaging } from "./messaging.js";
import { registerSignaling } from "./signaling.js";

/**
 * Boot the realtime layer. The Redis adapter lets presence/signaling fan out
 * correctly across multiple backend instances (horizontal scaling).
 */
export function initRealtime(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: env.CORS_ORIGINS, credentials: true },
    transports: ["websocket", "polling"],
    pingInterval: 25_000,
    pingTimeout: 20_000,
  });

  io.adapter(createAdapter(pubClient, subClient));
  setIo(io);

  const nsp = io.of(RT_NAMESPACE);
  nsp.use(socketAuth);
  // Isolation is by visibility (partitioning), not by blocking realtime access —
  // online/mobile users must always be able to connect. See middleware/networkLock.

  nsp.on("connection", (socket) => {
    const { userId, deviceId } = socket.data;
    logger.debug({ userId, deviceId, sid: socket.id }, "socket connected");

    registerPresence(nsp, socket);
    registerMessaging(nsp, socket);
    registerSignaling(nsp, socket);

    socket.on("error", (err) => logger.warn({ err: err.message }, "socket error"));
  });

  return io;
}
