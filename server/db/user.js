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
    db.all(`SELECT * FROM Routines JOIN Users ON Routines.userId = Users.id WHERE Users.username = ?`, [username], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
    db.close();
  });
}


module.exports = {
    getExercisesForUser, getRoutinesForUser
  };