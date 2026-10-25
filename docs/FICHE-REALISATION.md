# MicroMonde, Vivez le vivant

**Parcours de découverte des fresques UNC — Fiche de réalisation**

Estelle Pochic - Léandre Vigouroux - Alexis Boutin

Statut : brouillon (à valider). Date : fin novembre 2026.
Sources : commande *Micro-Mondes : Trajectoires du vivant*, dossier de l'artiste Kuby Kolor, fiche projet, [PRD.md](PRD.md), [TRD.md](TRD.md), code `0.3.0-beta`.

**Pitch du projet :** Le concept du projet Micro-monde est une immersion dans l'art, une invitation à découvrir les fresques à travers une expérience en 3 dimensions, aussi bien visuelle, auditive que spatiale. Micro-monde raconte une histoire, celle de la découverte de la représentation du vivant. Au travers, des contes, des espèces, et des molécules qui les composent, venez vivre le vivant.

## 1. Identité du projet

| Élément | Contenu |
|---|---|
| Projet | MicroMonde, parcours de découverte des fresques UNC |
| Commande | *Micro-Mondes : Trajectoires du vivant* |
| Formation | MMI, parcours Développement et application web |
| Volet traité | Développement et dispositifs interactifs |
| Équipe | Estelle Pochic, Léandre Vigouroux, Alexis Boutin |
| Commanditaire | Université de la Nouvelle-Calédonie (UNC) |
| Artiste | Kuby Kolor, artiste muraliste, graffeur, directeur artistique |
| Rendu | Fin novembre 2026 |
| Cadre | Projet universitaire : l'artiste et l'UNC n'ont pas été informés du projet |

## 2. Ce que nous avons compris de la commande

| Consigne | Notre compréhension | Notre réponse |
|---|---|---|
| Concevoir un parcours artistique, immersif et interactif | Le campus devient une galerie interactive à ciel ouvert où l'on explore, écoute et comprend les œuvres | Un site web accessible depuis le téléphone, sans application : carte des fresques et scan en réalité augmentée |
| Intégrer les trois fresques existantes | Tortue marine, hibiscus, loriquet à tête bleue | Les trois fresques sont reconnues au scan |
| Imaginer au moins deux nouvelles œuvres cohérentes | Prolonger l'exposition dans le même esprit : espèce, molécule, histoire | Deux propositions : la fresque du champignon *Pisolithus albus* et la fresque *Le Voyage* (navire du bagne) |
| Construire une narration reliant le parcours | Un fil conducteur du visible vers l'invisible | Chaque fresque s'ouvre sur son animal en 3D, sa molécule, son histoire |
| Chaque fresque prend vie en réalité augmentée | Animations, espèces en mouvement, passage du visible à l'invisible, ambiance sonore, audio | Espèces en mouvement : modèles 3D animés et ancrés (livré). Audio : bouton prêt, enregistrements à venir (V2). Monde microscopique et ambiance sonore : propositions pour la suite |
| Support de communication | Dépliant, carte interactive, livret, mini-site ou affiche | Carte interactive intégrée au site ; affiches relais sur le campus |
| Dispositif accessible, robuste en espace public | Simple, intuitif, rapide sur smartphone ; penser aux cas sans numérique | Parcours prévus pour les 4 cas (V2) : voir [APP-FLOW.md](APP-FLOW.md) |
| Prototype fonctionnel et tests utilisateurs | Montrer la faisabilité, observer, améliorer | Prototype déployé ; tests : [TESTS-UTILISATEURS.md](TESTS-UTILISATEURS.md) |

Critères d'évaluation retenus : cohérence de l'expérience, intégration entre l'œuvre physique et le numérique, accessibilité, qualité du prototype, capacité à traduire un concept artistique en expérience interactive.

## 3. Synopsis

*Un campus. Trois murs. Une tortue, une fleur, un oiseau, peints à l'échelle des bâtiments.*

Un téléphone se lève. Le mur s'ouvre. La tortue se détache de l'océan peint, l'oiseau déploie ses ailes, la fleur tourne sur elle-même. Derrière chacun, une voix raconte un conte, et une molécule dit ce qui fait leurs couleurs. Le visiteur n'a rien installé. Il choisit son chemin, il revient sur ses pas, il écoute. À la fin du parcours, deux autres histoires attendent : l'une sous la terre, l'autre sur l'eau.

