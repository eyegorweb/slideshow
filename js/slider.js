
      // Des Variables pour pouvoir modifier facilement ce qui doit l'être
      
      var infosImage = [
        {'id': '0', 'src': 'images/bird.jpg', 'title': 'Bird'},
        {'id': '1', 'src': 'images/red_bird.jpg', 'title': 'Red bird'},
        {'id': '2', 'src': 'images/spring.jpg', 'title': 'Spring'},
        {'id': '3', 'src': 'images/winter.jpg', 'title': 'Winter'}
      ];
      
      var infosMiniatures = [
        {'id': '0', 'src': 'images/m_photo1.png', 'title': 'Bird'},
        {'id': '1', 'src': 'images/m_photo2.png', 'title': 'Red bird'},
        {'id': '2', 'src': 'images/m_photo3.png', 'title': 'Spring'},
        {'id': '3', 'src': 'images/m_photo4.png', 'title': 'Winter'}
      ];
      
      var slider = document.getElementById('slider');
      var containerDots = document.getElementById('dots');
      var dots = containerDots.getElementsByTagName('li');
      var containerImage = document.getElementById("container");
      
      var secDuration = 5,
      nb = 1,
      maxImages = infosImage.length,
      timeout = 0;
      
      
      
      // Créer autant d'éléments DOM que d'images
      
      function createElements(json, container, link, desc, photo, len, index){
        if(!desc){
          // Create <image> element
          console.log(index);
          // Delete old image
          var element = containerImage;
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          // Put new image
          // Elément <DIV>
          link = document.createElement("dl");
          link.setAttribute("id", json[index].id);
          link.setAttribute("class", "button" + json[index].id);
          container.appendChild(link);
          // Eléments <SPAN>
          desc = document.createElement("dt");
          // Put data text
          desc.innerText = json[index].title;
          link.appendChild(desc);
          var content = document.createElement("dd");
          link.insertBefore(content, desc.nextSibling);
          // Eléments <IMG>
          photo = document.createElement("img");
          // Put data image
          photo.setAttribute("src", json[index].src);
          photo.setAttribute("alt", json[index].title);
          content.appendChild(photo);
        }else{
          // Create <dots> elements
          for(var i = 0; i < len; i++){
            // Eléments <LI>
            link = document.createElement("li");
            link.setAttribute("id", json[i].id);
            link.setAttribute("class", "button" + json[i].id);
            container.appendChild(link);
            // Eléments <A>
            desc = document.createElement("a");
            desc.setAttribute("href", "");
            desc.setAttribute("title", json[i].title);
            // Put data text
            desc.innerText = json[i].title;
            link.appendChild(desc);
            // Eléments <IMG>
            photo = document.createElement("img");
            // Put data minis image
            photo.setAttribute("src", json[i].src);
            photo.setAttribute("alt", json[i].title);
            desc.appendChild(photo);
          }
        }
      }

      //function getInfos(item){
      //  console.log(item.id);
      //  console.log(item.title);
      //}


      // On crée une fonction appelée dans le callback du gestionnaire d'événement plus bas
      // afin de créer une closure => portée en dehors du gestionnaire d'événements
      function callbackForId(item){
        return function(e){ // Closure to keep each item in a local and own scope
          e.preventDefault(); // prevent links <a> default action
          //getInfos(item);
          createElements(infosImage, containerImage, 'dl: null', '', 'img: null', maxImages, item.id);
          //console.log(item.id);
          //console.log(item.title);
        }
      }
      
      function getImage(){
        createElements(infosMiniatures, containerDots, 'li: null', 'a: null', 'img: null', maxImages);
        createElements(infosImage, containerImage, 'dl: null', '', 'img: null', maxImages, 0);
        for(var i = 0; i < maxImages; i++){
          var item = infosImage[i];
          dots[i].addEventListener('click', callbackForId(item), false);
        }
      }
      //getImage();
      document.addEventListener('load', getImage(), false);
      
      
      function next(){
        var index = document.getElementsByTagName('dl')[0].attributes.getNamedItem('id').nodeValue;
        index++;
        if(index >= maxImages){
          index = 0;
        }else{
          index = index;
        }
        createElements(infosImage, containerImage, 'dl: null', '', 'img: null', maxImages, index);
        //console.log(index);
      }
      
      function prev(){
        var index = document.getElementsByTagName('dl')[0].attributes.getNamedItem('id').nodeValue;
        index--;
        if(index < 0){
          index = maxImages - 1;
        }else{
          index = index;
        }
        createElements(infosImage, containerImage, 'dl: null', '', 'img: null', maxImages, index);
        //console.log(index);
      }
      
      document.getElementById("next").addEventListener('click', next, false);
      document.getElementById("prev").addEventListener('click', prev, false);
      

      
      
      // La fonction qui change les images. Peut pointer vers une image spécifique, ou bien être appelée vide, pour passer ç celle d'apres
      function changeImage(requiredImage) {
      
        // Début de l'algorithme  .
        if (!requiredImage && requiredImage != 0){ //Si nous n'avons pas spécifié une image
          if(nb < maxImages){// Si l'image n'est pas la dernière, on avance d'une image
            nb++;
          }
          else{
            nb = 1;//Si Nous sommes sur la dernière, on reviens au début 
          }
        }
        else{ // Si nous avons spécifié une image
          if(requiredImage > maxImages){//Si nous avons spécifié une image au dela de la dernière, on revient à la première
            nb = 1;
          }
          else if(requiredImage < 1){ //Si nous avons spécifié une image 0 ou moins, on va à la dernière image
            nb = maxImages;
          }
          else{
            nb = requiredImage; // Sinon, on va à l'image spécifiée.
          }
        }
        //On dit au slider à travers sa classe quelle image il doit afficher
        slider.className = "image" + nb;
        
        // On nettoie et relance le timeout
        clearTimeout(timeout);
        timeout = setTimeout("changeImage()", secDuration * 1000);
      }
      
      //Deux petites fonctions très compréhensibles
      //function nextImage(){
      //  changeImage(nb + 1);
      //}
      //function prevImage(){
      //  changeImage(nb - 1);
      //}
      
      //On met le slide sur l'image par défaut, ici la 1ère
      //changeImage(1);

