showIdOrder()

function showIdOrder(){
    //on récupère l'URL
    let newUrl = new URL (window.location)
    // on récupère l'ID dans l'URL
    let idUrl = newUrl.searchParams.get("id")
    let idOrderHtml = document.querySelector("#orderId");
    // on affiche l'ID de l'URL dans la page confirmation
    idOrderHtml.innerHTML = idUrl
    // on supprime l'id de la commande du localstorage
    localStorage.removeItem("orderId") 
    console.log(localStorage)
}



