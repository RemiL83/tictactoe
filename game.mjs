//#region
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
});
//#endregion

import ANSI from "./ANSI.mjs"

let vinner = 0;
let brett = 
[
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

//#region Logikken for spillet tre på rad. --------------------------------------------------------

const spiller1 = 1;
const spiller2 = -1;

let resultatAvSpill = "";
let spiller = spiller1;
let isGameOver = false

while (isGameOver == false) {

    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    visBrett(brett);
    console.log(`Det er spiller ${spillerNavn()} sin tur`);

    let rad = -1;
    let kolonne = -1;

    do {
        let pos = await rl.question("Hvor setter du merket ditt? Skriv rad,kolonne, for eksempel 1,2.\n");
        [rad, kolonne] = pos.split(",")
        rad = rad - 1;
        kolonne = kolonne - 1;

    } while (brett[rad][kolonne] != 0)

    brett[rad][kolonne] = spiller;

    vinner = harNoenVunnet(brett);
    if (vinner != 0) {
        isGameOver = true;
        resultatAvSpill = `Vinneren er ${spillerNavn(vinner)}`;
    } else if (erSpilletUavgjort(brett)) {
        resultatAvSpill = "Det ble uavgjort";
        isGameOver = true;
    }
    byttAktivSpiller();
}

console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
visBrett(brett);
console.log(resultatAvSpill);
process.exit();

//#endregion---------------------------------------------------------------------------------------

function harNoenVunnet(brett) {

    for (let rad = 0; rad < brett.length; rad++) {
        let sum = 0;
        for (let kolonne = 0; kolonne < brett.length; kolonne++) {
            sum += brett[rad][kolonne];
        }

        if (Math.abs(sum) == 3) {
            return sum / 3;
        }
    }

    for (let kolonne = 0; kolonne < brett.length; kolonne++) {
        let sum = 0;
        for (let rad = 0; rad < brett.length; rad++) {
            sum += brett[rad][kolonne];
        }

        if (Math.abs(sum) == 3) {
            return sum / 3;
        }
    }

    let venstreDiagonal = 0;
    for (let i = 0; i < brett.length; i++) {
        venstreDiagonal += brett[i][i];
    }
    if (Math.abs(venstreDiagonal) == 3) return venstreDiagonal / 3;

    let hoyreDiagonal = 0;
    for (let i = 0; i < brett.length; i++) {
        hoyreDiagonal += brett[i][brett.length - 1 - i];
    }
    if (Math.abs(hoyreDiagonal) == 3) return hoyreDiagonal / 3;

    return 0;
}

function erSpilletUavgjort(brett) {

    for (let rad = 0; rad < brett.length; rad++) {
        for (let kolonne = 0; kolonne < brett[rad].length; kolonne++) {
            if (brett[rad][kolonne] == 0) {
                return false;
            }
        }
    }

    return true;
}

function visBrett(brett) {

    let visningAvBrett = "     1     2     3\n";
    visningAvBrett += "  ╔═════╦═════╦═════╗\n";

    for (let i = 0; i < brett.length; i++) {
        const rad = brett[i];
        let visningAvRad = `${i + 1} ║`;
        for (let j = 0; j < rad.length; j++) {
            let verdi = rad[j];
            if (verdi == 0) {
                visningAvRad += `     ║`;
            } else if (verdi == spiller1) {
                visningAvRad += ANSI.COLOR.GREEN + `  X` + ANSI.COLOR_RESET + `  ║`;
            } else {
                visningAvRad += ANSI.COLOR.RED + `  O` + ANSI.COLOR_RESET + `  ║`;
            }
        }
        visningAvRad += "\n";
        visningAvBrett += visningAvRad;

        if (i < brett.length - 1) {
            visningAvBrett += "  ╠═════╬═════╬═════╣\n";            
        } else {
            visningAvBrett += "  ╚═════╩═════╩═════╝\n";
        }
    }

    console.log(visningAvBrett);
}

function spillerNavn(sp = spiller) {
    if (sp == spiller1) {
        return "Spiller 1(X)";
    } else {
        return "Spiller 2(O)";
    }
}

function byttAktivSpiller() {
    spiller = spiller * -1;
}
