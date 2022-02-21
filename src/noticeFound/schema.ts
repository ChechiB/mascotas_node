"use strict";

import * as mongoose from "mongoose";

interface IContact extends mongoose.Document {
  name: string;
  phone: string;
  email: string;
}

export interface INoticeFound extends mongoose.Document {
  name: string;
  title: string;
  description: string;
  date: Date;
  user: mongoose.Schema.Types.ObjectId;
  province: mongoose.Schema.Types.ObjectId;
  contact: IContact;
  updated: Number;
  created: Number;
  enabled: Boolean;
}

/**
 * Esquema de Anuncios mascotas encontradas
 */
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  }
}, { _id : false });

export const NoticeFoundSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
    trim: true,
    required: "Titulo es requerido"
  },
  date: {
    type: String,
    default: "",
    trim: true,
    required: "Visto por ultima vez requerido"
  },
  description: {
    type: String,
    default: "",
    trim: true,
    required: "Descripcion requerida"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  contact:{
    type: ContactSchema,
    default: {}
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provinces",
    required: "Provincia es requerido"
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  created: {
    type: Date,
    default: Date.now()
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { collection: "noticeFound" });

/**
 * Antes de guardar
 */
NoticeFoundSchema.pre("save", function (this: INoticeFound, next) {
  this.updated = Date.now();

  next();
});

export const NoticeFound = mongoose.model<INoticeFound>("noticeFound", NoticeFoundSchema);
