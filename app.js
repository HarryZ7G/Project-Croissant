const crypto = require('crypto');
const path = require('path');
const express = require('express');
const app = express();
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const url = `${process.env.MONGO_API}` || "mongodb://localhost:27017";
const cors = require('cors');
require("dotenv").config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const validator = require('validator');

app.use(express.static(path.join(__dirname, "client", "build")));
app.use(cors({
  origin: ["http://localhost:3000", "https://foo-findr.herokuapp.com", "http://foo-findr.herokuapp.com"],
  allowedHeaders: ["Access-Control-Allow-Credentials", "content-type"],
  credentials: true
}
));

const axios = require("axios");

let yelpREST = axios.create({
  baseURL: "https://api.yelp.com/v3/",
  headers: {
    Authorization: `Bearer ${process.env.YELP_API}`,
    "Context-type": "application/json",
  },
});

const httpServer = require('http').createServer(app);
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTPS server on http://localhost:%s", PORT);
});

const cookie = require('cookie');

const session = require('express-session');
app.use(session({
    secret: process.env.SECRET || 'Thierry',
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, sameSite: false}
}));

app.use((req, res, next) => {
  req.user = ('user' in req.session)? req.session.user : null;
  let username = (req.user) ? req.user._id : '';
  res.setHeader('Set-Cookie', cookie.serialize('username', username, {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7
  }));
  next();
});

generateSalt = () => {
  return crypto.randomBytes(16).toString('base64');
};

generateHash = (password, salt) => {
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('base64');
};

var checkUsername = (req, res, next) => {
  if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end("bad input");
  next();
};

var checkLogin = (req, res, next) => {
  if(!req.session.user) return res.status(401).end("access denied");
  next();
}

app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.get('/isloggedin/', (req, res, next) => {
  if (!req.session.user) return res.json({username: null});
  return res.json({username: req.session.user._id});
});

app.get('/group/isloggedin/', (req, res, next) => {
  if (!req.session.user) return res.json({ username: "" });
  let username = new Mongo.ObjectID(req.session.user._id);
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    client.db('UserDb').collection('Credentials').findOne({ _id: username }, (err, result) => {
      if (err) return res.status(500).end(err);
      if (!result) return res.status(404).end("User does not exist");
      return res.json({
        username: req.session.user._id,
        numCategories: result.preference.numCategories,
        numRestaurants: result.preference.numRestaurants
      });
    });
  });
});

app.post('/signup/', checkUsername, (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    if (err) return res.status(500).end(err);
    const users = client.db('UserDb').collection("Credentials");
    let salt = generateSalt();
    let hash = generateHash(password, salt);
    users.findOne({username: username}, (err, result) => {
      if (err) return res.status(500).end();
      if (!result) {
        users.insertOne({
          username: username,
          salt: salt,
          hash: hash,
          preference: {
            numCategories: 3,
            numRestaurants: 10
          },
          history: []
        }, (err, result) => {
          if (err) return res.status(500).end();
          return res.json("Success");
        });
      } else
        return res.status(401).end();
    });
  });
});

app.post('/signin/', checkUsername, (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    client.db('UserDb').collection('Credentials').findOne({ username: username },
      (err, result) => {
        if (err) return res.status(500).end(err);
        if (!result) return res.status(404).end("Username does not exist");
        if (result.hash != generateHash(password, result.salt)) return res.status(401).end("Incorrect Credentials");
        req.session.user = result;
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.setHeader('Set-Cookie', cookie.serialize('username', result._id, {
              path : '/', 
              maxAge: 60 * 60 * 24
        }));
        return res.status(200).end();
    });
  });
});

app.get('/signout/', (req, res, next) => {
  req.session.destroy();
  res.setHeader('Set-Cookie', cookie.serialize('username', '', {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7
  }));
  return res.end("user has been signed out");
});

app.get('/user/preference/:username/', checkLogin, (req, res, next) => {
  let username = new Mongo.ObjectID(req.params.username);
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    client.db('UserDb').collection('Credentials').findOne({ _id: username }, (err, result) => {
      if (err) return res.status(500).end(err);
      if (!result) return res.status(404).end("User does not exist");
      return res.json(result.preference);
    });
  });
}); 

app.patch('/user/preference/', checkLogin, (req, res, next) => {
  let username = new Mongo.ObjectID(req.body.username);
  let preference = req.body.preference;
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    client.db('UserDb').collection('Credentials').findOne({ _id: username }, (err, result) => {
      if (err) return res.status(500).end(err);
      if (!result) return res.status(404).end("User does not exist");
      result.preference = preference;
      client.db('UserDb').collection('Credentials').findOneAndReplace({ _id: username }, result, (err, newResult) => {
        if (err) return res.status(500).end(err);
        return res.status(200).end();
      });
    });
  });
}); 

