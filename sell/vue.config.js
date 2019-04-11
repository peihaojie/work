var appData = require('./public/data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

module.exports={
  devServer: {
    before(app){
      app.get('/seller',function(rep,res){
        res.json({
          errno:0,
          data:seller
        });
      });

      app.get('/goods',function(rep,res){
        res.json({
          errno:0,
          data:goods
        });
      });

      app.get('/ratings',function(rep,res){
        res.json({
          errno:0,
          data:ratings
        });
      });
    }
  }
}
