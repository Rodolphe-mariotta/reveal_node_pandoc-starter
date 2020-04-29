#!/usr/bin/env node
/**
 * Script de construction de la presentation markdown par pandoc
 * Paramètres :
 * --build : construit la presentation
 * --serve : construit la presentation et demarre un serveur web
 */
const fs = require('fs')
const path = require('path')
const junk = require('junk')
const pandoc = require('node-pandoc')
const express = require('express')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const config = require('../config.json')
const environment = process.env.NODE_ENV || 'development'
const Config = config[environment]

const buildParam = '--build'
const servParam = '--serve'

const sourceFolder = path.join(Config.sourceDir)
const destinationFolder = path.join(Config.destinationDir)

const pandocParam = Config.pandocParam

const isMdRegExp = /.*\.(m(?:d(?:te?xt|o?wn)?|arkdown|kdn?)|text)$/
const extRegExp = /\.[^.]+$/

console.log('sourceFolder <%s>', sourceFolder)
console.log('destinationFolder <%s>', destinationFolder)

const args = process.argv

/**
 * copie ou transforme les fichiers
 * @param {*} Objet contenant les informations du fichier sources
 * @param {*} dest repertoire de destiantion
 */
async function generate(file, dest) {
  const destPath = path.join(dest, file.folderName)
  const destFile = path.join(destPath, file.fileName)

  if (!fs.existsSync(destPath)) {
    console.log('[MKDIR] create dir %s', destPath)
    fs.mkdirSync(destPath, { recursive: true })
  }

  if (isMdRegExp.test(file.fileName)) {
    const markdownDestFile = destFile.replace(extRegExp, '.html')
    const args = '-o ' + markdownDestFile + ' ' + pandocParam

    console.log('[PANDOC] file from %s to %s', file.filePath, markdownDestFile)
    pandoc(file.filePath, args, pandocCallback)
  } else {
    console.log('[COPY] from %s to %s', file.filePath, destFile)
    fs.copyFileSync(file.filePath, destFile)
  }
  return true
}

const pandocCallback = function (err, result) {
  if (err) {
    console.error('PANDOC - Oh Nos: ', err)
  }
  return result
}

/**
 * retourne la liste des fichiers trouvé.
 * les fichier son filtré par l'usage de junk
 * @param {*} firstDir repertoire racine
 * @param {*} folderName le nom du repertoire à traiter
 * @param {*} result la liste des fichiers trouvé
 */
async function parseFolder(firstDir, folderName, result = []) {
  const files = await fs.promises.readdir(folderName)

  for (const file of files) {
    const fromPath = path.join(folderName, file)
    const currentFolder = path.join(folderName)
    const stat = await fs.promises.stat(fromPath)

    if (stat.isFile() && junk.not(file)) {
      const dest = currentFolder.slice(firstDir.length, currentFolder.length)
      const fileInfo = { fileName: file, filePath: fromPath, folderName: dest }

      result.push(fileInfo)
    } else if (stat.isDirectory()) {
      result = await parseFolder(firstDir, fromPath, result)
    }
  }

  return result
}

/**
 * consruit la presentation copie des fichiers et generation pandoc
 * @param {*} sourceDir repertoire source
 * @param {*} destinationDir repertoire destination
 */
async function build(sourceDir, destinationDir) {
  try {
    console.log(
      '[START] Generate presentation from %s to %s',
      sourceDir,
      destinationDir
    )
    console.log('[CONFIG] Pandoc args: %s', pandocParam)

    await parseFolder(sourceDir, sourceDir)
      .then(
        (fileList) => {
          fileList.forEach((element) => {
            generate(element, destinationDir)
          })
        },
        (err) => {
          console.log('[ERR] - %s', err)
        }
      )
      .then(() => {
        console.log('[END]')
      })
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e)
    return false
  }

  return true
}

/**
 *
 * @param {*} args argument passé au script
 * @param {*} sourceFolder repertoire source
 * @param {*} destinationFolder repertoire destination
 */
