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
├── escape_room_zagreb.csv
├── escape_room_zagreb.json
├── escape_room_dump.sql
├── README.md
└── LICENSE
```

## Licencija

Ovaj skup podataka objavljen je pod licencijom [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). To znači da se podaci mogu slobodno koristiti, dijeliti i mijenjati, uz obavezno navođenje izvora i autora.
