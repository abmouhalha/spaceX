$(document).ready(function() {
    $.ajax({
      url: 'https://api.spacexdata.com/v4/launches/next',
      method: 'GET',
      success: function(response) {
        updateNextLaunch(response);
      },
      error: function(error) {
        console.log('Erreur lors de la récupération du prochain lancement SpaceX : ' + error);
      }
    });
  });
  
  function updateNextLaunch(nextLaunch) {
    var nextLaunchElement = $('#next-launch-section');
    nextLaunchElement.empty(); // Vider la section du prochain lancement
  
    if (nextLaunch) {
      // Créer un élément pour afficher le titre "Prochain lancement"
      var titleElement = $('<h2></h2>').text('Prochain lancement');
      nextLaunchElement.append(titleElement);
  
      // Ajouter la date du prochain lancement
      var dateElement = $('<p></p>').text('Date du prochain lancement : ' + nextLaunch.date_local);
      nextLaunchElement.append(dateElement);
  
      // Ajouter le nom du prochain lancement
      var nameElement = $('<h3></h3>').text('Nom du prochain lancement : ' + nextLaunch.name);
      nextLaunchElement.append(nameElement);
  
      // Ajouter le décompte en temps réel
      var countdownElement = $('<p></p>').text('Décompte en temps réel : ');
      var countdownValueElement = $('<span></span>');
      countdownElement.append(countdownValueElement);
      nextLaunchElement.append(countdownElement);
  
      // Mettre à jour le décompte en temps réel
      updateCountdown(nextLaunch.date_unix, countdownValueElement);
    }
  }
  
  function updateCountdown(targetTimestamp, countdownElement) {
    var intervalId = setInterval(function() {
      var currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
      var remainingTime = targetTimestamp - currentTime; // Temps restant jusqu'au lancement en secondes
  
      // Vérifier si le temps restant est écoulé
      if (remainingTime >= 0) {
        clearInterval(intervalId);
        countdownElement.text('Lancement en cours');
      } else {
        // Convertir le temps restant en heures, minutes et secondes
        var hours = Math.floor(remainingTime / 3600);
        var minutes = Math.floor((remainingTime % 3600) / 60);
        var seconds = remainingTime % 60;
  
        // Formater le décompte en temps réel
        var countdownText = hours.toString().padStart(2, '0') + ':' +
                            minutes.toString().padStart(2, '0') + ':' +
                            seconds.toString().padStart(2, '0');
  
        countdownElement.text(countdownText);
      }
    }, 1000); // Mettre à jour le décompte toutes les secondes
  }
  