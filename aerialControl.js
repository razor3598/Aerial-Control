
function changeCoordinates(xOld, yOld) {
    let xLoOld = 2;
    let xHiOld = 836;
    let xLoNew = 0;
    let xHiNew = 100;
    xOld = parseFloat(xOld);

    let xNew = (xOld-xLoOld) / (xHiOld-xLoOld) * (xHiNew-xLoNew) + xLoNew;

    let yLoOld = 19;
    let yHiOld = 592;
    let yLoNew = 0;
    let yHiNew = 100;
    yOld = parseFloat(yOld);

    let yNew = (yOld-yLoOld) / (yHiOld-yLoOld) * (yHiNew-yLoNew) + yLoNew;
    return [xNew, yNew];
}


function getBallCoordinates() {
    var ball = document.getElementById("football");
    const [xNew, yNew] = changeCoordinates(ball.style.left + window.scrollX, 
                                            ball.style.top + window.scrollY);

    if (xNew > 100.0 || xNew < 0.0 || yNew > 100.0 || yNew < 0 || isNaN(xNew) || isNaN(yNew)) {
        document.getElementById("errorBox").innerHTML = "Incorrect ball co-ordinates";
        document.getElementById("errorBox").style.visibility = "visible";
        document.getElementById("footballField").removeEventListener("click", ballEndCoords);
    }

    else {
        $(".ball").draggable("disable");
        document.getElementById("errorBox").innerHTML = "Click on Ball End-coordinates";
        document.getElementById("errorBox").style.visibility = "visible";
        document.getElementById("footballField").addEventListener("click", pitchControl);
    }



function returnPitchMembers(team) {
    const returnTeam = [];
    for (let i = 0; i < team.length; i++) {
        unit = team[i].style.left.slice(-2);
        
        if (unit === 'em') {
            // Do nothing
        } 

        else {
            const [x1, y1] = changeCoordinates(team[i].style.left + window.scrollX,
                team[i].style.top + window.scrollY);
            
            if (x1 < 0.0 || x1 > 100.0 || y1 < 0.0 || y1 > 100.0) {
                // Do nothing
            }
            
            else {
                returnTeam.push(team[i]);
            } 
        }     
    }

    return returnTeam;
}

function pitchControl(event) {
    const [xNew, yNew] = changeCoordinates(event.clientX + window.scrollX, 
                            event.clientY + window.scrollY);
    
    team1 = document.getElementsByClassName("reddot");
    team2 = document.getElementsByClassName("bluedot");

    const attackingTeam = returnPitchMembers(team1);
    alert(attackingTeam.length);

    const defendingTeam = returnPitchMembers(team2);
    alert(defendingTeam.length);

}

}