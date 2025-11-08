import axios from "axios";

const apiUrl = "http://localhost:3002";


export async function getGroups() {
  const res = await axios.get(`${apiUrl}/groups`);
  return res.data as { id: number; groupName: string }[];
}

export async function getMeetings(groupCode: number) {
  const res = await axios.get(`${apiUrl}/group/${groupCode}/meetings`);
  return res.data as any[];
}

export async function addNewMeeting(payload: any) {
  const res = await axios.post(`${apiUrl}/meetings`, payload);
  return res.data;
}