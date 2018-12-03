var express=require("express");
var app=express();
var http=require("http").Server(app);
var io=require("socket.io")(http);

var shortId=require("shortid");
app.use(express.static(__dirname));
var clients=[];




 io.on("connection",function(socket){

        var currentUser;

    socket.on("LOGIN",function(data){

        console.log(data.name+" Player is login");
        
        currentUser={
            name:data.name,
            id:shortId.generate(),
            position:data.position,
            rotation:data.rotation
        }//new user in clients list

        clients.push(currentUser); //add currentUser in client list
        console.log(" currentUser "+currentUser);
        console.log("Total players: "+clients.length);

        socket.emit("LOGIN_SUCESS",currentUser);

        for(var i=0;i<clients.length;i++){

                if(clients[i].id!=currentUser.id){

                    socket.emit("SPAW_PLAYER",{
                      name:clients[i].name,
                      id:clients[i].id,
                      position:clients[i].position
                    });

                    console.log("User name "+clients[i].name+" is connected..");
                }

        }
                socket.broadcast.emit("SPAW_PLAYER",currentUser);
    });

    socket.on("MOVE",function(data){
            currentUser.position=data.position;
            socket.broadcast.emit("UPDATE_MOVE",currentUser);
            console.log(currentUser.name+" Move to "+currentUser.position);
    });


    socket.on("disconnect",function(){
        socket.broadcast.emit("USER_DISCONNECTED",currentUser);

        for(var i=0;i<clients.length;i++){
            if(clients[i].name==currentUser.name && clients[i].id==currentUser.id){
                console.log("User "+clients[i].name+" has disconnected");
                clients.splice(i,1); // i index delete 1 object
            }
        }
    });


});

http.listen(process.env.PORT || 3000,function(){
console.log("Listening on *:3000");
});

    console.log("-----------------SERVER IS RUNNING-------------");