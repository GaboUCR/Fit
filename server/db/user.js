const connectToDatabase = require("./db");

async function getExercisesForUser(username) {
  const db = connectToDatabase();
  return new Promise((resolve, reject) => {
    db.all(`SELECT ExerciseInstances.*, ExerciseTypes.name, ExerciseRecord.date
            FROM ExerciseRecord 
            INNER JOIN Users ON Users.id = ExerciseRecord.UserId
            INNER JOIN ExerciseInstances ON ExerciseInstances.id = ExerciseRecord.exerciseInstanceId
            INNER JOIN ExerciseTypes ON ExerciseTypes.id = ExerciseInstances.exerciseTypeId
            WHERE Users.username = ?`,
    [username], (err, rows) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        // map rows to the expected format
        const exercises = rows.map(row => ({
          name: row.name,
          amount: row.amount,
          unit: row.unit,
          date: row.date
        }));
        resolve(exercises);
      }
    });
  });
}

function getRoutinesForUser(username) {
  const db = connectToDatabase();

  return new Promise((resolve, reject) => {
    db.all(`
      SELECT Routines.name as routineName, ExerciseTypes.name as exerciseName, ExerciseInstances.amount, ExerciseInstances.unit
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
          unit: row.unit
        });

        return result;
      }, {});

      resolve(routines);
    });

    db.close();
  });
}

const processRoutineData = async (db, username, routineData) => {
  const dataLines = routineData.split('\n');
  const routineName = dataLines[0];
  const exercisesData = dataLines.slice(1).map(line => {
      const [name, amountUnit] = line.split(' - ');
      if (!amountUnit) throw new Error('Ejercicio mal formateado');
      const [amount, unit] = amountUnit.split(' ');
      if (!unit) throw new Error('Ejercicio mal formateado');
      return { name, amount: parseInt(amount, 10), unit };
  });

  // Get the user's id
  db.get("SELECT id FROM Users WHERE username = ?", [username], (err, row) => {
    if (err) throw err;
    if (!row) throw new Error('User not found');
    const userId = row.id;

    let routineId;

    // Check if the routine exists
    db.get("SELECT id FROM Routines WHERE name = ? AND userId = ?", [routineName, userId], (err, row) => {
      if (err) throw err;
      
      if (row) {
          routineId = row.id;
      } else {
          // If not, create a new one
          db.run("INSERT INTO Routines (name, userId) VALUES (?, ?)", [routineName, userId], function(err) {
              if (err) throw err;
              routineId = this.lastID;
          });
      }

      // Add the exercises
      for (const exerciseData of exercisesData) {
          let exerciseTypeId;
          db.get("SELECT id FROM ExerciseTypes WHERE name = ?", [exerciseData.name], (err, row) => {
              if (err) throw err;
              if (row) {
                  exerciseTypeId = row.id;
              } else {
                  // If the exercise type doesn't exist, create a new one
                  db.run("INSERT INTO ExerciseTypes (name) VALUES (?)", [exerciseData.name], function(err) {
                      if (err) throw err;
                      exerciseTypeId = this.lastID;
                  });
              }

              // Insert the exercise instance
              db.run("INSERT INTO ExerciseInstances (amount, unit, exerciseTypeId, routineId) VALUES (?, ?, ?, ?)", 
                  [exerciseData.amount, exerciseData.unit, exerciseTypeId, routineId], 
                  err => {
                      if (err) throw err;
                  }
              );
          });
      }
    });
  });
};

module.exports = {
    getExercisesForUser, getRoutinesForUser, processRoutineData
  };