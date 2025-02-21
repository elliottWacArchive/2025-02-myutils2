async function addEntry() {
    const entry = document.getElementById("entry").value;
    const list = document.getElementById("afaire-list");
    if (entry) {
        list.innerHTML += `<div class="element"><div class="content">${entry}</div><button class="delete">Supprimer</button><button class="finish">terminé</button><div>`;
        document.getElementById("entry").value = "";
    }
}


async function addToDb(content, type) {
    const response = await fetch('db.php?function=add', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            content: content,
            type: type
        })
    })
    const data = await response.text();
    if (data == "true") {
        return true;
    } else {
        return false;
    }
}

async function removeToDb() {
    const response = await fetch('db.php?function=rm')
    const data = await response.text();
    if (data == "true") {
        return true;
    } else {
        return false;
    }
}

async function save() {
    const elements = document.querySelectorAll(".element");
    const info = await removeToDb();
    if (info == false) {
        alert("Sauvegarde échouée...");
        return;
    }
    elements.forEach(async element => {
        const content = element.querySelector(".content").innerText;
        if (element.parentElement.id == "afaire-list") {
            const info = await addToDb(content, 1);
            if (info == false) {
                alert("Sauvegarde échouée...");
                return;
            }
        } else {
            const info = await addToDb(content, 2);
            if (info == false) {
                alert("Sauvegarde échouée...");
                return;
            }
        }
    });
    alert("Sauvegarde réussie!");
}

async function load() {
    const response = await fetch('db.php?function=load')
    const data = await response.json();
    document.getElementById("afaire-list").innerHTML = "";
    document.getElementById("fini-list").innerHTML = "";
    data.forEach(element => {
        if (element.type == 1) {
            const list = document.getElementById("afaire-list");
            list.innerHTML += `<div class="element"><div class="content">${element.body}</div><button class="delete">Supprimer</button><button class="finish">terminé</button><div>`;
        } else {
            const list = document.getElementById("fini-list");
            list.innerHTML += `<div class="element"><div class="content">${element.body}</div><button class="delete finishArea">Supprimer</button><div>`;
        }
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    await load();
});

document.addEventListener('click', async function (e) {
    if (e.target.classList.contains("delete")) {
        if (e.target.classList.contains("finishArea")) {
            const list = document.getElementById("fini-list");
            list.removeChild(e.target.parentNode);
        } else {
            const list = document.getElementById("afaire-list");
            list.removeChild(e.target.parentNode);
        }
    }
    if (e.target.classList.contains("finish")) {
        let element = e.target.parentNode;
        element.querySelector(".delete").classList.add("finishArea")
        const afaireList = document.getElementById("afaire-list");
        const finiList = document.getElementById("fini-list");
        afaireList.removeChild(element);
        e.target.remove();
        finiList.appendChild(element);

    }
});