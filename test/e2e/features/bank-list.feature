@bank @bankList
Feature: consultation de la banque
    En tant qu'utilisateur connecté
    Je veux voir la liste des pokemons que je possède
    Afin de connaitre son contenu

    Background:
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré
        And je suis connecté avec l'email "test.test@test.fr" avec le mdp "AZERTY01"

    Scenario: affichage de la liste
        When je me rend sur l'écran de ma banque
        Then la liste de mes pokemons est affichée
        And la colonne "Espèce" est en position "1" de la banque
        And la colonne "Talent(s)" est en position "2" de la banque
        And la colonne "Nature(s)" est en position "3" de la banque
        And la colonne "Attaque(s)" est en position "4" de la banque
        And la colonne "Options" est en position "5" de la banque

    Scenario: affichage d'un pokemon sans tags dans la banque
        Given l'utilisateur "Test" possède le pokemon "PokeTest"
        When je me rend sur l'écran de ma banque
        Then la liste de mes pokemons contient l'espèce "PokeTest"

    Scenario Outline: affichage d'un pokemon avec tags simples
        Given l'utilisateur "Test" possède le pokemon "PokeTest"
        And le pokemon "PokeTest" de "Test" à le tag "Tag1" de type "<tagType>"
        When je me rend sur l'écran de ma banque
        Then le pokemon en position "1" affiche "Tag1" pour la colone du type "<tagType>"
            
            Examples:
            | tagType   |
            | nature    |
            | ability   | 
            | move      |

    Scenario Outline: affichage du nombre de tag quand un pokemon en contient plusieurs du même type
        Given l'utilisateur "Test" possède le pokemon "PokeTest"
        And le pokemon "PokeTest" de "Test" à le tag "Tag1" de type "<tagType>"
        And le pokemon "PokeTest" de "Test" à le tag "Tag2" de type "<tagType>"
        When je me rend sur l'écran de ma banque
        Then le pokemon en position "1" affiche "2" pour la colone du type "<tagType>"
            
            Examples:
            | tagType   |
            | nature    |
            | ability   | 
            | move      |

    Scenario Outline: affichage des tags d'un type au survole du nombre
        Given l'utilisateur "Test" possède le pokemon "PokeTest"
        And le pokemon "PokeTest" de "Test" à le tag "Tag1" de type "<tagType>"
        And le pokemon "PokeTest" de "Test" à le tag "Tag2" de type "<tagType>"
        When je me rend sur l'écran de ma banque
        And je survole le texte de la colone du type "<tagType>" pour le pokemon en position "1"
        Then un message affiche "Tag1 Tag2"
            
            Examples:
            | tagType   |
            | nature    |
            | ability   | 
            | move      |

    Scenario: affichage de l'option de suppression pour un pokemon de la banque
        Given l'utilisateur "Test" possède le pokemon "PokeTest" avec l'identifiant "5d5c189123b3584286c63f29"
        When je me rend sur l'écran de ma banque
        Then le pokemon avec l'identifiant "5d5c189123b3584286c63f29" a un option de suppression