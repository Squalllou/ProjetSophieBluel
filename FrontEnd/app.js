let modal = null; //par défaut modal fermé

/********* fonction afficher modal ************/

const openModal = function (e) {  
    e.preventDefault();
    
    modal = document.querySelector(e.target.getAttribute("href"));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-close-modal').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    galleryModal();
    switchGalerieFormulaire();
}

/********* fonction fermer modal ************/

const closeModal = function (e) {
    if (modal === null) {
        return;
    }
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
}

/********* fonction afficher modal ************/

const stopPropagation = function (e) {
    e.stopPropagation();
}

/********* fonction afficher modal ************/

async function galleryModal() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const oeuvres = await reponse.json();


    const sectionGallery = document.querySelector("#modal1 .gallery-container");
    sectionGallery.innerHTML = '';

        oeuvres.forEach(oeuvre => {

        const oeuvreElement = document.createElement("figure");

        const imageOeuvre = document.createElement("img");
        imageOeuvre.src = oeuvre.imageUrl;
        imageOeuvre.alt = oeuvre.title;

        /*const span 
        const i*/

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        boutonSupprimer.classList.add("btn-supprimer");

        oeuvreElement.classList.add("id-" + oeuvre.id);

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

    boutonAjoutPhoto.addEventListener("click", () => {
        galerie.style.display = "none";
        formulaire.style.display = "flex";
    });

    const boutonRetour = document.querySelector(".js-return-modal");
    if(boutonRetour) {
        boutonRetour.addEventListener("click", (e) => {
            e.stopPropagation();
            formulaire.style.display = "none";
            galerie.style.display = "flex";
        });
    }
}


/********* ecoute du click sur la modale  ************/
document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener('click', openModal);
})