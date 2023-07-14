const connectToDatabase = require('./db');
const bcrypt = require('bcrypt');

async function findUser(username) {
  const db = connectToDatabase();
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      db.close();
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row);
      } else {
        resolve(null);
      }
    });
  });
}


async function registerUser(username, password) {
    const db = connectToDatabase();
  
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      db.run(`INSERT INTO Users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
  
    } catch (err) {
      console.error(err);
    } finally {
      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Close the database connection.');
      });
    }
  }
  
  module.exports = {
    registerUser,
    findUser
  };