| Acte | Lieu | Ce qui se passe |
|---|---|---|
| I — L'invitation | Affiche, QR, scan | Le visiteur scanne le QR, ouvre le site et peut ouvrir la carte des fresques pour choisir où aller |
| II — La traversée | Les trois fresques, ordre libre | Le mur s'ouvre : l'animal en 3D, le conte, la molécule, le fait scientifique. Fil de l'artiste : monde marin, puis végétal, puis animal |
| III — La révélation | Fin de parcours | Le campus se regarde autrement. Le champignon (sous terre) et le navire du bagne (sur l'eau) prolongent l'exposition |

## 4. Distribution

Les noms, titres et molécules viennent du dossier de l'artiste, sauf mention contraire.

| # | Personnage | Rôle dans l'histoire | Sa molécule | Fresque |
|---|---|---|---|---|
| 1 | La **tortue verte** | La voyageuse. Symbole du voyage, de la longévité, de la résilience | **Kératine**, protéine de la carapace | « Les architectes du récif » |
| 2 | L'**hibiscus** | La fleur qui peint le mur. Emblème du Pacifique et de la Nouvelle-Calédonie | **Cyanidine**, pigment de la famille des anthocyanes (rouges, roses, pourpres) | « La chimie des couleurs » |
| 3 | Les **loriquets à tête bleue** (un couple) | Les messagers colorés de la forêt | **Mélanine et caroténoïdes**, pigments du plumage ¹ | « Le langage des plumes » |
| 4 | **Kuby Kolor** | L'artiste qui a peint les murs | — | — |
| 5 | **Pisolithus albus** | Le héros caché sous la terre (fresque proposée) | Symbiose entre champignon et racines | À venir |
| 6 | **Le navire** | Le voyage contraint vers Nouville (fresque proposée) | **Cellulose**, constituant du bois | *Le Voyage* |
| 7 | Le **visiteur** | L'explorateur, téléphone en main | — | — |

¹ Note scientifique. La description de l'artiste est conservée dans ce document. Les recherches du 26/10/2026 indiquent, pour les perroquets en général : le rouge et le jaune du plumage viennent de pigments propres aux perroquets, les psittacofulvines, et non de caroténoïdes ; la mélanine donne les teintes sombres ; le bleu vient d'une structure de la plume ; le vert combine ce bleu et un pigment jaune. Aucune étude propre au loriquet à tête bleue n'a été trouvée. Sources : [Université de Bristol](https://www.chm.bris.ac.uk/motm/psittacofulvin/psittacofulvinh.htm), [Science News](https://www.sciencenews.org/?p=3145674), [enquête sur 44 espèces de perroquets](https://experts.azregents.edu/en/publications/distribution-of-unique-red-feather-pigments-in-parrots/), [Audubon](https://www.audubon.org/magazine/what-makes-bird-feathers-so-colorfully-fabulous).

## 5. Le dispositif en images

Les images définitives sont à fournir. Légendes prêtes :

| Figure | Contenu à montrer | Légende |
|---|---|---|
| 1 | Loriquet 3D en vol devant sa fresque, HUD visible | Le loriquet quitte le mur : modèle 3D ancré dans l'espace réel |
| 2 | Tortue 3D devant sa fresque | La tortue nage devant l'océan peint |
| 3 | Hibiscus avec le HUD complet, modèle masqué | Trois portes d'entrée : molécule, histoire, fait scientifique |
| 4 | Carte avec popup d'une fresque | La carte des fresques et le bouton « Scanner » |
| 5 | Panneau de contenu ouvert | Un contenu : titre, texte, mention IA, bouton audio |
| 6 | Écran de chargement du moteur | Le moteur de réalité augmentée démarre dans le navigateur |

## 6. État du projet (version `0.3.0-beta`)

| Élément | État |
|---|---|
| Reconnaissance des 3 fresques | Livré |
| Modèles 3D animés et ancrés | Livré |
| HUD à 4 boutons et panneau de contenu | Livré |
| Carte avec position du visiteur | Livré |
| Site déployé, code sous licence MIT | Livré |
| Contenus | Provisoires : contes générés par IA, étiquetés comme tels |
| Audio | Bouton prêt, enregistrements à venir |
| Langues anglais et kanak, progression, récompense, marqueurs en croix de carte au trésor, mode dégradé | V2 |
| Fresques du champignon et *Le Voyage*, ambiance sonore, monde microscopique animé | Propositions |

Détail des exigences : [PRD.md](PRD.md).

## 7. Rôles dans l'équipe

Répartition relevée dans l'historique git du dépôt (du 01/09 au 30/09/2026) :

| Personne | Travail |
|---|---|
| Alexis Boutin | Infrastructure du code, moteur de réalité augmentée, cibles d'image, déploiement, versions |
| Léandre Vigouroux | Front, réalisation des trois modèles 3D, classes CSS, direction artistique de l'interface, panneau et HUD, contenus de l'hibiscus |
| Estelle Pochic | Carte Leaflet : localisation des fresques, position du visiteur, accès depuis le scan |

## 8. Suite du travail

- Valider les documents `.md`, puis produire les versions Word.
- Compléter [TESTS-UTILISATEURS.md](TESTS-UTILISATEURS.md) avec les retours de la classe.
- V2 : contenus recherchés, enregistrements audio, langues, progression et récompense.
- Remplacer les figures par les images définitives.
