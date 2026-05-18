function createUnencodedArray() {
        let dataArray = [];
        let pointCoordinateInputs = document.querySelectorAll(".coordinate-input");
        let pointValue = 0;
    
        for (let pointCoordinate of pointCoordinateInputs) {
            pointValue = pointCoordinate.valueAsNumber;
            
            if (isNaN(pointValue)) {
                return "NAN-ERROR";
            }

            if (pointValue < -138 || pointValue > 117) {
                return "POINT-VALUE-RANGE-ERROR";

            }


            dataArray.push(pointValue);
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

        if (dataArray.length % 2 === 0) {
            return "NO-TOOL-TYPE-ERROR";
        }
    console.log(dataArray);
    return dataArray;
}

function generateCode(){
        let unencodedArray = createUnencodedArray();
        console.log(unencodedArray);

       if (unencodedArray === "NAN-ERROR") {
            displayError("Please input a number into all coordinate boxes.");
            return;
        }

        if (unencodedArray === "POINT-VALUE-RANGE-ERROR") {
            displayError("All numbers must be between -117 and 138.");
            return;
        }

        if (unencodedArray === "NO-TOOL-TYPE-ERROR") {
            displayError("Please select a tool type.");
            return;
        }

        for (let i = 0; i < (unencodedArray.length - 1); i++) {
            unencodedArray[i] += 10; // make coordinates relative to top left corner of edit bay instead of ship center
            unencodedArray[i] += (unencodedArray[i] < 0) ? 256 : 0;// negative values are stored as numbers ranging from 128-256 ingame
        }

        unencodedUInt8 = new Uint8Array(unencodedArray);
        console.log(unencodedUInt8);
        deflatedUInt8= fflate.deflateSync(unencodedUInt8);
        //console.log(deflatedUInt8);
        encodedUInt8 = deflatedUInt8.toBase64();
        //console.log(encodedUInt8);
        

        displayCode(encodedUInt8);
    }

function displayError(text) {
    outputText.style.color = "red";
    outputText.value = text;
}

function displayCode(text) {
    outputText.style.color = "black";
    outputText.value = text;
}

function addPoint() {
    const coordinateInputs = document.querySelector("#coordinate-inputs");

    let newElement = document.createElement("div");
    newElement.id = `point-${newPointNumber}-coordinates`;
    newElement.className = "point";
    newElement.innerHTML =
    `
        <label>Point ${newPointNumber}</label>

        <span class="point-dash">-</span>
        <span>
            <label for="point-${newPointNumber}-x" class="x-text">x:</label>
            <input type="number" id="point-${newPointNumber}-x" max="117" min="-138" class="coordinate-input">
            <label for="point-${newPointNumber}-y" class="y-text">y:</label>
            <input type="number" id="point-${newPointNumber}-y" max="117" min="-138" class="coordinate-input">
        </span>
    `;
    
    // let removeNewPointButton = newElement.querySelector("button");
    // removeNewPointButton.addEventListener("click", removePoint);

    coordinateInputs.appendChild(newElement);
    newPointNumber += 1;
}

function removeLastPoint() {
    let points = document.querySelector("#coordinate-inputs");
    points.lastChild.remove();
    newPointNumber -= (newPointNumber > 1) ? 1 : 0;
}

function copyCode(){
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
let outputText = document.querySelector("#output-text");
main();
