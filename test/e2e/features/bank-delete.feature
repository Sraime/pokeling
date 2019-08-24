@bank @bankDelete
Feature: suppresion d'un pokemon dand la banque
    En tant que utilisateur connecté
    Je veux spprimer un pokemon de ma banque
    Afin de le retirer de ma collection suite à un échange ou à une erreur de saisie

    Background:
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré
        And je suis connecté avec l'email "test.test@test.fr" avec le mdp "AZERTY01"

    Scenario: suppresion d'un pokemon de ma banque
        Given l'utilisateur "Test" possède le pokemon "PokeTest" avec l'identifiant "5d5c189123b3584286c63f29"
        And je suis sur l'écran de ma banque
        When je clique sur l'option de suppression du pokemon dont l'identifiant est "5d5c189123b3584286c63f29"
        Then le pokemon avec l'identifiant "5d5c189123b3584286c63f29" n'est pas affiché dans la banque
        And le pokemon avec l'identifiant "5d5c189123b3584286c63f29" n'existe pas