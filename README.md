# Reveal_Node_Pandoc-starter

![Love](badge_love.svg) ![18+](badge_age.svg) [![DEMO](badge_demo.svg)](https://rodolphe-mariotta.github.io/reveal_node_pandoc-starter/demo.html) [![PRESENTATION](badge_presentation.svg)](https://rodolphe-mariotta.github.io/reveal_node_pandoc-starter/)

Un starter pour vos présentation reveal.js écrite en markdown, pandoc pour transformer vos .md en .html et un peu de node pour avoir du chargement à chaud.

## Pour commencer

Assurez vous de satisfaire les près-requis !
Vous devez créer les markdown des presentations dans le repertoire src/ vous pouvez directement modifier le fichier index.md

### Pré-requis

Ce projet à besoin des éléments suivant :

- pandoc
- node (/yarn)
- votre bonne humeur.

### Installation

- cloner ce repository
- `yarn install` ou `node install` pour installer le dépendances
- `yarn build` ou `node build` pour contruire la presentation dans le repetoire (par defaut dans output/)
- ou `yarn serve` ou `node ./scripts/build.js --serve` pour contruire la presentation et demarrer un serveur web sur localhost:8080
- un editeur de texte pour commencer a ecrire la presentation

Pour publier par exemple sur les **gh_pages** dans le repertoire **/docs**

- `NODE_ENV=production yarn build`ou `NODE_ENV=production node ./scripts/build.js --build`

## Fabriqué avec

- [vscode](https://code.visualstudio.com/) - IDE
- [pandoc](https://pandoc.org/) - moteur de transformation
- [node.js](https://nodejs.org/) pour faire tourner tout cela

## Ce qu'il y a en plus autour de GIT

- **husky** pour les hooks git
- **commitlint** pour valider le texte de vos commit
- **cz-conventional-changelog** pour la config commitizen pour l'installer `npm install -g commitizen` c.f. [ici](http://commitizen.github.io/cz-cli/)
- **git-precommit-checks** pour se prémunir des merges non finalisé et les TODO [ici](https://www.npmjs.com/package/git-precommit-checks)

jeter un oeil dans le [package.json](package.json)

## Contribuer

Si vous souhaitez contribuer, lisez le fichier [CONTRIBUTING.md](CONTRIBUTING.md)

## Versions

**Dernière version stable :** QaD_two

**Dernière version :** QaD_two
Liste des versions : [Cliquer pour afficher](https://github.com/Rodolphe-mariotta/reveal_node_pandoc-starter/tags)

## Auteurs

Listez le(s) auteur(s) du projet ici !

- **Rodolphe Mariotta** [](https://github.com/Rodolphe-mariotta)

## License

Ce projet est sous licence `GPL` - voir le fichier [LICENSE.md](LICENSE.md) pour plus d'informations

## Autres information

- [favicon](./src/favicon.ico) trouvé sur https://www.favicon.cc/?action=icon&file_id=947600
- [idée](https://khtdr.com/tutorials/simple-live-reload-server.html) exemple pour le pour chargement à chaud
