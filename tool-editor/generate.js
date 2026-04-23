function createUnencodedData() {
    let dataArray = [];
    let pointCoordinateInputs = document.querySelectorAll(".coordinate-input");
    let pointValue = 0;

    
    for (let pointCoordinate of pointCoordinateInputs) {
        pointValue = pointCoordinate.value;
        dataArray.push(pointValue);
    }
    console.log(dataArray);
    console.log(pointCoordinateInputs);
}

function main() {
    const generateButton = document.querySelector("#generate-button");
    generateButton.addEventListener("click", createUnencodedData);
    
    const addPointButton = document.querySelector("#add-point-button")
    addPointButton.addEventListener("click",)
}

main();