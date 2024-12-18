//#region
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
});
//#endregion

import ANSI from "./ANSI.mjs"
import dictionary from "./dictionary.mjs"

const spiller1 = 1;
const spiller2 = -1;
let spiller = spiller1;
let resultatAvSpill = "";
let spiller1Navn;
let spiller2Navn;

console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
await hentSpillerNavn();

while (true) {
    await hovedSpill();
    const sluttvalg = await visMeny();
    if (sluttvalg === dictionary.omstart) {
    } else {
        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
        console.log(dictionary.sluttMelding);
        process.exit();
    }
}

async function hentSpillerNavn() {
    while (true) {
        spiller1Navn = await rl.question(dictionary.spiller1Spoersmaal);
        if (spiller1Navn.length > 10) {
            console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
            console.log(dictionary.forLangtNavn);            
        } else {
            break;
        }
    }
    while (true) {
        spiller2Navn = await rl.question(dictionary.spiller2Spoersmaal);
        if (spiller2Navn.length > 10) {
            console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
            console.log(dictionary.forLangtNavn);
        } else {
            break;
        }
    }
}

function spillerNavn(sp = spiller) {
    if (sp == spiller1) {
        return `${spiller1Navn} (X)`;
    } else {
        return `${spiller2Navn} (O)`;
    }
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

function byttAktivSpiller() {
    spiller = spiller * -1;
}

async function hovedSpill() {

    let vinner = 0;
    let brett = 
    [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    
    let isGameOver = false;

    while (isGameOver == false) {

        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
        visBrett(brett);
        console.log(`Det er ${spillerNavn(spiller)} sin tur.\n`);

        let rad;
        let kolonne;

        do {
            let pos = await rl.question(dictionary.spillInstruks);
            if (pos.trim().toLowerCase() === dictionary.avslutt) {
                console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
                console.log(dictionary.sluttMelding);
                process.exit();
            }

            [rad, kolonne] = pos.split(",");                       
            rad = parseInt(rad) - 1;
            kolonne = parseInt(kolonne) - 1;

            if (isNaN(rad) || isNaN(kolonne) || rad < 0 || rad > 2 || kolonne < 0 || kolonne > 2) {
                console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
                visBrett(brett);
                console.log(dictionary.ugyldigPlassering);
                continue;                
            }

            if (brett[rad][kolonne] !==0) {
                console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
                visBrett(brett);
                console.log(dictionary.opptattPlass);
                continue;
            }
            break;
        } while (true)

        brett[rad][kolonne] = spiller;

        vinner = harNoenVunnet(brett);
        if (vinner != 0) {
            resultatAvSpill = `Vinneren er ${spillerNavn(vinner)}.\n`;
            isGameOver = true;

        } else if (erSpilletUavgjort(brett)) {
            resultatAvSpill = dictionary.uavgjortMelding;
            isGameOver = true;
        }
        byttAktivSpiller();
    }

    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    visBrett(brett);
    console.log(resultatAvSpill);

}

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

async function visMeny() {
    while (true) {
        const valg = await rl.question(dictionary.omstartAvsluttMelding);
        if (valg === dictionary.omstart || valg === dictionary.avslutt) {
            return valg;
        }
    }
}