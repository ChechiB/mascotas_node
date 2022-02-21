"use strict";

import * as mongoose from "mongoose";

export interface INoticeType extends mongoose.Document {
  name: string;
  updated: Number;
  created: Number;
  enabled: Boolean;
}

/**
 * Esquema de Tipos de anuncios
 */
export const NoticeTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    trim: true,
    required: "Nombre es requerido"
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
}, { collection: "noticeType" });

/**
 * Antes de guardar
 */
 NoticeTypeSchema.pre("save", function (this: INoticeType, next) {
  this.updated = Date.now();

  next();
});

export const NoticeType = mongoose.model<INoticeType>("NoticeType", NoticeTypeSchema);
