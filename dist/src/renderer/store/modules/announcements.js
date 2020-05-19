var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Announcement from '@/models/announcement';
import feedService from '@/services/feed';
import { ANNOUNCEMENTS as source } from '@config';
import { unionBy } from 'lodash';
import Vue from 'vue';
export default {
    namespaced: true,
    state: {
        announcements: []
    },
    getters: {
        all: function (state) { return state.announcements; },
        findById: function (state, announcement) {
            return state.announcements.find(function (storedAnnouncement) { return storedAnnouncement.guid === announcement.guid; });
        },
        unread: function (state) { return state.announcements.filter(function (announcement) { return !announcement.isRead; }); },
        read: function (state) { return state.announcements.filter(function (announcement) { return announcement.isRead; }); }
    },
    mutations: {
        SAVE_ANNOUNCEMENTS: function (state, items) {
            var announcementsFromFeedItems = items.map(function (item) { return Announcement.deserialize(item); });
            state.announcements = unionBy(state.announcements, announcementsFromFeedItems, 'guid');
        },
        MARK_ANNOUNCEMENT_AS_READ: function (state, readAnnouncement) {
            var readAnnouncementIndex = state.announcements.findIndex(function (announcement) { return announcement.guid === readAnnouncement.guid; });
            Vue.set(state.announcements, readAnnouncementIndex, __assign(__assign({}, readAnnouncement), { summary: null, isRead: true }));
        },
        MARK_ANNOUNCEMENT_AS_READ_BULK: function (state, announcements) {
            var announcementsToUpdate = [];
            var _loop_1 = function (announcement) {
                var isRead = announcement.isRead;
                if (announcements.find(function (readAnnouncement) { return announcement.guid === readAnnouncement.guid; })) {
                    isRead = true;
                }
                announcementsToUpdate.push(__assign(__assign({}, announcement), { summary: isRead ? null : announcement.summary, isRead: isRead }));
            };
            for (var _i = 0, _a = state.announcements; _i < _a.length; _i++) {
                var announcement = _a[_i];
                _loop_1(announcement);
            }
            Vue.set(state, 'announcements', announcementsToUpdate);
        }
    },
    actions: {
        markAsRead: function (_a, announcement) {
            var commit = _a.commit;
            commit('MARK_ANNOUNCEMENT_AS_READ', announcement);
        },
        markAsReadBulk: function (_a, announcements) {
            var commit = _a.commit;
            commit('MARK_ANNOUNCEMENT_AS_READ_BULK', announcements);
        },
        fetch: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var items;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, feedService.fetchItems(source.rssUrl)];
                        case 1:
                            items = _b.sent();
                            commit('SAVE_ANNOUNCEMENTS', items);
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
};
//# sourceMappingURL=announcements.js.map