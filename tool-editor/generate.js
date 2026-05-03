function createUnencodedArray() {
    let dataArray = [];
    let pointCoordinateInputs = document.querySelectorAll(".coordinate-input");
    let pointValue = 0;
 
    for (let pointCoordinate of pointCoordinateInputs) {
        pointValue = pointCoordinate.valueAsNumber;
        dataArray.push(pointValue);

        //if (pointValue < -138 || pointValue > 117) {
        //    break generateBlock;
        //}
    }
    let joinFirstLastBox =  document.querySelector("#join-up");
    if (joinFirstLastBox.checked) {
        dataArray = dataArray.concat(dataArray.slice(0,2));
    }

    let toolTypeButtons = document.getElementsByName("tool-type");

    for (let toolTypeButton of toolTypeButtons) {
        if (toolTypeButton.checked ) {
            switch (toolTypeButton.id) {
                case "glued-button":
                    dataArray.push(0);
                    break;
                case "swing-button":
                    dataArray.push(1);
                    break;
                case "spin-button":
                    dataArray.push(3); // in WAGSR's code, the internal IDs for spin and torque do not line up with the order you unlock them
                    break;
                case "torque-button":
                    dataArray.push(2);
                    break;
                
            }
        }
    }
    
    console.log(dataArray);
    return dataArray;
}

    function generateCode(){
        let unencodedArray = createUnencodedArray();

        for (let i = 0; i < (unencodedArray.length - 1); i++) {
            unencodedArray[i] += 10; // make coordinates relative to top left corner of edit bay instead of ship center
            unencodedArray[i] += (unencodedArray[i] < 0) ? 256 : 0;// negative values are stored as numbers ranging from 128-256 ingame
        }

        unencodedUInt8 = new Uint8Array(unencodedArray);
        //console.log(unencodedUInt8);
        deflatedUInt8= fflate.deflateSync(unencodedUInt8);
        //console.log(deflatedUInt8);
        encodedUInt8 = deflatedUInt8.toBase64();
        //console.log(encodedUInt8);
        
        outputText = document.querySelector("#output-text");
        outputText.value = encodedUInt8;
    }

function addPoint() {
    const coordinateInputs = document.querySelector("#coordinate-inputs");

    let newElement = document.createElement("div");
    newElement.id = `point-${newPointNumber}-coordinates`
    newElement.innerHTML = `
        <label>Point ${newPointNumber}: </label>
        <span>
            <label for="point-${newPointNumber}-x">x:</label>
            <input type="number" id="point-${newPointNumber}-x" max="117" min="-138" class="coordinate-input">
            <label for="point-${newPointNumber}-y">y:</label>
            <input type="number" id="point-${newPointNumber}-y" max="117" min="-138" class="coordinate-input">
        </span>`;
    
    // let removeNewPointButton = newElement.querySelector("button");
    // removeNewPointButton.addEventListener("click", removePoint);

    coordinateInputs.appendChild(newElement);
    newPointNumber += 1;
}

/* function removePoint(event) {
    let pointIndex = Number(event.currentTarget.dataset.pointIndex) - 1;
    const coordinateInputs = document.querySelector("#coordinate-inputs");
    let coordinateInputArray = Array.from(coordinateInputs.children);

    coordinateInputArray.splice(pointIndex, 1);

    console.log(pointIndex);
    console.log(coordinateInputArray);
}
*/

function removeLastPoint() {
    let points = document.querySelector("#coordinate-inputs");
    points.lastChild.remove();
    newPointNumber -= 1;
}

function copyCode(){
    outputText = document.querySelector("#output-text");
    navigator.clipboard.writeText(outputText.value);
}

function main() {
    addPoint();
    addPoint();
    addPoint();

    const fflate = window.fflate;
    
    const generateButton = document.querySelector("#generate-button");
    generateButton.addEventListener("click", generateCode);
    
    const addPointButton = document.querySelector("#add-point-button");
    addPointButton.addEventListener("click", addPoint);

        
    const removeLastPointButton = document.querySelector("#remove-last-point-button");
    removeLastPointButton.addEventListener("click", removeLastPoint);

    const copyButton = document.querySelector("#copy-button");
    copyButton.addEventListener("click", copyCode);
}

let newPointNumber = 1;
let pointDisplayNumber = 1;
main();
