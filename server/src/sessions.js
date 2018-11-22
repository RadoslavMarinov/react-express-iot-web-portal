var db = require("./db/mongo");

function newSession() {
  var now_secs = Date.now() / 1000;
  var expireAfter_secs = 3600 * 12; //12h
  var sessionExpTime = now_secs + expireAfter_secs;

  return { expTime: sessionExpTime };
}

// const MAX_USER_SESSIONS = 3;

// async function updateSession(user) {
//   var { sessions } = user;

//   var now_secs = Date.now() / 1000;
//   var expireAfter_secs = 3600 * 12; //12h
//   var sessionExpTime = now_secs + expireAfter_secs;

//   var sessLength = sessions.unshift({ expTime: sessionExpTime });
//   if (sessLength > MAX_USER_SESSIONS) {
//     sessions.splice(MAX_USER_SESSIONS);
//   }

//   //Add session to DataBase
//   try {
//     var result = await db.updateField(
//       "users",
//       {
//         username: user.username
//       },
//       "sessions",
//       sessions
//     );
//   } catch (err) {
//     throw new Error(err);
//   }

//   if (result.nModified) {
//     return sessions[0];
//   }
//   return false;
// }

module.exports = { newSession: newSession };
