(function() {
  'use strict';

  /*
   * This directive establishes the body background (color or texture).
   * If that background is a texture, it could be configured to use a CSS class too.
   *
   * Since some background textures have light colors, they could use it to
   * customize other elements, such as buttons that would not be distinguishable
   * otherwise. Others could use it for improving the general aesthetics.
   */
  angular.module('arkclient.directives')
    .directive('backgroundStyle', [function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elem, attrs, ctrl) {

          // This is the custom configuration of textures
          var textures = {
            'Ahoy.jpg': {
              cssClass: '',
            }
          };

          var classes = Object.values(textures).reduce(function(all, texture) {
            if (all.indexOf(texture.cssClass) === -1)
              all.push(texture.cssClass);
            return all;
          }, []);

          // Used to extract the image filename
          var textureRe = /url\(.+\/([^/]+).\)/;

          scope.$watch(attrs.backgroundStyle, function(value) {
            var style = { background: value };
            var newClass = null;

            if (value.match('textures')) {
              style.backgroundRepeat = 'repeat';
            } else {
              style.backgroundSize = 'cover';
            }

            elem.css(style);

            var matches = value.match(textureRe);
            if (matches) {
              var filename = matches[1];

              if (textures[filename]) {
                newClass = textures[filename].cssClass;
                elem.addClass(newClass);
              }
            }

            classes.forEach(function(textureClass) {
              if (newClass !== textureClass) {
                elem.removeClass(textureClass);
              }
            });
          });
        }
      }
    }]);
    
})();