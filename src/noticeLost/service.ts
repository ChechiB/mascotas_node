"use strict";

import * as error from "../server/error";
import { NoticeLost, INoticeLost } from "./schema";
const mongoose = require("mongoose");


export async function list(): Promise<Array<INoticeLost>> {
  try {
    const result = await NoticeLost.find({enabled: true}).exec();
    if (!result) {
      throw error.ERROR_NOT_FOUND;
    }
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function findByID(noticeId: string): Promise<INoticeLost> {
    try {
      const result = await NoticeLost.findOne({
        _id: noticeId,
        enabled: true
    });
      if (!result) {
        throw error.ERROR_NOT_FOUND;
      }
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

async function validateUpdate(body: INoticeLost): Promise<INoticeLost> {
  const result: error.ValidationErrorMessage = {
    messages: []
  };

  if (body.name && body.name.length > 256) {
    result.messages.push({ path: "name", message: "Hasta 256 caracteres solamente." });
  }

  if (result.messages.length > 0) {
    return Promise.reject(result);
  }

  return Promise.resolve(body);
}

export async function update(noticeId: string, body: INoticeLost): Promise<INoticeLost> {
  try {
    let current: INoticeLost;
    if (noticeId) {
      current = await NoticeLost.findById(noticeId);
      if (!current) {
        throw error.ERROR_NOT_FOUND;
      }
    } else {
      current = new NoticeLost();
      current.id = mongoose.Types.ObjectId.createFromHexString(noticeId);
    }

    const validBody = await validateUpdate(body);
    if (validBody.name) {
      current.name = validBody.name;
    }

    await current.save();
    return Promise.resolve(current);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function validateCreate(body: INoticeLost): Promise<INoticeLost> {
    const result: error.ValidationErrorMessage = {
        messages: []
    };

    if (!body.name || body.name.length <= 0) {
        result.messages.push({ path: "name", message: "No puede quedar vacío." });
    } else if (body.name.length > 256) {
        result.messages.push({ path: "name", message: "Hasta 256 caracteres solamente." });
    }

    if (result.messages.length > 0) {
        return Promise.reject(result);
    }

    return Promise.resolve(body);
}


export async function create(body: INoticeLost): Promise<string> {
    try {
        console.log(body);
        const validated = await validateCreate(body);

        const noticeLost = new NoticeLost(body);
        noticeLost.name = validated.name;

        const saved = await noticeLost.save();
        return Promise.resolve(saved._id.toHexString());
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function remove(noticeId: string,): Promise<void> {
  try {
    const noticeLost = await NoticeLost.findOne({
      _id: noticeId
    }).exec();
    if (!noticeLost) {
      throw error.ERROR_NOT_FOUND;
    }
    noticeLost.enabled = false;
    await noticeLost.save();
  } catch (err) {
    return Promise.reject(err);
  }
}