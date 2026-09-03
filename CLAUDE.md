# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git

- Workflow git flow : `feature/*` pour le dev, merge sur `dev` en `--no-ff`. `hotfix/*` créé depuis `main`.
- Toujours demander confirmation à l'utilisateur avant de merger une `feature/*` sur `dev`. Ne jamais merger de sa propre initiative.
- Une fois une `feature/*` mergée dans `dev` et poussée sur `origin/dev`, supprimer la branche locale (`git branch -d`). Ne pas laisser de branches `feature/*` locales après clôture.
- Jamais de `Co-Authored-By` dans les messages de commit.
- Format de message de commit obligatoire :

```
type(scope): phrase résumé.
- ajout 1
- ajout 2
```

Exemple :

```
infra(docker): mise a jour de dépendances sur le conteneur.
- ajout de git
- installation des dépendances php laravel
```
