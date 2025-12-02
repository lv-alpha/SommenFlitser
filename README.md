# Wiskundige Analyse: Algoritme Rekenopgaven Generator
## Een Diepgravende Verhandeling als Voorwerk op de Implementatie

---

## Inhoudsopgave

1. [Inleiding en Probleemstelling](#1-inleiding-en-probleemstelling)
2. [Wiskundige Eigenschappen van de Vier Basisbewerkingen](#2-wiskundige-eigenschappen-van-de-vier-basisbewerkingen)
3. [Getallentheorie en Gehele Getallen](#3-getallentheorie-en-gehele-getallen)
4. [Domeinanalyse per Bewerking en Niveau](#4-domeinanalyse-per-bewerking-en-niveau)
5. [Kardinaliteit van de Oplossingenruimte](#5-kardinaliteit-van-de-oplossingenruimte)
6. [Validatieregels en Wiskundige Constraints](#6-validatieregels-en-wiskundige-constraints)
7. [Uniforme Randomisatie en Verdelingstheorie](#7-uniforme-randomisatie-en-verdelingstheorie)
8. [Randgevallen en Edge Cases](#8-randgevallen-en-edge-cases)
9. [Complexiteitsanalyse](#9-complexiteitsanalyse)
10. [Conclusies en Implementatie-aanbevelingen](#10-conclusies-en-implementatie-aanbevelingen)

---

## 1. Inleiding en Probleemstelling

### 1.1 Wiskundige Kernvraag

De centrale wiskundige vraagstelling luidt: 

> Gegeven een bewerking **âŠ•** âˆˆ {+, âˆ’, Ã—, Ã·} en een moeilijkheidsniveau **L** âˆˆ {1, 2, 3}, genereer een ordered pair **(a, b)** zodanig dat:
> 1. **a, b** âˆˆ â„¤âº (positieve gehele getallen)
> 2. **a âŠ• b** âˆˆ â„¤âº (de uitkomst is een positief geheel getal)
> 3. **a, b** voldoen aan de domeinrestricties van niveau **L**
> 4. De selectie is uniform random binnen de toegestane verzameling

### 1.2 Formele Notatie

Laten we definiÃ«ren:
- **S(âŠ•, L)** = {(a, b) | a, b voldoen aan alle constraints voor bewerking âŠ• en niveau L}
- **|S(âŠ•, L)|** = kardinaliteit van deze verzameling (aantal mogelijke opgaven)
- **P(a, b)** = 1/|S(âŠ•, L)| voor uniforme verdeling

---

## 2. Wiskundige Eigenschappen van de Vier Basisbewerkingen

### 2.1 Optellen: a + b = c

**AlgebraÃ¯sche eigenschappen:**
- **Commutativiteit:** a + b = b + a
- **Associativiteit:** (a + b) + c = a + (b + c)
- **Identiteitselement:** a + 0 = a
- **Gesloten onder â„¤âº:** âˆ€a, b âˆˆ â„¤âº: a + b âˆˆ â„¤âº

**Implicaties voor het algoritme:**
- Commutatieve eigenschap betekent dat (a, b) en (b, a) verschillende presentaties zijn van dezelfde opgave
- Voor didactische variatie is het zinvol beide te beschouwen als uniek
- Er is geen upper bound nodig voor a en b individueel, alleen voor c = a + b

**Constraint formulering:**
```
Gegeven: c_max (maximale uitkomst)
Te vinden: a, b zodanig dat:
  1 â‰¤ a, b
  a + b â‰¤ c_max
```

### 2.2 Aftrekken: a âˆ’ b = c

**AlgebraÃ¯sche eigenschappen:**
- **Niet-commutatief:** a âˆ’ b â‰  b âˆ’ a (in algemeen)
- **Niet-associatief:** (a âˆ’ b) âˆ’ c â‰  a âˆ’ (b âˆ’ c)
- **Geen identiteitselement rechts:** a âˆ’ 0 = a, maar 0 âˆ’ a = -a
- **Niet gesloten onder â„¤âº:** a âˆ’ b kan negatief zijn

**Implicaties voor het algoritme:**
- Vereist expliciete check: a â‰¥ b om negatieve uitkomsten te vermijden
- De volgorde van a en b is cruciaal
- Het domein wordt significant beperkt door de niet-negativiteitseis

**Constraint formulering:**
```
Gegeven: c_max (hoewel minder relevant), c_min = 0
Te vinden: a, b zodanig dat:
  a â‰¥ b â‰¥ 1
  a âˆ’ b â‰¥ 0
```

### 2.3 Vermenigvuldigen: a Ã— b = c

**AlgebraÃ¯sche eigenschappen:**
- **Commutativiteit:** a Ã— b = b Ã— a
- **Associativiteit:** (a Ã— b) Ã— c = a Ã— (b Ã— c)
- **Distributiviteit:** a Ã— (b + c) = (a Ã— b) + (a Ã— c)
- **Identiteitselement:** a Ã— 1 = a
- **Gesloten onder â„¤âº:** âˆ€a, b âˆˆ â„¤âº: a Ã— b âˆˆ â„¤âº

**Tafel van Vermenigvuldiging als verzameling:**

Definieer **T_n** als de verzameling van producten in de tafels 1 t/m n:
```
T_n = {i Ã— j | 1 â‰¤ i, j â‰¤ n}
```

Voor n = 12:
```
T_12 = {1, 2, 3, ..., 12, 14, 15, 16, 18, 20, ..., 144}
```

**Belangrijke observatie:** T_n is **geen** interval. Er zitten "gaten" in:
- 13 âˆ‰ T_12 (priemgetal > 12)
- 26 âˆ‰ T_12 (= 2 Ã— 13)
- 130 âˆ‰ T_12 (= 10 Ã— 13)

**Implicaties voor het algoritme:**
- Directe benadering: kies i, j âˆˆ [1, n] en bereken c = i Ã— j
- Dit garandeert dat c âˆˆ T_n
- Uniforme verdeling over (i, j) geeft echter **niet** uniforme verdeling over c

### 2.4 Delen: a Ã· b = c, ofwel a = b Ã— c

**AlgebraÃ¯sche eigenschappen:**
- **Niet-commutatief:** a Ã· b â‰  b Ã· a
- **Niet-associatief:** (a Ã· b) Ã· c â‰  a Ã· (b Ã· c)
- **Identiteitselement rechts:** a Ã· 1 = a
- **Niet gesloten onder â„¤:** a Ã· b âˆ‰ â„¤ in algemeen

**Deelbaarheidsrelatie:**

a is deelbaar door b als en slechts als:
```
âˆƒc âˆˆ â„¤: a = b Ã— c
```

In symbolen: **b | a** (b deelt a)

**Constraint voor gehele uitkomst:**
```
a â‰¡ 0 (mod b)
```

Dit betekent dat a een veelvoud moet zijn van b.

**Implicaties voor het algoritme:**
- Omgekeerde benadering van vermenigvuldigen: kies b, c en bereken a = b Ã— c
- Dit garandeert deelbaarheid
- Equivalent aan het genereren van een vermenigvuldigingsopgave en deze "omkeren"

**Formele relatie met vermenigvuldigen:**
```
Stel M = {(b, c) | vermenigvuldigingsopgave}
Dan D = {(b Ã— c, b) | (b, c) âˆˆ M} (delingsopgaven)
```

---

## 3. Getallentheorie en Gehele Getallen

### 3.1 Fundamentele Stelling van de Rekenkunde

Elk positief geheel getal n > 1 kan op unieke wijze worden geschreven als product van priemgetallen:
```
n = pâ‚^(aâ‚) Ã— pâ‚‚^(aâ‚‚) Ã— ... Ã— pâ‚–^(aâ‚–)
```

**Relevantie voor deling:**

Voor a Ã· b âˆˆ â„¤ moet gelden dat alle priemfactoren van b (met hun multipliciteiten) ook voorkomen in a.

Voorbeeld:
- 72 = 2Â³ Ã— 3Â²
- 8 = 2Â³
- 72 Ã· 8 = 9 âœ“ (want 2Â³ | 2Â³ Ã— 3Â²)

Maar:
- 72 = 2Â³ Ã— 3Â²
- 16 = 2â´
- 72 Ã· 16 âˆ‰ â„¤ (want 2â´ âˆ¤ 2Â³ Ã— 3Â²)

### 3.2 Grootste Gemene Deler (GGD)

Voor twee getallen a en b:
```
ggd(a, b) = grootste d âˆˆ â„¤âº zodat d | a en d | b
```

**Stelling:** a Ã· b âˆˆ â„¤ âŸº ggd(a, b) = b

**Euclidisch Algoritme** voor berekening ggd(a, b):
```
Zolang b â‰  0:
  r := a mod b
  a := b
  b := r
Return a
```

### 3.3 Kleinste Gemene Veelvoud (KGV)

Voor twee getallen a en b:
```
kgv(a, b) = kleinste m âˆˆ â„¤âº zodat a | m en b | m
```

**Relatie met GGD:**
```
kgv(a, b) Ã— ggd(a, b) = a Ã— b
```

**Relevantie:** Bij het genereren van opgaven kunnen we kgv gebruiken om combinaties te vermijden die tot grote getallen leiden.

### 3.4 Veelvouden en Reeksen

Een veelvoud van b is een getal van de vorm:
```
V_b = {k Ã— b | k âˆˆ â„¤âº} = {b, 2b, 3b, 4b, ...}
```

**Aantal veelvouden van b in interval [1, n]:**
```
|V_b âˆ© [1, n]| = âŒŠn / bâŒ‹
```

Dit is cruciaal voor het bepalen van |S(Ã·, L)|.

---

## 4. Domeinanalyse per Bewerking en Niveau

### 4.1 Niveau 1 - Basis Automatisering

#### Optellen (Niveau 1)
```
Domein: a, b âˆˆ [1, 50]
Constraint: a + b â‰¤ 100
```

**Analyse:**
- Maximum a + b = 50 + 50 = 100 âœ“
- Minimum a + b = 1 + 1 = 2
- Niet alle combinaties zijn geldig

**Geldige verzameling:**
```
S(+, 1) = {(a, b) | 1 â‰¤ a, b â‰¤ 50 âˆ§ a + b â‰¤ 100}
```

**Visualisatie in (a, b)-ruimte:**
Dit vormt een driehoekig gebied in het eerste kwadrant, begrensd door:
- a â‰¥ 1, b â‰¥ 1 (ondergrens)
- a â‰¤ 50, b â‰¤ 50 (rechthoekige begrenzing)
- a + b â‰¤ 100 (diagonale begrenzing)

Het vierkant [1, 50] Ã— [1, 50] heeft kardinaliteit 50 Ã— 50 = 2500.

De constraint a + b â‰¤ 100 elimineert het rechterboven driehoekje waar a + b > 100.

Dit driehoekje heeft combinaties waar:
- a > 50 âˆ¨ b > 50 (niet mogelijk gezien domein)
- Alle punten binnen domein voldoen automatisch aan a + b â‰¤ 100

**Conclusie:** Alle 2500 combinaties zijn geldig voor optellen niveau 1.

#### Aftrekken (Niveau 1)
```
Domein: a, b âˆˆ [1, 50]
Constraint: a âˆ’ b â‰¥ 0
```

**Analyse:**
```
S(âˆ’, 1) = {(a, b) | 1 â‰¤ a, b â‰¤ 50 âˆ§ a â‰¥ b}
```

In de (a, b)-ruimte is dit het driehoekige gebied **boven** de diagonaal a = b (inclusief de diagonaal zelf).

**Kardinaliteit berekening:**
- Diagonaal: a = b levert 50 punten op (1,1), (2,2), ..., (50,50)
- Boven diagonaal: voor elke a zijn er (a âˆ’ 1) geldige b-waarden
  ```
  Î£(a=2 tot 50) (a âˆ’ 1) = Î£(k=1 tot 49) k = 49 Ã— 50 / 2 = 1225
  ```
- **Totaal:** 50 + 1225 = **1275 geldige combinaties**

#### Vermenigvuldigen (Niveau 1)
```
Domein: a, b âˆˆ [1, 10] (tafels 1 t/m 10)
Constraint: (impliciet voldaan)
```

**Analyse:**
```
S(Ã—, 1) = {(a, b) | 1 â‰¤ a, b â‰¤ 10}
```

**Kardinaliteit:** 10 Ã— 10 = **100 combinaties**

**Unieke producten in T_10:**

Hoeveel verschillende getallen zitten in T_10?

Systematische telling:
- 1Ã—1 = 1
- 1Ã—2 = 2Ã—1 = 2
- 1Ã—3 = 3Ã—1 = 3
- ...
- 2Ã—2 = 4
- 2Ã—3 = 3Ã—2 = 6
- ...

Door symmetrie (commutatieve eigenschap) tellen we eigenlijk unieke ordered pairs.

**Aantal unieke producten â‰  Aantal ordered pairs**

Voorbeeld: 12 kan worden verkregen als:
- 2 Ã— 6
- 3 Ã— 4
- 4 Ã— 3
- 6 Ã— 2

Dit betekent dat sommige producten vaker voorkomen dan andere, wat van belang is voor de verdeling.

#### Delen (Niveau 1)
```
Domein: a = b Ã— c waar b, c âˆˆ [1, 10]
Constraint: (impliciet voldaan door constructie)
```

**Analyse:**

Genereren via: kies b, c âˆˆ [1, 10], bereken a = b Ã— c

Dit levert precies dezelfde verzameling op als vermenigvuldigen, maar dan "omgedraaid":
```
S(Ã·, 1) = {(b Ã— c, b) | 1 â‰¤ b, c â‰¤ 10}
```

**Kardinaliteit:** 10 Ã— 10 = **100 combinaties**

**Unieke quotiÃ«nten:**
De quotiÃ«nt is altijd c âˆˆ [1, 10], dus er zijn exact 10 mogelijke antwoorden.

### 4.2 Niveau 2 - Gevorderd

#### Optellen (Niveau 2)
```
Domein: a, b âˆˆ [1, 200]
Constraint: a + b â‰¤ 500
```

**Analyse:**

De rechthoek [1, 200] Ã— [1, 200] heeft kardinaliteit 40.000.

De constraint a + b â‰¤ 500 legt een diagonale begrenzing op.

**Tellen van geldige punten:**

Voor elke a âˆˆ [1, 200], hoeveel b âˆˆ [1, 200] voldoen aan a + b â‰¤ 500?

- Als a â‰¤ 300: b â‰¤ min(200, 500 âˆ’ a)
  - Voor a âˆˆ [1, 200]: b â‰¤ min(200, 500 âˆ’ a)
  - Omdat 500 âˆ’ a â‰¥ 500 âˆ’ 200 = 300 > 200 voor alle a âˆˆ [1, 200]
  - Dus b âˆˆ [1, 200] altijd geldig

**Conclusie:** Alle 200 Ã— 200 = **40.000 combinaties** zijn geldig.

#### Aftrekken (Niveau 2)
```
Domein: a, b âˆˆ [1, 200]
Constraint: a â‰¥ b
```

**Kardinaliteit:**
- Diagonaal: 200 punten
- Boven diagonaal: Î£(a=2 tot 200) (a âˆ’ 1) = 199 Ã— 200 / 2 = 19.900

**Totaal:** 200 + 19.900 = **20.100 combinaties**

#### Vermenigvuldigen (Niveau 2)
```
Domein: a, b âˆˆ [1, 12]
```

**Kardinaliteit:** 12 Ã— 12 = **144 combinaties**

#### Delen (Niveau 2)
```
Domein: Afgeleid van vermenigvuldiging met tafels 1-12
```

**Kardinaliteit:** **144 combinaties**

### 4.3 Niveau 3 - Verdieping

#### Optellen (Niveau 3)
```
Domein: a, b âˆˆ [1, 500]
Constraint: a + b â‰¤ 1000
```

**Analyse:**

Voor a âˆˆ [1, 500]:
- b â‰¤ min(500, 1000 âˆ’ a)
- Voor a âˆˆ [1, 500]: 1000 âˆ’ a âˆˆ [500, 999]
- Dus b â‰¤ 500 altijd

**Conclusie:** Alle 500 Ã— 500 = **250.000 combinaties** zijn geldig.

#### Aftrekken (Niveau 3)
```
Domein: a âˆˆ [1, 1000], b âˆˆ [1, 1000]
Constraint: a â‰¥ b
```

**Maar let op:** De opdrachtstelling specificeert:
- "Aftrekken: getallen 1-1000"

Dit suggereert dat zowel a als b uit [1, 1000] kunnen komen.

**Kardinaliteit:**
- Diagonaal: 1000 punten
- Boven diagonaal: Î£(a=2 tot 1000) (a âˆ’ 1) = 999 Ã— 1000 / 2 = 499.500

**Totaal:** **500.500 combinaties**

#### Vermenigvuldigen & Delen (Niveau 3)

Identiek aan Niveau 2: **144 combinaties** elk.

---

## 5. Kardinaliteit van de Oplossingenruimte

### 5.1 Samenvatting Kardinaliteiten

| Bewerking | Niveau 1 | Niveau 2 | Niveau 3 |
|-----------|----------|----------|----------|
| Optellen (+) | 2.500 | 40.000 | 250.000 |
| Aftrekken (âˆ’) | 1.275 | 20.100 | 500.500 |
| Vermenigvuldigen (Ã—) | 100 | 144 | 144 |
| Delen (Ã·) | 100 | 144 | 144 |

### 5.2 Asymmetrie in Oplossingenruimte

**Observatie:** 
- Optellen en aftrekken hebben exponentieel grotere oplossingenruimtes bij hogere niveaus
- Vermenigvuldigen en delen blijven beperkt tot tafels (bescheiden groei)

**Implicatie voor randomisatie:**
- Optellen/aftrekken: ruime keuze, gemakkelijk uniform te samplen
- Vermenigvuldigen/delen: kleine verzameling, grotere kans op herhaling

**Didactische overweging:**
De beperkte ruimte bij vermenigvuldigen/delen is opzettelijk: het doel is automatisering van **specifieke** tafels. Herhaling is hier gewenst voor spaced repetition.

### 5.3 Uniforme Verdeling vs. Didactische Verdeling

**Wiskundige uniform:** Elke geldige (a, b) heeft gelijke kans P = 1/|S|

**Didactische overwegingen:**
- Bij vermenigvuldigen: moeten "moeilijke" tafels (7Ã—8, 9Ã—6) even vaak voorkomen als "gemakkelijke" (2Ã—3)?
- Bij deling: zeer grote delers (Ã·12) vs. kleine delers (Ã·2)?

**Frequentieverdeling van producten in T_12:**

Sommige getallen komen vaker voor:
- 1: 1 keer (1Ã—1)
- 12: 6 keer (1Ã—12, 2Ã—6, 3Ã—4, 4Ã—3, 6Ã—2, 12Ã—1)
- 24: 8 keer (1Ã—24 n.v.t., 2Ã—12, 3Ã—8, 4Ã—6, 6Ã—4, 8Ã—3, 12Ã—2)

Als we uniform over (a, b) samplen, krijgen "populaire" producten meer aandacht.

**Alternatieve verdeling:**
Weighted sampling waar elke **unieke** tafelfeit (i Ã— j met i â‰¤ j) gelijke kans heeft.

---

## 6. Validatieregels en Wiskundige Constraints

### 6.1 Pre-conditie Validatie

Voordat een opgave wordt gegenereerd, moeten de parameters voldoen aan:

**Algemeen:**
```
niveau âˆˆ {1, 2, 3}
bewerking âˆˆ {+, âˆ’, Ã—, Ã·}
```

**Niveau-specifieke parameters:**
```
Voor niveau L:
  a_min(L, âŠ•), a_max(L, âŠ•)
  b_min(L, âŠ•), b_max(L, âŠ•)
  c_min(L, âŠ•), c_max(L, âŠ•)
```

### 6.2 Post-conditie Validatie

Na generatie van (a, b), valideer:

**Optellen:**
```
Geldig âŸº (1 â‰¤ a â‰¤ a_max) âˆ§ (1 â‰¤ b â‰¤ b_max) âˆ§ (a + b â‰¤ c_max)
```

**Aftrekken:**
```
Geldig âŸº (1 â‰¤ b â‰¤ b_max) âˆ§ (b â‰¤ a â‰¤ a_max) âˆ§ (a âˆ’ b â‰¥ 0)
```

**Vermenigvuldigen:**
```
Geldig âŸº (1 â‰¤ a â‰¤ tafel_max) âˆ§ (1 â‰¤ b â‰¤ tafel_max)
```

**Delen:**
```
Geldig âŸº (1 â‰¤ b â‰¤ tafel_max) âˆ§ (âˆƒc âˆˆ [1, tafel_max]: a = b Ã— c)
```

### 6.3 Invarianten

Eigenschappen die altijd gelden:

**Invariant 1:** Output is altijd een geldig ordered pair (a, b)
```
âˆ€ gegenereerde opgaven: (a, b) âˆˆ S(âŠ•, L)
```

**Invariant 2:** De uitkomst is altijd een positief geheel getal
```
âˆ€ (a, b): a âŠ• b âˆˆ â„¤âº
```

**Invariant 3:** Herhaalbare generatie levert diverse opgaven
```
P(opgave_i = opgave_j) is klein voor i â‰  j, tenzij |S| zeer klein
```

---

## 7. Uniforme Randomisatie en Verdelingstheorie

### 7.1 Uniform Random Sampling

**Definitie:** Een sample uit verzameling S is **uniform random** als:
```
âˆ€ x âˆˆ S: P(X = x) = 1/|S|
```

**Methoden voor uniforme sampling:**

#### Methode 1: Rejection Sampling
```
Herhaal:
  a := random uit [a_min, a_max]
  b := random uit [b_min, b_max]
Totdat (a, b) voldoet aan alle constraints
Return (a, b)
```

**EfficiÃ«ntie:**
```
Verwacht aantal pogingen = 1 / (|S| / |R|)
```
waarbij R = rechthoekig domein [a_min, a_max] Ã— [b_min, b_max]

**Voor optellen niveau 1:**
```
|S| = 2500, |R| = 2500
Verwacht aantal pogingen = 1
```

**Voor aftrekken niveau 1:**
```
|S| = 1275, |R| = 2500
Verwacht aantal pogingen â‰ˆ 1.96
```

#### Methode 2: Direct Sampling (voor specifieke gevallen)

**Aftrekken:** Sample uniform uit driehoekig gebied
```
a := random uit [1, a_max]
b := random uit [1, min(b_max, a)]
Return (a, b)
```

Dit is exact uniform en heeft 100% efficiency (geen rejection).

**Vermenigvuldigen/Delen:** Direct sampling uit tafel
```
i := random uit [1, tafel_max]
j := random uit [1, tafel_max]
Return (i, j) voor vermenigvuldigen
Return (i Ã— j, i) voor delen
```

### 7.2 Statistische Properties

**Verwachtingswaarde van de uitkomst:**

Voor optellen:
```
E[a + b] = E[a] + E[b]
```

Als a, b uniform uit [1, n]:
```
E[a] = E[b] = (1 + n)/2
E[a + b] = (1 + n)/2 + (1 + n)/2 = 1 + n
```

**Voor niveau 1 optellen:**
```
E[a + b] = 1 + 50 = 51
```

Dit ligt precies in het midden van het bereik [2, 100]. Goede balans!

**Variantie:**

Voor onafhankelijke a, b:
```
Var[a + b] = Var[a] + Var[b]
```

Uniforme verdeling op [1, n]:
```
Var[X] = (nÂ² âˆ’ 1)/12
```

**Standaardafwijking** geeft spreiding aan.

### 7.3 Entropie en Informatie

Shannon-entropie meet de "verrassing" van een verdeling:
```
H(X) = âˆ’Î£ P(x) logâ‚‚ P(x)
```

**Voor uniforme verdeling over |S| elementen:**
```
H = logâ‚‚ |S|
```

**Entropie per niveau/bewerking:**

| Bewerking | Niveau 1 | Niveau 2 | Niveau 3 |
|-----------|----------|----------|----------|
| + | logâ‚‚(2500) â‰ˆ 11.3 bits | logâ‚‚(40000) â‰ˆ 15.3 bits | logâ‚‚(250000) â‰ˆ 17.9 bits |
| âˆ’ | logâ‚‚(1275) â‰ˆ 10.3 bits | logâ‚‚(20100) â‰ˆ 14.3 bits | logâ‚‚(500500) â‰ˆ 19.0 bits |
| Ã— | logâ‚‚(100) â‰ˆ 6.6 bits | logâ‚‚(144) â‰ˆ 7.2 bits | logâ‚‚(144) â‰ˆ 7.2 bits |
| Ã· | logâ‚‚(100) â‰ˆ 6.6 bits | logâ‚‚(144) â‰ˆ 7.2 bits | logâ‚‚(144) â‰ˆ 7.2 bits |

**Interpretatie:**
- Optellen/aftrekken hebben hoge entropie: veel variatie mogelijk
- Vermenigvuldigen/delen hebben lage entropie: beperkte variatie (opzettelijk voor training)

---

## 8. Randgevallen en Edge Cases

### 8.1 Minimale Waarden

**Optellen:**
```
Min: 1 + 1 = 2
```
Geen bijzonderheden.

**Aftrekken:**
```
Min: a âˆ’ a = 0 (voor elke a)
```
Nul als uitkomst is geldig maar triviaal. Didactisch minder interessant.

**Vermenigvuldigen:**
```
Min: 1 Ã— 1 = 1
Min non-triviaal: 2 Ã— 1 = 2
```
Vermenigvuldigen met 1 is triviaal (identiteit).

**Delen:**
```
Min: a Ã· a = 1
Min non-triviaal: 2 Ã· 2 = 1, of 2 Ã· 1 = 2
```
Delen door 1 is triviaal, delen door zichzelf levert altijd 1.

**Aanbeveling:** 
Optionele filter voor "triviale" opgaven:
- Vermijd a = 1 of b = 1 bij vermenigvuldigen
- Vermijd a = b bij aftrekken en delen

### 8.2 Maximale Waarden

**Optellen niveau 3:**
```
Max: a + b = 1000
Bijvoorbeeld: 500 + 500 = 1000
```

**Aftrekken niveau 3:**
```
Max verschil: 1000 âˆ’ 1 = 999
```

**Vermenigvuldigen:**
```
Max: 12 Ã— 12 = 144
```

**Delen:**
```
Max deeltal: 12 Ã— 12 = 144
Max quotiÃ«nt: 12
```

### 8.3 Grensgevallen en Foutgevoeligheid

**Grenswaarde analyse:**

Bij implementatie zijn off-by-one errors gebruikelijk. Test daarom:

**Optellen:**
- (a, b) zodanig dat a + b = c_max (exact op limiet)
- (a, b) zodanig dat a + b = c_max + 1 (net over limiet, moet afgekeurd)

**Aftrekken:**
- (a, b) met a = b (verschil = 0, op limiet)
- (a, b) met a = b âˆ’ 1 (negatief, moet afgekeurd)

**Vermenigvuldigen:**
- (tafel_max, tafel_max) = (12, 12)
- (tafel_max + 1, iets) moet niet mogelijk zijn

**Delen:**
- (tafel_max Ã— tafel_max, tafel_max) = (144, 12)
- Gevallen waar a niet deelbaar is door b

### 8.4 Hoekgevallen in Deelbaarheid

**Prime detection:**

Priemgetallen > tafel_max kunnen niet worden gegenereerd als product.

Voorbeeld: 13, 17, 19, 23, ... kunnen niet als uitkomst verschijnen bij vermenigvuldigen met tafels 1-12.

Dit is correct gedrag: de tafelstructuur verbiedt deze uitkomsten.

**Samengestelde getallen met factoren > tafel_max:**

26 = 2 Ã— 13

Kan niet met tafels 1-12, omdat 13 > 12.

**Conclusie:** De verzameling T_n is **niet** gelijk aan [1, nÂ²], maar een strikte deelverzameling.

---

## 9. Complexiteitsanalyse

### 9.1 Tijdcomplexiteit van Generatie

**Methode: Direct Sampling**

Voor vermenigvuldigen/delen:
```
T(Ã—) = O(1)
```
Twee random getallen, Ã©Ã©n vermenigvuldiging.

Voor optellen niveau 1-3:
```
T(+) = O(1)
```
Twee random getallen, Ã©Ã©n optelling, constraint-check (O(1)).

Voor aftrekken met direct sampling:
```
T(âˆ’) = O(1)
```
Random a, vervolgens random b â‰¤ a.

**Methode: Rejection Sampling**

Voor aftrekken (als gebruikt):
```
T_rejection(âˆ’) = E[aantal pogingen] Ã— T_per_poging
                = (|R| / |S|) Ã— O(1)
```

Voor niveau 1:
```
T = (2500 / 1275) Ã— O(1) â‰ˆ 2 Ã— O(1) = O(1)
```

**Conclusie:** Alle bewerkingen kunnen in constante gemiddelde tijd worden gegenereerd.

### 9.2 Ruimtecomplexiteit

**Geheugen voor opslag van constraints:**
```
S_constraints = O(1)
```
Enkele integers voor niveau-specifieke grenzen.

**Geheugen voor Random Number Generator (RNG) state:**
```
S_RNG = O(1)
```

**Totale ruimtecomplexiteit:**
```
S_total = O(1)
```

### 9.3 Parallellisatie Mogelijkheden

Omdat elke opgave onafhankelijk wordt gegenereerd:
```
P generaties in parallel: T_parallel = O(1)
```

Dit is ideaal voor batch-generatie of vooraf-caching van opgaven.

### 9.4 Cache StrategieÃ«n

**Pre-generatie van opgaven:**

Voor kleine oplossingenruimtes (vermenigvuldigen/delen):
- Genereer alle mogelijke opgaven bij initialisatie
- Opslag: O(|S|)
- Sampling: O(1) (index lookup)

Voor niveau 2 vermenigvuldigen:
```
Opslag = 144 opgaven Ã— (2 integers + 1 operator) â‰ˆ 1 KB
```

**Voordelen:**
- Perfecte uniforme verdeling gegarandeerd
- Geen risico op herhaalde rejection sampling
- Snelle runtime performance

**Nadelen:**
- Geheugengebruik (verwaarloosbaar voor deze schaal)
- Initialisatietijd

**Aanbeveling:** Cache-strategie voor vermenigvuldigen/delen, direct sampling voor optellen/aftrekken.

---

## 10. Conclusies en Implementatie-aanbevelingen

### 10.1 Wiskundige Kernbevindingen

1. **Deelbaarheid is de cruciale constraint bij deling**
   - Oplossing: genereer via inverse (a = b Ã— c)
   - Dit garandeert gehele uitkomsten

2. **Niet-negativiteit vereist zorgvuldige ordening bij aftrekking**
   - Oplossing: sample a eerst, dan b â‰¤ a

3. **Commutatieve eigenschappen zijn didactisch relevant**
   - 3 + 5 vs. 5 + 3 zijn wiskundig identiek, maar didactisch verschillend
   - Aanbeveling: treat als unieke opgaven

4. **Kardinaliteit varieert dramatisch tussen bewerkingen**
   - Vermenigvuldigen/delen: klein (10Â² tot 12Â²)
   - Optellen/aftrekken: groot (tot 500K)
   - Implicatie: verschillende sampling strategieÃ«n per bewerking

### 10.2 Algoritme-architectuur Aanbevelingen

**Strategie per bewerking:**

| Bewerking | Methode | Rationale |
|-----------|---------|-----------|
| Optellen | Direct sampling | Constraints zijn eenvoudig, geen rejection nodig |
| Aftrekken | Direct sampling (ordered) | Sample a, dan b â‰¤ a voor efficientie |
| Vermenigvuldigen | Pre-generatie + cache | Kleine verzameling, perfecte verdeling |
| Delen | Inverse van vermenigvuldigen | Garandeert deelbaarheid |

**Modularisatie:**

```
Hoofdfunctie: genereer_opgave(bewerking, niveau)
  â”œâ”€ valideer_input(bewerking, niveau)
  â”œâ”€ haal_constraints(bewerking, niveau)
  â””â”€ roep_specifieke_generator(bewerking, niveau)
       â”œâ”€ genereer_optelling(constraints)
       â”œâ”€ genereer_aftrekking(constraints)
       â”œâ”€ genereer_vermenigvuldiging(constraints)
       â””â”€ genereer_deling(constraints)
```

### 10.3 Validatie StrategieÃ«n

**Pre-validatie:**
- Check niveau âˆˆ {1, 2, 3}
- Check bewerking âˆˆ {+, âˆ’, Ã—, Ã·}

**Post-validatie:**
- Voor optellen: controleer a + b â‰¤ c_max
- Voor aftrekken: controleer a â‰¥ b
- Voor vermenigvuldigen: (impliciet geldig)
- Voor delen: (impliciet geldig door constructie)

**Unit tests moeten dekken:**
- Minimale waarden (lower bounds)
- Maximale waarden (upper bounds)
- Grensgevallen (exact op limiet)
- Triviale gevallen (b = 1, a = b, etc.)

### 10.4 Uitbreidingsmogelijkheden

**Toekomstige features:**

1. **Gewogen sampling voor didactische focus**
   - Bijvoorbeeld: meer "moeilijke" tafels (7Ã—8, 9Ã—7) bij niveau 3
   - Implementatie: probability mass function per (i, j)

2. **Adaptieve moeilijkheid**
   - Track prestaties per tafeltype
   - Verhoog kans op tafels met lage accuratesse

3. **Combinaties van bewerkingen**
   - Opgaven als: (a + b) Ã— c
   - Vereist hiÃ«rarchische generatie

4. **Negatieve getallen (uitbreiding voorbij opdracht)**
   - Aftrekking zonder niet-negativiteits-constraint
   - Introductie van negatieve integers â„¤

5. **Decimale uitkomsten (uitbreiding voorbij opdracht)**
   - Deling zonder gehele-getal-constraint
   - Introductie van rationale getallen â„š

### 10.5 Samenvatting Wiskundige Eigenschappen

| Eigenschap | Optellen | Aftrekken | Vermenigvuldigen | Delen |
|------------|----------|-----------|------------------|-------|
| Commutatief | âœ“ | âœ— | âœ“ | âœ— |
| Associatief | âœ“ | âœ— | âœ“ | âœ— |
| Gesloten onder â„¤âº | âœ“ | âœ— | âœ“ | âœ— |
| Dominant constraint | c â‰¤ max | a â‰¥ b | Tafel-lidmaatschap | Deelbaarheid |
| Kardinaliteit (N1) | 2500 | 1275 | 100 | 100 |
| Kardinaliteit (N3) | 250K | 500K | 144 | 144 |
| Sampling-strategie | Direct | Ordered direct | Pre-generatie | Inverse van Ã— |
| Triviale gevallen | Weinig | a = b | a = 1 of b = 1 | a = b of b = 1 |

### 10.6 Finale Aanbeveling

Het algoritme is wiskundig goed gedefinieerd en implementeerbaar met:
- **Constante tijdcomplexiteit** O(1) per opgave
- **Constante ruimtecomplexiteit** O(1) (of O(|S|) voor caching)
- **Uniforme verdeling** binnen elke (bewerking, niveau) combinatie
- **Gegarandeerd geldige uitkomsten** door constructieve generatie

De wiskundige analyse biedt solide fundament voor implementatie, met duidelijke handling van edge cases en constraints.

---

## Referenties en Verder Lezen

**Getallentheorie:**
- Hardy, G. H., & Wright, E. M. (2008). *An Introduction to the Theory of Numbers*. Oxford University Press.
- Rosen, K. H. (2019). *Elementary Number Theory and Its Applications*. Pearson.

**Algoritmen en Complexiteit:**
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms*. Addison-Wesley.

**Randomisatie en Statistiek:**
- Devroye, L. (1986). *Non-Uniform Random Variate Generation*. Springer-Verlag.
- Ross, S. M. (2014). *Introduction to Probability Models* (11th ed.). Academic Press.

**Didactiek Rekenen (context):**
- Van den Heuvel-Panhuizen, M., & Drijvers, P. (2020). *Realistic Mathematics Education*. In S. Lerman (Ed.), Encyclopedia of Mathematics Education (pp. 713-717). Springer.

---

*Einde wiskundige analyse. Dit document dient als theoretische basis voor de implementatiefase.*
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
