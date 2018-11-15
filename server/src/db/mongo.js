var MongoClient = require("mongodb").MongoClient;

// var url = "mongodb://localhost:27017/site";
var url = "mongodb://elapp:Alphatraper0@ds155833.mlab.com:55833/elapp";
const dbName = "elapp";

var collections = ["users"];
var dataBase = false;

function connectToDb() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      { useNewUrlParser: true }
    )
      .then(client => {
        console.log("Data Base Connected!");
        dataBase = client.db(dbName);
        resolve("1");
      })
      .catch(err => {
        console.log(err);
      });
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
        resolve(docs);
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
  insertDoc: insertDoc,
  existsDoc: existsDoc,
  removeDoc: removeDoc
};
