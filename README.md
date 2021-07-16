# camp-organization-app

Upute za testiranje projekta:

- pozicionirat se u Izvorni kod
- u db/seed.js prepraviti podatke o bazi
- pokrenuti nodejs db/seed.js
- time je stvorena baza, te se u nju upisani podaci jednog organizatora:
	username: pstojanovic
	pwd: admin
- sad se moze pokrenuti server: nodejs server.js
- logicni koraci su organizacija kampa i odabir prijave
- pokretanje skripte db/unos.js, unosi se jedan animator i jedan sudionik (i stvara racun za njih)
	animator:
		username: rfederer
		pwd: sifra
	korisnik: 
		username: ekolega
		pwd: sifra
- mozete se i vi registrirati, na mail vam stize link za finalnu registraciju
- nakon toga testirate ostale stvari (razmjestaj u grupe, razmjestaj medu grupama, formiranje rasporeda, dojmovi...)

VAZNO: Neke stvari nisu dostupne u ovisnosti je li kamp poceo, traje ili zavrsio. Najlakse je sve isprobati da se manualno mijenja vrijeme na racunalu. (Npr. ako kamp pocinje 30.01 i traje 5 dana, prvo se mozete prebaciti u 31.01, a onda u 05.02). Putovanje vremenom ubija sjednicu u bazi, tako da cete se morati ponovno loginati.

