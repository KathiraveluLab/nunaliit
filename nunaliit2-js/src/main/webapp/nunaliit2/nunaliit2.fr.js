/*
  Nunaliit2 French Language Pack
*/
;(function($n2){

if( !$n2.l10n ) $n2.l10n = {};
if( !$n2.l10n.strings ) $n2.l10n.strings = {};	
if( !$n2.l10n.strings['fr'] ) $n2.l10n.strings['fr'] = {};

function loadStrings(strings) {
	var dic = $n2.l10n.strings['fr'];
	for(var key in strings) {
		dic[key] = strings[key];
	};
};

loadStrings({
	// Language: fr
	" definition (":" définition ("
	," definition (index: ":" définition (indice: "
	," definition null and skipped.":" définition nulle et ignorée"
	," definition: ":" définition"
	,"(by {author})":"(par {author})"
	,"<Unknown error>":"<Erreur inconnue>"
	,"A filter function must be supplied":"Un filtre doit être donné"
	,"A list must be provided for refining":"Durant une spécialisation, une liste doit être donnée"
	,"A list name must be supplied":"Un nom de liste doit être donné"
	,"A name must be provided when refining a list":"Durant une spécialisation, un nom doit être donné"
	,"A valid schema must be provided":"Un schème valide doit être donné"
	,"Add":"Ajouter"
	,"Add Contribution":"Ajouter un contribution"
	,"Add File":"Ajouter un fichier"
	,"Add Layer":"Ajouter Couche"
	,"Add Related":"Relier"
	,"Add Related Item":"Relier"
	,"Add Relation":"Relier"
	,"Add a line to the map":"Ajouter une ligne à la carte"
	,"Add a point to the map":"Ajouter un point à la carte"
	,"Add a polygon to the map":"Ajouter un polygone à la carte"
	,"Add or Edit a Map Feature":"Modifier la Carte"
	,"All Documents":"Tous les documents"
	,"All LineString Geometries":"Toutes les géométries de lignes"
	,"All Point Geometries":"Toutes les géométries de points"
	,"All Polygon Geometries":"Toutes les géométries de polygones"
	,"All documents containing {searchTerm}":"Tous les documents contenant {searchTerm}"
	,"All documents filtered by script":"Tous les documents filtré par un programme"
	,"Attach":"Joindre"
	,"Attachment":"Pièce jointe"
	,"Attachment: ":"Pièce jointe: "
	,"Author":"Auteur"
	,"Back":"Retour"
	,"Brief":"Brève Affichage"
	,"CSS":"CSS"
	,"Can not perform file uploads unless jquery.form.js is included":"jquery.form.js est nécessaire pour le téléchargement de fichier"
	,"Cancel":"Annuler"
	,"Cancel Feature Editing":"Annuler les modifications"
	,"Cancelling Operation...":"Annuler l'opération..."
	,"Clear":"Vider"
	,"Confirm":"Confirmer"
	,"Contribution":"Contribution"
	,"Create User":"Création d'usager"
	,"Create a new user":"Créer un nouvel usager"
	,"Created by":"Créer par"
	,"Data Modification Application":"Application de modification des données"
	,"Date":"Date"
	,"Delete":"Supprimer"
	,"Deletion Progress":"Progrès de suppression"
	,"Demo Document":"Document de Démonstration"
	,"Demo Media":"Média de Démonstration"
	,"Description":"Description"
	,"Display":"Affichage"
	,"Do you really want to delete this feature?":"Voulez-vous vraiment supprimer cette géométrie?"
	,"Do you really wish to delete the {count} document(s) referenced by this list?":"Désirez-vous supprimer les {count} document(s) contenu dans cette liste?"
	,"Do you wish to delete this element?":"Désirez-vous supprimer cet élément?"
	,"Doc ids must be supplied when creating a list from document ids":"Les identificateurs de documents doit être donnés durant la création de cette liste"
	,"Documents from schema type {schemaName}":"Documents de type de schème {schemaName}"
	,"Done":"Complété"
	,"E-mail":"Couriel"
	,"Edit":"Modifier"
	,"Editor View":"Perspective d'Éditeur"
	,"Error":"Erreur"
	,"Error creating ":"Erreur de création"
	,"Error during export":"Erreur pendant l'exportation"
	,"Error occurred with progress service":"Erreur avec service de progrès"
	,"Error while uploading: ":"Erreur de téléchargement"
	,"Error: query error while verifying ":"Erreur: la vérification a échoué"
	//no longer in use: "Error: query error while verifying "
	,"Error: query error while verifying {label} definition ({key})":"Erreur: interrogation échouée lors de la vérification de la définition {label} ({key})"
	,"Errors in process: {count}.":"Nombre d'erreurs: {count}"
	,"Export":"Exporter"
	,"Export Geometries":"Exportation des géométries"
	,"Export service is not available":"Le service d'exportation n'est pas en ligne"
	,"Export service is not configured":"Le service d'exportation n'est pas configuré"
	,"Exporting":"Exportation en marche"
	,"Extent (Max X)":"Étendue (max x)"
	,"Extent (Max Y)":"Étendue (max y)"
	,"Extent (Min X)":"Étendue (min x)"
	,"Extent (Min Y)":"Étendue (min y)"
	,"Failure to delete {docId}":"Impossible de supprimer {docId}"
	,"Failure to fetch {docId}":"Impossible d'obtenir {docId}"
	,"Failure to save {docId}":"Impossible de sauvegarder {docId}"
	,"Fetching All Document Ids":"Obtention de tous les identificateurs de document"
	,"File":"Fichier"
	,"File Name":"Nom du fichier"
	,"File Uploaded":"Fichier téléchargé"
	,"File is not currently available":"Le ficher n'est pas disponible"
	,"Fill Out Related Document":"Entrer l'information"
	,"Find on Map":"Trouver sur la Carte"
	,"First Name":"Prénom"
	,"Form":"Formulaire"
	,"Form View":"Perspective Formulaire"
	,"From":"De"
	,"Function is required on transformation":"Une fonction est nécessaire durant les transformations"
	,"Geometries from layer {layerName}":"Les géométries de la couche {layerName}"
	,"Geometry":"Géometrie"
	,"Guest Login":"Session pour visiteur"
	,"Hover Sound":"Son descriptif"
	,"Hover Sound?":"Son descriptif?"
	,"ID":"ID"
	,"In reply to":"En réplique à"
	,"Introduction":"Introduction"
	,"Invalid e-mail and/or password":"Problème avec votre nom d'usager ou votre mot de passe"
	,"Javascript":"Javascript"
	,"Javascript Replace":"Remplacer par Javascript"
	,"Key already in use: ":"Clé déjà utilisée: "
	,"Label":"Intitulé"
	,"Language":"Langue"
	,"Last Name":"Dernier Nom"
	,"Last updated by":"Mis-à jour par"
	,"Layer":"Couche"
	,"Layer Definition":"Définition de Couche"
	,"Layer Selector":"Sélecteur de couches"
	,"Layer name":"Nom de couche"
	,"Layers":"Couches"
	,"List Creation Progress":"Progrès de la création de liste"
	,"List Refinement Progress":"Progrès du refinement de liste"
	,"List is required on transformation":"Une liste est nécessaire durant les transformations"
	,"Login":"Ouvrir session"
	,"Logout":"Fermer session"
	,"Logs":"Journal"
	,"Media":"Média"
	,"Module":"Module"
	,"More Info":"Détails"
	,"Must enter a layer name":"Nom de couche manquant"
	,"Must enter a schema name":"Nom de schème manquant"
	,"Name":"Nom"
	,"Name of new list":"Nom de la nouvelle liste"
	,"No Document":"Aucun document"
	,"No document modified.":"Aucun document modifié."
	,"No list Selected":"Aucune liste sélectionée"
	,"No media found on {docId}":"Aucun média trouvé avec {docId}"
	,"Nunaliit Atlas":"Atlas Nunaliit"
	,"OK":"Accepter"
	,"Operation cancelled by user":"Opération annulée par l'usager"
	,"Order":"Ordre"
	,"Original String":"Chaîne de caractères originale"
	,"Password":"Mot de Passe"
	,"Password should have at least 6 characters":"Le mot de passe devrait contenir au moins 6 caractères"
	,"Please login":"Ouverture de session"
	,"Problem obtaining documents from layer":"Problème détecté pendant l'obtention des documents d'une couche"
	,"Problem obtaining documents from schema":"Problème détecté pendant l'obtention des documents d'un type de schème"
	,"Proceed":"Procéder"
	,"Process completed.":"Processus complété."
	,"Progress":"Progrès"
	,"Queries":"Interrogations"
	,"Re-Submit Media":"Resoumettre les média"
	,"Reference":"Référence"
	,"Reference:":"Référence:"
	,"Refine List":"Spécialiser la liste"
	,"Relation: ":"Relation"
	,"Remove":"Supprimer"
	,"Replace Text":"Texte de remplacement"
	,"Required fields missing for ":"Champs nécessaires manquants pour "
	,"Reset":"Redémarrer"
	,"Revision":"Version"
	,"Roles":"Roles"
	,"Root Schema":"Schème de Base"
	,"STOPPING: Failed verifying view ":"ARRET. Impossible de vérifier la perspective. "
	,"Save":"Sauvegarder"
	,"Schema":"Schème"
	,"Scroll Map":"Faire défiler la carte"
	,"Search":"Rechercher"
	,"Search error:":"Erreur durant la recherche"
	,"Search results empty":"Recherche sans résultats"
	,"Search term":"Terme recherché"
	,"Search:":"Rechercher:"
	,"Select Document":"Choisir Document"
	,"Select Document Schema":"Choisir un schème de document"
	,"Select Document Transform":"Choisir une transformation de document"
	,"Select Layers":"Choisir couches"
	,"Select Search Filter":"Choisir un filtre de recherche"
	,"Select a media":"Choisir un média"
	,"Select a schema":"Choisir un schème"
	,"Select a schema:":"Choisir un schème:"
	,"Select documents from a schema type":"Choisir les documents d'un type de schème"
	,"Select from Javascript":"Choisir à partir de Javascript"
	,"Select geometries from a layer":"Choisir les géométries d'une couche"
	,"Select schema":"Choisir un schème"
	,"Temporary View":"Perspective temporaire"
	,"Test Temporary View":"Tester une perspective temporaire"
	,"Text Replace":"Remplacer le texte"
	,"Text Search":"Rechercher un texte"
	,"The projection {srsName} is not supported. Atlas may no function properly.":"La projection {srsName} n'est pas disponible, L'atlas pourrait tomber en panne."
	,"The two passwords should match":"Les deux mots de passe devrait être pareils"
	,"This object is being modified. Do you wish to continue and revert current changes?":"L'objet en cours d'être modifié. Désirez-vous continuer?"
	,"Title":"Titre"
	,"To":"À"
	,"Tranform":"Transformer"
	,"Transform Progress":"Progrès de la transformation"
	,"Transformations completed with some failures":"Transformations complétées. Erreurs détectées."
	,"Transformations completed. Successful: {ok} Failures: {fail} Skipped: {skipped}":"Transformations complétées. Accomplies: {ok} Erreurs: {fail} Ignorées: {skipped}"
	,"Translation":"Traduction"
	,"Tree View":"Perspective en Arbre"
	,"Type of refinement":"Type de spécialisation"
	,"Unable to create a new list":"Impossible de créer une nouvelle liste"
	,"Unable to create user: ":"La création d'usager a échoué"
	,"Unable to display brief description":"Impossible d'afficher la brève description"
	,"Unable to display document":"Impossible d'afficher le document"
	,"Unable to fetch schema":"Impossible d'obtenir le schème"
	,"Unable to find document search filter":"Impossible de trouver le filtre de recherche"
	,"Unable to find document transform":"Impossible de trouver la transformation"
	,"Unable to find search filter":"Impossible de trouver le filtre de recherche"
	,"Unable to obtain document {docId}":"Impossible d'obtenir le document {docId}"
	,"Unable to obtain list of layers":"Impossible d'obtenir la liste des couches"
	,"Unable to obtain list of schemas":"Impossible d'obtenir la liste des schèmes"
	,"Unable to parse JSON string: ":"Incapable de lire l'expression JSON: "
	,"Unable to parse key: ":"Incapable de comprendre la clé: "
	,"Unable to retrieve document":"Impossible de trouver le document"
	,"Unable to retrieve documents":"Impossible de trouver les documents"
	,"Uncategorized":"Sans catégorie"
	,"Unknown Filter":"Filtre inconnu"
	,"Unknown List":"Liste inconnue"
	,"Unknown Transform":"Transformation inconnue"
	,"Upload":"Télécharger"
	,"Upload service can not be reached. Unable to submit a related document.":"Le service de téléchargement n'est pas disponible."
	,"User":"Usager"
	,"User Creation":"Creation d'un Usager"
	,"User name should have at least 3 characters":"Le nom d'usager devrait avoir au moins 3 caractères"
	,"View":"Afficher"
	,"View Media":"Visualiser le Média"
	,"Welcome":"Bienvenue"
	,"You are about to delete this document. Do you want to proceed?":"Voulez-vous vraiment supprimer ce document?"
	,"You are about to leave this page. Do you wish to continue?":"Vous quittez cette page. Voulez-vous continuer?"
	,"You must enter a valid function":"Vous devez soumettre une fonction valide"
	,"You must leave the atlas to view this file.":"Vous devez quitter l'atlas pour accéder à ce fichier."
	,"Your file was uploaded and will become available when it has been approved.":"Votre fichier est téléchargé. Il sera disponible lorsqu'un adminitrateur l'aura approuvé"
	,"Zoom In":"Rapprocher la carte"
	,"Zoom Out":"Eloigner la carte"
	,"a Checkbox":"une Boîte"
	,"a Number":"un Chiffre"
	,"a String":"une Chaîne de Caractères"
	,"an Array":"une Chaîne"
	,"an Object":"un Objet"
	,"an image":"une image"
	,"confirm password":"vérifier le mot de passe"
	,"display name":"nom d'affichage"
	,"empty":"vide"
	,"id":"id"
	,"is":"est"
	,"password":"mot de passe"
	,"search the atlas":"recherche de l'atlas"
	,"top":"en haut"
	,"user name":"Nom d'usager"
	,"{count} document(s)":"{count} document(s)"
	,"{count} document(s) modified.":"{count} document(s) modifiés."
	,"{docId} deleted":"{docId} supprimé"
	,"{docId} transformed and saved":"{docId} transformé et sauvegardé"
	,"{label} definition ({key}) already exists - not loaded or updated":"Définition {label} ({key}) existe déjà - ignorée"
});
	
})(nunaliit2);