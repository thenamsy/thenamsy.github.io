function createUnencodedData() {
    let dataArray = [];
    let pointCoordinateInput = document.querySelectorAll(".coordinate-input");
    
    for (let pointCoordinate of pointCoordinateInput) {
        let pointValue = pointCoordinate.getAttribute("value");
        dataArray.push(pointValue);
    }
    console.log(dataArray);
}

function main() {
    const generateButton = document.querySelector("#generate-button");
    generateButton.addEventListener("click", createUnencodedData);
}

main()