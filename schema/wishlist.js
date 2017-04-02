var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WishlistSchema = new Schema(
  {
    /*sid: {
      type: Number
      //required: true,
      //unique: true
    },*/
    coursecode: {
      type: String
      //requried: true
    },
    coursename: {
      type: String
      //requried: true
    }
  },
  {
    collection: 'wishlist'
  }
);

//mongoose.connect('mongodb://localhost/wishlist');

var WishList = module.exports = mongoose.model('WishList', WishlistSchema);

module.exports.deleteWish = function(id, callback){
  var query = {_id: id};
  WishList.remove(query, callback);
}

module.exports.addWish = function(wish, callback){
  WishList.create(wish, callback);
}
