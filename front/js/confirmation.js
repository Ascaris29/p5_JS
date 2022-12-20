showIdOrder()
redirectionIfEmpty()

/**
 * Récupération de l'id de la commande 
 */
function showIdOrder(){
    //on récupère l'URL
    let newUrl = new URL (window.location)
    // on récupère l'ID dans l'URL
    let idUrl = newUrl.searchParams.get("id")
    let idOrderHtml = document.querySelector("#orderId");
    // on affiche l'ID de l'URL dans la page confirmation
    idOrderHtml.innerHTML = idUrl
    // on supprime l'id de la commande du localstorage
    localStorage.clear() 
    console.log(localStorage)
}

/**
 * Redirection si l'utilisateur accede directement à la page confirmation sans passer commande
 */
function redirectionIfEmpty(){
    let newUrl = new URL (window.location);
    let idUrl = newUrl.searchParams.get("id")
    let msgConfirmation = document.querySelector(".confirmation p")
    if(idUrl == null || idUrl == "undefined"){
        msgConfirmation.innerHTML = "Votre panier est vide, vous allez être redirigé dans 7 secondes vers la page d'accueil"
        setTimeout( function redirection(){
            location.href = "index.html";
        }, 7000)
    }
}

