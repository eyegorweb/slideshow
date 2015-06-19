

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

var containerDots = document.getElementById('dots'),
  dots = containerDots.getElementsByTagName('li'),
  containerImage = document.getElementById("container"),
  nav = document.getElementById('nav'),
  arrows = nav.getElementsByTagName('a');

var secDuration = 3, maxImages = infosImage.length, timer, delay;



// Créer autant d'éléments DOM que d'images

function setAttributes(tagName, attributes, data){
  var elmt = document.createElement(tagName);
  for(var i = 0; i< attributes.length; i++){
    elmt.setAttribute(attributes[i], data[i]);
  }
  //console.log(elmt.className);
  return elmt;
}

// La méthode String.prototype.match() permet d'obtenir le tableau des correspondances entre la chaîne courante et une expression rationnelle
// Donc pour retrouver le nb de la classe courante à image et le nb des liens correspondant, on peut créer cette fonction:
// On regarde quelle est la classe de la photo (image0, image1, etc...) => chaîne courante
// On extrait/sépare les lettres du chiffre de la classe (par exemple: [iamge, 0])
// On recherche le chiffre correspondant parmi les liens (link0, link1, etc) => expression rationnelle
// On dit que ce lien à la classe dont l'expression comporte le chiffre recherché possède la classe "active"

/*var str = 'image0';
var chiffre = '0'; */// ou var chiffre = 0, tester la différence (replace 0 by current index in loop for)
// Utiliser la syntaxe new RegExp(variable valueToFind, 'flag') et non /[variable valueToFind]/g
// Préciser le flag (2nd paramètre de RegExp sinon pas de valeurs multiples trouvées renvoyées, uniquement la première)
//var regexp = new RegExp(chiffre, 'g'); 
//var tableau_correspondances = str.match(regexp);
//console.log(tableau_correspondances);

//String.prototype.matchAll = function(withThis) {
//  var regexp = new RegExp(withThis, 'gi');
//  return this.match(regexp);
//};
//var strin = "IiIImageine999iiII";
//var matchWith = "i";
//var toto = strin.matchAll(matchWith);
//console.log(toto);
//console.log(String.prototype);

function addClass(item){
  // Find/Active className
    var correspondance = [];
    var chiffre = getId();
    var str = document.getElementsByTagName('dl')[0].getAttribute('class');
    var regexp = new RegExp(chiffre, 'g');
    correspondance = str.match(regexp).toString();
    for(var j = 0; j < dots.length; j++){
      item = infosImage[j];
      if(item.id == correspondance){
        dots[j].className = ' ';
        dots[j].className = dots[j].className + ' active';
      }else{
        dots[j].className = ' ';
        dots[j].className = dots[j].className + ' inactive';
      }
      
    }
}




function createElements(json, container, bool, len, index){
  if(!bool){
    // Create <image> element
    //console.log(index);
    // Delete old image
    while (containerImage.firstChild) {
      containerImage.removeChild(containerImage.firstChild);
    }
    // Put new image
    // Elément <DIV>
    var link = setAttributes("dl", ["id", "class"], [json[index].id, "image" + json[index].id]);
    container.appendChild(link);
    // Eléments <SPAN>
    var desc = document.createElement("dt");
    // Attribute title text
    desc.innerText = json[index].title;
    link.appendChild(desc);
    var content = document.createElement("dd");
    link.insertBefore(content, desc.nextSibling);
    // Eléments <IMG>
    // Attribute image source
    var photo = setAttributes("img", ["src", "alt"], [json[index].src, json[index].title]);
    content.appendChild(photo);
  }else{
    // Create <dots> elements
    for(var i = 0; i < len; i++){
      // Eléments <LI>
      var link = setAttributes("li", ["class"], ["link" + json[i].id]);
      container.appendChild(link);
      // Eléments <A>
      var desc = setAttributes("a", ["id", "class", "href", "title"], ["desc" + json[i].id, "desc" + json[i].id, "", json[i].title]);
      // Attribute title text
      desc.innerText = json[i].title;
      link.appendChild(desc);
      // Eléments <IMG>
      // Attribute image source
      var photo = setAttributes("img", ["src", "alt"], [json[i].src, json[i].title]);
      desc.appendChild(photo);
    }
  }
}



function getId(){
  var id = document.getElementsByTagName('dl')[0].attributes.getNamedItem('id').nodeValue; // OU document.getElementsByTagName('dl')[0].getAttribute('id')
  return id;
}


// On crée une fonction appelée dans le callback du gestionnaire d'événement plus bas
// afin de créer une closure => portée en dehors du gestionnaire d'événements
function callbackForId(item){
  return function(e){ // Closure to keep each item in a local and own scope
    e.preventDefault(); // prevent links <a> default action
    createElements(infosImage, containerImage, false, maxImages, item.id);
    addClass(infosImage);
  }
}

function getImage(){
  createElements(infosMiniatures, containerDots, true, maxImages);
  createElements(infosImage, containerImage, false, maxImages, 0);
  addClass(infosImage);
  
  //console.log(dots);
  for(var i = 0; i < maxImages; i++){
    //console.log(dots[i].attributes.getNamedItem('class').nodeValue);
    var item = infosImage[i];
    dots[i].addEventListener('click', callbackForId(item), false);
  }
}


function next(){
  var index = getId();
  index++;
  if(index >= maxImages){
    index = 0;
  }else{
    index = index;
  }
  createElements(infosImage, containerImage, false, maxImages, index);
  addClass(infosImage);
}

function prev(){
  var index = getId();
  index--;
  if(index < 0){
    index = maxImages - 1;
  }else{
    index = index;
  }
  createElements(infosImage, containerImage, false, maxImages, index);
  addClass(infosImage);
}

// La fonction qui "joue" les images
function play() {
  // Un setTimeout pour lancer l'image suivante
  delay = setTimeout("next()", secDuration * 1000);
  // Un setTimeout pour lancer le play global (récursivité)
  timer = setTimeout("play()", secDuration * 1000);
}

function pause(){
  clearTimeout(delay);
  clearTimeout(timer);
  delay = null;
  timer = null;
}

document.addEventListener('load', getImage(), false);
document.getElementById("next").addEventListener('click', next, false);
document.getElementById("prev").addEventListener('click', prev, false);
document.getElementById("play").addEventListener('click', play, false);
document.getElementById("pause").addEventListener('click', pause, false);

//function recursion(c){
//  setTimeout(function(c){
//      c = c || 0;
//      console.log(c++);
//      if(c == 10){
//        return;
//      }
//      recursion(c);
//  },
//  2000,
//  c
//  );
//}
//
//recursion();


