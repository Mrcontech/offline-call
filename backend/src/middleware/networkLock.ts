import type { NextFunction, Request, Response } from "express";

/**
 * Office isolation is enforced by VISIBILITY partitioning (users.service) and
 * per-account login binding (auth.service) — NOT by blocking network access.
 * Online/mobile users must always be able to reach the app; only who they can
 * *see* is partitioned by network. This gate is therefore a pass-through, kept
 * in the route wiring so the isolation model stays explicit and easy to restore.
 */
export async function enforceNetworkLock(_req: Request, _res: Response, next: NextFunction) {
  return next();
}
