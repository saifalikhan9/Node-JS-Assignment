"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("./controllers");
const router = (0, express_1.Router)();
router.post("/addSchool", controllers_1.addSchool);
router.get("/listSchools", controllers_1.listSchools);
exports.default = router;
