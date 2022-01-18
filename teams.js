function checkTeams() {
    var team1 = document.getElementById("team-1").value;
    var team2 = document.getElementById("team-2").value;

    if (team1 != team2) {
      var color1 = document.getElementById("teamColor1").value;
      var color2 = document.getElementById("teamColor2").value;
      document.getElementById("team-box1").remove();
      document.getElementById("team-box2").remove();
      document.getElementById("team-button").remove();
      document.getElementById("footballField").style.visibility = "visible";
      document.getElementById("subbox").style.visibility = "visible";
      document.getElementById("ballCoordinates").style.visibility = "visible";
      //document.getElementById("player-info").style.visibility = "visible";
      

      fetch(team1+'.json')
              .then(function (response) {
                  return response.json();
              })
              .then(function (data) {
                  appendData(data, "reddot", team1, color1);
                  $(".reddot").draggable({revert: "invalid"});
                  assignPosition("reddot");
              })
              .catch(function (err) {
                  console.log('error: ' + err);
              });

      fetch(team2+'.json')
              .then(function (response) {
                  return response.json();
              })
              .then(function (data) {
                  appendData(data, "bluedot", team2, color2);
                  $(".bluedot").draggable({revert: "invalid"});
                  assignPosition("bluedot");
              })
              .catch(function (err) {
                  console.log('error: ' + err);
              });

      appendBall();
      $(".ball").draggable({revert: "invalid"});
      $("#footballField").droppable();
      $("#subbox").droppable();
    }

    else {
      document.getElementById("team-box1").style.borderColor = "red";
      document.getElementById("team-box2").style.borderColor = "red";
    }
}

function appendBall() {
  var mainContainer = document.getElementById("subbox");
  var div = document.createElement("div");
  div.setAttribute("class", "ball");
  div.setAttribute("id", "football");
  div.style.top = "60%";
  div.style.zIndex = "2";
  mainContainer.appendChild(div);
}

function appendData(data, className, idName, color) {
  var mainContainer = document.getElementById("subbox");
  for (var i = 0; i < data.length; i++) {
      var div = document.createElement("div");
      div.setAttribute("class", className);
      div.setAttribute("id", idName + i );
      div.setAttribute("style", "background-color : " + color);
      div.setAttribute("data-player_name", data[i].player_name);
      div.setAttribute("data-player_position", data[i].position);
      div.setAttribute("data-player_height", data[i].Height);
      div.setAttribute("data-player_weight", data[i].Weight);
      div.setAttribute("data-player_vX", 2.5);
      div.setAttribute("data-player_vY", 2.5);
      div.onclick = function() {showDetails(this);};

      var textNode = document.createElement("div");
      textNode.style.position = "absolute";
      textNode.style.bottom = "-75%";
      textNode.style.fontSize = "12px";
      textNode.style.left = "-15%";
      const nameArr = data[i].player_name.split(" ");

      if (nameArr.length == 1) {
        textNode.innerHTML = nameArr[0];
      }

      else if (nameArr.length == 2) {
        textNode.innerHTML = nameArr[1];
      }

      else if (nameArr.length > 2) {
        for (var j = 1; j < nameArr.length; j++) {
          textNode.innerHTML += nameArr[j];
        }
      }

      if (textNode.innerHTML.includes("-")) {
        var oldName = textNode.innerHTML;
        var newName = oldName.replace(/-/g, "");
        textNode.innerHTML = newName;
      }

      div.appendChild(textNode);
      
      mainContainer.appendChild(div);
  }
}



function assignPosition(team) {
  var teams = document.getElementsByClassName(team);

  if (team === "reddot") {
    var hor = Number(50) + Number(5);
    var ver = 2;
  }

  else {
    var hor = Number(50) + Number(5);
    var ver = 20;
  }
  

  for (let i = 0; i < teams.length; i++) {
      teams[i].style.left = hor + "em";
      teams[i].style.top = ver + "em";
      hor += 5;
      if (hor === 95) {
        ver = ver + Number(3);
        hor = Number(50) + Number(5);
      }
  }
}


function checkPosition() {
  var ft = document.getElementsByClassName("reddot");
  var results = document.getElementById("results");

  function displayCoords() {
      results.innerHTML = "offsetLeft: " + ft[0].offsetLeft + "<br>offsetTop: " + ft[0].offsetTop;
  }

  setInterval(displayCoords, 750);
}

function showDetails(event) {
  var infoBox = document.getElementById("player-info");
  infoBox.innerHTML = "";
  infoBox.style.visibility = "visible";
  
  var textNode = document.createElement("div"); 
  textNode.innerHTML = "Player Name: " + event.getAttribute("data-player_name") + 
                        "&emsp;&emsp;&emsp;Player Height: " + event.getAttribute("data-player_height") + "m" + 
                        "&emsp;&emsp;&emsp;Player Weight: " + event.getAttribute("data-player_weight") + "kg" ;
  infoBox.appendChild(textNode);

  var vX = document.createElement("span");
  vX.innerHTML = "vX: ";
  infoBox.appendChild(vX);

  var vX = document.createElement("input");
  vX.setAttribute("type", "number");
  vX.setAttribute("step", "0.1");
  vX.setAttribute("value", event.getAttribute("data-player_vX"));
  vX.addEventListener("focusout", velocityXSet);
  vX.myPlayer = event;
  infoBox.appendChild(vX);
  
  var vY = document.createElement("span");
  vY.innerHTML = "vY: ";
  infoBox.appendChild(vY);

  var vY = document.createElement("input");
  vY.setAttribute("type", "number");
  vY.setAttribute("step", "0.1");
  vY.setAttribute("value", event.getAttribute("data-player_vY"));
  vY.addEventListener("focusout", velocityYSet);
  vY.myPlayer = event;

  
  infoBox.appendChild(vY);
}

function velocityXSet(event) {
  event.currentTarget.myPlayer.setAttribute("data-player_vX", event.currentTarget.value);
}

function velocityYSet(event) {
  event.currentTarget.myPlayer.setAttribute("data-player_vY", event.currentTarget.value);
}