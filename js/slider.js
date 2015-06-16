
      // Des Variables pour pouvoir modifier facilement ce qui doit l'�tre
      
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
      
      
      
      // Cr�er autant d'�l�ments DOM que d'images
      
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
          // El�ment <DIV>
          link = document.createElement("dl");
          link.setAttribute("id", json[index].id);
          link.setAttribute("class", "button" + json[index].id);
          container.appendChild(link);
          // El�ments <SPAN>
          desc = document.createElement("dt");
          // Put data text
          desc.innerText = json[index].title;
          link.appendChild(desc);
          var content = document.createElement("dd");
          link.insertBefore(content, desc.nextSibling);
          // El�ments <IMG>
          photo = document.createElement("img");
          // Put data image
          photo.setAttribute("src", json[index].src);
          photo.setAttribute("alt", json[index].title);
          content.appendChild(photo);
        }else{
          // Create <dots> elements
          for(var i = 0; i < len; i++){
            // El�ments <LI>
            link = document.createElement("li");
            link.setAttribute("id", json[i].id);
            link.setAttribute("class", "button" + json[i].id);
            container.appendChild(link);
            // El�ments <A>
            desc = document.createElement("a");
            desc.setAttribute("href", "");
            desc.setAttribute("title", json[i].title);
            // Put data text
            desc.innerText = json[i].title;
            link.appendChild(desc);
            // El�ments <IMG>
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


      // On cr�e une fonction appel�e dans le callback du gestionnaire d'�v�nement plus bas
      // afin de cr�er une closure => port�e en dehors du gestionnaire d'�v�nements
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
      

      
      
      // La fonction qui change les images. Peut pointer vers une image sp�cifique, ou bien �tre appel�e vide, pour passer � celle d'apres
      function changeImage(requiredImage) {
      
        // D�but de l'algorithme  .
        if (!requiredImage && requiredImage != 0){ //Si nous n'avons pas sp�cifi� une image
          if(nb < maxImages){// Si l'image n'est pas la derni�re, on avance d'une image
            nb++;
          }
          else{
            nb = 1;//Si Nous sommes sur la derni�re, on reviens au d�but 
          }
        }
        else{ // Si nous avons sp�cifi� une image
          if(requiredImage > maxImages){//Si nous avons sp�cifi� une image au dela de la derni�re, on revient � la premi�re
            nb = 1;
          }
          else if(requiredImage < 1){ //Si nous avons sp�cifi� une image 0 ou moins, on va � la derni�re image
            nb = maxImages;
          }
          else{
            nb = requiredImage; // Sinon, on va � l'image sp�cifi�e.
          }
        }
        //On dit au slider � travers sa classe quelle image il doit afficher
        slider.className = "image" + nb;
        
        // On nettoie et relance le timeout
        clearTimeout(timeout);
        timeout = setTimeout("changeImage()", secDuration * 1000);
      }
      
      //Deux petites fonctions tr�s compr�hensibles
      //function nextImage(){
      //  changeImage(nb + 1);
      //}
      //function prevImage(){
      //  changeImage(nb - 1);
      //}
      
      //On met le slide sur l'image par d�faut, ici la 1�re
      //changeImage(1);

