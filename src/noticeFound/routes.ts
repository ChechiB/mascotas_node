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
  app.route("/v1/notice_found")
    .get(list)
    .post(onlyLoggedIn, create);

  app.route("/v1/notice_found/:noticeId")
    .get(onlyLoggedIn, read)
    .post(onlyLoggedIn, update)
    .delete(onlyLoggedIn, remove);
}

async function read(req: ISessionRequest, res: express.Response) {
    const result = await service.findByID(req.params.noticeId);
    res.json({
        id: result.id,
        title: result.title,
        date: result.date,
        description: result.description,
        user: result.user,
        contact: result.contact,
        province: result.province
    });
}

async function list(req: ISessionRequest, res: express.Response) {
  const result = await service.list();

  res.json(result.map(u => {
    return {
        id: u.id,
        title: u.title,
        date: u.date,
        description: u.description,
        user: u.user,
        contact: u.contact,
        province: u.province
    };
  }));
}

async function create(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "user");
  const result = await service.create(req.body);
  res.json({ id: result });
}

 async function update(req: ISessionRequest, res: express.Response) {
    const result = await service.update(req.params.noticeId, req.body);
    res.json({
        id: result.id,
        title: result.title,
        date: result.date,
        description: result.description,
        user: result.user,
        contact: result.contact,
        province: result.province
    });
  }

async function remove(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "user");
  await service.remove(req.params.noticeId);
  res.send();
}
