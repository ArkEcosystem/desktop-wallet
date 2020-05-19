import { URL } from 'url';
import logger from 'electron-log';
import path from 'path';
var allowedProtocols = [
    'ark:',
    'http:',
    'https:'
];
var isValidURL = function (input) {
    if (!input) {
        return false;
    }
    try {
        var uri = new URL(input);
        var isAllowed = allowedProtocols.includes(uri.protocol);
        if (!isAllowed) {
            logger.error('[webframe]: Protocol not allowed.');
        }
        return isAllowed;
    }
    catch (_a) {
        logger.error("[webframe]: Invalid url. Make sure to set the protocol (" + allowedProtocols.join(',') + ").");
        return false;
    }
};
export default {
    name: 'WebFrame',
    functional: true,
    props: {
        src: {
            type: String,
            required: false,
            default: null
        },
        width: {
            type: Number,
            required: false,
            default: null
        },
        height: {
            type: Number,
            required: false,
            default: null
        }
    },
    render: function (h, ctx) {
        var src = ctx.props.src;
        var url = isValidURL(src) ? src : 'about:blank';
        return h('webview', {
            attrs: {
                width: ctx.props.width,
                height: ctx.props.height,
                class: ctx.data.staticClass,
                src: url,
                enableremotemodule: 'false',
                preload: "file:" + path.resolve(__static, './webview-preload.js')
            },
            on: {
                'console-message': function (event) {
                    var message = typeof event.message !== 'string' ? JSON.stringify(event.message) : event.message;
                    if (event.level === 2) {
                        logger.error('[webframe log]:', message);
                    }
                    else {
                        logger.log('[webframe log]:', message);
                    }
                },
                'will-navigate': function (event) {
                    if (!isValidURL(event.url)) {
                        event.target.stop();
                        event.target.location = 'about:blank';
                    }
                },
                'ipc-message': function (event) {
                    window.postMessage({
                        action: event.channel,
                        data: event.args.length ? event.args[0] : {}
                    });
                }
            }
        });
    }
};
//# sourceMappingURL=WebFrame.js.map