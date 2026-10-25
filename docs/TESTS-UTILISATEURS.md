# Tests utilisateurs — MicroMonde

**Prototype testé avec la classe**

Statut : brouillon (à valider)
Couvre : livrables D6 (protocole) et D7 (synthèse des retours) de la commande.
Sources : commande (pages 6 et 9), souvenirs de la séance de classe (renseignés par Alexis Boutin), vidéos d'essai du 19/10/2026.

## 1. Prototype testé

| Élément              | Valeur                                  |
| -------------------- | --------------------------------------- |
| Version              | `0.3.0-beta`                            |
| Déploiement          | Site Netlify (compte d'Alexis Boutin)   |
| Fresques disponibles | Tortue, hibiscus, loriquet à tête bleue |
| Appareils            | Smartphone des étudiants                |

## 2. Contexte du test

Renseigné par Alexis Boutin :

- Date et lieu de la séance : 08/10/2026, Université de la Nouvelle-Calédonie
- Nombre de personnes : 20
- Fresques essayées : loriquet à tête bleue (nommé « Perruche » dans l'application à ce moment), tortue, hibiscus
- Conditions (réseau, lumière, accompagnement) : réseau de l'Université de la Nouvelle-Calédonie, ciel clair en fin d'après-midi, accompagnement par l'équipe de développement pour conseil.

## 3. Protocole (D6)

La commande demande de faire tester le parcours à quelques utilisateurs (étudiants ou proches), de recueillir leurs retours avec une courte grille d'observation, puis de faire évoluer le projet.

Tâches proposées au testeur :

1. Ouvrir le site et trouver la fresque la plus proche sur la carte.
2. Scanner la fresque.
3. Ouvrir un contenu et lire ou écouter.
4. Faire apparaître l'animal en 3D et tourner autour.
5. Revenir à la carte et choisir une autre fresque.

Ce qu'on observe (liste de la commande) :

| Observation                 | Question posée                                          |
| --------------------------- | ------------------------------------------------------- |
| Compréhension du dispositif | A-t-il compris à quoi servent les boutons et la carte ? |
| Prise en main               | Combien d'essais pour scanner ?                         |
| Blocages                    | Où s'est-il arrêté, qu'a-t-il demandé ?                 |
| Temps nécessaire            | Combien de temps par tâche ?                            |
| Réactions                   | Qu'a-t-il dit ou montré (surprise, plaisir, doute) ?    |
| Ce qu'il a retenu           | Que retient-il de l'espèce, de la molécule, du conte ?  |

## 4. Avis et retours sur l'œuvre

Les retours de la séance sont consignés dans la synthèse ci-dessous. Les avis individuels, s'ils sont retrouvés, s'ajoutent ici.

## 5. Synthèse (D7)

Rédigée par Alexis Boutin d'après ses souvenirs de la séance du 08/10/2026 :

| Thème                   | Constat                                                                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ce qu'ils ont compris   | L'ensemble de l'interface est assez clair. Cependant, il y a parfois un décalage entre l'interface et la fresque. Il faut vraiment l'avoir en fond.                                     |
| Ce qu'ils ont retenu    | L'attention a majoritairement été portée sur l'impact des modèles 3D et sur le fait que l'on puisse se prendre en photo à côté. Aucun retour concernant l'apprentissage ou la molécule. |
| Moments qui ont surpris | Le modèle 3D est très impactant, c'est ce que les gens ont le plus retenu. Ils sont gros, prennent l'écran et font un effet de surprise avec l'animation.                               |
| Difficultés rencontrées | Il faut vraiment que l'écran du téléphone ait la fresque en fond pour que tout apparaisse. Parfois, il faut reprendre le cadre pour afficher à nouveau l'interface.                     |
| Améliorations possibles | Améliorer la qualité du tracking. Rajouter du contenu audio et les contes sur les différents boutons.                                                                                   |

## 6. Améliorations

### 6.1 Issues des retours de la classe (08/10/2026)

| Retour | Amélioration envisagée | Fait |
| --- | --- | --- |
| L'interface n'apparaît que si la fresque est bien en fond de l'écran ; il faut parfois reprendre le cadre pour la faire revenir | Améliorer la qualité du suivi (tracking) | Non |
| Les modèles 3D ont marqué ; aucun retour sur l'apprentissage ni sur la molécule | Ajouter du contenu audio et les contes sur les boutons | Non |
| Des participants se prennent en photo à côté du modèle 3D | Piste à décider : faciliter la prise de photo | Non décidé |

### 6.2 Observées par l'équipe sur les vidéos du 19/10/2026

Ce ne sont pas des retours de testeurs.

| Observation | Amélioration envisagée | Fait |
| --- | --- | --- |
| Un badge « Powered by Netlify » recouvre le bas de l'écran, à l'endroit du bouton audio et du bouton « Scanner une fresque » | Vérifier l'origine du badge et le retirer ou le déplacer | Non |
| Croix de fermeture 3D (40 px) et croix du panneau (32 px) sous 44 px | Agrandir | Non |

## 7. Limites

- Échantillon : une seule classe, 20 personnes.
- iPhone / Safari : fonctionnement à confirmer.
- Contenus provisoires (contes générés par IA) : les retours sur le texte ne portent pas sur le contenu final.
