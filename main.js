#!/usr/bin/env node
/*
 * usage: cat test.html | main.js
 */
var fs = require('fs');
var TurndownService = require('turndown')

var turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
  preformattedCode: 'true'
})
// turndownService.keep('figure')
var turndownPluginGfm = require('turndown-plugin-gfm')
turndownService.use(turndownPluginGfm.gfm)
turndownService.addRule('figure', {
  filter: ['figure'],
  replacement: function (content, node, options) {
    // console.log(node.outerHTML)
    arr = content.trim().split('!')
    if (arr.length == 3) {
      arr.splice(2, 1)
      return arr.join('!')
    } else {
      return content
    }

  }
})

turndownService.addRule('fencedCodeBlock', {
  filter: function (node, options) {
    return (
      options.codeBlockStyle === 'fenced' &&
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    )
  },

  replacement: function (content, node, options) {

    var className = node.getAttribute('class') || ''
    var language = (className.match(/language-(\S+)/) || [null, ''])[1]
    if (language == '') {
      className = node.firstChild.getAttribute('class') || ''
      language = (className.match(/language-(\S+)/) || [null, ''])[1]
    }
    var code = node.firstChild.textContent
    return (
      '\n\n' + options.fence + language + '\n' +
      code.replace(/\n$/, '') +
      '\n' + options.fence + '\n\n'
    )
  }
})
// var content = fs.readFileSync('test.html', { encoding: 'utf8', flag: 'r' })
var stdinBuffer = fs.readFileSync(0)
var markdown = turndownService.turndown(stdinBuffer.toString())
console.log(markdown)