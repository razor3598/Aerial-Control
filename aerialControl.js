
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
    
    alert(xNew);
    alert(yNew)
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


function pitchControl(event) {
    const [xNew, yNew] = changeCoordinates(event.clientX + window.scrollX, 
                            event.clientY + window.scrollY);
    alert(xNew);
    alert(yNew);

    //Aerial control here
}

}