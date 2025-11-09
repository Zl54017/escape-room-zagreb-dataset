# Escape Room Zagreb – Otvoreni skup podataka

Ovaj skup podataka sadrži informacije o escape room igrama dostupnima u Zagrebu. Svaki zapis opisuje pojedini escape room, zajedno s pripadajućom tvrtkom, tematikom, težinom i trajanjem igre. Podaci su prikupljeni sa stranice [https://www.escaperoomzagreb.com/sve-escape-room-igre-u-hrvatskoj/](https://www.escaperoomzagreb.com/sve-escape-room-igre-u-hrvatskoj/).

* **Naziv skupa podataka:** Escape Room Zagreb Dataset
* **Autor:** Zvonko Lelas
* **Verzija:** 1.0
* **Jezik:** hrvatski
* **Datum izrade:** listopad 2025.
* **Format datoteka:** CSV i JSON
* **Broj zapisa:** 32
* **Broj atributa:** 11

## Opis atributa

| Atribut               | Opis                                                             |
| --------------------- | -----------------------------------------------------------------|
| `id`                  | Jedinstveni identifikator escape rooma                           |
| `naziv`               | Naziv escape room igre                                           |
| `adresa`              | Lokacija escape rooma                                            |
| `tezina`              | Težina igre (1–5)                                                |
| `trajanje_minute`     | Trajanje igre u minutama                                         |
| `maks_igraca`         | Maksimalan broj igrača                                           |
| `web_stranica`        | Poveznica na web stranicu igre                                   |
| `tvrtka.naziv`        | Naziv tvrtke koja nudi escape room                               |
| `tvrtka.web_stranica` | Web stranica tvrtke                                              |
| `tvrtka.kontakt`      | Kontakt broj tvrtke                                              |
| `tematika.naziv`      | Tematika igre (npr. horror, detektivska, avanturistička, sci-fi) |

## Struktura repozitorija

```
escape-room-zagreb-dataset/
│
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
├── schema.json
├── escape_room.csv
├── escape_room.json
├── escape_room_dump.sql
├── index.html
├── datatable.html
├── backend/
│   └── server.js
└── frontend/
    ├── main.js
    └── style.css
```

## Stranica
Web sučelje omogućuje jednostavan pregled i pretragu escape roomova iz Zagreba. Podaci su prikazani u tablici s osnovnim informacijama o svakoj igri i pripadajućoj tvrtki.
**Css generiran preko [https://uiverse.io/](Ui verse stranice)**

### Kako koristiti

1. **Pokrenite lokalni server**

   U direktoriju `backend` pokrenite:
   ```
   npm install
   node server.js
   ```

2. **Otvorite `datatable.html`**

   U pregledniku otvorite datoteku `datatable.html`. Možete pretraživati i filtrirati podatke po svim ključnim atributima. Moguće je i preuzeti podatke u CSV ili JSON obliku putem gumba na stranici.


## Licenca

Ovaj skup podataka objavljen je pod licencom **Creative Commons CC0 1.0 Universal (Public Domain Dedication)**.
To znači da se podaci mogu slobodno koristiti, dijeliti, mijenjati i ponovno objavljivati u bilo koje svrhe, uključujući komercijalne, bez potrebe za navođenjem izvora.

Više informacija o licenci dostupno je na službenoj stranici:
[https://creativecommons.org/publicdomain/zero/1.0/](https://creativecommons.org/publicdomain/zero/1.0/)
