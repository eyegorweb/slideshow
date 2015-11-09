(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

function setAttributes(tagName, attributes, data) {
	var elmt = document.createElement(tagName);
	for (var i = 0; i < attributes.length; i++) {
		elmt.setAttribute(attributes[i], data[i]);
	}
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

function addClass(item) {
	// Find/Active className
	var correspondance = [];
	var chiffre = getId();
	var str = document.getElementsByTagName('dl')[0].getAttribute('class');
	var regexp = new RegExp(chiffre, 'g');
	correspondance = str.match(regexp).toString();
	for (var j = 0; j < dots.length; j++) {
		item = infosImage[j];
		if (item.id === correspondance) {
			dots[j].className = ' ';
			dots[j].className = dots[j].className + ' active';
		} else {
			dots[j].className = ' ';
			dots[j].className = dots[j].className + ' inactive';
		}

	}
}




function createElements(json, container, bool, len, index) {
	var link, desc, photo;
	if (!bool) {
		// Create <image> element
		//console.log(index);
		// Delete old image
		while (containerImage.firstChild) {
			containerImage.removeChild(containerImage.firstChild);
		}
		// Put new image
		// Elément <DIV>
		link = setAttributes("dl", ["id", "class"], [json[index].id, "image" + json[index].id]);
		container.appendChild(link);
		// Eléments <SPAN>
		desc = document.createElement("dt");
		// Attribute title text
		desc.innerText = json[index].title;
		link.appendChild(desc);
		var content = document.createElement("dd");
		link.insertBefore(content, desc.nextSibling);
		// Eléments <IMG>
		// Attribute image source
		photo = setAttributes("img", ["src", "alt"], [json[index].src, json[index].title]);
		content.appendChild(photo);
	} else {
		// Create <dots> elements
		for (var i = 0; i < len; i++) {
			// Eléments <LI>
			link = setAttributes("li", ["class"], ["link" + json[i].id]);
			container.appendChild(link);
			// Eléments <A>
			desc = setAttributes("a", ["id", "class", "href", "title"], ["desc" + json[i].id, "desc" + json[i].id, "", json[i].title]);
			// Attribute title text
			desc.innerText = json[i].title;
			link.appendChild(desc);
			// Eléments <IMG>
			// Attribute image source
			photo = setAttributes("img", ["src", "alt"], [json[i].src, json[i].title]);
			desc.appendChild(photo);
		}
	}
	// Relance le player avec un timer réinitialisé
	if (isPlayed) {
		pause();
		play();
	}
}



function getId() {
	var id = document.getElementsByTagName('dl')[0].attributes.getNamedItem('id').nodeValue; // OU document.getElementsByTagName('dl')[0].getAttribute('id')
	return id;
}


// On crée une fonction appelée dans le callback du gestionnaire d'événement plus bas
// afin de créer une closure => portée en dehors du gestionnaire d'événements
function callbackForId(item) {
	return function(e) { // Closure to keep each item in a local and own scope
		e.preventDefault(); // prevent links <a> default action
		createElements(infosImage, containerImage, false, maxImages, item.id);
		addClass(infosImage);
	};
}

// Externalisons la callback dans une fonction callbackForId qui sera une fermeture
function getImage() {
	createElements(infosMiniatures, containerDots, true, maxImages);
	createElements(infosImage, containerImage, false, maxImages, 0);
	addClass(infosImage);

	//console.log(dots);
	for (var i = 0; i < maxImages; i++) {
		//console.log(dots[i].attributes.getNamedItem('class').nodeValue);
		var item = infosImage[i];
		dots[i].addEventListener('click', callbackForId(item), false);
	}
}

// Pas d'externalisation de fonction, mais une déclaration de IIFE
//function getImage2() {
//	createElements(infosMiniatures, containerDots, true, maxImages);
//	createElements(infosImage, containerImage, false, maxImages, 0);
//	addClass(infosImage);
//	for (var i = 0; i < maxImages; i++) {
//		//console.log(dots[i].attributes.getNamedItem('class').nodeValue);
//		var item = infosImage[i];
//		dots[i].addEventListener('click', (function(item) { // IIFE to encapsulate code
//			return function(e) { // Closure to keep each item in a local and own scope
//				e.preventDefault(); // prevent links <a> default action
//				createElements(infosImage, containerImage, false, maxImages, item.id);
//				addClass(infosImage);
//			};
//		// Invoke immediately function
//		})(item), false);
//	}
//}


function next() {
	var index = getId();
	index++;
	if (index >= maxImages) {
		index = 0;
	} 
//	else {
//		index = index;
//	}
	createElements(infosImage, containerImage, false, maxImages, index);
	addClass(infosImage);
	// Relance le player avec un timer réinitialisé
	if (isPlayed) {
		pause();
		play();
	}
}

function prev() {
	var index = getId();
	index--;
	if (index < 0) {
		index = maxImages - 1;
	} 
//	else {
//		index = index;
//	}
	createElements(infosImage, containerImage, false, maxImages, index);
	addClass(infosImage);
	// Relance le player avec un timer réinitialisé
	if (isPlayed) {
		pause();
		play();
	}
}

// La fonction qui "joue" les images
function play() {
	// Un setTimeout pour lancer l'image suivante
	delay = setTimeout(next, secDuration * 1000);
	// Un setTimeout pour lancer le play global (récursivité)
	timer = setTimeout(play, secDuration * 1000);
	isPlayed = true;
	return isPlayed;
}

function pause() {
	clearTimeout(delay);
	clearTimeout(timer);
	delay = null;
	timer = null;
	isPlayed = false;
	return isPlayed;
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



},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zbGlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGluZm9zSW1hZ2UgPSBbXG5cdHsnaWQnOiAnMCcsICdzcmMnOiAnaW1hZ2VzL2JpcmQuanBnJywgJ3RpdGxlJzogJ0JpcmQnfSxcblx0eydpZCc6ICcxJywgJ3NyYyc6ICdpbWFnZXMvcmVkX2JpcmQuanBnJywgJ3RpdGxlJzogJ1JlZCBiaXJkJ30sXG5cdHsnaWQnOiAnMicsICdzcmMnOiAnaW1hZ2VzL3NwcmluZy5qcGcnLCAndGl0bGUnOiAnU3ByaW5nJ30sXG5cdHsnaWQnOiAnMycsICdzcmMnOiAnaW1hZ2VzL3dpbnRlci5qcGcnLCAndGl0bGUnOiAnV2ludGVyJ31cbl07XG5cbnZhciBpbmZvc01pbmlhdHVyZXMgPSBbXG5cdHsnaWQnOiAnMCcsICdzcmMnOiAnaW1hZ2VzL21fcGhvdG8xLnBuZycsICd0aXRsZSc6ICdCaXJkJ30sXG5cdHsnaWQnOiAnMScsICdzcmMnOiAnaW1hZ2VzL21fcGhvdG8yLnBuZycsICd0aXRsZSc6ICdSZWQgYmlyZCd9LFxuXHR7J2lkJzogJzInLCAnc3JjJzogJ2ltYWdlcy9tX3Bob3RvMy5wbmcnLCAndGl0bGUnOiAnU3ByaW5nJ30sXG5cdHsnaWQnOiAnMycsICdzcmMnOiAnaW1hZ2VzL21fcGhvdG80LnBuZycsICd0aXRsZSc6ICdXaW50ZXInfVxuXTtcblxudmFyIGNvbnRhaW5lckRvdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZG90cycpLFxuXHRcdGRvdHMgPSBjb250YWluZXJEb3RzLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpLFxuXHRcdGNvbnRhaW5lckltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXJcIiksXG5cdFx0bmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdicpLFxuXHRcdGFycm93cyA9IG5hdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpO1xuXG52YXIgc2VjRHVyYXRpb24gPSAzLCBtYXhJbWFnZXMgPSBpbmZvc0ltYWdlLmxlbmd0aCwgdGltZXIsIGRlbGF5LCBpc1BsYXllZCA9IGZhbHNlO1xuXG5cblxuLy8gQ3LDqWVyIGF1dGFudCBkJ8OpbMOpbWVudHMgRE9NIHF1ZSBkJ2ltYWdlc1xuXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKHRhZ05hbWUsIGF0dHJpYnV0ZXMsIGRhdGEpIHtcblx0dmFyIGVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRlbG10LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVzW2ldLCBkYXRhW2ldKTtcblx0fVxuXHRyZXR1cm4gZWxtdDtcbn1cblxuLy8gTGEgbcOpdGhvZGUgU3RyaW5nLnByb3RvdHlwZS5tYXRjaCgpIHBlcm1ldCBkJ29idGVuaXIgbGUgdGFibGVhdSBkZXMgY29ycmVzcG9uZGFuY2VzIGVudHJlIGxhIGNoYcOubmUgY291cmFudGUgZXQgdW5lIGV4cHJlc3Npb24gcmF0aW9ubmVsbGVcbi8vIERvbmMgcG91ciByZXRyb3V2ZXIgbGUgbmIgZGUgbGEgY2xhc3NlIGNvdXJhbnRlIMOgIGltYWdlIGV0IGxlIG5iIGRlcyBsaWVucyBjb3JyZXNwb25kYW50LCBvbiBwZXV0IGNyw6llciBjZXR0ZSBmb25jdGlvbjpcbi8vIE9uIHJlZ2FyZGUgcXVlbGxlIGVzdCBsYSBjbGFzc2UgZGUgbGEgcGhvdG8gKGltYWdlMCwgaW1hZ2UxLCBldGMuLi4pID0+IGNoYcOubmUgY291cmFudGVcbi8vIE9uIGV4dHJhaXQvc8OpcGFyZSBsZXMgbGV0dHJlcyBkdSBjaGlmZnJlIGRlIGxhIGNsYXNzZSAocGFyIGV4ZW1wbGU6IFtpYW1nZSwgMF0pXG4vLyBPbiByZWNoZXJjaGUgbGUgY2hpZmZyZSBjb3JyZXNwb25kYW50IHBhcm1pIGxlcyBsaWVucyAobGluazAsIGxpbmsxLCBldGMpID0+IGV4cHJlc3Npb24gcmF0aW9ubmVsbGVcbi8vIE9uIGRpdCBxdWUgY2UgbGllbiDDoCBsYSBjbGFzc2UgZG9udCBsJ2V4cHJlc3Npb24gY29tcG9ydGUgbGUgY2hpZmZyZSByZWNoZXJjaMOpIHBvc3PDqGRlIGxhIGNsYXNzZSBcImFjdGl2ZVwiXG5cbi8qdmFyIHN0ciA9ICdpbWFnZTAnO1xuIHZhciBjaGlmZnJlID0gJzAnOyAqLy8vIG91IHZhciBjaGlmZnJlID0gMCwgdGVzdGVyIGxhIGRpZmbDqXJlbmNlIChyZXBsYWNlIDAgYnkgY3VycmVudCBpbmRleCBpbiBsb29wIGZvcilcbi8vIFV0aWxpc2VyIGxhIHN5bnRheGUgbmV3IFJlZ0V4cCh2YXJpYWJsZSB2YWx1ZVRvRmluZCwgJ2ZsYWcnKSBldCBub24gL1t2YXJpYWJsZSB2YWx1ZVRvRmluZF0vZ1xuLy8gUHLDqWNpc2VyIGxlIGZsYWcgKDJuZCBwYXJhbcOodHJlIGRlIFJlZ0V4cCBzaW5vbiBwYXMgZGUgdmFsZXVycyBtdWx0aXBsZXMgdHJvdXbDqWVzIHJlbnZvecOpZXMsIHVuaXF1ZW1lbnQgbGEgcHJlbWnDqHJlKVxuLy92YXIgcmVnZXhwID0gbmV3IFJlZ0V4cChjaGlmZnJlLCAnZycpOyBcbi8vdmFyIHRhYmxlYXVfY29ycmVzcG9uZGFuY2VzID0gc3RyLm1hdGNoKHJlZ2V4cCk7XG4vL2NvbnNvbGUubG9nKHRhYmxlYXVfY29ycmVzcG9uZGFuY2VzKTtcblxuLy9TdHJpbmcucHJvdG90eXBlLm1hdGNoQWxsID0gZnVuY3Rpb24od2l0aFRoaXMpIHtcbi8vICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCh3aXRoVGhpcywgJ2dpJyk7XG4vLyAgcmV0dXJuIHRoaXMubWF0Y2gocmVnZXhwKTtcbi8vfTtcbi8vdmFyIHN0cmluID0gXCJJaUlJbWFnZWluZTk5OWlpSUlcIjtcbi8vdmFyIG1hdGNoV2l0aCA9IFwiaVwiO1xuLy92YXIgdG90byA9IHN0cmluLm1hdGNoQWxsKG1hdGNoV2l0aCk7XG4vL2NvbnNvbGUubG9nKHRvdG8pO1xuLy9jb25zb2xlLmxvZyhTdHJpbmcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gYWRkQ2xhc3MoaXRlbSkge1xuXHQvLyBGaW5kL0FjdGl2ZSBjbGFzc05hbWVcblx0dmFyIGNvcnJlc3BvbmRhbmNlID0gW107XG5cdHZhciBjaGlmZnJlID0gZ2V0SWQoKTtcblx0dmFyIHN0ciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkbCcpWzBdLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcblx0dmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoY2hpZmZyZSwgJ2cnKTtcblx0Y29ycmVzcG9uZGFuY2UgPSBzdHIubWF0Y2gocmVnZXhwKS50b1N0cmluZygpO1xuXHRmb3IgKHZhciBqID0gMDsgaiA8IGRvdHMubGVuZ3RoOyBqKyspIHtcblx0XHRpdGVtID0gaW5mb3NJbWFnZVtqXTtcblx0XHRpZiAoaXRlbS5pZCA9PT0gY29ycmVzcG9uZGFuY2UpIHtcblx0XHRcdGRvdHNbal0uY2xhc3NOYW1lID0gJyAnO1xuXHRcdFx0ZG90c1tqXS5jbGFzc05hbWUgPSBkb3RzW2pdLmNsYXNzTmFtZSArICcgYWN0aXZlJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG90c1tqXS5jbGFzc05hbWUgPSAnICc7XG5cdFx0XHRkb3RzW2pdLmNsYXNzTmFtZSA9IGRvdHNbal0uY2xhc3NOYW1lICsgJyBpbmFjdGl2ZSc7XG5cdFx0fVxuXG5cdH1cbn1cblxuXG5cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudHMoanNvbiwgY29udGFpbmVyLCBib29sLCBsZW4sIGluZGV4KSB7XG5cdHZhciBsaW5rLCBkZXNjLCBwaG90bztcblx0aWYgKCFib29sKSB7XG5cdFx0Ly8gQ3JlYXRlIDxpbWFnZT4gZWxlbWVudFxuXHRcdC8vY29uc29sZS5sb2coaW5kZXgpO1xuXHRcdC8vIERlbGV0ZSBvbGQgaW1hZ2Vcblx0XHR3aGlsZSAoY29udGFpbmVySW1hZ2UuZmlyc3RDaGlsZCkge1xuXHRcdFx0Y29udGFpbmVySW1hZ2UucmVtb3ZlQ2hpbGQoY29udGFpbmVySW1hZ2UuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXHRcdC8vIFB1dCBuZXcgaW1hZ2Vcblx0XHQvLyBFbMOpbWVudCA8RElWPlxuXHRcdGxpbmsgPSBzZXRBdHRyaWJ1dGVzKFwiZGxcIiwgW1wiaWRcIiwgXCJjbGFzc1wiXSwgW2pzb25baW5kZXhdLmlkLCBcImltYWdlXCIgKyBqc29uW2luZGV4XS5pZF0pO1xuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5rKTtcblx0XHQvLyBFbMOpbWVudHMgPFNQQU4+XG5cdFx0ZGVzYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkdFwiKTtcblx0XHQvLyBBdHRyaWJ1dGUgdGl0bGUgdGV4dFxuXHRcdGRlc2MuaW5uZXJUZXh0ID0ganNvbltpbmRleF0udGl0bGU7XG5cdFx0bGluay5hcHBlbmRDaGlsZChkZXNjKTtcblx0XHR2YXIgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkZFwiKTtcblx0XHRsaW5rLmluc2VydEJlZm9yZShjb250ZW50LCBkZXNjLm5leHRTaWJsaW5nKTtcblx0XHQvLyBFbMOpbWVudHMgPElNRz5cblx0XHQvLyBBdHRyaWJ1dGUgaW1hZ2Ugc291cmNlXG5cdFx0cGhvdG8gPSBzZXRBdHRyaWJ1dGVzKFwiaW1nXCIsIFtcInNyY1wiLCBcImFsdFwiXSwgW2pzb25baW5kZXhdLnNyYywganNvbltpbmRleF0udGl0bGVdKTtcblx0XHRjb250ZW50LmFwcGVuZENoaWxkKHBob3RvKTtcblx0fSBlbHNlIHtcblx0XHQvLyBDcmVhdGUgPGRvdHM+IGVsZW1lbnRzXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0Ly8gRWzDqW1lbnRzIDxMST5cblx0XHRcdGxpbmsgPSBzZXRBdHRyaWJ1dGVzKFwibGlcIiwgW1wiY2xhc3NcIl0sIFtcImxpbmtcIiArIGpzb25baV0uaWRdKTtcblx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5rKTtcblx0XHRcdC8vIEVsw6ltZW50cyA8QT5cblx0XHRcdGRlc2MgPSBzZXRBdHRyaWJ1dGVzKFwiYVwiLCBbXCJpZFwiLCBcImNsYXNzXCIsIFwiaHJlZlwiLCBcInRpdGxlXCJdLCBbXCJkZXNjXCIgKyBqc29uW2ldLmlkLCBcImRlc2NcIiArIGpzb25baV0uaWQsIFwiXCIsIGpzb25baV0udGl0bGVdKTtcblx0XHRcdC8vIEF0dHJpYnV0ZSB0aXRsZSB0ZXh0XG5cdFx0XHRkZXNjLmlubmVyVGV4dCA9IGpzb25baV0udGl0bGU7XG5cdFx0XHRsaW5rLmFwcGVuZENoaWxkKGRlc2MpO1xuXHRcdFx0Ly8gRWzDqW1lbnRzIDxJTUc+XG5cdFx0XHQvLyBBdHRyaWJ1dGUgaW1hZ2Ugc291cmNlXG5cdFx0XHRwaG90byA9IHNldEF0dHJpYnV0ZXMoXCJpbWdcIiwgW1wic3JjXCIsIFwiYWx0XCJdLCBbanNvbltpXS5zcmMsIGpzb25baV0udGl0bGVdKTtcblx0XHRcdGRlc2MuYXBwZW5kQ2hpbGQocGhvdG8pO1xuXHRcdH1cblx0fVxuXHQvLyBSZWxhbmNlIGxlIHBsYXllciBhdmVjIHVuIHRpbWVyIHLDqWluaXRpYWxpc8OpXG5cdGlmIChpc1BsYXllZCkge1xuXHRcdHBhdXNlKCk7XG5cdFx0cGxheSgpO1xuXHR9XG59XG5cblxuXG5mdW5jdGlvbiBnZXRJZCgpIHtcblx0dmFyIGlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RsJylbMF0uYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ2lkJykubm9kZVZhbHVlOyAvLyBPVSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGwnKVswXS5nZXRBdHRyaWJ1dGUoJ2lkJylcblx0cmV0dXJuIGlkO1xufVxuXG5cbi8vIE9uIGNyw6llIHVuZSBmb25jdGlvbiBhcHBlbMOpZSBkYW5zIGxlIGNhbGxiYWNrIGR1IGdlc3Rpb25uYWlyZSBkJ8OpdsOpbmVtZW50IHBsdXMgYmFzXG4vLyBhZmluIGRlIGNyw6llciB1bmUgY2xvc3VyZSA9PiBwb3J0w6llIGVuIGRlaG9ycyBkdSBnZXN0aW9ubmFpcmUgZCfDqXbDqW5lbWVudHNcbmZ1bmN0aW9uIGNhbGxiYWNrRm9ySWQoaXRlbSkge1xuXHRyZXR1cm4gZnVuY3Rpb24oZSkgeyAvLyBDbG9zdXJlIHRvIGtlZXAgZWFjaCBpdGVtIGluIGEgbG9jYWwgYW5kIG93biBzY29wZVxuXHRcdGUucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCBsaW5rcyA8YT4gZGVmYXVsdCBhY3Rpb25cblx0XHRjcmVhdGVFbGVtZW50cyhpbmZvc0ltYWdlLCBjb250YWluZXJJbWFnZSwgZmFsc2UsIG1heEltYWdlcywgaXRlbS5pZCk7XG5cdFx0YWRkQ2xhc3MoaW5mb3NJbWFnZSk7XG5cdH07XG59XG5cbi8vIEV4dGVybmFsaXNvbnMgbGEgY2FsbGJhY2sgZGFucyB1bmUgZm9uY3Rpb24gY2FsbGJhY2tGb3JJZCBxdWkgc2VyYSB1bmUgZmVybWV0dXJlXG5mdW5jdGlvbiBnZXRJbWFnZSgpIHtcblx0Y3JlYXRlRWxlbWVudHMoaW5mb3NNaW5pYXR1cmVzLCBjb250YWluZXJEb3RzLCB0cnVlLCBtYXhJbWFnZXMpO1xuXHRjcmVhdGVFbGVtZW50cyhpbmZvc0ltYWdlLCBjb250YWluZXJJbWFnZSwgZmFsc2UsIG1heEltYWdlcywgMCk7XG5cdGFkZENsYXNzKGluZm9zSW1hZ2UpO1xuXG5cdC8vY29uc29sZS5sb2coZG90cyk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SW1hZ2VzOyBpKyspIHtcblx0XHQvL2NvbnNvbGUubG9nKGRvdHNbaV0uYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ2NsYXNzJykubm9kZVZhbHVlKTtcblx0XHR2YXIgaXRlbSA9IGluZm9zSW1hZ2VbaV07XG5cdFx0ZG90c1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhbGxiYWNrRm9ySWQoaXRlbSksIGZhbHNlKTtcblx0fVxufVxuXG4vLyBQYXMgZCdleHRlcm5hbGlzYXRpb24gZGUgZm9uY3Rpb24sIG1haXMgdW5lIGTDqWNsYXJhdGlvbiBkZSBJSUZFXG4vL2Z1bmN0aW9uIGdldEltYWdlMigpIHtcbi8vXHRjcmVhdGVFbGVtZW50cyhpbmZvc01pbmlhdHVyZXMsIGNvbnRhaW5lckRvdHMsIHRydWUsIG1heEltYWdlcyk7XG4vL1x0Y3JlYXRlRWxlbWVudHMoaW5mb3NJbWFnZSwgY29udGFpbmVySW1hZ2UsIGZhbHNlLCBtYXhJbWFnZXMsIDApO1xuLy9cdGFkZENsYXNzKGluZm9zSW1hZ2UpO1xuLy9cdGZvciAodmFyIGkgPSAwOyBpIDwgbWF4SW1hZ2VzOyBpKyspIHtcbi8vXHRcdC8vY29uc29sZS5sb2coZG90c1tpXS5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbSgnY2xhc3MnKS5ub2RlVmFsdWUpO1xuLy9cdFx0dmFyIGl0ZW0gPSBpbmZvc0ltYWdlW2ldO1xuLy9cdFx0ZG90c1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChmdW5jdGlvbihpdGVtKSB7IC8vIElJRkUgdG8gZW5jYXBzdWxhdGUgY29kZVxuLy9cdFx0XHRyZXR1cm4gZnVuY3Rpb24oZSkgeyAvLyBDbG9zdXJlIHRvIGtlZXAgZWFjaCBpdGVtIGluIGEgbG9jYWwgYW5kIG93biBzY29wZVxuLy9cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCBsaW5rcyA8YT4gZGVmYXVsdCBhY3Rpb25cbi8vXHRcdFx0XHRjcmVhdGVFbGVtZW50cyhpbmZvc0ltYWdlLCBjb250YWluZXJJbWFnZSwgZmFsc2UsIG1heEltYWdlcywgaXRlbS5pZCk7XG4vL1x0XHRcdFx0YWRkQ2xhc3MoaW5mb3NJbWFnZSk7XG4vL1x0XHRcdH07XG4vL1x0XHQvLyBJbnZva2UgaW1tZWRpYXRlbHkgZnVuY3Rpb25cbi8vXHRcdH0pKGl0ZW0pLCBmYWxzZSk7XG4vL1x0fVxuLy99XG5cblxuZnVuY3Rpb24gbmV4dCgpIHtcblx0dmFyIGluZGV4ID0gZ2V0SWQoKTtcblx0aW5kZXgrKztcblx0aWYgKGluZGV4ID49IG1heEltYWdlcykge1xuXHRcdGluZGV4ID0gMDtcblx0fSBcbi8vXHRlbHNlIHtcbi8vXHRcdGluZGV4ID0gaW5kZXg7XG4vL1x0fVxuXHRjcmVhdGVFbGVtZW50cyhpbmZvc0ltYWdlLCBjb250YWluZXJJbWFnZSwgZmFsc2UsIG1heEltYWdlcywgaW5kZXgpO1xuXHRhZGRDbGFzcyhpbmZvc0ltYWdlKTtcblx0Ly8gUmVsYW5jZSBsZSBwbGF5ZXIgYXZlYyB1biB0aW1lciByw6lpbml0aWFsaXPDqVxuXHRpZiAoaXNQbGF5ZWQpIHtcblx0XHRwYXVzZSgpO1xuXHRcdHBsYXkoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwcmV2KCkge1xuXHR2YXIgaW5kZXggPSBnZXRJZCgpO1xuXHRpbmRleC0tO1xuXHRpZiAoaW5kZXggPCAwKSB7XG5cdFx0aW5kZXggPSBtYXhJbWFnZXMgLSAxO1xuXHR9IFxuLy9cdGVsc2Uge1xuLy9cdFx0aW5kZXggPSBpbmRleDtcbi8vXHR9XG5cdGNyZWF0ZUVsZW1lbnRzKGluZm9zSW1hZ2UsIGNvbnRhaW5lckltYWdlLCBmYWxzZSwgbWF4SW1hZ2VzLCBpbmRleCk7XG5cdGFkZENsYXNzKGluZm9zSW1hZ2UpO1xuXHQvLyBSZWxhbmNlIGxlIHBsYXllciBhdmVjIHVuIHRpbWVyIHLDqWluaXRpYWxpc8OpXG5cdGlmIChpc1BsYXllZCkge1xuXHRcdHBhdXNlKCk7XG5cdFx0cGxheSgpO1xuXHR9XG59XG5cbi8vIExhIGZvbmN0aW9uIHF1aSBcImpvdWVcIiBsZXMgaW1hZ2VzXG5mdW5jdGlvbiBwbGF5KCkge1xuXHQvLyBVbiBzZXRUaW1lb3V0IHBvdXIgbGFuY2VyIGwnaW1hZ2Ugc3VpdmFudGVcblx0ZGVsYXkgPSBzZXRUaW1lb3V0KG5leHQsIHNlY0R1cmF0aW9uICogMTAwMCk7XG5cdC8vIFVuIHNldFRpbWVvdXQgcG91ciBsYW5jZXIgbGUgcGxheSBnbG9iYWwgKHLDqWN1cnNpdml0w6kpXG5cdHRpbWVyID0gc2V0VGltZW91dChwbGF5LCBzZWNEdXJhdGlvbiAqIDEwMDApO1xuXHRpc1BsYXllZCA9IHRydWU7XG5cdHJldHVybiBpc1BsYXllZDtcbn1cblxuZnVuY3Rpb24gcGF1c2UoKSB7XG5cdGNsZWFyVGltZW91dChkZWxheSk7XG5cdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdGRlbGF5ID0gbnVsbDtcblx0dGltZXIgPSBudWxsO1xuXHRpc1BsYXllZCA9IGZhbHNlO1xuXHRyZXR1cm4gaXNQbGF5ZWQ7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBnZXRJbWFnZSgpLCBmYWxzZSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuZXh0LCBmYWxzZSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXZcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwcmV2LCBmYWxzZSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwbGF5LCBmYWxzZSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdXNlXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGF1c2UsIGZhbHNlKTtcblxuLy9mdW5jdGlvbiByZWN1cnNpb24oYyl7XG4vLyAgc2V0VGltZW91dChmdW5jdGlvbihjKXtcbi8vICAgICAgYyA9IGMgfHwgMDtcbi8vICAgICAgY29uc29sZS5sb2coYysrKTtcbi8vICAgICAgaWYoYyA9PSAxMCl7XG4vLyAgICAgICAgcmV0dXJuO1xuLy8gICAgICB9XG4vLyAgICAgIHJlY3Vyc2lvbihjKTtcbi8vICB9LFxuLy8gIDIwMDAsXG4vLyAgY1xuLy8gICk7XG4vL31cbi8vXG4vL3JlY3Vyc2lvbigpO1xuXG5cbiJdfQ==
