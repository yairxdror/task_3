import { useEffect, useState } from "react";
import { getGroups, getMeetings } from "../services/clientApi";
import AddMeetingModal from "../Components/AddMeetingModal";
import "./Home.css";

export type Group = {
  id: number;
  groupName: string;
};

export type Meeting = {
  id: number;
  groupName: string;
  startDate: string;
  endDate: string;
  description: string;
  room: string;
  groupCode: number;
};

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return value;
  }
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    async function loadGroups() {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load groups");
      }
    }
    loadGroups();
  }, []);

  async function loadMeetings(groupId: number) {
    try {
      const data = await getMeetings(groupId);
      setMeetings(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load meetings");
    }
  }

  async function handleSelect(groupIdStr: string) {
    const groupId = groupIdStr ? Number(groupIdStr) : "";
    setSelectedGroupId(groupId);
    setMeetings([]);
    setError("");

    if (typeof groupId === "number") {
      await loadMeetings(groupId);
    }
  }

  function handleOpenModal() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleMeetingAdded(groupId: number) {
    if (typeof selectedGroupId === "number" && selectedGroupId === groupId) {
      await loadMeetings(groupId);
    }
  }

  const selectedGroupName =
    typeof selectedGroupId === "number"
      ? groups.find(g => g.id === selectedGroupId)?.groupName
      : "";

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Meeting management</h1>
      </header>

      <div className="controls-row">
        <select
          id="groupSelect"
          onChange={e => handleSelect(e.target.value)}
          value={selectedGroupId}
          className="group-select"
        >
          <option value="">- Select a group -</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.groupName}
            </option>
          ))}
        </select>

        <button onClick={handleOpenModal} className="add-meeting-btn">
          Add a new meeting
        </button>
      </div>

      {error && <div className="error-box">Error, {error}</div>}

      {typeof selectedGroupId === "number" && (
        <section className="meetings-section">
          <h2 className="meetings-title">{selectedGroupName}</h2>

          {meetings.length === 0 && (
            <div className="empty-state">No meetings found for this group</div>
          )}

          {meetings.length > 0 && (
            <table className="meetings-table">
              <thead>
                <tr>
                  <th className="table-th">Start date</th>
                  <th className="table-th">End date</th>
                  <th className="table-th">Room</th>
                  <th className="table-th">Description</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map(meeting => (
                  <tr key={meeting.id}>
                    <td className="table-td">{formatDate(meeting.startDate)}</td>
                    <td className="table-td">{formatDate(meeting.endDate)}</td>
                    <td className="table-td">{meeting.room}</td>
                    <td className="table-td">{meeting.description || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      <AddMeetingModal
        isOpen={showModal}
        onClose={handleCloseModal}
        groups={groups}
        defaultGroupId={typeof selectedGroupId === "number" ? selectedGroupId : undefined}
        onAdded={handleMeetingAdded}
      />
    </div>
  );
}
