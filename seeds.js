var Comment = require("./models/comment");

var data=[
    {
        name: "Green Valley",
        image: "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"
    },
    {
        name: "Lake Camp",
        image: "https://images.unsplash.com/photo-1507266183343-3381ffde1d68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "More blah blah blah"
    },
    {
        name: "Barbeque Campers",
        image: "https://images.unsplash.com/photo-1499218727621-7642e7bfa048?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Yummy Yummy in Tummy"
    }
];

function seedDB(){
Comment.deleteMany({},function(err,del){
    if(err){
        console.log(err);
    }else{
        console.log("deleted comments");
    }
});
    //remove all existing campgrounds
Campground.deleteMany({},function(err){
    if(err){
        console.log(err);
    }else{
        console.log("removed campground");
        //run forEach loop to add data to campground schema
        data.forEach(function(seed){
            //asdd campground
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("Campground created");
                    //create comment
                    Comment.create({
                        text: "This is a great campground, far from internet and gives you eternal peace",
                        author: "Jugal"
                    },function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save(function(err,comments){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("new comment created");
                                }
                            });
                        }
                    });
                }
            });
        });
    }
});
}

module.exports= seedDB;