var MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
// var url = "mongodb://localhost:27017/site";
var url = "mongodb://elapp:Alphatraper0@ds155833.mlab.com:55833/elapp";
const dbName = "elapp";

var collections = ["users"];
var dataBase = false;
var dbClient = false;

function connectToDb() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      { useNewUrlParser: true }
    )
      .then(client => {
        console.log("Data Base Connected!");
        dataBase = client.db(dbName);
        dbClient = client;
        resolve("1");
      })
      .catch(err => {
        console.log(err);
      });
  });
}

async function findOne(collectionName, query) {
  return new Promise(async (resolve, reject) => {
    //
    if (!(await connectDb())) {
      reject("Unable to connect to database!");
    }

    var collection = dataBase.collection(collectionName);

    if (query.hasOwnProperty("_id")) {
      if (!ObjectId.isValid(query._id)) {
        reject("Object not Valid");
      }

      collection.findOne({ _id: ObjectId(query._id) }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      collection.findOne(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }
  });
}

async function findMany(collectionName, query) {
  if (dataBase == false) {
    await connectToDb();
  }
  return new Promise(function(resolve, reject) {
    var collection = dataBase.collection(collectionName);

    collection.find(query).toArray((err, docs) => {
      if (err) {
        reject("Rejection at Find function", err);
      } else {
        if (docs.length > 0) {
          resolve(docs);
        }
        resolve(false);
      }
    });
  });
}

// Update field with new value
async function updateField(collectionName, query, field, value) {
  if (dataBase == false) {
    await connectToDb();
  }
  return new Promise(function(resolve, reject) {
    var collection = dataBase.collection(collectionName);
    collection.updateOne(query, { $set: { [field]: value } }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.result);
      }
    });
  });
}

async function insertDoc(collectionName, doc) {
  if (dataBase == false) {
    await connectToDb();
  }

  return new Promise((resolve, reject) => {
    // if (!Array.isArray(doc)) {
    //   reject('parameter "doc" must be array!');
    // }
    let docs = [];
    docs.push(doc);

    let collection = dataBase.collection(collectionName);
    collection.insertMany(docs, function(err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

async function appendkeyValue(collectionName, query, pair) {
  if (dataBase == false) {
    await connectToDb();
  }
  return new Promise((resolve, reject) => {
    let collection = dataBase.collection(collectionName);
    collection.updateOne(query, { $set: pair }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// ARRAY functions
async function appendOneToArray(collectionName, query, arrName, arrEl) {
  if (dataBase == false) {
    await connectToDb();
  }

  return new Promise((resolve, reject) => {
    let collection = dataBase.collection(collectionName);

    collection.updateOne(
      query,
      { $push: { [arrName]: arrEl } },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function removeDoc(collectionName, query) {
  if (dataBase == false) {
    await connectToDb();
  }

  return new Promise(async (resolve, reject) => {
    let collection = dataBase.collection(collectionName);
    collection
      .deleteOne(query)
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function existsDoc(collection, query) {
  const result = await findMany(collection, query);
  if (result.length) {
    return true;
  }
  return false;
}

module.exports = {
  findMany: findMany,
  findOne: findOne,
  insertDoc: insertDoc,
  updateField: updateField,
  existsDoc: existsDoc,
  removeDoc: removeDoc,
  appendkeyValue: appendkeyValue,
  appendOneToArray: appendOneToArray
};

async function connectDb() {
  if (dataBase === false) {
    try {
      await connectToDb();
    } catch (error) {
      return false;
    }
  }
  return true;
}
