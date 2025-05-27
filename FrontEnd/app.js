import { chargerOeuvres } from "./script.js";

let modal = null; //par défaut modal fermé

/********* fonction afficher modal ************/

const openModal = function (e) {
    e.preventDefault();

    document.querySelector(".modal-galerie").style.display = "flex";
    document.querySelector(".modal-formulaire").style.display = "none";


    modal = document.querySelector(e.currentTarget.getAttribute("href"));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener('click', closeModal);
    modal.querySelectorAll('.js-close-modal').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    galleryModal();
    switchGalerieFormulaire();
    loadCategories();
    setupFormListener();
    resetFormAndPreview(modal);
}

/********* fonction fermer modal ************/

const closeModal = function (e) {
    if (modal === null) {
        return;
    }
    e.preventDefault();

    const galerie = modal.querySelector(".modal-galerie");
    const formulaire = modal.querySelector(".modal-formulaire");
    if (galerie && formulaire) {
        galerie.style.display = "flex";
        formulaire.style.display = "none";
    }

    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener('click', closeModal);
    modal.querySelectorAll('.js-close-modal').forEach(button => {
        button.removeEventListener('click', closeModal);
    });
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    const form = modal.querySelector('#form-ajout-oeuvre');
    if (form) {
        form.reset();
    }
    modal = null;
}

/********* fonction pour empecher la propagation du click ************/

const stopPropagation = function (e) {
    e.stopPropagation();
}

/********* fonction pour charger les oeuvre/bouton supprimer de la modale ************/

async function galleryModal() {

    /*** recuperation des oeuvre en json */
    const reponse = await fetch("http://localhost:5678/api/works");
    const oeuvres = await reponse.json();

    /*** creation de la modale et affichage de la gallery d'oeuvre miniature */
    const sectionGallery = document.querySelector("#modal1 .gallery-container");
    sectionGallery.innerHTML = '';

    oeuvres.forEach(oeuvre => {

        const oeuvreElement = document.createElement("figure");

        const imageOeuvre = document.createElement("img");
        imageOeuvre.src = oeuvre.imageUrl;
        imageOeuvre.alt = oeuvre.title;

        const i = document.createElement("i");

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.classList.add("btn-supprimer");

        i.classList.add("fa-solid", "fa-trash-can");

        boutonSupprimer.appendChild(i);

        /*** ajout de l'id de l'oeuvre au bouton de suppression sur la figure ou il est */
        boutonSupprimer.dataset.id = oeuvre.id;
        /*** ajout du listener pour supprimer l'oeuvre */
        boutonSupprimer.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const bouton = e.target.closest("button");

            bouton.disabled = true; // pour eviter les doubles cliques

            const idOeuvre = bouton.dataset.id;

            const suppressionOk = await deletOeuvre(idOeuvre);

            if (suppressionOk) {
                const figureASupprimer = e.target.closest("figure");
                figureASupprimer.remove();
                await galleryModal();
                await chargerOeuvres();
            }
            else {
                bouton.disabled = false; // si echec permet de reéssayer de supprimer
            }
        })

        sectionGallery.appendChild(oeuvreElement);
        oeuvreElement.appendChild(imageOeuvre);
        oeuvreElement.appendChild(boutonSupprimer);

    });
}

/********* fonction passage formulaire / galerie  ************/

function switchGalerieFormulaire() {
    const boutonAjoutPhoto = document.querySelector(".ajout-photo");
    const galerie = document.querySelector(".modal-galerie");
    const formulaire = document.querySelector(".modal-formulaire");

    if (!boutonAjoutPhoto.dataset.listener) {       // verifier si j'ai aps deja un listener
        boutonAjoutPhoto.addEventListener("click", () => {
            galerie.style.display = "none";
            formulaire.style.display = "flex";
        });
        boutonAjoutPhoto.dataset.listener = "true"; // indiquer la presence du listener
    }

    const boutonRetour = document.querySelector(".js-return-modal");
    if (boutonRetour && !boutonRetour.dataset.listener) {  // verifie la presence du bouton retour et si il y a un listener
        boutonRetour.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            formulaire.style.display = "none";
            galerie.style.display = "flex";
        });
        boutonRetour.dataset.listener = "true"; // indique le listener
    }
}

/********* fonction ecoute du formulaire d'envoie  ************/

