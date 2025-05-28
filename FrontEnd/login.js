async function login() { // declaration de ma fonction login
    const userLogin = document.querySelector("#login-form");
    userLogin.addEventListener("submit", async function (event) { //ecoute du formulaire de login
        event.preventDefault(); // on retire le comportement par defaut (evite de rafraichir la page)

        
        const user = {          // pour récupéré les valeur entrees par l'utilisateur
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        }

        const payload = JSON.stringify(user); // passage du json en chaine de character avant envoie

        const reponse = await fetch("http://localhost:5678/api/users/login", {   // envoie des information a l'api
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
        });

        const logOk = await reponse.json(); //récupération de la réponse de l'api
   

        /*** verification de la reponse et login si ok sinon message d'erreur */
        if (reponse.ok) { 
            window.localStorage.setItem("tokenUser", logOk.token);
            window.location.href = "index.html"
        }
        else {
            alert("Identifiant incorrect");
        }

    });

}
/*** utilisation de la fonction login */
login();