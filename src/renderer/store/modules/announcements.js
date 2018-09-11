import { SAVE_ANNOUNCEMENTS, MARK_ANNOUNCEMENT_AS_READ } from '../mutation-types'
import Announcement from '@/models/announcement'
import feedService from '@/services/feed'
import { ANNOUNCEMENTS } from '@config'
import { unionBy } from 'lodash'

export default {
  namespaced: true,

  state: {
    announcements: []
  },

  getters: {
    browse: ({ announcements }) => announcements,

    read: ({ announcements }, announcement) => {
      return announcements.find(storedAnnouncement => storedAnnouncement.guid === announcement.guid)
    },

    unreadAnnouncements: ({ announcements }) => announcements.filter(announcement => !announcement.isRead),

    readAnnouncements: ({ announcements }) => announcements.filter(announcement => announcement.isRead)
  },

  mutations: {
    [SAVE_ANNOUNCEMENTS] (state, items) {
      const announcementsFromFeedItems = items.map(item => Announcement.create(item))

      state.announcements = unionBy(state.announcements, announcementsFromFeedItems, 'guid')
    },

    [MARK_ANNOUNCEMENT_AS_READ] (state, readAnnouncement) {
      let readAnnouncementIndex = state.announcements.findIndex(announcement => announcement.guid === readAnnouncement.guid)

      state.announcements[readAnnouncementIndex].isRead = true
    }
  },

  actions: {
    markAsRead ({ commit }, announcement) {
      commit(MARK_ANNOUNCEMENT_AS_READ, announcement)
    },

    async syncAnnouncements ({ commit }) {
      let items = await feedService.fetchItems(ANNOUNCEMENTS.rssUrl) // TODO: can move URL into FeedService

      commit(SAVE_ANNOUNCEMENTS, items)
    }
  }
}
