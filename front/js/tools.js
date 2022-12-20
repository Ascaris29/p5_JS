showCart()

function showCart(){
    let panier = getPanier()
    let total = 0
    if(panier.length > 0){
        panier.forEach(element => {
            const totalArticle = element["Quantity"]
            total = total+ totalArticle
        })
        document.querySelector(".count").innerHTML = total;
        document.querySelector(".count").style.color = "#3498db"
        document.querySelector(".count").style.marginLeft = "2px"
        document.querySelector(".count").style.fontWeight = "bold"
    }
}

function getPanier(){
    // on récupère le panier 
    let panier = localStorage.getItem("panier")
    // si le panier est vide
    if (panier == null ){
        // on retourne un tableau vide
        return [];
    }else{
        // sinon on retourne le panier 
        return JSON.parse(localStorage.getItem("panier"));                     
    }   
}