import WebFrame from '@/components/utils/WebFrame';
export function create(plugin) {
    return function () {
        plugin.globalComponents[WebFrame.name] = WebFrame;
    };
}
//# sourceMappingURL=webframe-setup.js.map