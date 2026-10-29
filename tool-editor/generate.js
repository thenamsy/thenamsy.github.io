const customErrors = {
    "NAN-ERROR": "Please input a number into all coordinate boxes.",
    "POINT-VALUE-RANGE-ERROR": "All numbers must be between -138 and 117.",
    "NOT-ENOUGH-POINTS-ERROR": "There must be at least 3 points, including the extra point from joining up.",
    "NO-TOOL-TYPE-ERROR": "Please select a tool type."
};

function createUnencodedArray() {
    let dataArray = [];
    let pointCoordinateInputs = document.querySelectorAll(".coordinate-input");
    let pointValue = 0;

    try {
        for (let pointCoordinate of pointCoordinateInputs) {
            pointValue = pointCoordinate.valueAsNumber;
            
            if (isNaN(pointValue)) {
                throw new Error("NAN-ERROR");
            }

            if (pointValue < -138 || pointValue > 117) {
                throw new Error("POINT-VALUE-RANGE-ERROR");
            }

            dataArray.push(pointValue);
        }

        let joinFirstLastBox =  document.querySelector("#join-up");
        if (joinFirstLastBox.checked) {
            dataArray = dataArray.concat(dataArray.slice(0,2));
        }

        if (dataArray.length < 6) {
            throw new Error("NOT-ENOUGH-POINTS-ERROR");
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
            throw new Error("NO-TOOL-TYPE-ERROR");
        }

    console.log(dataArray);
    return dataArray;
    }

    catch (error) {
        displayError(customErrors[error.message]);
        return;
    }
}

function generateCode(){
        let unencodedArray = createUnencodedArray();
        console.log(unencodedArray);

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

    let newElement = document.createElement("tr");
    newElement.id = `point-${newPointNumber}-coordinates`;
    newElement.className = "point";
    newElement.innerHTML =
    `
        <th>${newPointNumber}</th>
        <td>
            <input type="number" id="point-${newPointNumber}-x" max="117" min="-138" class="coordinate-input">
        </td>
        <td>
            <input type="number" id="point-${newPointNumber}-y" max="117" min="-138" class="coordinate-input">
        </td>
    `;
    
    // let removeNewPointButton = newElement.querySelector("button");
    // removeNewPointButton.addEventListener("click", removePoint);

    coordinateInputs.appendChild(newElement);
    newPointNumber += 1;

    coordinateInputs.scroll({top: coordinateInputs.scrollHeight});
}

function removeLastPoint() {
    let points = document.querySelector("#coordinate-inputs");

    if (newPointNumber > 1) { points.lastChild.remove(); }

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
