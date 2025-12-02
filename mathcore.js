/**
 * SommenFlitser Math Core
 * Modular math opgave generator volgens wiskundige specificaties
 * Zie README.md voor volledige wiskundige analyse
 */

class OpgaveGenerator {
    constructor() {
        /**
         * Niveau configuraties volgens README.md specificaties:
         * Niveau 1: Basis automatisering
         * Niveau 2: Gevorderd
         * Niveau 3: Verdieping
         */
        this.niveaus = {
            1: {
                optellen: { max: 100, range: 50 },
                aftrekken: { max: 100, range: 50 },
                vermenigvuldigen: { max: 100, range: 10, tafelMax: 10 },
                delen: { max: 100, range: 10, tafelMax: 10 }
            },
            2: {
                optellen: { max: 500, range: 200 },
                aftrekken: { max: 500, range: 200 },
                vermenigvuldigen: { max: 144, range: 12, tafelMax: 12 },
                delen: { max: 144, range: 12, tafelMax: 12 }
            },
            3: {
                optellen: { max: 1000, range: 500 },
                aftrekken: { max: 1000, range: 1000 },
                vermenigvuldigen: { max: 144, range: 12, tafelMax: 12 },
                delen: { max: 144, range: 12, tafelMax: 12 }
            }
        };
    }

    /**
     * Hoofdfunctie: genereer een opgave
     * @param {string} bewerking - Type bewerking: 'optellen', 'aftrekken', 'vermenigvuldigen', 'delen'
     * @param {number} niveau - Moeilijkheidsgraad: 1, 2, of 3
     * @returns {Object} Opgave object met a, b, operator, antwoord, bewerking, niveau
     */
    genereer(bewerking, niveau) {
        const config = this.niveaus[niveau][bewerking];

        switch(bewerking) {
            case 'optellen':
                return this.genereerOptelling(config, bewerking, niveau);
            case 'aftrekken':
                return this.genereerAftrekking(config, bewerking, niveau);
            case 'vermenigvuldigen':
                return this.genereerVermenigvuldiging(config, bewerking, niveau);
            case 'delen':
                return this.genereerDeling(config, bewerking, niveau);
            default:
                throw new Error(`Onbekende bewerking: ${bewerking}`);
        }
    }

    /**
     * Genereer optelling: a + b = c
     * Constraint: a + b ≤ max, a,b ∈ [1, range]
     */
    genereerOptelling(config, bewerking, niveau) {
        const a = Math.floor(Math.random() * config.range) + 1;
        const maxB = Math.min(config.range, config.max - a);
        const b = Math.floor(Math.random() * maxB) + 1;

        return {
            a,
            b,
            operator: '+',
            antwoord: a + b,
            bewerking,
            niveau
        };
    }

    /**
     * Genereer aftrekking: a − b = c
     * Constraint: a ≥ b (geen negatieve uitkomsten)
     * Methode: Direct sampling (sample a eerst, dan b ≤ a)
     */
    genereerAftrekking(config, bewerking, niveau) {
        const a = Math.floor(Math.random() * config.range) + 1;
        const b = Math.floor(Math.random() * a) + 1;

        return {
            a,
            b,
            operator: '−',
            antwoord: a - b,
            bewerking,
            niveau
        };
    }

    /**
     * Genereer vermenigvuldiging: a × b = c
     * Beperkt tot tafels 1 t/m tafelMax
     * Commutativiteit: a × b = b × a (beide worden als uniek beschouwd voor didactiek)
     */
    genereerVermenigvuldiging(config, bewerking, niveau) {
        const a = Math.floor(Math.random() * config.tafelMax) + 1;
        const b = Math.floor(Math.random() * config.tafelMax) + 1;

        return {
            a,
            b,
            operator: '×',
            antwoord: a * b,
            bewerking,
            niveau
        };
    }

    /**
     * Genereer deling: a ÷ b = c
     * Methode: Inverse van vermenigvuldiging (a = b × c)
     * Dit garandeert dat a deelbaar is door b (gehele uitkomst)
     * Constructieve aanpak: kies b en c, bereken a = b × c
     */
    genereerDeling(config, bewerking, niveau) {
        const b = Math.floor(Math.random() * config.tafelMax) + 1; // deler
        const c = Math.floor(Math.random() * config.tafelMax) + 1; // quotiënt
        const a = b * c; // deeltal (gegarandeerd deelbaar)

        return {
            a,
            b,
            operator: '÷',
            antwoord: c,
            bewerking,
            niveau
        };
    }

