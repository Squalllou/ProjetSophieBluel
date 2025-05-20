let modal = null;

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

}

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

const stopPropagation = function (e) {
    e.stopPropagation();
}

async function galleryModal() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const oeuvres = await reponse.json();


    const sectionGallery = document.querySelector("#modal1 .gallery-container");
    sectionGallery.innerHTML = '';

        oeuvres.forEach(oeuvre => {
        console.log(oeuvre.title);

        const oeuvreElement = document.createElement("figure");

        const imageOeuvre = document.createElement("img");
        imageOeuvre.src = oeuvre.imageUrl;
        imageOeuvre.alt = oeuvre.title;

        const titreOeuvre = document.createElement("figcaption");
        

        oeuvreElement.classList.add("category-" + oeuvre.category.id);

        sectionGallery.appendChild(oeuvreElement);

        oeuvreElement.appendChild(imageOeuvre);
        
    });
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener('click', openModal);
})