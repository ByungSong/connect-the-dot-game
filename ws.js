const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

let prevPointArr = []
let pointArr = []
let player = true

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(req) {

    obj = JSON.parse(req);
    console.log(obj)
    console.log()

    if(obj.msg == "INITIALIZE"){

      obj.body = {
            "newLine": null,
            "heading": "Player 1",
            "message": "Awaiting Player 1's Move."
          }    

    }else if(obj.msg == "NODE_CLICKED"){

      // console.log("Prev: ",prevPointArr)
      // console.log("Current: ",pointArr)

      if(pointArr.length == 1 && prevPointArr.length == 2){

        console.log(prevPointArr[0])
        console.log(prevPointArr[1])
        console.log([obj.body.x, obj.body.y])
        console.log(pointArr[0])

        if((prevPointArr[0][0] == pointArr[0][0] &&  prevPointArr[0][1] == pointArr[0][1]) ||
          (prevPointArr[1][0] == pointArr[0][0] && prevPointArr[1][1] == pointArr[0][1]) || 
          (prevPointArr[0][0] == obj.body.x && prevPointArr[0][1] == obj.body.y) ||
          (prevPointArr[1][0] == obj.body.x && prevPointArr[1][1] == obj.body.y)
          ){
            console.log('match')
            pointArr.push([obj.body.x, obj.body.y])  

        }else{
          obj.msg = "INVALID_END_NODE"
          obj.body = {
            "newLine": null, 
            "heading": player ? "Player 1" : "Player 2",
            "message": "Invalid move!"
          }
          pointArr = []
        }

      }else{
        pointArr.push([obj.body.x, obj.body.y])
      }

      if(pointArr.length == 1){

        obj.msg = "VALID_START_NODE"
        obj.body = {
          "newLine": null,
          "heading": player ? "Player 1" : "Player 2",
          "message": "Select a second node to complete the line."
        }

        player = !player 

      }else if(pointArr.length == 2){
        
        //console.log(pointArr)

        obj.msg = "VALID_END_NODE"
        obj.body = {
          "newLine": {
            "start": {
                "x": pointArr[0][0],
                "y": pointArr[0][1] },
            "end": {
                "x": pointArr[1][0],
                "y": pointArr[1][1] }
                },
          "heading": player ? "Player 1" : "Player 2",
          "message": null
        }
        prevPointArr = pointArr
        pointArr = []
      }
    }

    let res = {
      "id": obj.id,
      "msg": obj.msg,
      "body": obj.body
    }

    ws.send(JSON.stringify(res));
    
  });    
});