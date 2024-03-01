const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';
const moment = require('moment');


async function getAllEmployeeUnavailability() {
  let unavailability = [];
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const appointments = await db.collection('AssignmentAppointment').find().toArray();
    client.close();

    for(let i = 0; i < appointments.length; i++){
      for(let j = 0; j < appointments[i].assignments.length; j++){4
        if(appointments[i].assignments[j][4] != 2){
          unavailability.push(
            {
              "employee": appointments[i].assignments[j][0]._id,
              "start": appointments[i].assignments[j][2],
              "end": appointments[i].assignments[j][3],
            }
          )
        }
      }
    }

    return unavailability;

  } catch (error) {
    console.error(error);
    throw error;
  }
}
module.exports = getAllEmployeeUnavailability;






function trouverIntersections(intervals) {
  if (intervals.length <= 1) {
    return []; // Pas d'intersection avec un seul intervalle ou aucun
  }

  // Tri des intervalles par ordre croissant de la date de début
  intervals.sort((a, b) => new Date(a.start) - new Date(b.start));

  const intersections = [];

  for (let i = 0; i < intervals.length - 1; i++) {
    const currentInterval = intervals[i];
    const nextInterval = intervals[i + 1];

    const currentEnd = new Date(currentInterval.end);
    const nextStart = new Date(nextInterval.start);

    if (currentEnd >= nextStart) {
      // Il y a une intersection, ajoutons-la au tableau des intersections
      intersections.push({
        start: nextInterval.start,
        end: currentEnd <= nextInterval.end ? currentInterval.end : nextInterval.end,
      });
    }
  }

  return intersections;
}
module.exports = trouverIntersections;







function generateAvailableSlots(workingHours, employeeIndisponibilites, daysToGenerate, serviceDuration) {
  const availableSlotsForWeek = [];

  // Générer pour les 7 prochains jours, en excluant les lundis
  for (let i = 1; i < daysToGenerate + 1; i++) {
    const currentDate = moment().add(i, 'days');

    // Exclure les lundis
    if (currentDate.day() !== 1) {
      const startOfDay = moment(workingHours.start, 'HH:mm').set({
        year: currentDate.year(),
        month: currentDate.month(),
        date: currentDate.date(),
      });
      const endOfDay = moment(workingHours.end, 'HH:mm').set({
        year: currentDate.year(),
        month: currentDate.month(),
        date: currentDate.date(),
      });

      const allSlots = [];
      let currentSlot = startOfDay.clone();
      while (currentSlot.isBefore(endOfDay)) {
        allSlots.push(currentSlot.format('YYYY-MM-DDTHH:mm'));
        currentSlot.add(serviceDuration, 'minutes');
      }

      const unavailableSlots = allSlots.filter(slot => {
        for (const indisponibilite of employeeIndisponibilites) {
          const startIndispo = moment(indisponibilite.start);
          const endIndispo = moment(indisponibilite.end);
          if (moment(slot, 'YYYY-MM-DDTHH:mm').isBetween(startIndispo, endIndispo, null, '[]')) {
            return true; // Indisponible
          }
        }
        return false; // Disponible
      });

      const availableSlots = allSlots.filter(slot => !unavailableSlots.includes(slot));

      if (availableSlots.length > 0) {
        const resultObject = {};
        resultObject[i] = availableSlots;
        availableSlotsForWeek.push(resultObject);
      }
    }
  }

  return availableSlotsForWeek;
}
module.exports = generateAvailableSlots;


  /*const intervals = [
    {
      start: '2024-03-03T08:00',
      end: '2024-03-03T10:00'
    },
    {
      start: '2024-03-03T08:00',
      end: '2024-03-03T10:00'
    },
    {
      start: '2024-03-03T08:00',
      end: '2024-03-03T10:00'
    }
  ];

  getAllEmployeeUnavailability()
  .then(result => {
    console.log(result); // Vous pouvez utiliser la liste des AssignmentAppointment ici
    const results = trouverIntersections(result);

    // Exemple d'utilisation
    const workingHours = { start: '07:00', end: '18:00' };
    
    
    const availableSlots = generateAvailableSlots(workingHours, results, 7);
    console.log(availableSlots);
    
  })
  .catch(error => {
    console.error(error);
  });
  
  */