app.post('/user/history/', checkLogin, (req, res, next) => {
  let username = new Mongo.ObjectID(req.body.username);
  let restaurant = req.body.restaurant;
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    client.db('UserDb').collection('Credentials').findOne({ _id: username }, (err, result) => {
      if(err) return res.status(500).end(err);
      if(!result) return res.status(404).end("User does not exist");
      result.history.unshift(restaurant);
      client.db('UserDb').collection('Credentials').findOneAndReplace({ _id: username }, result, (err, newResult) => {
        if(err) return res.status(500).end(err);
        return res.status(200).end();
      });
    });
  });
});

app.get('/user/history/:username/', checkLogin, (req, res, next) => {
  let username = new Mongo.ObjectID(req.params.username);
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    client.db('UserDb').collection('Credentials').findOne({ _id: username }, (err, result) => {
      if(err) return res.status(500).end(err);
      if(!result) return res.status(404).end("User does not exist");
      return res.json({history: result.history.slice(0, 6)});
    });
  });
});

app.post('/yelp/find/', (req, res, next) => {
  if (JSON.stringify(req.body) == "{}") return res.json("failed");
  let limit = req.session.user ? req.session.user.preference.numRestaurants : 10;
  yelpREST("businesses/search", {
    params: {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      location: req.body.location,
      categories: req.body.categories,
      limit: limit
    },
  }).then(({ data }) => {
    let { businesses } = data;
    return res.json(JSON.stringify(businesses));
  }).catch(({ err }) => {
    return res.json(err);
  });
});

app.post('/group/create/', (req, res, next) => {
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    if (err) return res.status(500).end();
    client.db('UserDb').collection('Groups').insertOne({
      roomNum: req.body.roomNum.toString(),
      categories: {
        breakfast_brunch: 0,
        bubbletea: 0,
        cafes: 0,
        chinese: 0,
        hotdogs: 0,
        french: 0,
        indpak: 0,
        italian: 0,
        japanese: 0,
        korean: 0,
        mexican: 0,
        mideastern: 0,
        pizza: 0,
        chicken_wings: 0
      },
      restaurants: {},
      members: req.body.members,
    }).then(() => {
      return res.status(200).end();
    });
  });
});

app.post('/group/join/', (req, res, next) => {
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    if (err) return res.status(500).end();
    client.db('UserDb').collection('Groups').findOne({ roomNum: req.body.roomNum }, 
      (err, result) => {
        if (err) return res.status(500).end();
        if (!result) return res.status(404).end();
        else {
          client.db('UserDb').collection('Groups').findOneAndUpdate({ roomNum: req.body.roomNum }, { $inc: {members: 1} }, (err, result) => {
            if(err) return res.status(500).end;
            return res.status(200).end();
          });
        }
      });
  });
});

app.post('/group/individual/', (req, res, next) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) return res.status(500).end();
    client.db('UserDb').collection('Groups').findOne({ roomNum: req.body.roomNum }, (err, result) =>{
      if (err) return res.status(500).end();
      if (!result) return res.status(404).end();
      for (const [key, value] of Object.entries(req.body.categories)) {
        if (value)
          result.categories[key] += 1;
      }
      client.db('UserDb').collection('Groups').findOneAndReplace({ roomNum: req.body.roomNum }, result, (err, newResult) =>{
        if (err) return res.status(500).end();
        return res.status(200).end();
      });
      return res.status(200).end();
    });
  });
});

app.post('/group/vote/', (req, res, next) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if(err) return res.status(500).end();
    client.db('UserDb').collection('Groups').findOne({ roomNum: req.body.roomNum }, (err, result) => {
      if (err) return res.status(500).end();
      if (!result) return res.status(404).end();
      for (const [key, restaurant] of Object.entries(req.body.restaurants)) {
        if (restaurant["selection"]) {
          if (!result.restaurants.hasOwnProperty(key)) result.restaurants[key] = 1;
          else result.restaurants[key] += 1;
        } else {
          if (!result.restaurants.hasOwnProperty(key)) result.restaurants[key] = 0;
        }
      }
      client.db('UserDb').collection('Groups').findOneAndReplace({ roomNum: req.body.roomNum }, result, (err, newResult) => {
        if (err) return res.status(500).end();
        return res.status(200).end();
      });
    });
  });
});

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "https://localhost:3001",
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Credentials"],
    credentials: true
  }
});

