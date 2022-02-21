"use strict";

import * as error from "../server/error";
import { NoticeFound, INoticeFound } from "./schema";
const mongoose = require("mongoose");


export async function list(): Promise<Array<INoticeFound>> {
  try {
    const result = await NoticeFound.find({enabled: true}).exec();
    if (!result) {
      throw error.ERROR_NOT_FOUND;
    }
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function findByID(noticeId: string): Promise<INoticeFound> {
    try {
      const result = await NoticeFound.findOne({
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

async function validateUpdate(body: INoticeFound): Promise<INoticeFound> {
  const result: error.ValidationErrorMessage = {
    messages: []
  };

  if (body.title && body.title.length > 100) {
    result.messages.push({ path: "title", message: "Hasta 100 caracteres solamente." });
  }

  if (body.description && body.description.length > 250) {
    result.messages.push({ path: "description", message: "Hasta 250 caracteres solamente." });
  }

  // if not user register, then should be a contact
  if (!body.user && !body.contact) {
    result.messages.push({ path: "contact", message: "Debe existir un contacto" });
  }

  if (body.contact && body.contact.name && body.contact.name.length > 100) {
    result.messages.push({ path: "contact", message: "Hasta 100 caracteres solamente." });
  }

  if (body.contact && !body.contact.phone) {
    result.messages.push({ path: "contact", message: "Debe existir un contacto" });
  }

  if (result.messages.length > 0) {
    return Promise.reject(result);
  }

  return Promise.resolve(body);
}

export async function update(noticeId: string, body: INoticeFound): Promise<INoticeFound> {
  try {
    let current: INoticeFound;
    if (noticeId) {
      current = await NoticeFound.findById(noticeId);
      if (!current) {
        throw error.ERROR_NOT_FOUND;
      }
    } else {
      current = new NoticeFound();
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

async function validateCreate(body: INoticeFound): Promise<INoticeFound> {
    const result: error.ValidationErrorMessage = {
        messages: []
    };

    if (body.title && body.title.length > 100) {
        result.messages.push({ path: "title", message: "Hasta 100 caracteres solamente." });
    }

    if (body.description && body.description.length > 250) {
        result.messages.push({ path: "description", message: "Hasta 250 caracteres solamente." });
    }
    // if not user register, then should be a contact
    if (!body.user && !body.contact) {
        result.messages.push({ path: "contact", message: "Debe existir un contacto" });
    }

    if (body.contact && body.contact.name && body.contact.name.length > 100) {
        result.messages.push({ path: "contact", message: "Hasta 100 caracteres solamente." });
    }

    if (body.contact && !body.contact.phone) {
        result.messages.push({ path: "contact", message: "Debe existir un contacto" });
    }

    if (!body.province) {
        result.messages.push({ path: "contact", message: "Debe indicarse una provincia" });
    }

    if (result.messages.length > 0) {
        return Promise.reject(result);
    }

    return Promise.resolve(body);
}


export async function create(body: INoticeFound): Promise<string> {
    try {
        const validated = await validateCreate(body);

        const noticeFound = new NoticeFound(body);
        noticeFound.title = validated.title;

        const saved = await noticeFound.save();
        return Promise.resolve(saved._id.toHexString());
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function remove(noticeId: string,): Promise<void> {
  try {
    const noticeFound = await NoticeFound.findOne({
      _id: noticeId
    }).exec();
    if (!noticeFound) {
      throw error.ERROR_NOT_FOUND;
    }
    noticeFound.enabled = false;
    await noticeFound.save();
  } catch (err) {
    return Promise.reject(err);
  }
}