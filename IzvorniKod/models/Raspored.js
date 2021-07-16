const Grupa = require('./Grupa');
const Aktivnost = require('./Aktivnost');
const Animator = require('./Animator');
const Kamp = require('./Kamp');
const AktivnostSveGrupe = require('./AktivnostSveGrupe');
const SQLutil = require('./SQLutil');
const AktivnostTocnoNGrupa = require('./AktivnostTocnoNGrupa');
const AktivnostMaxNGrupa = require('./AktivnostMaxNGrupa');
const AktivnostSamoJednaGrupa = require('./AktivnostSamoJednaGrupa');
module.exports = class Raspored {
    /*constructor(aktivnostiGrupe) {
        this.aktivnostiGrupe = aktivnostiGrupe
    }
    Rasp = {}; 
*/
    

    /*
    slobAnimatori = sviAnimatori;           // animatori koji trenutno ne rade nista
    slobAktivnosti = sveAktivnosti;         // aktivnosti koje se ne dogadaju trenutno
    slobGrupe = sveGrupe;                   // grupe koje nista ne rade trenutno
*/
 

    static async dodajAktivnost(newAktivnost, newDan, newVrijeme, newGrupe, newAnimatori)
    {
        console.log("Aktivnost: " + newAktivnost);
        console.log("Dan: " + newDan);
        //let br = parseInt(newVrijeme);
        console.log("Vrijeme: " + newVrijeme); //samo sati trebaju
        console.log("Grupe: " + newGrupe);
        console.log("Animatori: " + newAnimatori);



        if(newDan > (await Kamp.provjeriImaLiKampa()).trajanje) {
            return {uspjeh:false, err: 'Kamp je u tom trenutku završen!'};
        }
        
       
        let preSql = `SELECT trajanje FROM aktivnost WHERE nazivakt = '${newAktivnost}'`
        let preResult = await SQLutil.query(preSql);
        let trajanje = preResult[0].trajanje.hours; 
        let kraj = parseInt(newVrijeme) + trajanje; 
       
        //1. uvjet aktivnost se neće preklapati s aktivnošću istog tipa
        let sql = `SELECT * FROM sudjeluje WHERE nazivAkt = '${newAktivnost}' AND dan = ${newDan} AND ('${kraj + ":00"}' > vrijeme AND '${newVrijeme + ":00"}' < vrijeme + '${trajanje} hours')`; //kraj nove poslije pocetka stare i pocetak nove prije kraja stare
        let result = await SQLutil.query(sql);
        if (result.length > 0) {
            return {uspjeh: false, err: "Aktivnosti se preklapaju"};
        }

        //2. uvjet barem jedan animator
        if (newAnimatori == undefined) {
            return {uspjeh: false, err: 'Morate pridružiti barem jednog animatora'};
        }

        //3. uvjet pridružen je odgovarajuć broj grupa

        sql = `SELECT * FROM aktivnost1 WHERE nazivakt = '${newAktivnost}'`;
        if((await SQLutil.query(sql)).length > 0) {
            if(newGrupe.length != 1) {
                return {uspjeh: false, err: 'Nije pridružen odgovarajući broj grupa (1)'};
            }
        } 

        let brojGrupa;
        sql = `SELECT * FROM aktivnostn WHERE nazivakt = '${newAktivnost}'`;
        result = await SQLutil.query(sql); 
        if(result.length > 0) {
            if(result[0].brojgrupa != newGrupe.length) {
                return {uspjeh: false, err: `Nije pridružen odgovarajući broj grupa (${result[0].brojGrupa})`};
            }
        }

        sql = `SELECT * FROM aktivnostmaxn WHERE nazivakt = '${newAktivnost}'`;
        result = await SQLutil.query(sql); 
        if(result.length > 0) {
            if(result[0].brojgrupa < newGrupe.length) {
                return {uspjeh: false, err: `Nije pridružen odgovarajući broj grupa (max ${result[0].brojGrupa})`};
            }
        }

        sql = `SELECT * FROM aktivnostsve WHERE nazivakt = '${newAktivnost}'`;
        result = await SQLutil.query(sql); 
        if(result.length > 0) {
            if((await Grupa.fetchAllGroups()).length != newGrupe.length) {
                return {uspjeh: false, err: `Nije pridružen odgovarajući broj grupa (sve grupe)`};
            }
        }


        //4. uvjet ni jedna od pridruženih grupa neće imati konflikte s drugim aktivnostima koje su vec navedene
        //grupa mora biti slobodna
        for (let grupa of newGrupe) {
            sql = `SELECT * 
                    FROM sudjeluje NATURAL JOIN aktivnost
                    WHERE nazivgrupa = '${grupa}'
                    AND dan = ${newDan}
                    AND '${kraj + ":00"}' > vrijeme
                    AND '${newVrijeme + ":00"}' < vrijeme + trajanje`;

            
            result = await SQLutil.query(sql);
            if (result.length > 0) {
                return {uspjeh: false, err: grupa + " u to vrijeme nije slobodna!"};
            }
        }
        
        //5. uvjet ni jedna od pridruženih grupa nije već pridružena jednakoj aktivnosti
        for (let grupa of newGrupe) {
            sql = `SELECT * FROM sudjeluje WHERE nazivgrupa = '${grupa}' AND nazivAkt = '${newAktivnost}'`;
            result = await SQLutil.query(sql);
            if (result.length > 0) {
                return {uspjeh: false, err: `${grupa} je već pridružena aktivnosti ${newAktivnost}`};
            }
        }
        
        //6. uvjet pridruženi animatori neće imati konflikte s drugim aktivnostima na koje su pridruženi.
        for (let animator of newAnimatori) {
            sql = `SELECT * 
                    FROM animatorsudjeluje NATURAL JOIN aktivnost
                    WHERE idosobe = '${animator}'
                    AND dan = ${newDan}
                    AND '${kraj + ":00"}' > vrijeme
                    AND '${newVrijeme + ":00"}' < vrijeme + trajanje`;

            result = await SQLutil.query(sql);
            if (result.length > 0) {
                return {uspjeh: false, err: `Jedan od animatora nije slobodan u to vrijeme!`};
            }
        }
        

        //dodaj u bazu sudjeluje
        for(let grupa of newGrupe) {
            let sql = `INSERT INTO sudjeluje VALUES('${grupa}', '${newAktivnost}', ${newDan}, '${newVrijeme + ":00"}')`;
            await SQLutil.query(sql);
        }

        //dodaj u bazu animatorsudjeluje
        for(let animator of newAnimatori) {
            let sql = `INSERT INTO animatorsudjeluje VALUES('${animator}', '${newAktivnost}', '${newVrijeme + ":00"}' , ${newDan})`
            await SQLutil.query(sql);
        }

        return {uspjeh: true, err: null};
              
       // Rasp[{dan: newDan, vrijeme: newVrijeme}] = {aktivnost : newAktivnost, grupe : newGrupe, animatori: newAnimatori};  // ako se ovo smije

    }

    static async zavrsiDodavanjeAktivnosti() {
        let sqlAktivnosti = `SELECT nazivAkt FROM aktivnost`;
        let sqlGrupe = `SELECT nazivGrupa FROM grupa`;

        let aktivnosti = await SQLutil.query(sqlAktivnosti);
        let grupe = await SQLutil.query(sqlGrupe);

        let povezane = true;
        let greske = new Array();
        for (let aktivnost of aktivnosti) {
            for (let grupa of grupe) {
                let sql = `SELECT * FROM sudjeluje WHERE nazivAkt = '${aktivnost.nazivakt}' AND nazivgrupa = '${grupa.nazivgrupa}'`;
                let result = await SQLutil.query(sql);
                if (result.length == 0) {
                    povezane = false;
                    greske.push(`${grupa.nazivgrupa} nije povezana s aktivnosti ${aktivnost.nazivakt}. <br>`)
                }
            }
        }

        return povezane ? {uspjeh : true, err: null} : {uspjeh: false, err: greske}
    }

    static async dohvatiRaspored() {
        const sql = `SELECT * FROM sudjeluje ORDER BY nazivgrupa, dan, vrijeme`
        return await SQLutil.query(sql);
    }

    static async dohvatiRasporedZaUsername(username, uloga) {
        if(uloga != 'a' && uloga != 's' && username == undefined) new Array();
        const sql = `select distinct dan, vrijeme, nazivakt
        from ${uloga == 'a' ? 'animatorsudjeluje' : 'sudjeluje natural join sudionik'}  natural join racun 
        where korisnickoime = '${username}'
        order by dan, vrijeme, nazivakt`;

        return await SQLutil.query(sql);
    } 


    //formiranje mape rasporeda po grupama
    static async formiraj() 
    {
        
        let trajanjeKampa = (await Kamp.provjeriImaLiKampa()).trajanje;

        let sveGrupe = await Grupa.fetchAllGroups();
        let grupe = new Array();
        sveGrupe.forEach(g => grupe.push(g.naziv));

        let animatori = await Animator.fetchAnimatorIDs();
        // dodavanje obroka svaki dan
        let obrok;
        obrok = new AktivnostSveGrupe("Dorucak", "najbitniji obrok u danu", 1);
        obrok.persist(); // otkomentirati na kraju!!!

        obrok = new AktivnostSveGrupe("Rucak", "rucak", 1);
        obrok.persist(); //otkomentirati na kraju!!!
    
        obrok = new AktivnostSveGrupe("Vecera", "vecera", 1);
        obrok.persist(); //otkomentirati na kraju!!!
    
        var millisecondsToWait = 5000;
            setTimeout(async function() {
    // Whatever you want to do after the wait

        for(let i = 1; i <= trajanjeKampa; i++)
        {        
            for(let grupa of grupe) {
                let sql = `INSERT INTO sudjeluje VALUES('${grupa}', 'Dorucak', ${i}, '${8 + ":00"}');
                            INSERT INTO sudjeluje VALUES('${grupa}', 'Rucak', ${i}, '${12 + ":00"}');
                            INSERT INTO sudjeluje VALUES('${grupa}', 'Vecera', ${i}, '${18 + ":00"}');`;
                await SQLutil.query(sql);
            }
    
            //dodaj u bazu animatorsudjeluje
            for(let animator of animatori) {
                let sql = `INSERT INTO animatorsudjeluje VALUES('${animator}', 'Dorucak', '${8 + ":00"}' , ${i});
                            INSERT INTO animatorsudjeluje VALUES('${animator}', 'Rucak', '${12 + ":00"}' , ${i});
                            INSERT INTO animatorsudjeluje VALUES('${animator}', 'Vecera', '${18 + ":00"}' , ${i});`
                
                
                await SQLutil.query(sql);
            }
        }
        }, millisecondsToWait);        

/*
        //podjela aktivnosti za sve grupe, pretpostavka da kamp traje od 8 ujutro do 6 navecer

        const satiUDanu = 11;

        let aktivnostiSveGrupe = await AktivnostSveGrupe.odaberiAktivnostiZaSveGrupe(sveAktivnosti);
        let rasp = new Array(trajanjeKampa * satiUDanu).fill(0); //polje popunjeno 0, svaki element reprezentira jedan sat u trajanju kampa        
        for(let i = 0; i < trajanjeKampa; i++) {
            rasp[i*satiUDanu + 0] = 1; //zauzmi dorucak
            rasp[i*satiUDanu + 4] = 1; //zauzmi rucak
            rasp[i*satiUDanu + 10] = 1; //zauzmi veceru
        }

        for(let aktivnost of aktivnostiSveGrupe) { 
            if(aktivnost.ime == 'Dorucak' || aktivnost.ime == 'Rucak' || aktivnost.ime == 'Vecera') continue; 
            if(aktivnost.trajanje > 5) {
                console.log('Greska, nemoguce organizirati kamp1');
                return false; //nemoguce organizirati kamp
            }

            for(let i = 0; i < trajanjeKampa * satiUDanu; i++) {
                if(i + aktivnost.trajanje > (trajanjeKampa * satiUDanu)) {
                    console.log('Greska, nemoguce organizirati kamp2');
                    return false; //nemoguce organizirati kamp
                }

                if(this.usporediPolja(rasp.slice(i, i + aktivnost.trajanje), new Array(aktivnost.trajanje).fill(0), aktivnost.trajanje)) {//nasli smo slobodno
                    rasp.fill(1, i, i + aktivnost.trajanje);
                    this.dodajAktivnost(aktivnost, Math.floor(i / satiUDanu), i % satiUDanu + 8, sveGrupe, sviAnimatori);
                    break;
                } 

            }
            

        }

        
        */
        /*todo podijeli raspored za tocno n grupa
        let aktivnostiTocnoN = await AktivnostTocnoNGrupa.odaberiAktivnostiZaTocnoNGrupa(sveAktivnosti);
        console.log(aktivnostiTocnoN);
        /*  ------------------*/

        /*todo podijeli raspored za max n grupa 
        let aktivnostiMaxN = await AktivnostMaxNGrupa.odaberiAktivnostiZaMaxNGrupa(sveAktivnosti);
        console.log(aktivnostiMaxN);
        /*  ------------------*/

        /*todo podijeli raspored za jednu grupu 
        let aktivnostSamoJedna = await AktivnostSamoJednaGrupa.odaberiAktivnostiZaSamoJednuGrupu(sveAktivnosti);
        console.log(aktivnostSamoJedna);
        /*  ------------------*/

         
        //console.log(rasp);
    }

    /**
     * Usporeduje dva polja
     * @param {Array} a 
     * @param {Array} b 
     * @param {Number} size 
     */
    usporediPolja(a, b, size) {
        for(let i = 0; i < size; i++) {
            if(a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
}

