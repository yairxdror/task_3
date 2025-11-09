import { useEffect, useState } from "react";
import { addNewMeeting } from "../services/clientApi";
import type { Group } from "../Home/Home";
import "./AddMeetingModal.css";

const ROOMS = ["Innovation Hub", "Main Hall", "Tech Lab", "Project Room"];

type AddMeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  selectedGroupId?: number;
  onAdded?: (groupId: number) => void;
};

export default function AddMeetingModal({
  isOpen,
  onClose,
  groups,
  selectedGroupId,
  onAdded,
}: AddMeetingModalProps) {
  const [groupId, setGroupId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [room, setRoom] = useState<string>(ROOMS[0]);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setGroupId(
        typeof selectedGroupId === "number" ? String(selectedGroupId) : ""
      );
      setStartDate("");
      setEndDate("");
      setRoom(ROOMS[0]);
      setDescription("");
      setError("");
    }
  }, [isOpen, selectedGroupId]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!groupId || !startDate || !endDate) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await addNewMeeting({
        startDate,
        endDate,
        description,
        room,
        groupCode: Number(groupId),
      });

      if (onAdded) {
        onAdded(Number(groupId));
      }

      onClose();
    } catch (err) {
      setError("The meeting could not be added.");
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3 className="modal-title">Add a new meeting</h3>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-field">
            <h4>Group</h4>
            <select
              value={groupId}
              onChange={e => setGroupId(e.target.value)}
              className="modal-input"
            >
              <option value="">Select a group</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </label>

          <label className="modal-field">
            <h4>Room</h4>
            <select
              value={room}
              onChange={e => setRoom(e.target.value)}
              className="modal-input"
            >
              {ROOMS.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="modal-field">
            <h4>Start date</h4>
            <input
              type="datetime-local"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="modal-input"
            />
          </label>

          <label className="modal-field">
            <h4>End date</h4>
            <input
              type="datetime-local"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="modal-input"
            />
          </label>

          <label className="modal-field">
            <h4>Description</h4>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="modal-textarea"
              placeholder="optional"
            />
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}