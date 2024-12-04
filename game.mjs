//#region
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
});
//#endregion

import ANSI from "./ANSI.mjs"

const spiller1 = 1;
const spiller2 = -1;
let spiller = spiller1;
let resultatAvSpill = "";

while (true) {
    await hovedSpill();
    const sluttvalg = await visMeny();
    if (sluttvalg === 'r') {
    } else {
        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
        console.log(`Takk for spillet. Velkommen igjen.`);
        process.exit();
    }
}

//#endregion---------------------------------------------------------------------------------------

function spillerNavn(sp = spiller) {
    if (sp == spiller1) {
        return "spiller 1(X)";
    } else {
        return "spiller 2(O)";
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

        let rad = -1;
        let kolonne = -1;

        do {
            let pos = await rl.question(`Skriv 'rad,kolonne' (f.eks: 1,1), og trykk enter for å sette merket ditt. Skriv 'q' for å avslutte.\n`);
            if (pos.trim().toLowerCase() === 'q') {
                console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
                console.log(`Velkommen igjen.`);
                process.exit();
            }
            [rad, kolonne] = pos.split(",")

            rad = rad - 1;
            kolonne = kolonne - 1;

        } while (brett[rad][kolonne] != 0)

        brett[rad][kolonne] = spiller;

        vinner = harNoenVunnet(brett);
        if (vinner != 0) {
            resultatAvSpill = `Vinneren er ${spillerNavn(vinner)}.\n`;
            isGameOver = true;

        } else if (erSpilletUavgjort(brett)) {
            resultatAvSpill = "Det ble uavgjort.\n";
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
        const valg = await rl.question(`Skriv 'r' for å spille på nytt eller 'q' for å avslutte.\n`);
        if (valg === 'r' || valg === 'q') {
            return valg;
        }
    }
}