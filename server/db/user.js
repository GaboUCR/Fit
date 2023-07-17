const connectToDatabase = require("./db");

async function getExercisesForUser(username) {
  const db = connectToDatabase();
  return new Promise((resolve, reject) => {
    db.all(`SELECT ExerciseInstances.*, ExerciseTypes.name 
            FROM ExerciseInstances 
            INNER JOIN Routines ON Routines.id = ExerciseInstances.routineId
            INNER JOIN Users ON Users.id = Routines.userId
            INNER JOIN ExerciseTypes ON ExerciseTypes.id = ExerciseInstances.exerciseTypeId
            WHERE Users.username = ?`,
    [username], (err, rows) => {
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
      SELECT Routines.name as routineName, ExerciseTypes.name as exerciseName, ExerciseInstances.amount, ExerciseInstances.unit, ExerciseInstances.date
      FROM Users
      INNER JOIN Routines ON Users.id = Routines.userId
      INNER JOIN ExerciseInstances ON Routines.id = ExerciseInstances.routineId
      INNER JOIN ExerciseTypes ON ExerciseInstances.exerciseTypeId = ExerciseTypes.id
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