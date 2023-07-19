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
      SELECT Routines.name as routineName, ExerciseTypes.name as exerciseName, ExerciseInstances.amount, ExerciseInstances.unit, ExerciseInstances.id as instanceId
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
          instanceId: row.instanceId
        });

        return result;
      }, {});

      resolve(routines);
    });

    db.close();
  });
}

const run = (db, sql, params) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    })
  );

const get = (db, sql, params) =>
  new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    })
  );

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

  const userRow = await get(db, "SELECT id FROM Users WHERE username = ?", [username]);
  if (!userRow) throw new Error('User not found');
  const userId = userRow.id;

  let routineRow = await get(db, "SELECT id FROM Routines WHERE name = ? AND userId = ?", [routineName, userId]);
  let routineId = routineRow ? routineRow.id : await run(db, "INSERT INTO Routines (name, userId) VALUES (?, ?)", [routineName, userId]);

  for (const exerciseData of exercisesData) {
    let exerciseTypeRow = await get(db, "SELECT id FROM ExerciseTypes WHERE name = ?", [exerciseData.name]);
    let exerciseTypeId = exerciseTypeRow ? exerciseTypeRow.id : await run(db, "INSERT INTO ExerciseTypes (name) VALUES (?)", [exerciseData.name]);

    await run(db, "INSERT INTO ExerciseInstances (amount, unit, exerciseTypeId, routineId) VALUES (?, ?, ?, ?)", 
      [exerciseData.amount, exerciseData.unit, exerciseTypeId, routineId]
    );
  }
};

const addWorkoutToDB = async (db, username, completedExercises, date) => {
  // Obtén el userId del nombre de usuario
  const userQuery = `SELECT id FROM Users WHERE username = ?`;

  const userId = await new Promise((resolve, reject) => {
    db.get(userQuery, [username], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row.id);
    });
  });

  // Itera sobre completedExercises e inserta cada uno en la tabla
  for (let exercise of completedExercises) {
    const insertQuery = `INSERT INTO ExerciseRecord(date, exerciseInstanceId, UserId) VALUES (?, ?, ?)`;
    db.run(insertQuery, [date, exercise.instanceId, userId], function(err) {
      if (err) {
        return console.error(err.message);
      }
    });
  }
};


module.exports = {
    getExercisesForUser, getRoutinesForUser, processRoutineData, addWorkoutToDB
  }