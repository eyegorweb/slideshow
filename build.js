(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Test watchify...

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

var secDuration = 3, maxImages = infosImage.length, timer, delay, isPlayed = false;



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
  // Relance le player avec un timer réinitialisé
  if(isPlayed){
    pause();
    play();
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

// Externalisons la callback dans une fonction callbackForId qui sera une fermeture
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

// Pas d'externalisation de fonction, mais une déclaration de IIFE
function getImage2(){
  createElements(infosMiniatures, containerDots, true, maxImages);
  createElements(infosImage, containerImage, false, maxImages, 0);
  addClass(infosImage);
  for(var i = 0; i < maxImages; i++){
    //console.log(dots[i].attributes.getNamedItem('class').nodeValue);
    var item = infosImage[i];
    dots[i].addEventListener('click', (function(item){ // IIFE to encapsulate code
        return function(e){ // Closure to keep each item in a local and own scope
          e.preventDefault(); // prevent links <a> default action
          createElements(infosImage, containerImage, false, maxImages, item.id);
          addClass(infosImage);
        }
      })(item) // Invoke immediately function
      ,false);
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
  // Relance le player avec un timer réinitialisé
  if(isPlayed){
    pause();
    play();
  }
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
  // Relance le player avec un timer réinitialisé
  if(isPlayed){
    pause();
    play();
  }
}

// La fonction qui "joue" les images
function play() {
  // Un setTimeout pour lancer l'image suivante
  delay = setTimeout("next()", secDuration * 1000);
  // Un setTimeout pour lancer le play global (récursivité)
  timer = setTimeout("play()", secDuration * 1000);
  return isPlayed = true;
}

function pause(){
  clearTimeout(delay);
  clearTimeout(timer);
  delay = null;
  timer = null;
  return isPlayed = false;
}

document.addEventListener('load', getImage2(), false);
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



},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zbGlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBUZXN0IHdhdGNoaWZ5Li4uXG5cbnZhciBpbmZvc0ltYWdlID0gW1xuICB7J2lkJzogJzAnLCAnc3JjJzogJ2ltYWdlcy9iaXJkLmpwZycsICd0aXRsZSc6ICdCaXJkJ30sXG4gIHsnaWQnOiAnMScsICdzcmMnOiAnaW1hZ2VzL3JlZF9iaXJkLmpwZycsICd0aXRsZSc6ICdSZWQgYmlyZCd9LFxuICB7J2lkJzogJzInLCAnc3JjJzogJ2ltYWdlcy9zcHJpbmcuanBnJywgJ3RpdGxlJzogJ1NwcmluZyd9LFxuICB7J2lkJzogJzMnLCAnc3JjJzogJ2ltYWdlcy93aW50ZXIuanBnJywgJ3RpdGxlJzogJ1dpbnRlcid9XG5dO1xuXG52YXIgaW5mb3NNaW5pYXR1cmVzID0gW1xuICB7J2lkJzogJzAnLCAnc3JjJzogJ2ltYWdlcy9tX3Bob3RvMS5wbmcnLCAndGl0bGUnOiAnQmlyZCd9LFxuICB7J2lkJzogJzEnLCAnc3JjJzogJ2ltYWdlcy9tX3Bob3RvMi5wbmcnLCAndGl0bGUnOiAnUmVkIGJpcmQnfSxcbiAgeydpZCc6ICcyJywgJ3NyYyc6ICdpbWFnZXMvbV9waG90bzMucG5nJywgJ3RpdGxlJzogJ1NwcmluZyd9LFxuICB7J2lkJzogJzMnLCAnc3JjJzogJ2ltYWdlcy9tX3Bob3RvNC5wbmcnLCAndGl0bGUnOiAnV2ludGVyJ31cbl07XG5cbnZhciBjb250YWluZXJEb3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RvdHMnKSxcbiAgZG90cyA9IGNvbnRhaW5lckRvdHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJyksXG4gIGNvbnRhaW5lckltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXJcIiksXG4gIG5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYnKSxcbiAgYXJyb3dzID0gbmF2LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJyk7XG5cbnZhciBzZWNEdXJhdGlvbiA9IDMsIG1heEltYWdlcyA9IGluZm9zSW1hZ2UubGVuZ3RoLCB0aW1lciwgZGVsYXksIGlzUGxheWVkID0gZmFsc2U7XG5cblxuXG4vLyBDcsOpZXIgYXV0YW50IGQnw6lsw6ltZW50cyBET00gcXVlIGQnaW1hZ2VzXG5cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXModGFnTmFtZSwgYXR0cmlidXRlcywgZGF0YSl7XG4gIHZhciBlbG10ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgZm9yKHZhciBpID0gMDsgaTwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKyl7XG4gICAgZWxtdC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlc1tpXSwgZGF0YVtpXSk7XG4gIH1cbiAgLy9jb25zb2xlLmxvZyhlbG10LmNsYXNzTmFtZSk7XG4gIHJldHVybiBlbG10O1xufVxuXG4vLyBMYSBtw6l0aG9kZSBTdHJpbmcucHJvdG90eXBlLm1hdGNoKCkgcGVybWV0IGQnb2J0ZW5pciBsZSB0YWJsZWF1IGRlcyBjb3JyZXNwb25kYW5jZXMgZW50cmUgbGEgY2hhw65uZSBjb3VyYW50ZSBldCB1bmUgZXhwcmVzc2lvbiByYXRpb25uZWxsZVxuLy8gRG9uYyBwb3VyIHJldHJvdXZlciBsZSBuYiBkZSBsYSBjbGFzc2UgY291cmFudGUgw6AgaW1hZ2UgZXQgbGUgbmIgZGVzIGxpZW5zIGNvcnJlc3BvbmRhbnQsIG9uIHBldXQgY3LDqWVyIGNldHRlIGZvbmN0aW9uOlxuLy8gT24gcmVnYXJkZSBxdWVsbGUgZXN0IGxhIGNsYXNzZSBkZSBsYSBwaG90byAoaW1hZ2UwLCBpbWFnZTEsIGV0Yy4uLikgPT4gY2hhw65uZSBjb3VyYW50ZVxuLy8gT24gZXh0cmFpdC9zw6lwYXJlIGxlcyBsZXR0cmVzIGR1IGNoaWZmcmUgZGUgbGEgY2xhc3NlIChwYXIgZXhlbXBsZTogW2lhbWdlLCAwXSlcbi8vIE9uIHJlY2hlcmNoZSBsZSBjaGlmZnJlIGNvcnJlc3BvbmRhbnQgcGFybWkgbGVzIGxpZW5zIChsaW5rMCwgbGluazEsIGV0YykgPT4gZXhwcmVzc2lvbiByYXRpb25uZWxsZVxuLy8gT24gZGl0IHF1ZSBjZSBsaWVuIMOgIGxhIGNsYXNzZSBkb250IGwnZXhwcmVzc2lvbiBjb21wb3J0ZSBsZSBjaGlmZnJlIHJlY2hlcmNow6kgcG9zc8OoZGUgbGEgY2xhc3NlIFwiYWN0aXZlXCJcblxuLyp2YXIgc3RyID0gJ2ltYWdlMCc7XG52YXIgY2hpZmZyZSA9ICcwJzsgKi8vLyBvdSB2YXIgY2hpZmZyZSA9IDAsIHRlc3RlciBsYSBkaWZmw6lyZW5jZSAocmVwbGFjZSAwIGJ5IGN1cnJlbnQgaW5kZXggaW4gbG9vcCBmb3IpXG4vLyBVdGlsaXNlciBsYSBzeW50YXhlIG5ldyBSZWdFeHAodmFyaWFibGUgdmFsdWVUb0ZpbmQsICdmbGFnJykgZXQgbm9uIC9bdmFyaWFibGUgdmFsdWVUb0ZpbmRdL2dcbi8vIFByw6ljaXNlciBsZSBmbGFnICgybmQgcGFyYW3DqHRyZSBkZSBSZWdFeHAgc2lub24gcGFzIGRlIHZhbGV1cnMgbXVsdGlwbGVzIHRyb3V2w6llcyByZW52b3nDqWVzLCB1bmlxdWVtZW50IGxhIHByZW1pw6hyZSlcbi8vdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoY2hpZmZyZSwgJ2cnKTsgXG4vL3ZhciB0YWJsZWF1X2NvcnJlc3BvbmRhbmNlcyA9IHN0ci5tYXRjaChyZWdleHApO1xuLy9jb25zb2xlLmxvZyh0YWJsZWF1X2NvcnJlc3BvbmRhbmNlcyk7XG5cbi8vU3RyaW5nLnByb3RvdHlwZS5tYXRjaEFsbCA9IGZ1bmN0aW9uKHdpdGhUaGlzKSB7XG4vLyAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAod2l0aFRoaXMsICdnaScpO1xuLy8gIHJldHVybiB0aGlzLm1hdGNoKHJlZ2V4cCk7XG4vL307XG4vL3ZhciBzdHJpbiA9IFwiSWlJSW1hZ2VpbmU5OTlpaUlJXCI7XG4vL3ZhciBtYXRjaFdpdGggPSBcImlcIjtcbi8vdmFyIHRvdG8gPSBzdHJpbi5tYXRjaEFsbChtYXRjaFdpdGgpO1xuLy9jb25zb2xlLmxvZyh0b3RvKTtcbi8vY29uc29sZS5sb2coU3RyaW5nLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIGFkZENsYXNzKGl0ZW0pe1xuICAvLyBGaW5kL0FjdGl2ZSBjbGFzc05hbWVcbiAgICB2YXIgY29ycmVzcG9uZGFuY2UgPSBbXTtcbiAgICB2YXIgY2hpZmZyZSA9IGdldElkKCk7XG4gICAgdmFyIHN0ciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkbCcpWzBdLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cChjaGlmZnJlLCAnZycpO1xuICAgIGNvcnJlc3BvbmRhbmNlID0gc3RyLm1hdGNoKHJlZ2V4cCkudG9TdHJpbmcoKTtcbiAgICBmb3IodmFyIGogPSAwOyBqIDwgZG90cy5sZW5ndGg7IGorKyl7XG4gICAgICBpdGVtID0gaW5mb3NJbWFnZVtqXTtcbiAgICAgIGlmKGl0ZW0uaWQgPT0gY29ycmVzcG9uZGFuY2Upe1xuICAgICAgICBkb3RzW2pdLmNsYXNzTmFtZSA9ICcgJztcbiAgICAgICAgZG90c1tqXS5jbGFzc05hbWUgPSBkb3RzW2pdLmNsYXNzTmFtZSArICcgYWN0aXZlJztcbiAgICAgIH1lbHNle1xuICAgICAgICBkb3RzW2pdLmNsYXNzTmFtZSA9ICcgJztcbiAgICAgICAgZG90c1tqXS5jbGFzc05hbWUgPSBkb3RzW2pdLmNsYXNzTmFtZSArICcgaW5hY3RpdmUnO1xuICAgICAgfVxuICAgICAgXG4gICAgfVxufVxuXG5cblxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50cyhqc29uLCBjb250YWluZXIsIGJvb2wsIGxlbiwgaW5kZXgpe1xuICBpZighYm9vbCl7XG4gICAgLy8gQ3JlYXRlIDxpbWFnZT4gZWxlbWVudFxuICAgIC8vY29uc29sZS5sb2coaW5kZXgpO1xuICAgIC8vIERlbGV0ZSBvbGQgaW1hZ2VcbiAgICB3aGlsZSAoY29udGFpbmVySW1hZ2UuZmlyc3RDaGlsZCkge1xuICAgICAgY29udGFpbmVySW1hZ2UucmVtb3ZlQ2hpbGQoY29udGFpbmVySW1hZ2UuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIC8vIFB1dCBuZXcgaW1hZ2VcbiAgICAvLyBFbMOpbWVudCA8RElWPlxuICAgIHZhciBsaW5rID0gc2V0QXR0cmlidXRlcyhcImRsXCIsIFtcImlkXCIsIFwiY2xhc3NcIl0sIFtqc29uW2luZGV4XS5pZCwgXCJpbWFnZVwiICsganNvbltpbmRleF0uaWRdKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgLy8gRWzDqW1lbnRzIDxTUEFOPlxuICAgIHZhciBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImR0XCIpO1xuICAgIC8vIEF0dHJpYnV0ZSB0aXRsZSB0ZXh0XG4gICAgZGVzYy5pbm5lclRleHQgPSBqc29uW2luZGV4XS50aXRsZTtcbiAgICBsaW5rLmFwcGVuZENoaWxkKGRlc2MpO1xuICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRkXCIpO1xuICAgIGxpbmsuaW5zZXJ0QmVmb3JlKGNvbnRlbnQsIGRlc2MubmV4dFNpYmxpbmcpO1xuICAgIC8vIEVsw6ltZW50cyA8SU1HPlxuICAgIC8vIEF0dHJpYnV0ZSBpbWFnZSBzb3VyY2VcbiAgICB2YXIgcGhvdG8gPSBzZXRBdHRyaWJ1dGVzKFwiaW1nXCIsIFtcInNyY1wiLCBcImFsdFwiXSwgW2pzb25baW5kZXhdLnNyYywganNvbltpbmRleF0udGl0bGVdKTtcbiAgICBjb250ZW50LmFwcGVuZENoaWxkKHBob3RvKTtcbiAgfWVsc2V7XG4gICAgLy8gQ3JlYXRlIDxkb3RzPiBlbGVtZW50c1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKyl7XG4gICAgICAvLyBFbMOpbWVudHMgPExJPlxuICAgICAgdmFyIGxpbmsgPSBzZXRBdHRyaWJ1dGVzKFwibGlcIiwgW1wiY2xhc3NcIl0sIFtcImxpbmtcIiArIGpzb25baV0uaWRdKTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIC8vIEVsw6ltZW50cyA8QT5cbiAgICAgIHZhciBkZXNjID0gc2V0QXR0cmlidXRlcyhcImFcIiwgW1wiaWRcIiwgXCJjbGFzc1wiLCBcImhyZWZcIiwgXCJ0aXRsZVwiXSwgW1wiZGVzY1wiICsganNvbltpXS5pZCwgXCJkZXNjXCIgKyBqc29uW2ldLmlkLCBcIlwiLCBqc29uW2ldLnRpdGxlXSk7XG4gICAgICAvLyBBdHRyaWJ1dGUgdGl0bGUgdGV4dFxuICAgICAgZGVzYy5pbm5lclRleHQgPSBqc29uW2ldLnRpdGxlO1xuICAgICAgbGluay5hcHBlbmRDaGlsZChkZXNjKTtcbiAgICAgIC8vIEVsw6ltZW50cyA8SU1HPlxuICAgICAgLy8gQXR0cmlidXRlIGltYWdlIHNvdXJjZVxuICAgICAgdmFyIHBob3RvID0gc2V0QXR0cmlidXRlcyhcImltZ1wiLCBbXCJzcmNcIiwgXCJhbHRcIl0sIFtqc29uW2ldLnNyYywganNvbltpXS50aXRsZV0pO1xuICAgICAgZGVzYy5hcHBlbmRDaGlsZChwaG90byk7XG4gICAgfVxuICB9XG4gIC8vIFJlbGFuY2UgbGUgcGxheWVyIGF2ZWMgdW4gdGltZXIgcsOpaW5pdGlhbGlzw6lcbiAgaWYoaXNQbGF5ZWQpe1xuICAgIHBhdXNlKCk7XG4gICAgcGxheSgpO1xuICB9XG59XG5cblxuXG5mdW5jdGlvbiBnZXRJZCgpe1xuICB2YXIgaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGwnKVswXS5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbSgnaWQnKS5ub2RlVmFsdWU7IC8vIE9VIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkbCcpWzBdLmdldEF0dHJpYnV0ZSgnaWQnKVxuICByZXR1cm4gaWQ7XG59XG5cblxuLy8gT24gY3LDqWUgdW5lIGZvbmN0aW9uIGFwcGVsw6llIGRhbnMgbGUgY2FsbGJhY2sgZHUgZ2VzdGlvbm5haXJlIGQnw6l2w6luZW1lbnQgcGx1cyBiYXNcbi8vIGFmaW4gZGUgY3LDqWVyIHVuZSBjbG9zdXJlID0+IHBvcnTDqWUgZW4gZGVob3JzIGR1IGdlc3Rpb25uYWlyZSBkJ8OpdsOpbmVtZW50c1xuZnVuY3Rpb24gY2FsbGJhY2tGb3JJZChpdGVtKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpeyAvLyBDbG9zdXJlIHRvIGtlZXAgZWFjaCBpdGVtIGluIGEgbG9jYWwgYW5kIG93biBzY29wZVxuICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCBsaW5rcyA8YT4gZGVmYXVsdCBhY3Rpb25cbiAgICBjcmVhdGVFbGVtZW50cyhpbmZvc0ltYWdlLCBjb250YWluZXJJbWFnZSwgZmFsc2UsIG1heEltYWdlcywgaXRlbS5pZCk7XG4gICAgYWRkQ2xhc3MoaW5mb3NJbWFnZSk7XG4gIH1cbn1cblxuLy8gRXh0ZXJuYWxpc29ucyBsYSBjYWxsYmFjayBkYW5zIHVuZSBmb25jdGlvbiBjYWxsYmFja0ZvcklkIHF1aSBzZXJhIHVuZSBmZXJtZXR1cmVcbmZ1bmN0aW9uIGdldEltYWdlKCl7XG4gIGNyZWF0ZUVsZW1lbnRzKGluZm9zTWluaWF0dXJlcywgY29udGFpbmVyRG90cywgdHJ1ZSwgbWF4SW1hZ2VzKTtcbiAgY3JlYXRlRWxlbWVudHMoaW5mb3NJbWFnZSwgY29udGFpbmVySW1hZ2UsIGZhbHNlLCBtYXhJbWFnZXMsIDApO1xuICBhZGRDbGFzcyhpbmZvc0ltYWdlKTtcbiAgXG4gIC8vY29uc29sZS5sb2coZG90cyk7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCBtYXhJbWFnZXM7IGkrKyl7XG4gICAgLy9jb25zb2xlLmxvZyhkb3RzW2ldLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKCdjbGFzcycpLm5vZGVWYWx1ZSk7XG4gICAgdmFyIGl0ZW0gPSBpbmZvc0ltYWdlW2ldO1xuICAgIGRvdHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYWxsYmFja0ZvcklkKGl0ZW0pLCBmYWxzZSk7XG4gIH1cbn1cblxuLy8gUGFzIGQnZXh0ZXJuYWxpc2F0aW9uIGRlIGZvbmN0aW9uLCBtYWlzIHVuZSBkw6ljbGFyYXRpb24gZGUgSUlGRVxuZnVuY3Rpb24gZ2V0SW1hZ2UyKCl7XG4gIGNyZWF0ZUVsZW1lbnRzKGluZm9zTWluaWF0dXJlcywgY29udGFpbmVyRG90cywgdHJ1ZSwgbWF4SW1hZ2VzKTtcbiAgY3JlYXRlRWxlbWVudHMoaW5mb3NJbWFnZSwgY29udGFpbmVySW1hZ2UsIGZhbHNlLCBtYXhJbWFnZXMsIDApO1xuICBhZGRDbGFzcyhpbmZvc0ltYWdlKTtcbiAgZm9yKHZhciBpID0gMDsgaSA8IG1heEltYWdlczsgaSsrKXtcbiAgICAvL2NvbnNvbGUubG9nKGRvdHNbaV0uYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ2NsYXNzJykubm9kZVZhbHVlKTtcbiAgICB2YXIgaXRlbSA9IGluZm9zSW1hZ2VbaV07XG4gICAgZG90c1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChmdW5jdGlvbihpdGVtKXsgLy8gSUlGRSB0byBlbmNhcHN1bGF0ZSBjb2RlXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlKXsgLy8gQ2xvc3VyZSB0byBrZWVwIGVhY2ggaXRlbSBpbiBhIGxvY2FsIGFuZCBvd24gc2NvcGVcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgbGlua3MgPGE+IGRlZmF1bHQgYWN0aW9uXG4gICAgICAgICAgY3JlYXRlRWxlbWVudHMoaW5mb3NJbWFnZSwgY29udGFpbmVySW1hZ2UsIGZhbHNlLCBtYXhJbWFnZXMsIGl0ZW0uaWQpO1xuICAgICAgICAgIGFkZENsYXNzKGluZm9zSW1hZ2UpO1xuICAgICAgICB9XG4gICAgICB9KShpdGVtKSAvLyBJbnZva2UgaW1tZWRpYXRlbHkgZnVuY3Rpb25cbiAgICAgICxmYWxzZSk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBuZXh0KCl7XG4gIHZhciBpbmRleCA9IGdldElkKCk7XG4gIGluZGV4Kys7XG4gIGlmKGluZGV4ID49IG1heEltYWdlcyl7XG4gICAgaW5kZXggPSAwO1xuICB9ZWxzZXtcbiAgICBpbmRleCA9IGluZGV4O1xuICB9XG4gIGNyZWF0ZUVsZW1lbnRzKGluZm9zSW1hZ2UsIGNvbnRhaW5lckltYWdlLCBmYWxzZSwgbWF4SW1hZ2VzLCBpbmRleCk7XG4gIGFkZENsYXNzKGluZm9zSW1hZ2UpO1xuICAvLyBSZWxhbmNlIGxlIHBsYXllciBhdmVjIHVuIHRpbWVyIHLDqWluaXRpYWxpc8OpXG4gIGlmKGlzUGxheWVkKXtcbiAgICBwYXVzZSgpO1xuICAgIHBsYXkoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcmV2KCl7XG4gIHZhciBpbmRleCA9IGdldElkKCk7XG4gIGluZGV4LS07XG4gIGlmKGluZGV4IDwgMCl7XG4gICAgaW5kZXggPSBtYXhJbWFnZXMgLSAxO1xuICB9ZWxzZXtcbiAgICBpbmRleCA9IGluZGV4O1xuICB9XG4gIGNyZWF0ZUVsZW1lbnRzKGluZm9zSW1hZ2UsIGNvbnRhaW5lckltYWdlLCBmYWxzZSwgbWF4SW1hZ2VzLCBpbmRleCk7XG4gIGFkZENsYXNzKGluZm9zSW1hZ2UpO1xuICAvLyBSZWxhbmNlIGxlIHBsYXllciBhdmVjIHVuIHRpbWVyIHLDqWluaXRpYWxpc8OpXG4gIGlmKGlzUGxheWVkKXtcbiAgICBwYXVzZSgpO1xuICAgIHBsYXkoKTtcbiAgfVxufVxuXG4vLyBMYSBmb25jdGlvbiBxdWkgXCJqb3VlXCIgbGVzIGltYWdlc1xuZnVuY3Rpb24gcGxheSgpIHtcbiAgLy8gVW4gc2V0VGltZW91dCBwb3VyIGxhbmNlciBsJ2ltYWdlIHN1aXZhbnRlXG4gIGRlbGF5ID0gc2V0VGltZW91dChcIm5leHQoKVwiLCBzZWNEdXJhdGlvbiAqIDEwMDApO1xuICAvLyBVbiBzZXRUaW1lb3V0IHBvdXIgbGFuY2VyIGxlIHBsYXkgZ2xvYmFsIChyw6ljdXJzaXZpdMOpKVxuICB0aW1lciA9IHNldFRpbWVvdXQoXCJwbGF5KClcIiwgc2VjRHVyYXRpb24gKiAxMDAwKTtcbiAgcmV0dXJuIGlzUGxheWVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcGF1c2UoKXtcbiAgY2xlYXJUaW1lb3V0KGRlbGF5KTtcbiAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgZGVsYXkgPSBudWxsO1xuICB0aW1lciA9IG51bGw7XG4gIHJldHVybiBpc1BsYXllZCA9IGZhbHNlO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZ2V0SW1hZ2UyKCksIGZhbHNlKTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5leHQsIGZhbHNlKTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJldlwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHByZXYsIGZhbHNlKTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHBsYXksIGZhbHNlKTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF1c2VcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwYXVzZSwgZmFsc2UpO1xuXG4vL2Z1bmN0aW9uIHJlY3Vyc2lvbihjKXtcbi8vICBzZXRUaW1lb3V0KGZ1bmN0aW9uKGMpe1xuLy8gICAgICBjID0gYyB8fCAwO1xuLy8gICAgICBjb25zb2xlLmxvZyhjKyspO1xuLy8gICAgICBpZihjID09IDEwKXtcbi8vICAgICAgICByZXR1cm47XG4vLyAgICAgIH1cbi8vICAgICAgcmVjdXJzaW9uKGMpO1xuLy8gIH0sXG4vLyAgMjAwMCxcbi8vICBjXG4vLyAgKTtcbi8vfVxuLy9cbi8vcmVjdXJzaW9uKCk7XG5cblxuIl19
