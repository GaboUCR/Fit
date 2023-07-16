const connectToDatabase = require("./db");

async function getExercisesForUser(username) {
    const db = connectToDatabase();
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM Exercises WHERE userId = (SELECT id FROM Users WHERE username = ?)", [username], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
}

function getRoutinesForUser(username) {
  const db = connectToDatabase();

  return new Promise((resolve, reject) => {
    db.all(`
      SELECT Routines.name as routineName, Exercises.name as exerciseName, Exercises.amount, Exercises.unit, Exercises.date
      FROM Users
      INNER JOIN Routines ON Users.id = Routines.userId
      INNER JOIN RoutineExercises ON Routines.id = RoutineExercises.routineId
      INNER JOIN Exercises ON RoutineExercises.exerciseId = Exercises.id
      WHERE Users.username = ?
    `, [username], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      // Transform the flat rows data into a nested structure
      const routines = rows.reduce((result, row) => {
        if (!result[row.routineName]) {
          result[row.routineName] = [];
        }

        result[row.routineName].push({
          name: row.exerciseName,
          amount: row.amount,
          unit: row.unit,
          date: row.date
        });

        return result;
      }, {});

      resolve(routines);
    });

    db.close();
  });
}

module.exports = {
    getExercisesForUser, getRoutinesForUser
  };