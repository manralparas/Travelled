const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://paras:CFMFV0UOQPA1Y8Ic@cluster0.y8o7g.mongodb.net/camp?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true,});
const Post = require("./models/campground");
const User = require("./models/user");


