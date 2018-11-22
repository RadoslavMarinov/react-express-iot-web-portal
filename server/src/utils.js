const db = require("./db/mongo");

function constructUserObjectForDb(reqBody) {
  var obj = {};
  obj.devices = [];
  for (prop in reqBody) {
    if (prop === "deviceId") {
      obj.devices.push(reqBody[prop]);
    } else {
      obj[prop] = reqBody[prop];
    }
  }
  return obj;
}

async function addUserSession(username, obj) {
  const result = await db.appendOneToArray(
    "users",
    {
      username: username
    },
    "sessions",
    obj
  );
  if (result.result.nModified > 0) {
    return true;
  }
  return false;
}

function validateRegReques(reqBody) {
  return new Promise((resolve, reject) => {
    let { username } = reqBody;
    let { deviceId } = reqBody;
    let { email } = reqBody;

    db.existsDoc("devices", { deviceId: deviceId })
      .then(result => {
        if (result) {
          console.log("Device exists! :)");
          return true;
        }
        throw "Device not available!";
      })
      .then(async result => {
        let existUser = await db.existsDoc("users", { username: username });
        if (existUser) {
          throw "User with this name already exists! Try another username.";
        }
        console.log("Username accepted!");
        return true;
      })
      .then(async result => {
        let emailExists = await db.existsDoc("users", { email: email });
        if (emailExists) {
          throw "User with this email already exists! Try another email.";
        }
        resolve(true);
      })
      .then(() => {})
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = {
  constructUserObjectForDb: constructUserObjectForDb,
  validateRegReques: validateRegReques,
  addUserSession: addUserSession
};
