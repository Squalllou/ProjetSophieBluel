async function login() {
    const utilisateurLogin = document.querySelector("#login-form");
    utilisateurLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const utilisateur = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        }

        const chargeUtile = JSON.stringify(utilisateur);

        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });

        const logOk = await reponse.json();
   


        if (reponse.ok) {
            window.localStorage.setItem("token", logOk.token);
             window.location.href = "index.html";

        }
        else {
            alert("Identifiant incorrect");
        }

    });

}

login();