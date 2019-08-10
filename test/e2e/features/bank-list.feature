@bank
Feature: consultation de la banque
    En tant qu'utilisateur connecté
    Je veux voir la liste des pokemons que je possède
    Afin de connaitre son contenu

    Scenario: affichage de la liste
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré
        And je suis connecté avec l'email "test.test@test.fr" avec le mdp "AZERTY01"
        When je suis sur l'écran de la ma banque
        Then la liste de mes pokemons est affichée
        And la colone "Espèce" est en position "1" de la banque
        And la colone "Talent(s)" est en position "2" de la banque
        And la colone "Nature(s)" est en position "3" de la banque
        And la colone "Attaque(s)" est en position "4" de la banque

    Scenario: affichage d'un pokemon sans tags dans la banque
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré
        And l'utilisateur "Test" possède le pokemon "PokeTest"
        And je suis connecté avec l'email "test.test@test.fr" avec le mdp "AZERTY01"
        When je suis sur l'écran de la ma banque
        Then la liste de mes pokemons contient l'espèce "PokeTest"

    Scenario Outline: affichage d'un pokemon avec tags simples
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré
        And l'utilisateur "Test" possède le pokemon "PokeTest"
        And le pokemon "PokeTest" de "Test" à le tag "Tag1" de type "<tagType>"
        And je suis connecté avec l'email "test.test@test.fr" avec le mdp "AZERTY01"
        When je suis sur l'écran de la ma banque
        Then le pokemon en position "1" affiche "Tag1" pour la colone du type "<tagType>"
            
            Examples:
            | tagType   |
            | nature    |
            | ability    | 
            | move   |

    Scenario Outline: affichage du nombre de tag quand un pokemon en contient plusieurs du même type
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré
        And l'utilisateur "Test" possède le pokemon "PokeTest"
        And le pokemon "PokeTest" de "Test" à le tag "Tag1" de type "<tagType>"
        And le pokemon "PokeTest" de "Test" à le tag "Tag2" de type "<tagType>"
        And je suis connecté avec l'email "test.test@test.fr" avec le mdp "AZERTY01"
        When je suis sur l'écran de la ma banque
        Then le pokemon en position "1" affiche "2" pour la colone du type "<tagType>"
            
            Examples:
            | tagType   |
            | nature    |
            | ability    | 
            | move   |

    Scenario Outline: affichage des tags d'un type au survole du nombre
        Given l'utilisateur "Test" avec l'email "test.test@test.fr" et le mdp "AZERTY01" est enregistré
        And l'utilisateur "Test" possède le pokemon "PokeTest"
        And le pokemon "PokeTest" de "Test" à le tag "Tag1" de type "<tagType>"
        And le pokemon "PokeTest" de "Test" à le tag "Tag2" de type "<tagType>"
        And je suis connecté avec l'email "test.test@test.fr" avec le mdp "AZERTY01"
        When je suis sur l'écran de la ma banque
        And je survole le texte de la colone du type "<tagType>" pour le pokemon en position "1"
        Then un message affiche "Tag1 Tag2"
            
            Examples:
            | tagType   |
            | nature    |
            | ability    | 
            | move   |