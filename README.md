# Effekttoppar – Tibber / Telge Nät

Webbapp som hämtar din timförbrukning från Tibber och räknar ut effekttoppar och effektavgift enligt Telge Näts regler
(snitt av de 5 högsta timmarna på olika vardagar 07–20, nov–mars). Reglerna går att ändra under *Regler och inställningar*.

**Öppna:** https://powershelltoday.github.io/effekttoppar-tibber-telge/

## Kom igång
1. Skapa en personal access token på [developer.tibber.com](https://developer.tibber.com/settings/access-token).
2. Klistra in den i appen och tryck *Använd token*. Kryssa i *Kom ihåg token* om du vill slippa ange den igen (du får en fråga först).
3. På iPhone: Dela → *Lägg till på hemskärmen*. Appen startar då i helskärm med egen ikon.
   Obs: hemskärmsappen har egen lagring, separat från Safari, så token behöver anges en gång där också.

## Integritet
- Ingen server. Sidan är statisk och allt körs i din webbläsare.
- Token skickas bara till `api.tibber.com`. Den sparas (okrypterad) i webbläsarens localStorage, och bara om du godkänner det. *Glöm token* tar bort den.
- Förbrukningen cachas i webbläsarens IndexedDB. Den kan exporteras/importeras som JSON.

## Utveckling
```
npm install        # bara för ikonbygget (sharp)
npm run icons      # genererar icons/*.png och icons/*.svg från tools/build-icons.mjs
npm run serve      # lokal server på http://localhost:8080
```
