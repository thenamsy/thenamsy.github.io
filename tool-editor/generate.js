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
            if (unencodedArray[i] < 0) {
                unencodedArray[i] += 256; // negative values are stored as numbers ranging from 128-256 ingame
            }
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

}

function copyCode(){
    outputText = document.querySelector("#output-text");
    navigator.clipboard.writeText(outputText.value);
}

function main() {
    const fflate = window.fflate;
    
    const generateButton = document.querySelector("#generate-button");
    generateButton.addEventListener("click", generateCode);
    
    // const addPointButton = document.querySelector("#add-point-button")
    // addPointButton.addEventListener("click", addPoint)

    const copyButton = document.querySelector("#copy-button");
    copyButton.addEventListener("click", copyCode);
}

main();
