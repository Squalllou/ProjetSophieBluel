export async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works");  //récupération des oeuvres
    const works = await response.json();


    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = '';  // Vide la galerie

    const sectionFilters = document.querySelector(".filters");
    sectionFilters.innerHTML = '';  // Vide les boutons filtres

    /***Je creer le bouton pour afficher toutes les oeuvres */
    const buttonTous = document.createElement("button");
    buttonTous.innerText = "Tous";
    buttonTous.setAttribute("id", "buttonTous");

    sectionFilters.appendChild(buttonTous);

    /*** ajout de l'evenement click */

    buttonTous.addEventListener("click", () => {
        filterWorks("Tous");
    })

    /*** Je récupère les catégories des oeuvre et fait une liste sans doublons */
    const uniqueCategories  = [...new Set(works.map(work => JSON.stringify(work.category)))].map(cat => JSON.parse(cat));

    /*** je fait une boucle pour créer mes boutons de categories */
    uniqueCategories .forEach(category => {
        /*console.log(category); (verification du fonctionnement*/

        const filterButton = document.createElement("button");
        filterButton.innerText = category.name;
        filterButton.setAttribute("data-category-id", category.id);

        sectionFilters.appendChild(filterButton);

        /*** ajout de l'evenement de click pour filtrer les categories */
        filterButton.addEventListener("click", (event) => {
            /*console.log(event.target);(verification du fonctionnement*/

            const categoryIdClicked = event.target.getAttribute("data-category-id");
            filterWorks(categoryIdClicked);
        });

    });

    works.forEach(work => {
        /*console.log(work.title);*/ // pour vérification dans la console de ce que l'on récupère

        /*** j'indique le type de balise de mon element */
        const workElement = document.createElement("figure");

        /*** je créer une balise pour mon element et je récupère les informations de mon élément */
        const imageWork = document.createElement("img");
        imageWork.src = work.imageUrl;
        imageWork.alt = work.title;
        const titleWork = document.createElement("figcaption");
        titleWork.innerText = work.title;

        workElement.classList.add("category-" + work.category.id);

        sectionGallery.appendChild(workElement);

        workElement.appendChild(imageWork);
        workElement.appendChild(titleWork);
    });

    /**** fonction pour trier les oeuvres */
    function filterWorks(categoryId) {
        const worksElements = document.querySelectorAll(".gallery figure");

        worksElements.forEach(work => {
            if (categoryId === "Tous" || work.classList.contains("category-" + categoryId)) {
                /*console.log("affichage", work); (verification du fonctionnement)*/
                work.classList.remove("hidden");
            } else {
                /*console.log("masquage", work);(verification du fonctionnement)*/
                work.classList.add("hidden");
            }
        });
    }

}

/*** fonction pour logout */
function logout() {
    localStorage.removeItem("tokenUser");
    window.location.reload();
}

/*** fonction d'ecoute pour savoir si j'ai un jeton de connexion */
function checkToken() {
    const token = localStorage.getItem("tokenUser");
    const loginLink = document.querySelector("#login-link");
    if (token) {
        loginLink.innerText = "logout";
        loginLink.setAttribute("href", "#");
        loginLink.onclick = logout;
    }
    else {
        loginLink.innerText = "login";
        loginLink.setAttribute("href", "/login.html");
    }

}
/*** je vérifie la présence d'un jeton */
checkToken();

/*** Je charge mes éléments dynamiques sur ma page html */
loadWorks();