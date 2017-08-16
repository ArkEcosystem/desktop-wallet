//hack as per https://github.com/monospaced/angular-qrcode
window.qrcode = require("qrcode-generator");
require('angular-qrcode');

var themes = {
  'default': {
    primary: 'blue',
    accent: 'green',
    warn: 'red'
  },
  'caetano': {
    primary: 'teal',
    accent: 'cyan',
    warn: 'pink',
    background: 'blue-grey',
  },
  'evelynn': {
    primary: 'pink',
    accent: 'blue',
    warn: 'deep-orange'
  },
  'rok': {
    primary: 'blue',
    accent: 'amber',
    warn: 'green'
  },
  'solarized': {
    primary: 'orange',
    accent: 'yellow',
    warn: 'brown'
  },
  'amazonia': {
    primary: 'green',
    accent: 'lime',
    warn: 'light-green'
  },
  'brazil': {
    primary: 'green',
    accent: 'yellow',
    warn: 'blue'
  },
  'midnight': {
    primary: 'indigo',
    accent: 'deep-purple',
    warn: 'blue'
  }
};

angular
  .module('arkApp', ['ngMaterial', 'md.data.table', 'arkclient', 'gettext', 'monospaced.qrcode'])
  .config(function($provide, $mdThemingProvider, $mdIconProvider) {
    $mdIconProvider
      .defaultIconSet("./assets/svg/avatars.svg", 128)
      .icon("menu", "./assets/svg/menu.svg", 24)
      .icon("ledger", "./assets/svg/ledger.svg", 24);

    Object.keys(themes).forEach(function(key) {
      var theme = $mdThemingProvider.theme(key)
        .primaryPalette(themes[key].primary)
        .accentPalette(themes[key].accent)
        .warnPalette(themes[key].warn);

      if (themes[key].background) theme.backgroundPalette(themes[key].background);
    });

    $mdThemingProvider.alwaysWatchTheme(true);

    $provide.value('$mdThemingProvider', $mdThemingProvider);
  })
  .config(['$qProvider', function($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]);

const electron = require('electron');
const remote = electron.remote;
const Menu = remote.Menu;

const InputMenu = Menu.buildFromTemplate([{
  label: 'Undo',
  role: 'undo',
}, {
  label: 'Redo',
  role: 'redo',
}, {
  type: 'separator',
}, {
  label: 'Cut',
  role: 'cut',
}, {
  label: 'Copy',
  role: 'copy',
}, {
  label: 'Paste',
  role: 'paste',
}, {
  type: 'separator',
}, {
  label: 'Select all',
  role: 'selectall',
}, ]);

document.body.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  e.stopPropagation();

  let node = e.target;

  while (node) {
    if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
      InputMenu.popup(remote.getCurrentWindow());
      break;
    }
    node = node.parentNode;
  }
});

function turnOnDarkMode() {
  "use strict";
  var headID = document.getElementsByTagName("head")[0];
  var cssNode = document.createElement('link');
  cssNode.type = 'text/css';
  cssNode.rel = 'stylesheet';
  cssNode.href = 'assets/dark-mode.css';
  cssNode.media = 'screen';
  headID.appendChild(cssNode);
}

  
function turnOffDarkMode() {
  "use strict";
  var filename = "dark-mode.css";
  var targetElement = "link";
  var targetAttr = "href";
 var allCtrl = document.getElementsByTagName(targetElement);
  for (var i = allCtrl.length-1; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
      if (allCtrl[i] && allCtrl[i].getAttribute(targetAttr) != null && allCtrl[i].getAttribute(targetAttr).indexOf(filename) != -1) {
          allCtrl[i].parentNode.removeChild(allCtrl[i]);
      }
  }
} 