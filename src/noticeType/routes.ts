"use strict";

import * as express from "express";
import { onlyLoggedIn } from "../token/passport";
import * as user from "../user/service";
import { ISessionRequest } from "../user/service";
import * as service from "./service";

/**
 * Modulo de typos de anuncios
 */
export function initModule(app: express.Express) {
  // Rutas del controlador
  app.route("/v1/notice/type")
    .get(list)
    .post(onlyLoggedIn, create);

  app.route("/v1/notice/type/:noticeTypeId")
    .post(onlyLoggedIn, update)
    .delete(onlyLoggedIn, remove);
}


async function list(req: ISessionRequest, res: express.Response) {
  const result = await service.list();

  res.json(result.map(u => {
    return {
      id: u.id,
      name: u.name
    };
  }));
}

async function create(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "admin");
  const result = await service.create(req.body);
  res.json({ id: result });
}

 async function update(req: ISessionRequest, res: express.Response) {
    const result = await service.update(req.params.noticeTypeId, req.body);
    res.json({
      id: result.id,
      name: result.name
    });
  }

async function remove(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "admin");
  await service.remove(req.params.noticeTypeId);
  res.send();
}
