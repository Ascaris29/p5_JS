
createCart()



/**
 * Affichage du panier 
 */
function createCart(){
    let panier = getPanier()
    let blocItems =  document.querySelector("#cart__items");
    // si le panier n'est pas vide
    if(panier !== null){
        // on va faire le tour du panier 
        panier.forEach(function(element, index){
            // pour chaque produit dans le panier, nous créeons un article et l'envoyons au DOM
            //article
            prixTotal = element["price"] * element["Quantity"];
            
            let articleElt = document.createElement("article");
            blocItems.appendChild(articleElt);
            //console.log(priceProduit)
            //calculer le prix total de l'article
            articleElt.setAttribute("class", "cart__item")
            articleElt.setAttribute("data-id", element["id"])
            articleElt.setAttribute("data-color", element["Color"])

            let classItem1 = document.createElement("div");
            articleElt.appendChild(classItem1)
            classItem1.setAttribute("class", "cart__item__img")

            let imgClassItem = document.createElement("img")
            classItem1.appendChild(imgClassItem)
            imgClassItem.setAttribute("src", element["image"])
            imgClassItem.setAttribute("alt", "")

            let classItem2 = document.createElement("div")
            articleElt.appendChild(classItem2)
            classItem2.setAttribute("class", "cart__item__content")
            
            let classItem3 = document.createElement("div")
            classItem2.appendChild(classItem3)
            classItem3.setAttribute("class", "cart__item__content__description")

            let titleClassItem3 = document.createElement("h2")
            classItem3.appendChild(titleClassItem3)
            titleClassItem3.textContent = element['name']

            let pClassItem3 = document.createElement("p")
            classItem3.appendChild(pClassItem3)
            pClassItem3.setAttribute("class", "color")
            pClassItem3.textContent = element['Color']

            let p2ClassItem3 = document.createElement("p")
            classItem3.appendChild(p2ClassItem3)
            p2ClassItem3.setAttribute("class", "prix")
             recuperationPrixApi(element["id"]).then(meta => {
                p2ClassItem3.innerHTML = meta * element["Quantity"] + " €"
            }) 

            let classItem4 = document.createElement("div")
            classItem2.appendChild(classItem4)
            classItem4.setAttribute("class", "cart__item__content__settings")

            let classItem5 = document.createElement("div")
            classItem4.appendChild(classItem5)
            classItem5.setAttribute("class", "cart__item__content__settings__quantity")

            let pClassItem5 = document.createElement("p")
            classItem5.appendChild(pClassItem5)
            pClassItem5.textContent = "Qté : " + element['Quantity']

            let inputClassItem5 = document.createElement("input")
            inputClassItem5.type = "number"
            classItem5.appendChild(inputClassItem5)
            inputClassItem5.setAttribute("id", "itemQuantity")
            inputClassItem5.setAttribute("name", "itemQuantity")
            inputClassItem5.setAttribute("min", "1")
            inputClassItem5.setAttribute("max", "100")
            inputClassItem5.setAttribute("value", element['Quantity'])

            let classItem6 = document.createElement("div")
            classItem4.appendChild(classItem6)
            classItem6.setAttribute("class", "cart__item__content__settings__delete")

            let pClassItem6 = document.createElement("p")
            classItem6.appendChild(pClassItem6)
            pClassItem6.setAttribute("class", "deleteItem")
            pClassItem6.textContent = "Supprimer"
           

            displayTotalArticles()
            displayTotalPrice()
            modifyItem(articleElt, index)
            deleteItem()
            
            })
            checkAndPost()
    }
    cartEmpty()
}

/**
 * Vérification des données formulaire
 */
