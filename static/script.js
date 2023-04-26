const addExpenseForm = document.querySelector('#add-expense-form');
const addIncomeForm = document.querySelector('#add-income-form');
const addButton = document.querySelector('.add-button');

addExpenseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const { value: expenseName } = document.querySelector('#expense-name');
  const { value: expenseAmount } = document.querySelector('#expense-amount');
  const { value: expenseCategory } = document.querySelector('#expense-category');
  const { value: expenseDate } = document.querySelector('#expense-date');

  fetch('/ajouter_depense', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: expenseName,
      montant: expenseAmount,
      categorie: expenseCategory,
      date: expenseDate
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
});

addIncomeForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const { value: incomeName } = document.querySelector('#income-name');
  const { value: incomeAmount } = document.querySelector('#income-amount');
  const { value: incomeDate } = document.querySelector('#income-date');

  fetch('/ajouter_revenu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: incomeName,
      montant: incomeAmount,
      date: incomeDate
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
});

addButton.addEventListener('click',()=>{location.reload()});

//let table = document.getElementById("report-table");

// Récupérer les données CSV
//fetch('static/depenses.csv')
//  .then(response => response.text())
//  .then(data => {
//    let depensesData = Papa.parse(data, { header: true }).data;
    // Ajouter une ligne à la table pour chaque dépense
//    let size = Object.keys(depensesData).length;
//    let i = 1;
//    depensesData.forEach((depense) => {
//        if(size!=i) {
//            i++;
//            let row = table.insertRow(-1);
//            let Nom = row.insertCell(0);
//            let Montant = row.insertCell(1);
//            let Categorie = row.insertCell(2);
//            let Date = row.insertCell(3);
//            Nom.innerHTML = depense.nom;
//            Montant.innerHTML = depense.montant;
//            Categorie.innerHTML = depense.categorie;
//            Date.innerHTML = depense.date;
//        }    
//    });
//  });

// Sélectionner les éléments HTML nécessaires
let datePicker = document.getElementById('date-picker');
let showDataButton = document.getElementById('show-data-button');
let chart;

// Ajouter un gestionnaire d'événement pour le clic sur le bouton
showDataButton.addEventListener('click', () => {
  // Récupérer la date sélectionnée
  let selectedDate = datePicker.value;

  // Récupérer les données CSV
  fetch('static/depenses.csv')
    .then(response => response.text())
    .then(data => {
      let depensesData = Papa.parse(data, { header: true }).data;

      // Filtrer les données CSV en ne gardant que celles qui correspondent au mois et à l'année sélectionnés
      let filteredData = depensesData.filter((depense) => {
        let depenseDate = moment(depense.date, "YYYY-MM-DD");
        return depenseDate.year() === parseInt(selectedDate.slice(0, 4)) && depenseDate.month() === parseInt(selectedDate.slice(5)) - 1;
      });

      // Préparer les données pour le graphique
      let categories = [];
      let montants = [];
      filteredData.forEach((depense) => {
        if (depense.categorie !== "") {
          let index = categories.indexOf(depense.categorie);
          if (index === -1) {
            categories.push(depense.categorie);
            montants.push(parseFloat(depense.montant));
          } else {
            montants[index] += parseFloat(depense.montant);
          }
        }
      });

      if (categories.length === 0 || montants.length === 0) {
        alert("Aucune donnée disponible pour le mois sélectionné.");
        return;
      }

      // Détruire le graphique précédent s'il existe
      if (chart) {
        chart.destroy();
      }

      // Créer le graphique
      let ctx = document.getElementById('report-chart').getContext('2d');
      chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [{
            label: 'Montant utilisé',
            data: montants,
            backgroundColor: ['38DD7BF','#FFD872','#6C88C4','#FF5768','#C05780','#4DD091','#00B0BA'],
            borderWidth: 0
          }]
        },
        options: {
            plugins: {
                legend: {
                  display:true,
                  position: 'left',
                }
            },
          responsive:true,
          scales: {
            yAxes: [{
              gridlines:{
                drawBorder:false
              },
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
});

// Sélectionner les éléments HTML nécessaires
let date2Picker = document.getElementById('date2-picker');
let show2DataButton = document.getElementById('show-data2-button');
let chart2;

// Ajouter un gestionnaire d'événement pour le clic sur le bouton
show2DataButton.addEventListener('click', () => {
  // Récupérer la date sélectionnée
  let selectedDate = date2Picker.value;

  // Récupérer les données de dépenses CSV
  fetch('static/depenses.csv')
    .then(response => response.text())
    .then(depensesData => {
      // Parse CSV data and filter by selected month and year
      depensesData = Papa.parse(depensesData, { header: true }).data;
      let depensesFiltered = depensesData.filter((depense) => {
        let depenseDate = moment(depense.date, "YYYY-MM-DD");
        return depenseDate.year() === parseInt(selectedDate.slice(0, 4)) && depenseDate.month() === parseInt(selectedDate.slice(5)) - 1;
      });

      // Calculate total dépenses for the selected month and year
      let totalDepenses = depensesFiltered.reduce((acc, depense) => acc + parseFloat(depense.montant), 0);

      // Récupérer les données de revenus CSV
      fetch('static/revenus.csv')
        .then(response => response.text())
        .then(revenusData => {
          // Parse CSV data and filter by selected month and year
          revenusData = Papa.parse(revenusData, { header: true }).data;
          let revenusFiltered = revenusData.filter((revenu) => {
            let revenuDate = moment(revenu.date, "YYYY-MM-DD");
            return revenuDate.year() === parseInt(selectedDate.slice(0, 4)) && revenuDate.month() === parseInt(selectedDate.slice(5)) - 1;
          });

          // Calculate total revenus for the selected month and year
          let totalRevenus = revenusFiltered.reduce((acc, revenu) => acc + parseFloat(revenu.montant), 0);

          // Préparer les données pour le graphique
          let categories2 = ['Dépenses', 'Revenus'];
          let montants = [totalDepenses, totalRevenus];

          if (totalDepenses === 0 && totalRevenus === 0) {
            alert("Aucune donnée disponible pour le mois sélectionné.");
            return;
          }

          // Détruire le graphique précédent s'il existe
          if (chart2) {
            chart2.destroy();
          }

          // Créer le graphique
          let ctx = document.getElementById('report2-chart').getContext('2d');
          chart2 = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: categories2,
              datasets: [{
                label: 'Montant',
                data: montants,
                backgroundColor: ['#FF5768', '#4DD091'],
                borderWidth: 0
              }]
            },
            options: {
                plugins: {
                    legend: {
                      display:true,
                      position: 'right',
                    }
                },  
              responsive:true,
              scales: {
                yAxes: [{
                  gridlines:{
                    drawBorder:false
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        });
    });
});