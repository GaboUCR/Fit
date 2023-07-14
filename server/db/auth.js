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

async function authenticateUser(username, password) {
  const db = connectToDatabase();
  try {
    const usermsg = await findUser(username);
    //No such user found
    if (!usermsg) {
      return { status: 460, usermsg:'no such username'};
    }
    const match = await bcrypt.compare(password, usermsg.password);
    // Wrong password
    if (!match) {
      return { status: 461, usermsg:'wrong password'};
    }

    delete usermsg.password;

    return { status: 200, usermsg:usermsg}; // o devolver algo útil para tu aplicación, quizás un objeto del usuario, token, etc.
  } catch (error) {
    console.error(error);
    return { status: 500, usermsg: 'Server error' };
  } finally {
    db.close();
  }
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
    findUser,
    authenticateUser
  };