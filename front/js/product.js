
addLengthPanier()


//recuperation de l'api
async function recuperationApi(url){
    let recupApi = await fetch(url);
    let data = await recupApi.json();
    //await console.log(data)
    recuperationData(data);
}

recuperationApi("http://localhost:3000/api/products");

//recuperation des données de l'api
async function recuperationData(objet){
    const priceProduct = document.querySelector("#price");
    const titleProduct = document.querySelector("#title");
    const descriptionProduct = document.querySelector("#description");
    const imageProduct = document.querySelector("#img_produit");
    const selectColorsProduct = document.querySelector("#colors");
    const blocSelectColor = document.querySelector(".item__content__settings__color")
    const buttonCart = document.querySelector("#addToCart");
    const quantityProduct = document.querySelector("#quantity");
                       
    //on récupère l'URL
    let urlObject = new URL(window.location);
    // on récupère l'id dans l'URL
    let idProduct = urlObject.searchParams.get("id")
    // pour chaque réponse de l'API

    let clic = 0;

    let panier = getPanier()

    for(i =0; i < objet.length; i++){
        // si l'id dans l'url correspond à l'ID contenu dans la reponse de l'API
         if(idProduct === objet[i]["_id"]){
        // récuperer les informations qui correspondent à cet ID
           const name =  objet[i]["name"];
           const price = objet[i]["price"];
           const img = objet[i]["imageUrl"];
           const desc = objet[i]["description"];0
           let color = objet[i]["colors"];

            priceProduct.innerHTML = price;
            titleProduct.innerHTML = name;
            descriptionProduct.innerHTML = desc;              
            imageProduct.setAttribute('src', img);

            replaceSigneColor(color, selectColorsProduct)
            
            let showSelectedColor = document.createElement('p');
            blocSelectColor.appendChild(showSelectedColor);

            //au clic, on recupère le panier, on recupere les infos du canapé désiré dans le tableau canapé
            buttonCart.addEventListener('click', function(){
            let panier = getPanier();
            let canape = {
            id : idProduct,
            name: name,
            image : img,
            price : price,
            };

            checkIfValuesIsCorrect(canape)
            checkIfValuesIsNotDoublons(canape)
            })      
        }
        } 
    }  
   

//-------------------------------------------------localstorage---------------------------------------------------//
function savePanier(panier){     
    // on enregistre le panier dans le local storage                                         
    localStorage.setItem("panier", JSON.stringify(panier));               
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

// pour afficher les articles contenus dans le panier à côté de l'item panier 
function addLengthPanier(){
    let total = 0
    let panier = getPanier()
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



  function replaceSigneColor(objet, parent){
    //pour toutes les couleurs
    for (let colori of objet){
        //si les couleurs ont un "/" dans leur nom
        if ((colori.includes("/")) == true){
            // remplacer le signe "/" par "&"
            let selectReplace = colori.replace("/", " & ");
            parent.add(new Option(selectReplace));
        }else{
            parent.add(new Option(colori));
        }         
}
}

function checkIfValuesIsCorrect(objet){
    const quantityProduct = document.querySelector("#quantity");
    const selectColorsProduct = document.querySelector("#colors");
    //verifier que les valeurs du formulaire sont respectées 
        if(quantityProduct.value !== "0"){
            objet['Quantity'] =  Number(quantityProduct.value)
            document.querySelector(".error_msg_count").innerHTML = ""
        }else{
            document.querySelector(".error_msg_count").innerHTML = "Veuillez entrer la quantité souhaitée s'il vous plait"
        }
        if (selectColorsProduct.value !== "0"){
                document.querySelector(".error_msg_color").innerHTML = ""
                objet['Color'] = selectColorsProduct.value
        }else{
                document.querySelector(".error_msg_color").innerHTML = "Veuillez entrer une couleur s'il vous plait";
        }
}

function checkIfValuesIsNotDoublons(objet){
    const quantityProduct = document.querySelector("#quantity");
     //on récupère l'URL
     let urlObject = new URL(window.location);
     // on récupère l'id dans l'URL
     let idProduct = urlObject.searchParams.get("id")
     // pour chaque réponse de l'API
    //verification que les id et les couleurs ne seront pas des doublons
    const selectColorsProduct = document.querySelector("#colors");
    let panier = getPanier()
        // si les valeurs du formulaires ne sont pas vides
        if(selectColorsProduct.value !== "0" & quantityProduct.value !== "0"){
            // on déclare une variable valeur
            let value = false
            // on parcourt le panier
            panier.forEach(element => {
                // si l'ID de l'url est bien dans le panier
                if(idProduct == element['id']){
                    // si la couleur demandée est déja dans le panier
                    if(selectColorsProduct.value == element['Color']){
                        // on assigne la valeur true à la variable value
                        return value = true
                    }
                    
                }   
            });

   //si doublons, ajuster les quantités
   // si la valeur true est assignée à la variable value
    if (value == true){
        // on parcourt le panier
        panier.forEach(element => {
            // si la valeur choisie est déja dans le panier
            if(selectColorsProduct.value == element['Color']){
                // on modifie la valeur quantity en ajoutant la nouvelle valeur à celle déja dans le panier
                let quantity = element['Quantity']
                let quantitéVoulue = Number(quantityProduct.value)
                let result = quantity + quantitéVoulue
                element['Quantity'] = result
                // on enregistre la nouvelle valeur dans le panier
                savePanier(panier)
                alert("Votre article est bien dans le panier")
            }
        }) 
        //sinon ajouter un nouveau canapé    
    }else{
        panier.push(objet)
        savePanier(panier)
        alert("Votre article est bien dans le panier")
        console.log(panier)
    }
} 
}            