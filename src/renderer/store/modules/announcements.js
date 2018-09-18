import Announcement from '@/models/announcement'
import feedService from '@/services/feed'
import { ANNOUNCEMENTS as source } from '@config'
import { unionBy } from 'lodash'

export default {
  namespaced: true,

  state: {
    announcements: []
  },

  getters: {
    all: ({ announcements }) => announcements,

    findById: ({ announcements }, announcement) => {
      return announcements.find(storedAnnouncement => storedAnnouncement.guid === announcement.guid)
    },

    unread: ({ announcements }) => announcements.filter(announcement => !announcement.isRead),

    read: ({ announcements }) => announcements.filter(announcement => announcement.isRead)
  },

  mutations: {
    SAVE_ANNOUNCEMENTS (state, items) {
      const announcementsFromFeedItems = items.map(item => Announcement.deserialize(item))

      state.announcements = unionBy(state.announcements, announcementsFromFeedItems, 'guid')
    },

    MARK_ANNOUNCEMENT_AS_READ (state, readAnnouncement) {
      let readAnnouncementIndex = state.announcements.findIndex(announcement => announcement.guid === readAnnouncement.guid)

      state.announcements[readAnnouncementIndex].isRead = true
    }
  },

  actions: {
    markAsRead ({ commit }, announcement) {
      commit('MARK_ANNOUNCEMENT_AS_READ', announcement)
    },

    async fetch ({ commit }) {
      let items = await feedService.fetchItems(source.rssUrl) // TODO: can move URL into FeedService

      commit('SAVE_ANNOUNCEMENTS', items)
    }
  }
}
