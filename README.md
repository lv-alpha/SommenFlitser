# Definitieve Opdrachtstelling: Algoritme Rekenopgaven Generator

## 1. Doel
Ontwikkel een algoritme voor een oefensoftwareproduct waarmee **pabo-studenten hun eigen rekenvaardigheden** kunnen trainen. Het algoritme genereert telkens Ã©Ã©n rekenopgave waarbij de uitkomst altijd een geheel getal is. Het doel is dat studenten snel en automatisch kunnen rekenen, zodat zij boven de basisschoolstof staan.

---

## 2. Functionele Specificaties

### 2.1 Bewerkingen
Het algoritme ondersteunt vier basisbewerkingen:
- Optellen (+)
- Aftrekken (âˆ’)
- Vermenigvuldigen (Ã—)
- Delen (Ã·)

De gebruiker kan per generatie kiezen welke bewerking wordt toegepast.

### 2.2 Getallenregels

**Vermenigvuldigen en delen:**
- Gebaseerd op tafels van vermenigvuldiging 1 t/m 12
- Bij deling: deeltal moet een veelvoud zijn van de deler (geheel getal als uitkomst)
- Voorbeeld geldig: 72 Ã· 8 = 9 âœ“
- Voorbeeld ongeldig: 25 Ã· 7 = 3,57... âœ—

**Optellen en aftrekken:**
- Uitkomst maximaal 1000
- Uitkomst minimaal 0 (geen negatieve getallen)
- De individuele getallen zelf mogen groter zijn dan 1000, zolang de uitkomst â‰¤ 1000

### 2.3 Herhaalbaarheid
Het algoritme moet zodanig ontworpen zijn dat het herhaaldelijk aangeroepen kan worden binnen het softwareproduct om telkens een nieuwe opgave te genereren.

---

## 3. Moeilijkheidsgraden

Gericht op **snelheid en automatisering** voor pabo-studenten:

### **Niveau 1 - Basis automatisering**
- **Optellen:** getallen 1-50, uitkomst max 100
- **Aftrekken:** getallen 1-50, uitkomst min 0
- **Vermenigvuldigen:** tafels 1 t/m 10
- **Delen:** tafels 1 t/m 10
- *Doel: Basisvaardigheid, snelle herkenning*

### **Niveau 2 - Gevorderd**
- **Optellen:** getallen 1-200, uitkomst max 500
- **Aftrekken:** getallen 1-200, uitkomst min 0
- **Vermenigvuldigen:** tafels 1 t/m 12
- **Delen:** tafels 1 t/m 12
- *Doel: Vlot hoofdrekenen, tafels uitgebreid*

### **Niveau 3 - Verdieping**
- **Optellen:** getallen 1-500, uitkomst max 1000
- **Aftrekken:** getallen 1-1000, uitkomst min 0
- **Vermenigvuldigen:** alle combinaties tafels 1 t/m 12, inclusief "moeilijke" (7Ã—8, 9Ã—6, etc.)
- **Delen:** alle combinaties tafels 1 t/m 12
- *Doel: Absolute beheersing, snelheid onder druk*

---

## 4. Technische Vereisten

- Het algoritme moet willekeurige (random) getallen genereren binnen de gespecificeerde grenzen
- De gekozen getallen moeten gevalideerd worden voordat ze worden geretourneerd
- **Input:** bewerking (keuze gebruiker) en moeilijkheidsniveau
- **Output:** twee gehele getallen en de bijbehorende bewerking

---

## 5. Doelgroep
**Pabo-studenten** die hun eigen rekenvaardigheid willen trainen voor snelle, automatische beheersing van basisrekenvaardigheden.

---

## 6. Voorbeelden

### Geldige opgaven:
- 7 Ã— 8 = 56 âœ“
- 144 Ã· 12 = 12 âœ“
- 347 + 521 = 868 âœ“
- 750 âˆ’ 283 = 467 âœ“

### Ongeldige opgaven:
- 17 Ã· 5 = 3,4 âœ— (geen geheel getal)
- 643 + 789 = 1432 âœ— (uitkomst > 1000)
- 45 âˆ’ 67 = -22 âœ— (negatieve uitkomst)