async function start_build(args, sourceFolder, destinationFolder) {
  if (args[2] && (buildParam === args[2] || servParam === args[2])) {
    console.log('[START] - Build')

    const resBuild = await build(sourceFolder, destinationFolder)
    return resBuild
  } else {
    console.log('[END] - No action specified => No action done')
  }
  return true
}

/**
 * Demarre le serveur express et surcharge les routes
 * route : /socket.io.* vers le module socket.io-client
 * route : /  vers /index.html
 * route : *.html  contenue du fichier html surchargé
 * @param {*} sourceFolder repertoire source
 * @param {*} destinationFolder repertoire destination
 * @param {*} config configuration lu
 */
async function start_server(sourceFolder, destinationFolder, config) {
  console.log('[START] - express server')

  /**
   * Return all the /socket.io.*.js|map call to
   * the socket.io-client dist folder
   */
  const sockerIoDir = path.join(
    __dirname,
    '../',
    '/node_modules/socket.io-client/dist/'
  )

  const optionsSocketIo = {
    root: sockerIoDir,
    dotfiles: 'deny',
  }

  const regSocketIo = /\/socket.io(.\w*){0,3}.(js|map)$/

  /**
   * endpoint des fichier socket.io.*
   */
  app.get(regSocketIo, function (req, res) {
    res.sendFile(req.path, optionsSocketIo)
  })

  /*
   * tout les appels (/) sont redirigé vers (/index.hml)
   * c'est plus simple pour la surchage socket.io cf ci dessous
   */
  app.get([/.*\/$/], function (req, res) {
    res.redirect(req.path + 'index.html')
  })

  /**
   * tout les appels aux pages web (*.html)
   * sont surchargé pour y inclure les appels javascript pour socket.io
   * le cache de la page est desactivé.
   */
  app.get([/.*.html$/], function (req, res) {
    const filename = destinationFolder + req.path

    res.contentType('text/html')
    res.set('Cache-Control', 'no-store')

    fs.readFile(filename, function (_, data) {
      res.send(
        data +
          '<script src="/socket.io.js"></script>' +
          '<script>' +
          "function callb_reload(){console.log('reload');window.location.reload();};" +
          '  var socket = io();' +
          '  socket.on("file-change-event", function () {' +
          '    setTimeout(callb_reload, 100)' +
          '  });' +
          '</script>'
      )
    })
  })

  app.use(express.static(destinationFolder))
  http.listen(config.server_port)
  return true
}

/**
 * Demarre la synchronisation des repertoire pour la mise a jour de fichier
 * a la fin de la generation emmet un signal 'file-change-event' aux clients.
 * @param {*} sourceFolder repertoire source
 * @param {*} destinationFolder repertoire destination
 */
async function start_sync(sourceFolder, destinationFolder) {
  console.log('[START] - file sync')
  fs.watch(sourceFolder, { recursive: true }, function (event, filename) {
    if (filename) {
      const filePath = path.join(sourceFolder, filename)
      const fileFolder = path.dirname(filePath)
      const dest = fileFolder.slice(sourceFolder.length, fileFolder.length)

      if ('change' === event) {
        const fileInfo = {
          fileName: path.basename(filePath),
          filePath: filePath,
          folderName: dest,
        }
        generate(fileInfo, destinationFolder).then((res) => {
          if (res) {
            io.emit('file-change-event')
          }
        })
      } else {
        // TODO traiter les rename et suppression
        console.log('event =<%s> - filename =<%s>', event, filename)
      }
    }
  })

  return true
}

/**
 * Demarre le serveur express et la synchronisation
 * @param {*} args argument passé au script
 * @param {*} config configuration lu
 * @param {*} sourceFolder repertoire source
 * @param {*} destinationFolder repertoire destination
 */
async function start_server_sync(
  args,
  config,
  sourceFolder,
  destinationFolder
) {
  if (args[2] && servParam === args[2]) {
    const serve = await start_server(sourceFolder, destinationFolder, config)
    const sync = await start_sync(sourceFolder, destinationFolder)
  }
}

/**
 * MAIN
 */
;(async () => {
  start_build(args, sourceFolder, destinationFolder).then((res) => {
    if (res) {
      start_server_sync(args, Config, sourceFolder, destinationFolder)
    }
  })
})()
