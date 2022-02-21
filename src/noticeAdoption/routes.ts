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
  app.route("/v1/notice_adoption")
    .get(list)
    .post(onlyLoggedIn, create);

  app.route("/v1/notice_adoption/:noticeId")
    .get(onlyLoggedIn, read)
    .post(onlyLoggedIn, update)
    .delete(onlyLoggedIn, remove);
}

async function read(req: ISessionRequest, res: express.Response) {
    const result = await service.findByID(req.params.noticeId);
    res.json({
        name: result.name,
        title: result.title,
        health: result.health,
        situation: result.situation,
        description: result.description,
        date: result.date,
        province: result.province,
        contact: result.contact
    });
}

async function list(req: ISessionRequest, res: express.Response) {
  const result = await service.list();

  res.json(result.map(u => {
    return {
        name: u.name,
        title: u.title,
        health: u.health,
        situation: u.situation,
        description: u.description,
        date: u.date,
        province: u.province,
        contact: u.contact
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
        name: result.name,
        title: result.title,
        health: result.health,
        situation: result.situation,
        description: result.description,
        date: result.date,
        province: result.province,
        contact: result.contact,
    });
  }

async function remove(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "user");
  await service.remove(req.params.noticeId);
  res.send();
}
