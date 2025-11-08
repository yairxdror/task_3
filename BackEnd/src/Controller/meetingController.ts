import express from "express";
import { addNewMeeting, getGroups, getMeetings } from "../services/meetingServices";

export const groupRouter = express.Router();

groupRouter.get("/groups", async (_req, res, next) => {
  try { res.json(await getGroups()); } catch (e) { next(e); }
});

groupRouter.get("/group/:groupCode/meetings", async (req, res, next) => {
  try {
    const groupCode = Number(req.params.groupCode);
    if (Number.isNaN(groupCode)) return res.status(400).json({ error: "groupCode לא תקין" });
    res.json(await getMeetings(groupCode));
  } catch (e) { next(e); }
});

groupRouter.post("/meetings", async (req, res, next) => {
  try {
    const { startDate, endDate, description = "", room, groupCode } = req.body ?? {};
    if (!startDate || !endDate || !room || typeof groupCode !== "number") {
      return res.status(400).json({ error: "שדות חובה חסרים או סוגי נתונים שגויים" });
    }
    res.status(201).json(await addNewMeeting({ startDate, endDate, description, room, groupCode }));
  } catch (e) { next(e); }
});