function checkAndPost(){
    let panier = getPanier()
    let totalPrice = document.querySelector("#totalPrice");
    let btnConfirm = document.querySelector("#order");
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
    btnConfirm.addEventListener('click', function(e){
        e.preventDefault()
        if (inputFirstName.value && inputLastName.value && inputAddress.value && inputCity.value && inputMail.value){
            document.querySelector("#emailErrorMsg").innerHTML = ""
            let reg = new RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
            if((reg.test(inputMail.value))){
                if(panier.length !== 0){
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
                else{
                    e.preventDefault()
                    errorMsgFormIfCartIsEmpty(e)   
                }
            }else{
                e.preventDefault()
                document.querySelector("#emailErrorMsg").innerHTML = "Votre adresse email n'est pas correcte, ex : ireozriezpotiotio@lalala.com"
            }
        }else{
            e.preventDefault()
            errorMsg(inputFirstName, 'firstName', "prénom")
            errorMsg(inputLastName, 'lastName', "nom de famille")
            errorMsg(inputAddress, 'address', "adresse")
            errorMsg(inputCity, 'city', "ville")
            errorMsg(inputMail, 'email', "adresse email")
        }
     })  
}

/**
 * Envoi des données formulaire à l'API et création de bon de commande
 * @param {objet} element 
 */
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
/**
 * Affiche le prix total de la commande
 *  
 */
function displayTotalPrice(){
    let panier = getPanier()
    let totalPrice = document.querySelector("#totalPrice");
    //on déclare une variable total à zero
    let total = 0;
    // on parcours tous les éléments du panier et on récupère les prix des produits grace à la fonction fetch 
    panier.forEach(element => {
        recuperationPrixApi(element['id']).then(data => {
        // on récupère les prix des articles ainsi que les quantités et on les multiplie pour obtenir un prix total
            const totalPrix = data * element["Quantity"]
        // à chaque passage de la variable total dans la boucle, on ajoute le prix total les uns avec les autres
            total = total + totalPrix
            totalPrice.innerHTML = total
        })
     })
}

/**
 * Affichage du nombre total d'articles
 */
function displayTotalArticles(){
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


/**
 * Modification du panier si l'utilisateur modifie la quantité
 */
function modifyItem(item, index){
    let panier = getPanier()
    let qty = item.querySelector("#itemQuantity");
    let id = item.getAttribute("data-id")
    let price = item.querySelector(".prix")
    //on récupère les prix grace à la fonction fetch 
        recuperationPrixApi(id).then(meta => {
            // on enregistre la fonction dans une variable
            let prix = meta 
            // si la quantité est modifiée
            qty.addEventListener('change', function(e){
                let quantityFinale = Number(qty.value)
                // on modifie la quantité du panier et on la remplace par la quantité demandée par l'utilisateur
                panier[index]['Quantity'] = quantityFinale
                // on enregistre son panier
                localStorage.setItem("panier", JSON.stringify(panier))
                displayTotalArticles()
                displayTotalPrice()
                let b = e.target
                let parent = b.parentNode
                // on modifie la quantité dans le dom
                parent.querySelector("p").innerHTML = "Qté :" + panier[index]['Quantity']
                // on modifie le prix dans le dom
                price.innerHTML = prix * panier[index]['Quantity'] + " €"
                showCart()
            })
        }) 
}

/**
 * Suppression d'un ou des éléments si l'utilisateur actionne le bouton supprimer
 */
function deleteItem(){
    let panier = getPanier()
    let articles = document.querySelectorAll(".cart__item");
        for (let i =0; i < articles.length; i++){
            let btn = articles[i].getElementsByClassName("deleteItem")[0];
            btn.addEventListener("click", function(e){
                console.log(e.target)
                panier.splice([i], 1)
                localStorage.setItem("panier", JSON.stringify(panier))
                if (panier == null){
                    return []
                }
                location.reload()
                console.log(panier)
            })
        }
}

/**
 * Récuperer le panier
 * @returns le panier vide ou rempli
 */
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

/**
 * Afichage de messages d'erreur si les données formulaires sont vides 
 * @param {objet} 
 * @param {element} 
 * @param {string} 
 */
function errorMsg(objet, html, texte){
    if(!objet.value){
        document.querySelector(`#${html}ErrorMsg`).textContent = `Veuillez indiquer votre ${texte} s'il vous plait`
    }else{
        document.querySelector(`#${html}ErrorMsg`).textContent = ""
    }
}



/**
 * Message d'erreur si le formulaire est correctement rempli mais le panier est vide
 */
function errorMsgFormIfCartIsEmpty(event){
    event.preventDefault()
    let inputFirstName = document.querySelector("#firstName");
    let inputLastName = document.querySelector("#lastName");
    let inputAddress = document.querySelector("#address");
    let inputCity = document.querySelector("#city")
    let inputMail = document.querySelector("#email")
    let panier = getPanier()
    // si les valeurs sont correctement remplies
    if (inputFirstName.value && inputLastName.value && inputAddress.value && inputCity.value && inputMail.value){
        event.preventDefault()
        // si le panier est vide
        if(panier.length == 0){
            event.preventDefault()
            alert("Votre panier est vide, vous ne pouvez passer commande")
        }
    }
}

/**
 * Message d'erreur quand le panier est vide
 */
function cartEmpty(){
    let panier = getPanier()
    if(panier.length == 0){
        document.querySelector(".errorMsg").innerHTML = `Votre panier est vide `;
        document.querySelector(".errorMsg").style.display = "flex"
        document.querySelector(".errorMsg").style.justifyContent ="center"
        document.querySelector(".errorMsg").style.alignItems ="center"
    }
}


/**
 * Récupération des prix de chaque article avec les data-id et fetch 
 * @returns prix de chaques article
 */
async function recuperationPrixApi(id){
    try{
        let ftch = await fetch("http://localhost:3000/api/products/" + id)         
        let rep = await ftch.json()
        let prix = await rep["price"]
        return prix
    }catch(e){
        console.log(e)
    }
        
}



