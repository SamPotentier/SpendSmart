from flask import Flask, render_template, request, redirect
import csv

app = Flask(__name__)

@app.route('/')
def accueil():
    depenses = []
    with open('static/depenses.csv', mode='r') as fichier:
        reader = csv.reader(fichier)
        for row in reader:
            depenses.append(row)
    revenus = []
    with open('static/revenus.csv', mode='r') as fichier:
        reader = csv.reader(fichier)
        for row in reader:
            revenus.append(row)
    return render_template('accueil.html', depenses=depenses, revenus=revenus)

@app.route('/ajouter_revenu', methods=['POST'])
def ajouter_revenu():
    donnees = request.get_json()
    nom = donnees['nom']
    montant = donnees['montant']
    date = donnees['date']
    with open('static/revenus.csv', mode='a', newline='') as fichier:
        writer = csv.writer(fichier)
        writer.writerow([nom, montant, date])
    return 'Revenu ajouté avec succès'

@app.route('/ajouter_depense', methods=['POST'])
def ajouter_depense():
    categorie = request.json['categorie']
    nom = request.json['nom']
    montant = request.json['montant']
    date = request.json['date']
    with open('static/depenses.csv', mode='a', newline='') as fichier:
        writer = csv.writer(fichier)
        writer.writerow([categorie, nom, montant, date])
    return 'Dépense ajouté avec succès'