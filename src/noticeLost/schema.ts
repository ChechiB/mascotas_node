"use strict";

import * as mongoose from "mongoose";

export interface INoticeLost extends mongoose.Document {
  name: string;
  title: string;
  description: string;
  lastSeen: Date;
  user: mongoose.Schema.Types.ObjectId;
  province: mongoose.Schema.Types.ObjectId;
  reward: number;
  updated: Number;
  created: Number;
  enabled: Boolean;
}

/**
 * Esquema de Anuncios mascotas perdidas
 */
export const NoticeLostSchema = new mongoose.Schema({
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
  lastSeen: {
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "Usuario es requerido"
  },
  reward: {
    type: Number,
    default: 0
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
