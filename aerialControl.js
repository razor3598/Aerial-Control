
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
        document.getElementById("errorBox").innerHTML = "Click on Ball's destination.";
        document.getElementById("errorBox").style.visibility = "visible";
        document.getElementById("ballCoordinates").disabled = true;
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

function eucledianDistance(x1, y1, x2, y2) {
    var x = x2 - x1;
    var y = y2 - y1;
    
    return Math.sqrt(x*x + y*y);
}

function simple_time_to_intercept(player, xEnd, yEnd) {

    var avg_ball_speed = Number(20.0);
    var ball_angle = Number(document.getElementById("football").getAttribute("data-angle"));
    var impulse = 300.0;
    const [playerX, playerY] = changeCoordinates(player.style.left, player.style.top);

    var playerVX = Number(player.getAttribute("data-player_vX") * 0.7);
    var playerVY = Number(player.getAttribute("data-player_vY") * 0.7);

    reactionX = Number(playerX + playerVX);
    reactionY = Number(playerY + playerVY);

    var jump_time = 0;
    var y = 0;

    var jump_velocity = impulse / player.getAttribute("data-player_weight");

    var h_jump = Number(0.5 * jump_velocity * jump_velocity / 9.81);
    var total_reach = Number(player.getAttribute("data-player_height")) + h_jump;
    
    var peak_time = avg_ball_speed * Math.sin(ball_angle * 0.0174533) / 9.81;

    for (let t = 0; t < peak_time; t += 0.01) {
        y = (avg_ball_speed * (peak_time + t) * Math.sin(ball_angle * 0.0174533)) - (0.5 * 9.81 * (peak_time + t) * (peak_time + t));
        
        if (Number(y.toFixed(1)) <= Number(total_reach.toFixed(1))) {
            jump_time = jump_velocity / 9.81;
            break;
        }
    }

    var time_to_intercept = jump_time + 0.7 + (eucledianDistance(xEnd, yEnd, reactionX, reactionY) / 5.0);

    return time_to_intercept;
}

function getTimetoControl() {
    var timeToControl = 3*Math.log(10) * (Math.sqrt(3)*0.45/Math.PI + 1/4.3);
    return timeToControl;
}


function probability_intercept_ball(player, xEnd, yEnd, T) {
    
    var f = 1/(1. + Math.exp(-Math.PI/Math.sqrt(3.0)/0.45 * (T-simple_time_to_intercept(player,xEnd, yEnd)) ) );
    return f;
}

function pitchControl(event) {

    var ball = document.getElementById("football");
    const [xNew, yNew] = changeCoordinates(ball.style.left + window.scrollX, 
                                            ball.style.top + window.scrollY);
     
    if (xNew > 100.0 || xNew < 0.0 || yNew > 100.0 || yNew < 0 || isNaN(xNew) || isNaN(yNew)) {
        document.getElementById("errorBox").innerHTML = "Incorrect ball co-ordinates";
        document.getElementById("errorBox").style.visibility = "visible";
        document.getElementById("footballField").removeEventListener("click", ballEndCoords);
    }

    const [xEnd, yEnd] = changeCoordinates(event.clientX + window.scrollX, 
                            event.clientY + window.scrollY);

    let cross = document.createElement("div");
    cross.setAttribute("id","cross");
    cross.innerHTML = "<i class='fal fa-times-circle'></i>";
    cross.style.position = "absolute";
    cross.style.left = event.clientX + window.scrollX - 1 + 'px';
    cross.style.top = event.clientY + window.scrollY - 1 + 'px';

    document.body.appendChild(cross);

    var ball_speed = 20.0;                        
 
    team1 = document.getElementsByClassName("reddot");
    team2 = document.getElementsByClassName("bluedot");

    const attackingTeam = returnPitchMembers(team1);
    
    const defendingTeam = returnPitchMembers(team2);

    var football = document.getElementById("football");

    const [xStart, yStart] = changeCoordinates(football.style.left + window.scrollX, 
        football.style.top + window.scrollY);
    
    var ball_travel_time = eucledianDistance(xStart, yStart, xEnd, yEnd) / ball_speed;
    
    const attackingTimes = [];
    for (let i = 0; i < attackingTeam.length; i++) {
        attackingTimes.push(simple_time_to_intercept(attackingTeam[i], xEnd, yEnd));
    }
    
    var tau_min_att = Math.min(...attackingTimes);

    const defendingTimes = [];
    for (let i = 0; i < defendingTeam.length; i++) {
        defendingTimes.push(simple_time_to_intercept(defendingTeam[i], xEnd, yEnd));
    }
    
    var tau_min_def = Math.min(...defendingTimes);

    // if defending team can arrive significantly before attacking team, no need to solve pitch control model
    if (tau_min_att - Math.max(ball_travel_time, tau_min_def) >= getTimetoControl()) {
        document.getElementById("errorBox").innerHTML = "PPCFa: 0" + "<br>" +
                                                        "PPCFd: 1";
        $(".ball").draggable("enable");
    }

    // if attacking team can arrive significantly before defending team, no need to solve pitch control model
    else if (tau_min_def - Math.max(ball_travel_time, tau_min_att) >= getTimetoControl()) {
        document.getElementById("errorBox").innerHTML = "PPCFa: 1" + "<br>" +
                                                        "PPCFd: 0";
        $(".ball").draggable("enable");
    }

    else {
        const attacking_players  = [];
        const defending_players = [];

        for (let i = 0; i < attackingTeam.length; i++) {
            if (simple_time_to_intercept(attackingTeam[i], xEnd, yEnd) - tau_min_att < getTimetoControl()) {
                attacking_players.push(attackingTeam[i]);
            }
        }

        for (let i = 0; i < defendingTeam.length; i++) {
            if (simple_time_to_intercept(defendingTeam[i], xEnd, yEnd) - tau_min_def < getTimetoControl()) {
                defending_players.push(defendingTeam[i]);
            }
        }
        
        const dTArray = [];

        for (let i = ball_travel_time - 0.04; i < ball_travel_time + 10; i += 0.04) {
            dTArray.push(i);
        }

        var PPCFatt = 0;
        var PPCFdef = 0;
        var ptot = 0;

        i = 1;

        while (1-ptot > 0.01 && i < dTArray.length) {

            var T = dTArray[i];

            for (let i = 0; i < attacking_players.length; i++) {
                var player_ppcf = 0;

                var dPPCFdT = (1-PPCFatt-PPCFdef) * probability_intercept_ball(attacking_players[i],xEnd,yEnd,T) * 4.30;
                player_ppcf += dPPCFdT*0.04;
                PPCFatt += player_ppcf;
            }

            for (let i = 0; i < defending_players.length; i++) {
                var player_ppcf = 0;

                var dPPCFdT = (1-PPCFatt-PPCFdef) * probability_intercept_ball(defending_players[i],xEnd,yEnd,T) * 4.30;
                player_ppcf += dPPCFdT*0.04;
                PPCFdef += player_ppcf;
            }

            ptot = PPCFatt + PPCFdef;
            i += 1;
        }

        PPCFa = PPCFatt / ptot;
        PPCFd = PPCFdef / ptot;

        document.getElementById("errorBox").innerHTML = "PPCFa: " + PPCFa.toFixed(3) + "<br>" +
                                                        "PPCFd: " + PPCFd.toFixed(3);
    }

    $(".ball").draggable("enable");

    setTimeout(function(){
        $('#cross').remove();
    }, 500);
}

}