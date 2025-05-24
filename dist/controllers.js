"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSchools = exports.addSchool = void 0;
const prisma_1 = require("../generated/prisma");
const utils_1 = require("./utils");
const prisma = new prisma_1.PrismaClient();
const addSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ error: "Invalid input" });
        return;
    }
    try {
        const school = yield prisma.school.create({
            data: {
                name,
                address,
                latitude: parseFloat(latitude.toString()),
                longitude: parseFloat(longitude.toString()),
            },
        });
        res.status(201).json(school);
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add school" });
        return;
    }
});
exports.addSchool = addSchool;
const listSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);
    if (isNaN(userLat) || isNaN(userLon)) {
        res.status(400).json({ error: "Invalid latitude or longitude" });
        return;
    }
    try {
        const schools = yield prisma.school.findMany();
        const sorted = schools
            .map(school => (Object.assign(Object.assign({}, school), { distance: (0, utils_1.calculateDistance)(userLat, userLon, school.latitude, school.longitude) })))
            .sort((a, b) => a.distance - b.distance);
        res.json(sorted);
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch schools" });
        return;
    }
});
exports.listSchools = listSchools;
