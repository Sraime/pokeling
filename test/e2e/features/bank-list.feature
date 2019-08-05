@bank
Feature: consultation de la banque
    En tant qu'utilisateur connecté
    Je veux voir la liste des pokemons que je possède
    Afin de connaitre son contenu

    Scenario: affichage de la liste
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré
        And l'utilisateur "Test" possède le pokemon "PokeTest"
        And je suis connecté avec l'email "test.test@test.fr" avec le mdp "AZERTY01"
        When je suis sur l'écran de la ma banque
        Then la liste de mes pokemons est affichée
        And la liste de mes pokemons contient l'espèce "PokeTest"