async function chargerOeuvres() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const oeuvres = await reponse.json();

    /***Je creer le bouton pour afficher toutes les oeuvres */
    const sectionFiltre = document.querySelector(".filtres");
    const boutonTous = document.createElement("button");
    boutonTous.innerText = "Tous";
    boutonTous.setAttribute("id", "boutonTous");

    sectionFiltre.appendChild(boutonTous);

    /*** ajout de l'evenement click */

    boutonTous.addEventListener("click", () => {
        filtrerOeuvres("Tous");
    })

    /*** Je récupère les catégories des oeuvre et fait une liste sans doublons */
    const categoriesUnique = [...new Set(oeuvres.map(oeuvre => JSON.stringify(oeuvre.category)))].map(cat =>JSON.parse(cat));

    /*** je fait une boucle pour créer mes boutons de categories */
    categoriesUnique.forEach(categori => {
        console.log(categori);

        const boutonsFiltre = document.createElement("button");
        boutonsFiltre.innerText = categori.name;
        boutonsFiltre.setAttribute("data-category-id", categori.id);

        sectionFiltre.appendChild(boutonsFiltre);

        boutonsFiltre.addEventListener("click", (event) => {
            console.log(event.target);

            const categoriIdCliquee = event.target.getAttribute("data-category-id");
            filtrerOeuvres(categoriIdCliquee);
            
        });
        
    });

    oeuvres.forEach(oeuvre => {
        console.log(oeuvre.title);

        /*** j'indique l'endroit dans le html */
        const sectionGallery = document.querySelector(".gallery");
        /*** j'indique le type de balise de mon element */
        const oeuvreElement = document.createElement("figure");

        /*** je créer une balise pour mon element et je récupère les informations de mon élément */
        const imageOeuvre = document.createElement("img");
        imageOeuvre.src = oeuvre.imageUrl;
        imageOeuvre.alt = oeuvre.title;
        const titreOeuvre = document.createElement("figcaption");
        titreOeuvre.innerText = oeuvre.title;

        oeuvreElement.classList.add("category-" + oeuvre.category.id);

        sectionGallery.appendChild(oeuvreElement);

        oeuvreElement.appendChild(imageOeuvre);
        oeuvreElement.appendChild(titreOeuvre);
    });

    /**** fonction pour trier les oeuvres */
    function filtrerOeuvres(categoryId) {
        const oeuvresElements = document.querySelectorAll(".gallery figure");

        oeuvresElements.forEach(oeuvre => {
            if (categoryId === "Tous" || oeuvre.classList.contains("category-" + categoryId)) {
                console.log("affichage", oeuvre);
                oeuvre.classList.remove("hidden");
            } else {
                console.log("masquage", oeuvre);
                oeuvre.classList.add("hidden");
            }
        });
    }

}

/*** fonction pour logout */
async function logout() {
    localStorage.removeItem("tokenUser");
    window.location.reload();
}

/*** fonction d'ecoute pour savoir si j'ai login ou logout */
async function ecouteToken() {
    const token = localStorage.getItem("tokenUser");
    const loginLink = document.querySelector("#login-link");
    if (token) {
        loginLink.innerText = "logout";
        loginLink.setAttribute("href", "#");
        loginLink.onclick = logout;
    }
    else {
        loginLink.innerText = "login";
        loginLink.setAttribute("href", "/login.html") ;
    }
    
}

ecouteToken();
/*** Je charges mes éléments dynamiques sur ma page html */
chargerOeuvres();