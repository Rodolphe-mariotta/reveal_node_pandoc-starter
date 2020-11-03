---
author: Rodolphe Mariotta
title: reveal-starter
date: confinement jour -#30-
keywords: [reveal-js, pandoc, markdown, node]
parallaxBackgroundImage: https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg
margin: 0.0004
minScale: 0.1
maxScale: 2.0
parallaxBackgroundSize: 3000px 2000px
parallaxBackgroundHorizontal: 350
parallaxBackgroundVertical: 180
autoSlide: 6000
---

[//]: <!-- markdownlint-disable MD025 MD001 -->

# Preambule

---

Un starter pour vos présentation reveal.js

écrite en **markdown**

- markdown que du markdown
- serveur intégré
- chargement à chaud

# Installation

---

### [forkme](https://github.com/Rodolphe-mariotta/reveal_node_pandoc-starter)

```bash
# forker le dépot
# et cloner votre fork
git clone ..._pandoc-starter.git
cd reveal_node_pandoc-starter
yarn install
```

---

### Utilisation

```bash
# éditer/créer des fichiers  markdown dans src/
code src/index.md #(ce ficher)
code src/demo.md  #(fichier d'exemple)
```

---

### "Serve" ou "build"

```bash
# construire les présentations
yarn build ##  construit les présentations dans output/
# ou
yarn serve ## (build) et demarre un serveur web

```

---

### GithubPages / Production

```bash
NODE_ENV=production yarn build

# cf configuration dans config.json
```

# Des bonus

---

### Les outils autour de git

- [commitlint](https://github.com/conventional-changelog/commitlint)
- [commitizen](https://github.com/commitizen/cz-cli)
- [git-precommit-checks](https://mbrehin.github.io/git-precommit-checks/)

<kbd>→</kbd> [package.json](https://github.com/Rodolphe-mariotta/reveal_node_pandoc-starter/blob/master/package.json)

<script type="text/javascript">
(function(){
	var mlink=document.createElement('a');
	mlink.setAttribute("href","https://github.com/Rodolphe-mariotta/reveal_node_pandoc-starter");
	mlink.setAttribute("style","    position: absolute; top: 0; right: 0; z-index: 1000;");
	mlink.innerHTML='<img style="position: absolute; top: 0; right: 0; border: 0;" src="./images/forkme_green.png" alt="Fork me on GitHub">';
	document.body.insertBefore(mlink, document.body.childNodes[0]);
})();
</script>
