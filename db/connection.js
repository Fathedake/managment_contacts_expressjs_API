const mongoose =require("mongoose");

const options= {
  readPreference: 'secondary',
};
function connectDB(url, callback) {

  try {
    mongoose.connect(url,options);
    callback();
  } catch (err) {
    callback(err);
    process.exit(1);
  }
  return;
}
module.exports=connectDB