$(document).ready(function() {
  $.ajax({
    url: 'https://api.spacexdata.com/v4/launches',
    method: 'GET',
    success: function(response) {
      console.log(response);

      $('#launch-filter').on('change', function() {
        var selectedOption = $(this).val();
        var filteredLaunches = filterLaunches(response, selectedOption);
        updateLaunchList(filteredLaunches);
      });

      // Afficher tous les lancements par défaut
      updateLaunchList(response);
    },
    error: function(error) {
      console.log(error);
    }
  });
});

function filterLaunches(launches, option) {
  if (option === 'success') {
    return launches.filter(function(launch) {
      return launch.success === true;
    });
  } else if (option === 'failure') {
    return launches.filter(function(launch) {
      return launch.success === false;
    });
  } else {
    return launches;
  }
}

function updateLaunchList(launches) {
  var launchListElement = $('#launch-list');
  launchListElement.empty(); // Vider la liste actuelle des lancements

  for (var i = 0; i < launches.length && i < 10; i++) {
    var launch = launches[i];

    // Créer une section pour chaque lancement
    var launchSection = $('<section class="launch"></section>');

    // Ajouter le nom du lancement
    var nameElement = $('<h3></h3>').text(launch.name);
    launchSection.append(nameElement);

    // Ajouter la date du lancement au format Jour/Mois/Année
    var date = new Date(launch.date_utc);
    var formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    var dateElement = $('<p></p>').text('Date du lancement : ' + formattedDate);
    launchSection.append(dateElement);

    // Ajouter le texte de détail de la mission
    var detailsElement = $('<p></p>').text('Détails de la mission : ' + launch.details);
    launchSection.append(detailsElement);

    // Ajouter l'image d'illustration de la mission
    if (launch.links && launch.links.patch && launch.links.patch.small) {
      var imageElement = $('<img>').attr('src', launch.links.patch.small);
      launchSection.append(imageElement);
    }

    // Ajouter le bouton pour l'article
    if (launch.links && launch.links.article) {
      var articleButton = $('<a></a>')
        .attr('href', launch.links.article)
        .attr('target', '_blank')
        .html('<i class="fas fa-newspaper"></i> Lire l\'article');
      launchSection.append(articleButton);
    }

    // Ajouter le bouton pour la vidéo YouTube
    if (launch.links && launch.links.webcast) {
      var youtubeButton = $('<a></a>')
        .attr('href', launch.links.webcast)
        .attr('target', '_blank')
        .html('<i class="fab fa-youtube"></i> Vidéo YouTube');
      launchSection.append(youtubeButton);
    }

    // Ajouter le nom du lieu de lancement
    if (launch.launchpad && launch.launchpad.name) {
      var launchpadElement = $('<p></p>').text('Lieu de lancement : ' + launch.launchpad.name);
      launchSection.append(launchpadElement);
    }

    // Ajouter les noms des chargements envoyés
    if (launch.payloads && launch.payloads.length > 0) {
      var payloadsElement = $('<p></p>').text('Chargements envoyés : ');
      var payloadsList = $('<ul></ul>');

      launch.payloads.forEach(function(payload) {
        if (payload.name) {
          var payloadItem = $('<li></li>').text(payload.name);
          payloadsList.append(payloadItem);
        }
      });

      payloadsElement.append(payloadsList);
      launchSection.append(payloadsElement);
    }

    // Ajouter les noms des clients qui ont envoyé des chargements
    if (launch.payloads && launch.payloads.length > 0) {
      var clientsElement = $('<p></p>').text('Clients ayant envoyé des chargements : ');
      var clientsList = $('<ul></ul>');

      launch.payloads.forEach(function(payload) {
        if (payload.customers && payload.customers.length > 0) {
          payload.customers.forEach(function(customer) {
            var customerItem = $('<li></li>').text(customer);
            clientsList.append(customerItem);
          });
        }
      });

      clientsElement.append(clientsList);
      launchSection.append(clientsElement);
    }

    // Ajouter la section du lancement à la liste des lancements
    launchListElement.append(launchSection);
  }
}
