@bank @bankDetail
Feature: affichage du détail d'un pokemon de la banque
    En tant que utilisateur connecté
    Je veux afficher toutes les informations de mon pokemon
    Afin de me souvenir de toutes les informations que j'ai renseigné à son sujet

    Background: 
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré
        And je suis connecté avec l'email "test.test@test.fr" avec le mdp "AZERTY01"

    Scenario: affichage du détail au clique sur un pokemon de la bank
        Given l'utilisateur "Test" possède le pokemon "PokeTest" avec l'identifiant "5d5c189123b3584286c63f29"
        And je suis sur l'écran de ma banque
        When je clique sur la ligne du pokemon avec l'identifiant "5d5c189123b3584286c63f29"
        Then le détail s'affiche

    Scenario: L'espèce est afficher comme titre du détail
        Given l'utilisateur "Test" possède le pokemon "PokeTest" avec l'identifiant "5d5c189123b3584286c63f29"
        And je suis sur l'écran de ma banque
        When je clique sur la ligne du pokemon avec l'identifiant "5d5c189123b3584286c63f29"
        Then le détail du pokemon affiche "PokeTest" en titre

    Scenario Outline: Les tags du détail sont organisés par sections
        Given l'utilisateur "Test" possède le pokemon "PokeTest" avec l'identifiant "5d5c189123b3584286c63f29"
        And le pokemon "PokeTest" de "Test" à le tag "Tag1" de type "<tagType>"
        And je suis sur l'écran de ma banque
        When je clique sur la ligne du pokemon avec l'identifiant "5d5c189123b3584286c63f29"
        Then le détail contient 1 tags
        And la section du détail identifiée par "<sectionIdentifier>" à le titre "<sectionName>"
        And la section du détail identifiée par "<sectionIdentifier>" contient le tag "Tag1"

            Examples:
            | sectionName   | sectionIdentifier | tagType   |
            | Nature(s)     | nature            | nature    |
            | Talent(s)     | ability           | ability   |
            | Attaque(s)    | move              | move      |
            | Autre(s)      | other             | iv        |
            | Autre(s)      | other             | shiny     |

    Scenario: L'option de fermeture permet de quitter l'affiche du détail
        Given l'utilisateur "Test" possède le pokemon "PokeTest" avec l'identifiant "5d5c189123b3584286c63f29"
        And je suis sur détail du pokemon avec l'identifiant "5d5c189123b3584286c63f29"
        When je clique sur l'option de fermeture du détail
        Then le détail n'est pas affiché