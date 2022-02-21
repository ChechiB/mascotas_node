"use strict";

import * as mongoose from "mongoose";

interface IContact extends mongoose.Document {
  name: string;
  phone: string;
  email: string;
}
export interface INoticeLost extends mongoose.Document {
  pet: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  contact: IContact;
  province: mongoose.Schema.Types.ObjectId;
  reward: string;
  updated: Number;
  created: Number;
  enabled: Boolean;
}

/**
 * Esquema de Anuncios mascotas perdidas
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

export const NoticeLostSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
        trim: true,
        required: "Titulo es requerido"
    },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: "Mascota es requerido"
  },
  date: {
    type: Date,
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
  contact:{
    type: ContactSchema,
    default: {}
  },
  reward: {
    type: String,
    default: ""
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
}, { collection: "noticeLost" });

/**
 * Antes de guardar
 */
 NoticeLostSchema.pre("save", function (this: INoticeLost, next) {
  this.updated = Date.now();

  next();
});

export const NoticeLost = mongoose.model<INoticeLost>("NoticeLost", NoticeLostSchema);
