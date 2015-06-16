function displayPics()
{
	var photos = document.getElementById('galerie_mini') ;
	// On r�cup�re l'�l�ment ayant pour id galerie_mini
	var liens = photos.getElementsByTagName('a') ;
	// On r�cup�re dans une variable tous les liens contenu dans galerie_mini
	var big_photo = document.getElementById('big_pict') ;
	// Ici c'est l'�l�ment ayant pour id big_pict qui est r�cup�r�, c'est notre photo en taille normale
	var titre_photo = document.getElementById('photo').getElementsByTagName('dt')[0] ;
	// Et enfin le titre de la photo de taille normale
	
	for(var i = 0 ; i < liens.length ; i++)
	// Une boucle parcourant l'ensemble des liens contenu dans galerie_mini
	// Version DOM 0
	/*{
		liens[i].onclick = function()
		// Au clique sur ces liens
		{
			big_photo.src = this.href ; // On change l'attribut src de l'image en le rempla�ant par la valeur du lien
			big_photo.alt = this.title ; // On change son titre
			titre_photo.firstChild.nodeValue = this.title ; // On change le texte de titre de la photo
			return false ; // Et pour finir on inhibe l'action r�elle du lien
		}
	}*/
	// Version DOM 2
		{
		liens[i].addEventListener('click', function(evt)
		// Au clique sur ces liens
		{
			evt.preventDefault();
			big_photo.src = evt.currentTarget.href;
			big_photo.alt = evt.currentTarget.title;
			titre_photo.firstChild.nodeValue = evt.currentTarget.title;
		}, false);
	}
}

window.onload = displayPics ;
// Il ne reste plus qu'� appeler notre fonction au chargement de la page