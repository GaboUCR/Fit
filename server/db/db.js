const sqlite3 = require('sqlite3').verbose();

function connectToDatabase() {
  let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the exercise database.');
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
              id INTEGER PRIMARY KEY,
              username TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL
            );`);

    db.run(`CREATE TABLE IF NOT EXISTS Routines (
              id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              userId INTEGER,
              FOREIGN KEY(userId) REFERENCES Users(id)
            );`);

    db.run(`CREATE TABLE IF NOT EXISTS Exercises (
              id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              amount INTEGER NOT NULL,
              unit TEXT,          
              date TEXT NOT NULL,
              userId INTEGER,
              FOREIGN KEY(userId) REFERENCES Users(id)
            );`);

    db.run(`CREATE TABLE IF NOT EXISTS RoutineExercises (
              id INTEGER PRIMARY KEY,
              routineId INTEGER,
              exerciseId INTEGER,
              FOREIGN KEY(routineId) REFERENCES Routines(id),
              FOREIGN KEY(exerciseId) REFERENCES Exercises(id)
            );`);
  });

  return db;
}


module.exports = connectToDatabase;
