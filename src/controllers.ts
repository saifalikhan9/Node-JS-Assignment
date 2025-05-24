import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { calculateDistance } from "./utils";

const prisma = new PrismaClient();

export const addSchool = async (req: Request, res: Response) => {
  const { name, address, latitude, longitude } = req.body as {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };

  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  try {
    const school = await prisma.school.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude.toString()),
        longitude: parseFloat(longitude.toString()),
      },
    });

    res.status(201).json(school);
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to add school" });
    return;
  }
};

export const listSchools = async (req: Request, res: Response) => {
  const userLat = parseFloat(req.query.latitude as string);
  const userLon = parseFloat(req.query.longitude as string);

  if (isNaN(userLat) || isNaN(userLon)) {
      res.status(400).json({ error: "Invalid latitude or longitude" });
      return 
  }

  try {
    const schools = await prisma.school.findMany();

    const sorted = schools
      .map(school => ({
        ...school,
        distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

      res.json(sorted);
    return 
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch schools" });
      return 
  }
}
