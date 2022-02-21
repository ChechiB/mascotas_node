"use strict";

import * as express from "express";
import * as image from "../image/routes";
import * as pet from "../pet/routes";
import * as profile from "../profile/routes";
import * as profilePicture from "../profileImage/routes";
import * as provinces from "../provinces/routes";
import * as user from "../user/routes";
import * as noticeType from "../noticeType/routes";
import * as noticeLost from "../noticeLost/routes";
import * as noticeFound from "../noticeFound/routes";
import * as noticeAdoption from "../noticeAdoption/routes";

/**
 * Desacoplamos las rutas, los devs pueden tocar este archivo
 * libremente, pero no el archivo express.ts
 */
export function initModules(app: express.Express) {
    user.initModule(app);
    provinces.initModule(app);
    profile.initModule(app);
    image.initModule(app);
    pet.initModule(app);
    profilePicture.initModule(app);
    noticeType.initModule(app);
    noticeLost.initModule(app);
    noticeFound.initModule(app);
    noticeAdoption.initModule(app);
}

