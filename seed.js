const Campground= require('./models/campground');
const seedDb=()=>{
Campground.deleteMany({},(err)=>
{
    if(err)
    console.log(err)
    else
    console.log("deleted successfully")
});
}
module.exports=seedDb;    