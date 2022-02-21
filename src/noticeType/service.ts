"use strict";

import * as error from "../server/error";
import { NoticeType, INoticeType } from "./schema";
const mongoose = require("mongoose");


export async function list(): Promise<Array<INoticeType>> {
  try {
    const result = await NoticeType.find({enabled: true}).exec();
    if (!result) {
      throw error.ERROR_NOT_FOUND;
    }
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function validateUpdate(body: INoticeType): Promise<INoticeType> {
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

export async function update(noticeTypeId: string, body: INoticeType): Promise<INoticeType> {
  try {
    let current: INoticeType;
    if (noticeTypeId) {
      current = await NoticeType.findById(noticeTypeId);
      if (!current) {
        throw error.ERROR_NOT_FOUND;
      }
    } else {
      current = new NoticeType();
      current.id = mongoose.Types.ObjectId.createFromHexString(noticeTypeId);
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

async function validateCreate(body: INoticeType): Promise<INoticeType> {
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


export async function create(body: INoticeType): Promise<string> {
    try {
        const validated = await validateCreate(body);

        const noticeType = new NoticeType();
        noticeType.name = validated.name;

        const saved = await noticeType.save();
        return Promise.resolve(saved._id.toHexString());
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function remove(noticeTypeId: string,): Promise<void> {
  try {
    const noticeType = await NoticeType.findOne({
      _id: noticeTypeId
    }).exec();
    if (!noticeType) {
      throw error.ERROR_NOT_FOUND;
    }
    noticeType.enabled = false;
    await noticeType.save();
  } catch (err) {
    return Promise.reject(err);
  }
}