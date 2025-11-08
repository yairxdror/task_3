import { useEffect, useState } from "react";
import { addNewMeeting } from "../services/clientApi";
import type { Group } from "../Home/Home";
import "./AddMeetingModal.css";

const ROOMS = ["Innovation Hub", "Main Hall", "Tech Lab", "Project Room"];

type AddMeetingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    groups: Group[];
    defaultGroupId?: number;
    onAdded?: (groupId: number) => void;
};

export default function AddMeetingModal({
    isOpen,
    onClose,
    groups,
    defaultGroupId,
    onAdded,
}: AddMeetingModalProps) {
    const [formGroupId, setFormGroupId] = useState<number | "">("");
    const [formStart, setFormStart] = useState("");
    const [formEnd, setFormEnd] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formRoom, setFormRoom] = useState(ROOMS[0]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setFormGroupId(defaultGroupId ?? "");
            setFormStart("");
            setFormEnd("");
            setFormDesc("");
            setFormRoom(ROOMS[0]);
            setError("");
        }
    }, [isOpen, defaultGroupId]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!formGroupId || !formStart || !formEnd || !formRoom) {
            setError("All required fields must be filled in.");
            return;
        }

        try {
            await addNewMeeting({
                startDate: formStart,
                endDate: formEnd,
                description: formDesc,
                room: formRoom,
                groupCode: formGroupId,
            });

            if (onAdded) {
                onAdded(formGroupId);
            }

            onClose();
        } catch (e: any) {
            setError(e?.message || "Failed to add meeting");
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <h3 className="modal-title">Add a new meeting</h3>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <label className="modal-field">
                        <h4>group</h4>
                        <select
                            value={formGroupId}
                            onChange={e => setFormGroupId(e.target.value ? Number(e.target.value) : "")}
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
                        <h4>room</h4>
                        <select
                            value={formRoom}
                            onChange={e => setFormRoom(e.target.value)}
                            className="modal-input"
                        >
                            {ROOMS.map(room => (
                                <option key={room} value={room}>
                                    {room}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="modal-field">
                        <h4>Start date</h4>
                        <input
                            type="datetime-local"
                            value={formStart}
                            onChange={e => setFormStart(e.target.value)}
                            className="modal-input"
                            autoComplete="off"
                        />
                    </label>

                    <label className="modal-field">
                        <h4>End date</h4>
                        <input
                            type="datetime-local"
                            value={formEnd}
                            onChange={e => setFormEnd(e.target.value)}
                            className="modal-input"
                            autoComplete="off"
                        />
                    </label>

                    <label className="modal-field">
                        <h4>Description</h4>
                        <textarea
                            value = {formDesc}
                            onChange = {e => setFormDesc(e.target.value)}
                            className = "modal-textarea"
                            placeholder = "Meeting description (optional)"
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
