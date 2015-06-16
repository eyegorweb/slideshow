

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

function setAttributes(tagName, attributes, data){
  var elmt = document.createElement(tagName);
  for(var i = 0; i< attributes.length; i++){
    elmt.setAttribute(attributes[i], data[i]);
  }
  return elmt;
}



function createElements(json, container, bool, len, index){
  if(!bool){
    // Create <image> element
    //console.log(index);
    // Delete old image
    var element = containerImage;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    // Put new image
    // Elément <DIV>
    var link = setAttributes("dl", ["id", "class"], [json[index].id, "image" + json[index].id]);
    container.appendChild(link);
    // Eléments <SPAN>
    var desc = document.createElement("dt");
    // Put data text
    desc.innerText = json[index].title;
    link.appendChild(desc);
    var content = document.createElement("dd");
    link.insertBefore(content, desc.nextSibling);
    // Eléments <IMG>
    // Put data image
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
      // Put data text
      desc.innerText = json[i].title;
      link.appendChild(desc);
      // Eléments <IMG>
      // Put data minis image
      var photo = setAttributes("img", ["src", "alt"], [json[i].src, json[i].title]);
      desc.appendChild(photo);
    }
  }
}

function getId(){
  var id = document.getElementsByTagName('dl')[0].attributes.getNamedItem('id').nodeValue;
  //console.log(id);
  return id;
}


// On crée une fonction appelée dans le callback du gestionnaire d'événement plus bas
// afin de créer une closure => portée en dehors du gestionnaire d'événements
function callbackForId(item){
  return function(e){ // Closure to keep each item in a local and own scope
    e.preventDefault(); // prevent links <a> default action
    createElements(infosImage, containerImage, false, maxImages, item.id);
  }
}

function getImage(){
  createElements(infosMiniatures, containerDots, true, maxImages);
  createElements(infosImage, containerImage, false, maxImages, 0);
  for(var i = 0; i < maxImages; i++){
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
  createElements(infosImage, containerImage, false, maxImages, index);
}

// La fonction qui "joue" les images
function play() {
  next();
  // On nettoie et relance le timeout
  clearTimeout();
  setTimeout("play()", secDuration * 1000);
}


document.addEventListener('load', getImage(), false);
document.getElementById("next").addEventListener('click', next, false);
document.getElementById("prev").addEventListener('click', prev, false);