io.on("connection", socket => {
  let currentRoom = -1;
  let host = false;
  let ready = false;
  let voted = false;
  console.log("New socket");
  socket.on("disconnect", () => {
    if (currentRoom != -1 && io.sockets.adapter.rooms.get(currentRoom) && !host) {
      console.log("left", currentRoom);
      socket.to(currentRoom).emit("update", io.sockets.adapter.rooms.get(currentRoom).size);
      if (ready)
        socket.to(currentRoom).emit("subtract");
      currentRoom = -1;
    } else if (currentRoom != -1 || host) {
      console.log("destroyed", currentRoom);
      socket.to(currentRoom).emit("destory");
      MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
        if (err) return res.status(500).end();
        client.db('UserDb').collection('Groups').findOneAndDelete({ roomNum: currentRoom.toString() }, (err, result) =>{
          if (err) return res.status(500).end();
          currentRoom = -1;
        });
      });
    } else if (currentRoom != -1 && io.sockets.adapter.rooms.get(currentRoom).size < 1) {
      console.log("destroyed", currentRoom);
      MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
        if (err) return res.status(500).end();
        client.db('UserDb').collection('Groups').findOneAndDelete({ roomNum: currentRoom.toString() }, (err, result) =>{
          if (err) return res.status(500).end();
          currentRoom = -1;
        });
      });
    } else console.log("disconnected");
    host = false;
  });
  socket.on("create", () => {
    let roomNum = Math.floor(100000 + Math.random() * 900000);
    while (io.sockets.adapter.rooms.get(currentRoom))
      roomNum = Math.floor(100000 + Math.random() * 900000);
    console.log("create", roomNum);
    socket.join(roomNum.toString());
    currentRoom = roomNum.toString();
    host = true;
    socket.emit("created", roomNum.toString());
  });
  socket.on("join", data => {
    console.log("join");
    if (io.sockets.adapter.rooms.get(data)) {
      socket.join(data);
      currentRoom = data;
      socket.emit("exist", data);
      socket.to(currentRoom).emit("requestInfo");
      io.in(data).emit("update", io.sockets.adapter.rooms.get(data).size);
    } else
      socket.emit("exist", -1);
  });
  socket.on("leave", data => {
    console.log("leave", data);
    socket.leave(data);
    if (io.sockets.adapter.rooms.get(data))
      socket.to(data).emit("update", io.sockets.adapter.rooms.get(data).size);
  });
  socket.on("location", data => {
    console.log("location", data);
    socket.to(currentRoom).emit("location", data);
  });
  socket.on("start", () => {
    console.log("start", currentRoom);
    host = false;
    io.in(currentRoom).emit("start");
  });
  socket.on("info", data => {
    console.log("info", data);
    socket.to(currentRoom).emit("location", data);
  });
  socket.on("ready", () => {
    console.log("ready");
    ready = true;
    socket.to(currentRoom).emit("memready");
  });
  socket.on("all-ready", data => {
    console.log("all-ready");
    let dataParsed = JSON.parse(data);
    let username = new Mongo.ObjectID(dataParsed.user);
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      client.db('UserDb').collection('Groups').findOne({ roomNum: currentRoom }, (err, result) => {
        client.db('UserDb').collection('Credentials').findOne({ _id: username }, (err, userResult) => {
          let numCat = 3;
          let numRest = 10;
          if (userResult) {
            numCat = userResult.preference.numCategories;
            numRest = userResult.preference.numRestaurants;
          }
          restaurantDoc = result.categories;
          let doclist = [];
          for (let item in restaurantDoc) {
            doclist.push([item, restaurantDoc[item]]);
          }
          doclist.sort((a, b) => {
            return b[1] - a[1];
          });
          let selected = "";
          for (i = 0; i < numCat; i++) {
            if (doclist[i][1] !== 0)
              selected = selected + doclist[i][0] + ",";
          }
          selected = selected.substring(0, selected.length - 1);
          const position = dataParsed.position;
          yelpREST("businesses/search", {
            params: {
              latitude: position.latitude,
              longitude: position.longitude,
              location: position.location,
              categories: selected,
              limit: numRest,
            },
          }).then(({ data }) => {
            let { businesses } = data;
            io.in(currentRoom).emit("category", businesses);
          }).catch(({ err }) => {
            return;
          });
        });
      });
    });
  });
  socket.on("voted", () => {
    console.log("voted");
    vote = true;
    io.in(currentRoom).emit("vote");
  });
  socket.on("all-voted", () => {
    console.log("all-voted");
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) return res.status(500).end();
      client.db('UserDb').collection('Groups').findOne({ roomNum: currentRoom }, (err, result) => {
        if (err) return res.status(500).end();
        if (!result) return res.status(404).end();
        restaurantDoc = JSON.parse(JSON.stringify(result.restaurants));
        let resultLst = [];
        for (let item in restaurantDoc) {
          resultLst.push([item, restaurantDoc[item]]);
        }
        resultLst.sort((a,b) => {
          return b[1] - a[1];
        });
        io.in(currentRoom).emit("all-voted", resultLst);
      });
    });
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});