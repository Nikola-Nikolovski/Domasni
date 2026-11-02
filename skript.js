
let vozaci = [];
let krug = 0;

function novaTrka() {
    vozaci = [
        { ime: "Алекс", tim: "Црвен", brzina: 95, vestina: 90 },
        { ime: "Мартин", tim: "Син", brzina: 91, vestina: 88 },
        { ime: "Давид", tim: "Жолт", brzina: 89, vestina: 92 },
        { ime: "Лука", tim: "Зелен", brzina: 93, vestina: 85 },
        { ime: "Петар", tim: "Црвен", brzina: 87, vestina: 89 },
        { ime: "Иван", tim: "Син", brzina: 90, vestina: 86 },
        { ime: "Никола", tim: "Жолт", brzina: 88, vestina: 87 },
        { ime: "Стефан", tim: "Зелен", brzina: 85, vestina: 91 },
        { ime: "Марко", tim: "Бел", brzina: 86, vestina: 84 },
        { ime: "Филип", tim: "Бел", brzina: 84, vestina: 88 }
    ];

    krug = 0;

    
    for (let i = 0; i < vozaci.length; i++) {
        vozaci[i].gumi = i % 2 === 0 ? "меки" : "тврди";
        vozaci[i].vreme = 0;
        vozaci[i].pitKrug = 4 + (i % 4); // 4, 5, 6 ili 7 krug
        vozaci[i].smenilGumi = false;
        vozaci[i].status = "Нема";
    }

    document.getElementById("krug").textContent = "Круг: 0 / 10";
    document.getElementById("poraka").textContent = "Притисни „Следен круг“ за да започне трката.";
    document.getElementById("naslovPred").textContent = "Состојба пред почетокот";
    document.getElementById("naslovPo").textContent = "Состојба по кругот";
    document.getElementById("kopce").disabled = false;
    prikaziTabela("pred", false);
    document.getElementById("po").innerHTML = "<tr><td colspan='8'>Трката сè уште не започнала.</td></tr>";
}

function prikaziTabela(id, soStatus) {
    
    let redosled = [...vozaci].sort((a, b) => a.vreme - b.vreme);
    let html = "";

    for (let i = 0; i < redosled.length; i++) {
        let v = redosled[i];
        html += "<tr>";
        html += "<td>" + (i + 1) + "</td>";
        html += "<td>" + v.ime + "</td>";
        html += "<td>" + v.tim + "</td>";
        html += "<td>" + v.brzina + "</td>";
        html += "<td>" + v.vestina + "</td>";
        html += "<td>" + v.gumi + "</td>";
        html += "<td>" + v.vreme.toFixed(2) + "</td>";
        html += "<td>" + (soStatus ? v.status : "—") + "</td>";
        html += "</tr>";
    }
    document.getElementById(id).innerHTML = html;
}

function sledenKrug() {
    if (krug >= 10) return;

    
    let novKrug = krug + 1;
    document.getElementById("naslovPred").textContent = "Состојба пред " + novKrug + ". круг";
    prikaziTabela("pred", false);

    krug++;
    let bezbednosnoVozilo = Math.random() < 0.15;

    for (let v of vozaci) {
        
        let vreme = 120 - v.brzina * 0.4 - v.vestina * 0.2;
        vreme += v.gumi === "меки" ? -2 : 2;
        vreme += Math.random() * 3;
        let status = [];

        
        if (!v.smenilGumi && krug === v.pitKrug) {
            vreme += 18;
            v.gumi = v.gumi === "меки" ? "тврди" : "меки";
            v.smenilGumi = true;
            status.push("Пит-стоп (сменети гуми)");
        }

        
        let slucajno = Math.random();
        if (slucajno < 0.05) {
            vreme += 5;
            status.push("Извртување (+5 с)");
        } else if (slucajno < 0.10) {
            vreme += 10;
            status.push("Излетување (+10 с)");
        }

        if (bezbednosnoVozilo) {
            vreme += 8;
            status.push("Безбедносно возило");
        }

        v.vreme += vreme;
        v.status = status.length > 0 ? status.join(", ") : "Нема";
    }

    document.getElementById("krug").textContent = "Круг: " + krug + " / 10";
    document.getElementById("naslovPo").textContent = "Состојба по " + krug + ". круг";
    document.getElementById("poraka").textContent = bezbednosnoVozilo
        ? "Во овој круг излезе безбедносно возило!"
        : "Заврши " + krug + ". круг.";
    prikaziTabela("po", true);

    if (krug === 10) {
        let pobednik = [...vozaci].sort((a, b) => a.vreme - b.vreme)[0];
        document.getElementById("poraka").textContent =
            "Победник е " + pobednik.ime + " (" + pobednik.tim + ") со " +
            pobednik.vreme.toFixed(2) + " секунди!";
        document.getElementById("kopce").disabled = true;
    }
}

novaTrka();
