//local url
let url = "http://127.0.0.1:3000";

let authed = false;

//some startup logic to get the whole thing started
async function startup() {
    //adds functionality if page is right, with prevent of default submit behavior to stop reloading but keep required functionality
    let logBtn = document.getElementById("logBtn");
    if (logBtn != null) {
        logBtn?.addEventListener("click", () => log());   
    }
    let regBtn = document.getElementById("reg");
    if (regBtn != null) {
        regBtn?.addEventListener("click", () => register());   
    }
    //if logged in
    if (authed) {
        console.log("logged in");
        //page dependant
        if ( document.getElementById("loginHref")) {
            document.getElementById("loginHref")!.style.display = "none";
            document.getElementById("hide")!.style.display = "block";   
            document.getElementById("logout")!.style.display = "block";
        }
        let ele = document.getElementById("userLogin");
        ele!.innerHTML = "Inloggad Som: "+ localStorage.getItem("username") as string;

        //page depandant
        if (document.getElementById("userinfo")) {
            let val = await getUser(localStorage.getItem("token"));
            console.log(val);
            document.getElementById("realName")!.innerHTML = document.getElementById("realName")!.innerHTML + val[0].name;
            document.getElementById("email")!.innerHTML =  document.getElementById("email")!.innerHTML + val[0].email;
            document.getElementById("startDate")!.innerHTML =   document.getElementById("startDate")!.innerHTML + val[0].creationDate.split('T')[0];
        }
        //add event listener since that works better than hard coded html
        document.getElementById("logout")?.addEventListener("click", () => logOut());
    }
    if (!authed && document.getElementById("userinfo")) {
        window.location.href = "login.html";
    }
}

//log in handler
async function log() {
    let obj = {
        "username": (<HTMLInputElement>document.getElementById("username")).value,
        "password": (<HTMLInputElement>document.getElementById("pass")).value
    }
    //sends object with info
    let res = await fetch(url + "/login", {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    //error handling
    if (res.error) {
        errLog(res);
        return;
    }
    else {
        localStorage.setItem("token", res.token);
        localStorage.setItem("username", obj.username);
    }
    window.location.href = "secretPage.html";
}

//not sure what format to use here to be honest hence any
//error manager that shoves all errors into an div which will then display the errors
function errLog(objArr: any) {
    let container = document.getElementById("error");
    clearErr();
    for (let index = 0; index < objArr.error.length; index++) {
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

//making sure its all loaded before running, i miss java
window.onload = async function() {
    await checkLogin();   
    startup();
}

//Checks login status
async function checkLogin() {
    let val = localStorage.getItem("token");
    if (val != "") {
        let res = await fetch(url + "/secret", {
            method: 'GET',
            body: null,
            headers: {
                'Authorization': 'Bearer ' + val as string
            }
        }).then(response => response.json())
        //if logged in
        if (res == true) {
            authed = true;
            return;
        }
        //otherwise remove "old" token
        localStorage.removeItem("token");
    }
    console.log("not logged in");
}

//gets user data
async function getUser(token){
    let user = {
        username: localStorage.getItem("username")
    }
    let res = await fetch(url + "/data", {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => response.json())
    return res;
}

//logs out by resetting local storage
function logOut(){
    console.log("ran");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

//registration
async function register() {
    let form = document.getElementById("register");
    //object to update, gets id from select
    let newEntry = {
        username: form?.getElementsByTagName("input")[0].value,
        password: form?.getElementsByTagName("input")[1].value,
        email: form?.getElementsByTagName("input")[2].value,
        name: form?.getElementsByTagName("input")[3].value
    };

    //sends registration
    let res = await fetch(url + "/register", {
        method: 'POST',
        body: JSON.stringify(newEntry),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())

    //error handling
    if (res.error) {
        errLog(res);
        return;
    }
    else {
        clearErr();
        let container = document.getElementById("error");
        let ele = document.createElement("p");
        ele.innerHTML = "Lyckad skapning av nytt konto!";
        ele.style.backgroundColor = "green";
        container?.append(ele)
    }
}
