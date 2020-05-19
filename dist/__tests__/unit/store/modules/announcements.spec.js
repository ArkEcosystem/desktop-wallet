import announcementStore from '@/store/modules/announcements';
describe('announcements store module', function () {
    describe('the announcementStore mutations', function () {
        it('SAVE_ANNOUNCEMENTS', function () {
            // vuex state -- will be modified by mutation
            var state = {
                announcements: []
            };
            // array mimicking raw data from data feed service
            var announcementsFromFeed = require('../../__fixtures__/services/feed-items');
            // do the mutation
            announcementStore.mutations.SAVE_ANNOUNCEMENTS(state, announcementsFromFeed);
            // pull first announcement from state and from feed to make comparison easier
            var firstAnnouncement = state.announcements[0];
            var firstAnnouncementFromFeed = announcementsFromFeed[0];
            expect(firstAnnouncement.date).toEqual(firstAnnouncementFromFeed.isoDate);
            expect(firstAnnouncement.guid).toEqual(firstAnnouncementFromFeed.guid);
            expect(firstAnnouncement.title).toEqual(firstAnnouncementFromFeed.title);
            expect(firstAnnouncement.url).toEqual(firstAnnouncementFromFeed.link);
            expect(firstAnnouncement.isRead).toEqual(false);
            expect(firstAnnouncementFromFeed.isRead).toEqual(undefined);
        });
        it('MARK_ANNOUNCEMENT_AS_READ', function () {
            // create state
            var state = {
                announcements: []
            };
            announcementStore.mutations.SAVE_ANNOUNCEMENTS(state, [{
                    guid: 'TESTGUID',
                    title: 'Testing the mark-as-read functionality'
                }]);
            expect(state.announcements[0].isRead).toBe(false);
            announcementStore.mutations.MARK_ANNOUNCEMENT_AS_READ(state, state.announcements[0]);
            expect(state.announcements[0].isRead).toBe(true);
        });
        it('MARK_ANNOUNCEMENT_AS_READ_BULK', function () {
            // create state
            var state = {
                announcements: []
            };
            announcementStore.mutations.SAVE_ANNOUNCEMENTS(state, [{
                    guid: 'announcement-1',
                    title: 'announcement-1'
                }, {
                    guid: 'announcement-2',
                    title: 'announcement-2'
                }, {
                    guid: 'announcement-3',
                    title: 'announcement-3'
                }]);
            for (var _i = 0, _a = state.announcements; _i < _a.length; _i++) {
                var announcement = _a[_i];
                expect(announcement.isRead).toBe(false);
            }
            announcementStore.mutations.MARK_ANNOUNCEMENT_AS_READ_BULK(state, [
                {
                    guid: 'announcement-2',
                    title: 'announcement-2'
                }, {
                    guid: 'announcement-3',
                    title: 'announcement-3'
                }
            ]);
            expect(state.announcements[0].isRead).toBe(false);
            expect(state.announcements[1].isRead).toBe(true);
            expect(state.announcements[2].isRead).toBe(true);
        });
    });
    describe('the announcementStore getters', function () {
        it('fetches announcements from state', function () {
            // create state with items
            var state = {
                announcements: [
                    {
                        guid: '1234ABCD',
                        title: 'Ark Arrives At Moon',
                        summary: 'The value of ARK reached 3 Bitcoin today as all hodlers bought lambos for their pets.',
                        url: 'https://fakenews.com/ark-lunar-trip'
                    },
                    {
                        guid: '1FSAFEWA',
                        title: 'Second News Article',
                        summary: 'The value of ARK reached 6 Bitcoin today as all hodlers bought lambos for their pets.',
                        url: 'https://fakenews.com/ark-lunar-trip'
                    },
                    {
                        guid: '3123321',
                        title: 'Moon arrives at ark',
                        summary: 'The value of ARK reached 213 Bitcoin today as all hodlers bought lambos for their pets.',
                        url: 'https://fakenews.com/ark-lunar-trip'
                    },
                    {
                        guid: 'LDKJASD',
                        title: 'Fourth News Article',
                        summary: 'The value of ARK reached 431 Bitcoin today as all hodlers bought lambos for their pets.',
                        url: 'https://fakenews.com/ark-lunar-trip'
                    }
                ]
            };
            var fetchedAnnouncements = announcementStore.getters.all(state);
            fetchedAnnouncements.forEach(function (announcement) {
                expect(state.announcements).toContainEqual(announcement);
            });
        });
        it('fetches a single announcement from state', function () {
            var state = {
                announcements: [
                    {
                        guid: '1234ABCD',
                        title: 'Ark Arrives At Moon',
                        summary: 'The value of ARK reached 3 Bitcoin today as all hodlers bought lambos for their pets.',
                        url: 'https://fakenews.com/ark-lunar-trip'
                    },
                    {
                        guid: '1FSAFEWA',
                        title: 'Second News Article',
                        summary: 'The value of ARK reached 6 Bitcoin today as all hodlers bought lambos for their pets.',
                        url: 'https://fakenews.com/ark-lunar-trip'
                    },
                    {
                        guid: '3123321',
                        title: 'Moon arrives at ark',
                        summary: 'The value of ARK reached 213 Bitcoin today as all hodlers bought lambos for their pets.',
                        url: 'https://fakenews.com/ark-lunar-trip'
                    },
                    {
                        guid: 'LDKJASD',
                        title: 'Fourth News Article',
                        summary: 'The value of ARK reached 431 Bitcoin today as all hodlers bought lambos for their pets.',
                        url: 'https://fakenews.com/ark-lunar-trip'
                    }
                ]
            };
            var response = announcementStore.getters.findById(state, { guid: 'LDKJASD' }); // guid from sample state
            expect(state.announcements).toContainEqual(response);
        });
        it('fetches all read and unread announcements from state', function () {
            var state = {
                announcements: [
                    {
                        guid: 1,
                        isRead: false
                    },
                    {
                        guid: 2,
                        isRead: false
                    },
                    {
                        guid: 5,
                        isRead: true
                    },
                    {
                        guid: 43,
                        isRead: true
                    }
                ]
            };
            var readAnnouncements = announcementStore.getters.read(state);
            var unreadAnnouncements = announcementStore.getters.unread(state);
            readAnnouncements.forEach(function (readAnnouncement) {
                expect(readAnnouncement.isRead).toBe(true);
                expect(unreadAnnouncements).not.toContainEqual(readAnnouncement);
            });
            unreadAnnouncements.forEach(function (unreadAnnouncement) {
                expect(unreadAnnouncement.isRead).toBe(false);
                expect(readAnnouncements).not.toContainEqual(unreadAnnouncement);
            });
            var allAnnouncements = readAnnouncements.concat(unreadAnnouncements);
            expect(allAnnouncements).toHaveLength(state.announcements.length);
        });
    });
});
//# sourceMappingURL=announcements.spec.js.map