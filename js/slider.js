

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
maxImages = infosImage.length;



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

function getId(){
  var id = document.getElementsByTagName('dl')[0].attributes.getNamedItem('id').nodeValue;
  return id;
}


// On crée une fonction appelée dans le callback du gestionnaire d'événement plus bas
// afin de créer une closure => portée en dehors du gestionnaire d'événements
function callbackForId(item){
  return function(e){ // Closure to keep each item in a local and own scope
    e.preventDefault(); // prevent links <a> default action
    createElements(infosImage, containerImage, 'dl: null', '', 'img: null', maxImages, item.id);
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
  var index = getId();
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
  var index = getId();
  index--;
  if(index < 0){
    index = maxImages - 1;
  }else{
    index = index;
  }
  createElements(infosImage, containerImage, 'dl: null', '', 'img: null', maxImages, index);
}

document.getElementById("next").addEventListener('click', next, false);
document.getElementById("prev").addEventListener('click', prev, false);




// La fonction qui "joue" les images
function play() {
  next();
  // On nettoie et relance le timeout
  clearTimeout();
  setTimeout("play()", secDuration * 1000);
}

//play();
      
      

