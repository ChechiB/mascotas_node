"use strict";

import * as mongoose from "mongoose";

interface IContact extends mongoose.Document {
  name: string;
  phone: string;
  email: string;
}

export interface INoticeAdoption extends mongoose.Document {
  name: string;
  title: string;
  health: string;
  situation: string;
  description: string;
  date: Date;
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

export const NoticeAdoptionSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
    trim: true,
    required: "Titulo es requerido"
  },
  name: {
    type: String,
    default: "",
    trim: true,
    required: "Nombre es requerido"
  },
  situation: {
    type: String,
    default: "",
    trim: true,
    required: "Situacion es requerido"
  },
  description: {
    type: String,
    default: "",
    trim: true,
    required: "Descripcion es requerido"
  },
  health: {
    type: String,
    default: "",
  },
  contact:{
    type: ContactSchema,
    default: {}
  },
  date: {
    type: String,
    default: "",
    trim: true,
    required: "Visto por ultima vez requerido"
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
}, { collection: "noticeAdoption" });

/**
 * Antes de guardar
 */
NoticeAdoptionSchema.pre("save", function (this: INoticeAdoption, next) {
  this.updated = Date.now();

  next();
});

export const NoticeAdoption = mongoose.model<INoticeAdoption>("noticeAdoption", NoticeAdoptionSchema);

