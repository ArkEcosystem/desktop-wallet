;(function () {
  'use strict'

  /*
   * This directive establishes the body background (color or texture).
   * If that background is a texture, it could be configured to use a CSS class too.
   *
   * Since some background textures have light colors, they could use it to
   * customize other elements, such as buttons that would not be distinguishable
   * otherwise. Others could use it for improving the general aesthetics.
   */
  angular.module('arkclient.directives')
    .directive('backgroundStyle', [function () {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
          const defaultBackground = 'url(assets/images/images/Ark.jpg)'
          // This is the custom configuration of textures
          const textures = {
            'Ahoy.jpg': {
              cssClass: ''
            }
          }

          const classes = Object.values(textures).reduce((all, texture) => {
            if (all.indexOf(texture.cssClass) === -1) {
              all.push(texture.cssClass)
            }
            return all
          }, [])

          // Used to extract the image filename
          const textureRe = /url\(.+\/([^/]+).\)/
          // Used to extract the image path
          const pathRe = /\((.*)\)/

          scope.$watch(attrs.backgroundStyle, (value) => {
            if (value) {
              // Check if the background exists
              const mathPath = value.match(pathRe)
              if (mathPath) {
                const filePath = mathPath[1].replace(/'/g, ``)
                const fullPath = require('path').join(__dirname, filePath)
                if (!require('fs').existsSync(filePath) && !require('fs').existsSync(fullPath)) {
                  value = defaultBackground // if not exists
                }
              }
            } else {
              value = defaultBackground
            }

            const style = { background: value }
            let newClass = null

            if (value.match('textures')) {
              style.backgroundRepeat = 'repeat'
            } else {
              style.backgroundSize = 'cover'
            }

            elem.css(style)

            const matches = value.match(textureRe)
            if (matches) {
              const filename = matches[1]

              if (textures[filename]) {
                newClass = textures[filename].cssClass
                elem.addClass(newClass)
              }
            }

            classes.forEach((textureClass) => {
              if (newClass !== textureClass) {
                elem.removeClass(textureClass)
              }
            })
          })
        }
      }
    }])
})()