function setupFormListener() {
    const icon = modal.querySelector(".upload-container .fa-image");
    const validTypes = ["image/jpeg", "image/png"];
    const form = document.getElementById("form-ajout-oeuvre");
    if (!form || form.dataset.listener === "true") return; // pour etre sur d'avoir le formulaire et verifier si il y a deja un listener

    form.dataset.listener = "true";

    const imageInput = form.querySelector('input[type="file"]');
    const previewImage = document.getElementById("image-preview");
    const titleInput = form.querySelector('input[name="title"]');
    const categorySelect = form.querySelector('select[name="category"]');
    const submitButton = form.querySelector('button[type="submit"]');

    //  fonction qui vérifie si tous les champs sont remplis et active ou désactive le bouton pour envoyer
    function checkFormValidity() {
        const title = titleInput.value.trim();   // Trim pour éviter espaces vides
        const category = categorySelect.value;
        const imageFile = imageInput.files[0];

        // Si TOUT est rempli, bouton activé, sinon désactivé
        submitButton.disabled = !(title && category && imageFile);
    }

    // on vérifie la validité du formulaire a chaque modification
    titleInput.addEventListener("input", checkFormValidity);
    categorySelect.addEventListener("change", checkFormValidity);

    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) {
            previewImage.style.display = "none";
            previewImage.src = "";
            icon.classList.remove("hidden");
            checkFormValidity();
            return;
        }

        if (!validTypes.includes(file.type)) {
            alert("Format d'umage non suporté.(jpg ou png)");
            imageInput.value = "";
            previewImage.style.display = "none";
            icon.classList.remove("hidden");
            checkFormValidity();
            return;
        }

        const reader = new FileReader();        // creation de l'url de la miniature

        const label = modal.querySelector('.upload-label');
        const p = modal.querySelector('.upload-container p');


        reader.onload = function (e) {          // ajout de la miniature
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
            icon.classList.add("hidden");

            if (label) label.style.display = "none";
            if (p) p.style.display = "none";

            checkFormValidity();
        }

        reader.readAsDataURL(file);
    });

    checkFormValidity();

    form.addEventListener("submit", async function (event) {
        event.preventDefault()

        const title = form.querySelector('input[name="title"]').value.trim(); //trim pour eviter les espace avant ou apres le titre
        const category = form.querySelector('select[name="category"]').value;
        const imageFile = imageInput.files[0];

        /*** pour cibler ce qu'il manque mais possible de simplifier si pas nécessaire */
        if (!title) {
            alert("Le titre est obligatoire.");
            return;
        }

        if (!category) {
            alert("Veuillez choisir une catégorie.");
            return;
        }

        if (!imageFile) {
            alert("Veuillez sélectionner une image.");
            return;
        }

        /*** Formats autorisés */

        if (!validTypes.includes(imageFile.type)) {
            alert("Format d'image non supporté. Utilisez uniquement JPG ou PNG.");
            return;
        }

        /*** Taille max 4 Mo */
        const maxSize = 4 * 1024 * 1024; // 4 Mo
        if (imageFile.size > maxSize) {
            alert("L'image est trop volumineuse (max 4 Mo).");
            return;
        }

        const formData = new FormData(form);

        try {
            const result = await postOeuvre(formData);
            form.reset(); //reset du formulaire apres réussite
            resetFormAndPreview(modal);
            alert("ajout de l'oeuvre avec succès !")
            await galleryModal();
            await chargerOeuvres();
            checkFormValidity();
        }
        catch (error) {
            alert("Erreur lors de l'ajout de l'oeuvre");
        }
    });
}

/********* fonction paramettrage du select ************/

async function loadCategories() {
    try {
        const reponse = await fetch("http://localhost:5678/api/categories");
        const categories = await reponse.json();

        const select = document.getElementById("category");
        select.innerHTML = ''; // pour bien vider le select avant d'ajouter des options

        const optionDefault = document.createElement("option"); //le tiret etant afficher par défaut
        optionDefault.value = "";
        select.appendChild(optionDefault);

        categories.forEach(categorie => {
            const option = document.createElement("option");
            option.value = categorie.id;
            option.textContent = categorie.name;
            select.appendChild(option);
        });
    }
    catch (error) {
        alert("Impossible de charger les catégories.");
    }
}

/********* fonction d'envoie du formulaire  ************/

async function postOeuvre(data) {
    const token = localStorage.getItem("tokenUser");

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: data,
    });

    if (!response.ok) {
        throw new Error("Erreur lors de l'envoie de l'oeuvre");
    }

    return await response.json();
}

/********* fonction pour supprimer les oeuvres ************/

async function deletOeuvre(dataID) {
    try {
        const token = localStorage.getItem("tokenUser");

        const reponse = await fetch(`http://localhost:5678/api/works/${dataID}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (reponse.ok) {
            return true;
        }
        else {
            alert("Echec de la suppression.");
            return false;
        }
    }

    catch (error) {
        alert("Erreur réseu ou serveur, impossible de supprimer.");
        return false;
    }
}

/********* fonction reset form et preview  ************/
function resetFormAndPreview(modal) {
    const form = modal.querySelector("#form-ajout-oeuvre");
    const previewImage = modal.querySelector("#image-preview");
    const icon = modal.querySelector(".upload-container .fa-image");
    const label = modal.querySelector(".upload-label");
    const p = modal.querySelector(".upload-container p");

    if (form) form.reset();
    if (previewImage) previewImage.style.display = "none";
    if (icon) icon.classList.remove("hidden");
    if (label) label.style.display = "flex";   
    if (p) p.style.display = "block";           
}

/********* ecoute du click sur la modale  ************/
document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener('click', openModal);
})

