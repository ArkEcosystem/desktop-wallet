var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import path from 'path';
import { sortBy } from 'lodash';
import { flatten } from '@/utils';
import imageManager from '@/services/image-manager';
export default {
    computed: {
        allImages: function () {
            var additional = this.additional ? this.additional : [];
            return flatten(__spreadArrays(Object.values(this.images), additional));
        },
        /**
         * Images grouped by category.
         * Instead of using the image path only, each image Object is composed by
         * the image path and its filename as title.
         */
        images: function () {
            var _this = this;
            var componentName = this.strings_snakeCase(this.$options.name).toUpperCase();
            var groups = imageManager.tree;
            return this.categories.reduce(function (all, category) {
                if (groups[category]) {
                    var translatedCategory = _this.$t(componentName + "." + category.toUpperCase());
                    var images = groups[category].map(function (imagePath) {
                        var name = path.parse(imagePath).name;
                        return {
                            title: name,
                            imagePath: imagePath
                        };
                    });
                    all[translatedCategory] = sortBy(images, 'title');
                }
                return all;
            }, {});
        },
        selectedItem: function () {
            var _this = this;
            return this.allImages.find(function (image) {
                if (image.name && _this.selected) {
                    if (image.name === _this.selected.avatarName) {
                        return true;
                    }
                }
                return image.imagePath === _this.selected;
            });
        }
    },
    methods: {
        select: function (selection) {
            if (selection.imagePath) {
                this.$emit('select', selection.imagePath);
            }
            else if (selection.component) {
                this.$emit('select', selection);
            }
            else {
                this.$emit('select', selection);
            }
        }
    }
};
//# sourceMappingURL=mixin-selection-image.js.map