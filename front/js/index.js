
recuperation("http://localhost:3000/api/products")

/**
 * Récupération de l'api
 * @param {url} url 
 */
async function recuperation(url){
let blocSectionProduit = document.querySelector("#blockSectionProduit")
  try{
        const dataApi = await fetch(url)
        const dataGet = await dataApi.json();
        showData(dataGet)
        
  }catch(e){
      const errorHtml = `<span class="err"> Erreur de chargement ..</span>`;
      blocSectionProduit.insertAdjacentHTML('beforeend', errorHtml);
      console.log(e);
  }
}
/**
 * Récupération des données de l'api et affichage des données
 * @param {objet} objet 
 */
function showData(objet){
  let items = document.querySelector("#items");
      for (i = 0; i < objet.length; i++){       
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
          newProductA.setAttribute("id", "idProducts");

          let newProductArticle = document.createElement("article")
          newProductA.appendChild(newProductArticle)
          newProductArticle.setAttribute("id", "articleProduit")

          let newProductImage = document.createElement("img")
          newProductArticle.appendChild(newProductImage)
          newProductImage.setAttribute("src", imageProduit)
          newProductImage.setAttribute("alt", altImgProduit)
          newProductImage.setAttribute("id", imageProduit)

          let newProductTitle = document.createElement("h3")
          newProductArticle.appendChild(newProductTitle)
          newProductTitle.setAttribute("id", "productName")
          newProductTitle.textContent = nameProduit

          let newProductP = document.createElement("p")
          newProductArticle.appendChild(newProductP)
          newProductP.setAttribute("class", "productDescription")
          newProductP.setAttribute("id", "descProduct")
          newProductP.textContent = descProduit
          items.appendChild(newProductA); 
        }
        
    }    
}

