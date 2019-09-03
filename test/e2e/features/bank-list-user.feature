@bank @bankList @bankListUser
Feature: consultation banque d'un utilisateur
    En tant que contact d'un utilisateur accédant à l’application
    Je veux consulter sa banque
    Afin de me renseigner sur les pokemons qu'il possède

    Background:
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré

    Scenario: accès à la banque d'un utilisateur
        Given l'utilisateur "Test" possède le pokemon "PokeTest"
        When je me rend sur la banque de l'utilisateur "Test"
        Then le titre de la page est "Banque de Test"
        And la liste des pokemons contient l'espèce "PokeTest"

    Scenario: seul les pokemon de l'utilisateur sont affichés
        Given l'utilisateur "anotherUser" possède le pokemon "PokeTest2"
        When je me rend sur la banque de l'utilisateur "Test"
        Then le titre de la page est "Banque de Test"
        And la liste des pokemons ne contient pas l'espèce "PokeTest2"