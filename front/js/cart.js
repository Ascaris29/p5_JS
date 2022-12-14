
createCart()


function createCart(){
    let panier = getPanier()
    let blocItems =  document.querySelector("#cart__items");
    // si le panier n'est pas vide
    if(panier !== null){
        let prixTotal = 0
        // on va faire le tour du panier 
        panier.forEach(element => {
            // pour chaque produit dans le panier, nous créeons un article et l'envoyons au DOM
            let inputCart = document.createElement("article");
            blocItems.appendChild(inputCart);
            //calculer le prix total de l'article
            prixTotal = element["price"] * element["Quantity"];
            inputCart.innerHTML = `
                <article class="cart__item" data-id="${element['id']}" data-color="${element['Color']}">
                            <div class="cart__item__img">
                            <img src="${element["image"]}" alt="">
                            </div>
                            <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${element['name']}</h2>
                                <p>${element['Color']}</p>
                                <p>${prixTotal} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                <p>Qté : ${element['Quantity']}</p>
                                <input type="number" id="itemQuantity" name="itemQuantity" min="1" max="100" value="${element['Quantity']}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                            </div>
                        </article>
                `
                displayTotalPrice()
                displayTotalArticles()
                modifyItem()
                deleteItem()
                addLengthPanier()
            })
         
            checkAndPost()
    }else{
        document.querySelector(".errorMsg").innerHTML = `Votre panier est vide `;
    }
}



function checkAndPost(){
    let panier = getPanier()
    let totalPrice = document.querySelector("#totalPrice");
    let btnConfirm = document.querySelector(".cart__order__form__submit");
    let inputFirstName = document.querySelector("#firstName");
    let inputLastName = document.querySelector("#lastName");
    let inputAddress = document.querySelector("#address");
    let inputCity = document.querySelector("#city")
    let inputMail = document.querySelector("#email")
    let produits = [];
    // on fait le tour du panier et on récupère les id de chaque produits
    panier.forEach(element=>{
        let id = element['id']
        // on ajoute les id dans la variable produits
        produits.push(id)
    })
    let reg = new RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    btnConfirm.addEventListener('click', function(e){
        // on vérifie que toutes les valeurs sont bien présentes
        if(!inputFirstName.value || !inputLastName.value || !inputAddress.value || !inputCity.value || !inputMail.value){
            e.preventDefault()
            alert("Veuillez remplir les champs vides s'il vous plait")
            // on vérifie que l'email est correctement remplie
        }else if(!reg.test(inputMail.value)){
            e.preventDefault()
            document.querySelector("#emailErrorMsg").innerHTML = "Votre adresse email n'est pas correcte "
        }else{
            // on crée un objet order avec les coordonnées de contact ainsi que les produits à envoyer à l'API grace à un fetch
            const order = {
                contact : {
                    firstName : inputFirstName.value,
                    lastName : inputLastName.value,
                    address : inputAddress.value,
                    city : inputCity.value,
                    email : inputMail.value
                },  
                    products :
                        produits    
                }
                e.preventDefault()
                let totalPrix = totalPrice.innerHTML
                // on va envoyer l'objet order à l'API
                postApi(order)
            }
    })
}

        


async function postApi(element){
    try{
        // on envoie le contenu que l'on souhaite dans le body 
        let post = await fetch("http://localhost:3000/api/products/order", {
        method : "POST",
        headers : {"Content-type" : "application/json"},
        body: JSON.stringify(element)
    })
    // on récupère la reponse
    let reponse = await post.json()
    // recuperer l'id de commande dans la reponse et la rajouter au localstorage
    console.log(reponse)
    localStorage.setItem("orderId", reponse.orderId);
    //recuperer l'id de commande et l'afficher dans la redirection 
    let idOrder = localStorage.getItem("orderId")
    document.location.href="confirmation.html?id=" + idOrder
    //localStorage.clear()
    }catch(e){
        console.log(e)
    }
    
}


function displayTotalPrice(item){
    let panier = getPanier()
    let totalPrice = document.querySelector("#totalPrice");
    //on déclare une variable total à zero
    let total = 0;
    // on parcours tous les éléments du panier
    panier.forEach(element => {
        // on récupère les prix des articles ainsi que les quantités et on les multiplie pour obtenir un prix total
        const totalPrix = element["price"] * element["Quantity"]
        // à chaque passage de la variable total dans la boucle, on ajoute le prix total les uns avec les autres
        total = total + totalPrix
    })
    
    totalPrice.innerHTML = total
}

function displayTotalArticles(item){
    let panier = getPanier()
    let totalQuantity = document.querySelector("#totalQuantity");
    //on déclare une variable total à zero
    let total = 0;
    // on parcours tous les éléments du panier
    panier.forEach(element => {
        // on récupère les quantités pour chaque article
        const totalArticle = element["Quantity"]
        // a chaque passage de la variable total dans la boucle, on ajoute les quantités les unes aux autres
        total = total+ totalArticle
    })
    totalQuantity.innerHTML = total
}

function modifyItem(){
    let panier = getPanier()
    let quantitéProduit = document.querySelectorAll("#itemQuantity");
    let newValue = quantitéProduit.value
    for (let i=0; i < quantitéProduit.length; i++){
        quantitéProduit[i].addEventListener("change", function(){
                let quantityFinale = Number(quantitéProduit[i].value)
                panier[i]['Quantity'] = quantityFinale
                console.log(panier)
                localStorage.setItem("panier", JSON.stringify(panier))
                location.reload()
        })
    }
}

function deleteItem(){
    let panier = getPanier()
    let btnReset = document.querySelectorAll(".deleteItem");
    // faire le tour de tous les boutons supprimer
        for(let i =0; i< btnReset.length; i++){
            //au clic pour chaque bouton supprimer
            btnReset[i].addEventListener('click', function(){
                //supprimer l'article qui est relié au bouton supprimer
                panier.splice([i], 1)
                //enregistrer le nouveau panier avec l'élément supprimer en moins
                localStorage.setItem("panier", JSON.stringify(panier))
                if (panier == null){
                    return []
                }
                location.reload()
                console.log(panier)
            })
        }   
}

function getPanier(){
    // on récupère le panier qui est dans le localstorage sous l'appelation panier
    let panier = JSON.parse(localStorage.getItem("panier"))
    //si le panier est vide, on retourne un tableau vide
    if (panier == null){
        return [];
    }else{
        // sinon on retourne le panier
        return panier;                     
    }   
}


function addLengthPanier(){
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



let panier = getPanier()

console.log(localStorage)