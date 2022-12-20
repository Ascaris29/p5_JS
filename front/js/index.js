
recuperation("http://localhost:3000/api/products")

/**
 * Récupération de l'api
 * @param {url} url 
 */
async function recuperation(url){
  try{
        const dataApi = await fetch(url)
        const dataGet = await dataApi.json();
        showData(dataGet)
        
  }catch(e){
      const errorHtml = `<span class="err"> Erreur de chargement ..</span>`;
      //blocSectionProduit.insertAdjacentHTML('beforeend', errorHtml);
      console.log(e);
  }
}

/**
 * Récupération du panier
 * @returns un objet panier vide ou l'objet panier avec les éléments du panier
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
 * Récupération des données de l'api et affichage des données
 * @param {objet} objet 
 */
function showData(objet){
  let items = document.querySelector("#items");
  let idProduct = document.querySelector("#idProducts");
  let descProduct = document.querySelector("#descProduct");
  const blocSectionProduit = document.querySelector("#blockSectionProduit");
  let nameProduct = document.querySelector("#productName");
  let imageProduct = document.querySelector("#imgProduct");

      for (i = 0; i < objet.length; i++){         //recuperation data
        //capture des données API
        const idProduit = objet[i]['_id'];
        const nameProduit = objet[i]["name"];
        const descProduit = objet[i]["description"];
        const imageProduit = objet[i]["imageUrl"];
        const altImgProduit = objet[i]["altTxt"]

        creationElement()
        
        /**
         * Création des éléments qui affichent les caractéristiques
         */
        function creationElement(){
          //crée un nouveau bloc pour chaque data
          let newProductA = document.createElement( "a");                   
          newProductA.setAttribute("href", "product.html?id=" + idProduit)
          newProductA.innerHTML = 
          `<a id="idProducts" href="product.html?id=${idProduit}"></a>
          <article id="articleProduit">
          <img src="${imageProduit}" alt="" id="imgProduct">
          <h3 id="productName">${nameProduit}</h3>
          <p class="productDescription" id="descProduct">${descProduit}</p>
          </article>
          </a>`;
          items.appendChild(newProductA); 
        }
        
    }    
}

