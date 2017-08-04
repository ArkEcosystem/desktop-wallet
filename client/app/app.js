//hack as per https://github.com/monospaced/angular-qrcode
window.qrcode = require("qrcode-generator");
require('angular-qrcode');

var defaultTheme = {
    primaryColor: 'blue',
    accentColor: 'green',
    warnColor: 'red'
}

function sortObj(obj) {
    return Object.keys(obj).sort(function(a, b) {
        return obj[a] - obj[b];
    });
}

// Compare vibrant colors from image with default material palette
// And returns the most similar primary and accent palette
function extractPalette(image, materialPalette, callback) {
    var response = defaultTheme;

    var path = require('path');
    var vibrant = require('node-vibrant');

    // check if it's an image url
    var regExp = /\'([^)]+)\'/;
    var match = image.match(regExp);

    if (!match) {
        callback(false);
        return;
    }

    var url = path.join(__dirname, match[1]);
    vibrant.from(url).getPalette(function (err, palette) {
        if (err || !palette.Vibrant) {
            callback(response); // return default theme
            return;
        }

        var vibrantRatio = {};
        var darkVibrantRatio = {};

        Object.keys(materialPalette).forEach(function(color) {
            var vibrantDiff = vibrant.Util.hexDiff(materialPalette[color]['900']['hex'], palette.Vibrant.getHex());
            vibrantRatio[color] = vibrantDiff;

            var darkVibrantDiff = vibrant.Util.hexDiff(materialPalette[color]['900']['hex'], palette.DarkVibrant.getHex());
            darkVibrantRatio[color] = darkVibrantDiff;
        });

        var isArkJpg = path.basename(url) === 'Ark.jpg';
        response.primaryColor = isArkJpg ? 'red' : sortObj(vibrantRatio)[0];
        response.accentColor = sortObj(darkVibrantRatio)[0];

        callback(response);
    });
}

angular
    .module('arkApp', ['ngMaterial', 'md.data.table', 'arkclient', 'gettext', 'monospaced.qrcode'])
    .config(function($mdThemingProvider, $mdIconProvider, networkServiceProvider){
        var network = networkServiceProvider.$get().getNetwork();
        var palettes = $mdThemingProvider.$get().PALETTES;

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu", "./assets/svg/menu.svg", 24)
            .icon("ledger", "./assets/svg/ledger.svg", 24);

        $mdThemingProvider.theme('default')
            .primaryPalette(defaultTheme.primaryColor)
            .accentPalette(defaultTheme.accentColor)
            .warnPalette(defaultTheme.warnColor);

        $mdThemingProvider.alwaysWatchTheme(true);
        $mdThemingProvider.generateThemesOnDemand(true);

        extractPalette(network.background, palettes, function(colors) {
            if (!colors) return;
            
            $mdThemingProvider.theme('default')
                .primaryPalette(colors.primaryColor)
                .accentPalette(colors.accentColor)
                .warnPalette(colors.warnColor);
            
            $mdThemingProvider.$get().generateTheme('default');
        });

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
