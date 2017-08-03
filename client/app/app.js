//hack as per https://github.com/monospaced/angular-qrcode
window.qrcode = require("qrcode-generator");
require('angular');
require('angular-material');
require('angular-material-data-table');
require('angular-gettext');
require('angular-qrcode');

angular
    .module('arkclient', ['ngMaterial', 'md.data.table', 'arkclient', 'gettext', 'monospaced.qrcode',
      'arkclient.accounts', 'arkclient.addressbook', 'arkclient.coreServices', 'arkclient.coreUtils', 'arkclient.qrScanner'])

    .config(function($mdThemingProvider, $mdIconProvider){
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu", "./assets/svg/menu.svg", 24)
            .icon("ledger", "./assets/svg/ledger.svg", 24);

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('green')
            .warnPalette('red');

    })
    .config(['$qProvider', function ($qProvider) {
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
