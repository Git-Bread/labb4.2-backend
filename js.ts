let url = "http://127.0.0.1:3000";

let authed = false;

//some startup logic to get the whole thing started
function startup() {
    //adds functionality if page is right, with prevent of default submit behavior to stop reloading but keep required functionality
    let logBtn = document.getElementById("logBtn");
    if (logBtn != null) {
        logBtn?.addEventListener("click", () => log());   
        console.log("ran");
    }
    if (authed) {
        console.log("logged in");
    }
}

async function log() {
    let obj = {
        "username": (<HTMLInputElement>document.getElementById("username")).value,
        "password": (<HTMLInputElement>document.getElementById("pass")).value
    }
    let res = await fetch(url + "/login", {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if (res.error) {
        errLog(res);
        return;
    }
    else {
        localStorage.setItem("token", res.token);
        console.log(res.token);
    }
    window.location.href = "secretPage.html";
}

//not sure what format to use here to be honest hence any
//error manager that shoves all errors into an div which will then display the errors
function errLog(objArr: any) {
    let container = document.getElementById("error");
    clearErr();
    for (let index = 0; index < objArr.error.length; index++) {
        console.log(objArr[index]);
        let element = document.createElement("p");
        element.innerHTML = objArr.error[index];
        container?.append(element);     
    }
}

//clears errors
function clearErr() {
    let container = document.getElementById("error");
    while (container?.children[0]) {
        container?.removeChild(container.lastChild as HTMLElement);
    }
}

//making sure its all loaded before running, i miss c++
window.onload = async function() {
    if (document.URL.includes("login.html") || document.URL.includes("secretPage.html")) {
        await checkLogin();   
    }
    startup();
}

async function checkLogin() {
    let val = localStorage.getItem("token");
    console.log(val);
    if (val != "") {
        let res = await fetch(url + "/secret", {
            method: 'GET',
            body: null,
            headers: {
                'Authorization': 'Bearer ' + val as string
            }
        }).then(response => response.json())
        if (res) {
            authed = true;
            await getUser();
            return;
        }
        localStorage.removeItem("token");
    }
    console.log("not logged in");
    window.location.href = "login.html";
}

function getUser() {
    throw new Error("Function not implemented.");
}

