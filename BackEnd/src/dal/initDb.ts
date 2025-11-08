import { Database as DB } from "better-sqlite3";
import { openDb, runQuery } from "./dal";


function initDbSchema(db: DB): void {

    const ddl = `
CREATE TABLE IF NOT EXISTS meetings (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 startDate date NOT NULL DEFAULT (datetime('now')),
 endDate date NOT NULL DEFAULT (datetime('now')),
 description TEXT,
 room TEXT NOT NULL,
 groupCode INTEGER NOT NULL,
 FOREIGN KEY (groupCode) REFERENCES groups(id) ON DELETE RESTRICT
 );

CREATE TABLE IF NOT EXISTS groups (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 groupName TEXT NOT NULL
 );
    `;

    db.exec("BEGIN");
    try {
        db.exec(ddl);
        db.exec("COMMIT");
    } catch (e) {
        db.exec("ROLLBACK");
        throw e;
    }
}

function generateSampleData() {
    //groups
    runQuery("INSERT INTO groups (groupName) VALUES ('Frontend Dev Team');");
    runQuery("INSERT INTO groups (groupName) VALUES ('Backend Services');");
    runQuery("INSERT INTO groups (groupName) VALUES ('Mobile App Squad');");
    runQuery("INSERT INTO groups (groupName) VALUES ('AI & Data Lab');");
    runQuery("INSERT INTO groups (groupName) VALUES ('Frontend Dev Team - Alpha');");
    runQuery("INSERT INTO groups (groupName) VALUES ('Backend Services - Core');");
    runQuery("INSERT INTO groups (groupName) VALUES ('Mobile App Squad - Beta');");
    runQuery("INSERT INTO groups (groupName) VALUES ('AI & Data Lab - Vision');");
    runQuery("INSERT INTO groups (groupName) VALUES ('Frontend Dev Team - UI/UX');");
    runQuery("INSERT INTO groups (groupName) VALUES ('Backend Services - API');");

    // //meetings
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-01 09:00:00', '2025-11-01 10:30:00', 'Sprint planning for new frontend modules', 'Innovation Hub', 1);");
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-02 11:00:00', '2025-11-02 12:00:00', 'Database performance tuning and API review', 'Main Hall', 2);");
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-03 14:00:00', '2025-11-03 15:30:00', 'App layout and navigation flow updates', 'Innovation Hub', 3);");
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-04 10:00:00', '2025-11-04 11:15:00', 'AI model accuracy evaluation and feedback', 'Tech Lab', 4);");
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-05 09:00:00', '2025-11-05 10:00:00', 'Server deployment checklist discussion', 'Tech Lab', 5);");
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-06 13:00:00', '2025-11-06 14:00:00', 'CI/CD automation improvements', 'Main Hall', 6);");
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-07 10:00:00', '2025-11-07 11:30:00', 'Security audit results and next steps', 'Innovation Hub', 7);");
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-08 15:00:00', '2025-11-08 16:00:00', 'Regression testing summary and reports', 'Project Room', 8);");
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-09 09:30:00', '2025-11-09 10:30:00', 'Product analytics quarterly insights', 'Main Hall', 9);");
    runQuery("INSERT INTO meetings (startDate, endDate, description, room, groupCode) VALUES ('2025-11-10 12:00:00', '2025-11-10 13:15:00', 'User feedback and UX improvements', 'Project Room', 10);");

}

console.log("Starting init DB");

openDb().then((db) => {
    initDbSchema(db);
    console.log("Done init DB");
})
// generateSampleData();