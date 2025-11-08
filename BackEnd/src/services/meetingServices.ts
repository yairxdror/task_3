import { runQuery } from "../dal/dal";


export async function getGroups() {
  const q = `SELECT id, groupName FROM groups ORDER BY groupName`;
  const res = await runQuery(q) as any[];
  return res.map(r => ({ id: r.id, groupName: r.groupName }));
}

export async function getMeetings(groupCode: number) {
  const q = `
    SELECT 
      m.id AS id,
      g.groupName,
      m.startDate,
      m.endDate,
      m.description,
      m.room,
      m.groupCode
    FROM groups AS g
    INNER JOIN meetings AS m ON g.id = m.groupCode
    WHERE m.groupCode = ?
    ORDER BY m.startDate
  `;
  const res = await runQuery(q, [groupCode]) as any[];
  return res.map(row => ({
    id: row.id,
    groupName: row.groupName,
    startDate: row.startDate,
    endDate: row.endDate,
    description: row.description,
    room: row.room,
    groupCode: row.groupCode,
  }));
}

export async function addNewMeeting(meeting: {
    startDate: string;
    endDate: string;
    description: string;
    room: string;
    groupCode: number;
}) {

    const insertQuery = `
        INSERT INTO meetings (startDate, endDate, description, room, groupCode)
        VALUES (?, ?, ?, ?, ?)
    `;

    await runQuery(insertQuery, [
        meeting.startDate,
        meeting.endDate,
        meeting.description,
        meeting.room,
        meeting.groupCode
    ]);

    return { message: "Meeting added successfully" };
}