    /**
     * Genereer keuze-opties voor multiple choice vragen
     * Slimme strategie: voorkom eindcijfer-goktruc bij optellen/aftrekken
     * @param {number} correctAntwoord - Het correcte antwoord
     * @param {string} bewerking - Type bewerking voor context-specifieke strategie
     * @returns {Array} Array van 4 getallen inclusief correct antwoord
     */
    genereerKeuzes(correctAntwoord, bewerking) {
        const keuzes = new Set([correctAntwoord]);
        const eindcijfer = correctAntwoord % 10;

        let pogingen = 0;
        let aantalZelfdeEindcijfer = 0;

        // Genereer 3 foute antwoorden
        while (keuzes.size < 4 && pogingen < 50) {
            let fout;

            if (bewerking === 'vermenigvuldigen' || bewerking === 'delen') {
                // Voor vermenigvuldigen/delen: normale strategie
                const delta = Math.floor(Math.random() * 15) - 7;
                fout = correctAntwoord + delta;
            } else {
                // Voor optellen/aftrekken: voorkom eindcijfer-goktruc
                // 60% kans om bewust hetzelfde eindcijfer te gebruiken
                if (Math.random() < 0.6 && aantalZelfdeEindcijfer < 2) {
                    // Genereer getal met ZELFDE eindcijfer (delta moet veelvoud van 10 zijn)
                    const deltaSteps = Math.floor(Math.random() * 9) - 4; // -4 tot +4 (behalve 0)
                    const delta = deltaSteps === 0 ? 10 : deltaSteps * 10; // -40, -30, -20, -10, 10, 20, 30, 40
                    fout = correctAntwoord + delta;
                    aantalZelfdeEindcijfer++;
                } else {
                    // Normale generatie met verschillende eindcijfers
                    const delta = Math.floor(Math.random() * 40) - 20;
                    fout = correctAntwoord + delta;
                }
            }

            // Validatie: fout moet positief en verschillend zijn
            if (fout > 0 && fout !== correctAntwoord) {
                keuzes.add(fout);
            }
            pogingen++;
        }

        // Vul aan met random getallen indien nodig
        while (keuzes.size < 4) {
            const random = Math.floor(Math.random() * correctAntwoord * 2) + 1;
            if (random !== correctAntwoord) {
                keuzes.add(random);
            }
        }

        // Converteer naar array en shuffle
        const keuzesArray = Array.from(keuzes);
        return keuzesArray.sort(() => Math.random() - 0.5);
    }

    /**
     * Valideer of een opgave voldoet aan alle constraints
     * @param {Object} opgave - De te valideren opgave
     * @returns {boolean} True als geldig, false anders
     */
    valideerOpgave(opgave) {
        const { a, b, operator, antwoord, bewerking, niveau } = opgave;
        const config = this.niveaus[niveau][bewerking];

        // Algemene validaties
        if (a < 1 || b < 1) return false;
        if (!Number.isInteger(antwoord)) return false;
        if (antwoord < 0) return false;

        // Bewerking-specifieke validaties
        switch(bewerking) {
            case 'optellen':
                return a <= config.range && b <= config.range && antwoord <= config.max;
            case 'aftrekken':
                return a <= config.range && a >= b && antwoord >= 0;
            case 'vermenigvuldigen':
                return a <= config.tafelMax && b <= config.tafelMax;
            case 'delen':
                return b <= config.tafelMax && a % b === 0;
            default:
                return false;
        }
    }

    /**
     * Genereer een set van unieke opgaven
     * @param {string} bewerking - Type bewerking
     * @param {number} niveau - Moeilijkheidsgraad
     * @param {number} aantal - Aantal opgaven
     * @returns {Array} Array van unieke opgaven
     */
    genereerSet(bewerking, niveau, aantal) {
        const opgaven = [];
        const opgavenSet = new Set();
        let pogingen = 0;
        const maxPogingen = aantal * 20;

        while (opgaven.length < aantal && pogingen < maxPogingen) {
            const opgave = this.genereer(bewerking, niveau);
            const opgaveKey = `${opgave.a}${opgave.operator}${opgave.b}`;

            if (!opgavenSet.has(opgaveKey)) {
                opgavenSet.add(opgaveKey);
                opgaven.push(opgave);
            }

            pogingen++;
        }

        // Vul aan indien noodzakelijk
        while (opgaven.length < aantal) {
            opgaven.push(this.genereer(bewerking, niveau));
        }

        return opgaven;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpgaveGenerator;
}
