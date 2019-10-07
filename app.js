const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const bid = require('./bid');

const app = express();

mongoose
  .connect('mongodb+srv://java:gogomaster@database-qrvyh.mongodb.net/cf', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB Connected'));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());
app.use('/api/bid', bid);

const styleSchema = {
  value: String,
  price: Number
};

const imageSchema = {
  value: Object
};

const sizeSchema = {
  value: String,
  price: Number
};

const userSchema = {
  email: String,
  password: String
};

const Style = mongoose.model('Style', styleSchema);
const Image = mongoose.model('Image', imageSchema);
const Size = mongoose.model('Size', sizeSchema);
const User = mongoose.model('User', userSchema);

app.post('/api/createStyle', function(req, res) {
  const body = JSON.parse(req.body);
  // const style = new Style({
  //   value: body.value,
  //   price: body.price
  // });


  // style.save(function(err) {
  //   if (!err) {
  //     console.log('style saved to database');
  //   }
  // });

  Style.findOne({value : body.value}, function(err, doc){
    doc.price = body.price;
    doc.save();
  })
});

app.post('/api/createSize', function(req, res) {
  console.log("call post");
  
  const body = JSON.parse(req.body);
  const size = new Size({
    value: body.value,
    price: body.price
  });
  size.save(function(err) {
    if (!err) {
      console.log('size saved to DB');
    }
  });
});

app.post('/api/saveImage', function(req, res) {
  console.log('old', req.body);
  const body = JSON.parse(req.body);
  console.log(body);
  const image = new Image({
    value: body
  });
  image.save(function(err) {
    if (!err) {
      console.log('Img saved to DB');
    }
  });
});

app.get('/api/sizeList', function(req, res) {
  Size.find({}, function(err, sizes) {
    res.send(sizes);    
  });
});

app.get('/api/styleList', function(req, res) {
  Style.find({}, function(err, sizes) {
    res.send(sizes);
  });
});

// sign up
app.post('/api/register', function(req, res) {
  const body = JSON.parse(req.body);
  const newUser = new User({
    email: body.email,
    password: body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send('new user created');
    }
  });
});

// login
app.post('/api/login', function(req, res) {
  User.findOne({ email: req.body.username }, function(err, foundUser) {
    if (err) {
      console.log('err');
      res.send('user not found');
    } else {
      if (foundUser) {
        if (foundUser.password === req.body.password) {
          console.log('user found');
          return res.json({ user: 'found' });
        }
      }
    }
  });
});
const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
