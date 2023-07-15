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

module.exports = {
    getExercisesForUser
  };