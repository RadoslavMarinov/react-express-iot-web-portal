const db = require("./db/mongo");
const devices = require("./devices/devClasses");

function constructUserObjectForDb(reqBody) {
  var obj = {};
  obj.devices = [];
  for (prop in reqBody) {
    if (prop === "deviceId") {
      obj.devices.push(devices.getDevice(reqBody[prop]));
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
  return new Promise(async (resolve, reject) => {
    let { username } = reqBody;
    let { deviceId } = reqBody;
    let { email } = reqBody;

    var device = await db.findOne("devices", { id: deviceId });

    if (!device) {
      reject("Device not foud");
      return;
    }
    if (await db.existsDoc("users", { username: username })) {
      reject("Username not available. Try another one.");
      return;
    }
    if (await db.existsDoc("users", { email: email })) {
      reject("User with this email already exists! Try another email.");
      return;
    }

    resolve(device);

    //--
  });
}

module.exports = {
  constructUserObjectForDb: constructUserObjectForDb,
  validateRegReques: validateRegReques,
  addUserSession: addUserSession
};
