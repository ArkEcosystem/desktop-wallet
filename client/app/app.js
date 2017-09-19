//hack as per https://github.com/monospaced/angular-qrcode
window.qrcode = require("qrcode-generator");
require('angular-qrcode');

const themes = {
  'default': {
    primary: 'blue',
    accent: 'green',
    warn: 'red'
  },
  'caetano': {
    primary: 'teal',
    accent: 'cyan',
    warn: 'pink',
    background: 'blue-grey'
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
    .module('arkclient', ['ngMaterial', 'md.data.table', 'arkclient.time', 'gettext', 'monospaced.qrcode',
      'arkclient.accounts', 'arkclient.addressbook', 'arkclient.coreServices', 'arkclient.coreUtils', 'arkclient.qrScanner'])

    .config(function($provide, $mdThemingProvider, $mdIconProvider){
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu", "./assets/svg/menu.svg", 24)
            .icon("ledger", "./assets/svg/ledger.svg", 24)
			.icon("qrcode", "./assets/svg/qrcode.svg", 24);

    Object.keys(themes).forEach(function(key) {
      const theme = $mdThemingProvider.theme(key)
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
    },
]);

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
