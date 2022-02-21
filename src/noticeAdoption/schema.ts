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
  health: Array<string>;
  situation: string;
  description: string;
  foundDate: Date;
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  health: [{
      type: String
  }],
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
}, { collection: "noticeAdoption" });

/**
 * Antes de guardar
 */
NoticeAdoptionSchema.pre("save", function (this: INoticeAdoption, next) {
  this.updated = Date.now();

  next();
});

export const NoticeAdoption = mongoose.model<INoticeAdoption>("noticeAdoption", NoticeAdoptionSchema);

