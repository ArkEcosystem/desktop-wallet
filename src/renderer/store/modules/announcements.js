import Announcement from '@/models/announcement'
import feedService from '@/services/feed'
import { ANNOUNCEMENTS as source } from '@config'
import { unionBy } from 'lodash'
import Vue from 'vue'

export default {
  namespaced: true,

  state: {
    announcements: []
  },

  getters: {
    all: state => state.announcements,
    findById: (state, announcement) => {
      return state.announcements.find(storedAnnouncement => storedAnnouncement.guid === announcement.guid)
    },
    unread: state => state.announcements.filter(announcement => !announcement.isRead),
    read: state => state.announcements.filter(announcement => announcement.isRead)
  },

  mutations: {
    SAVE_ANNOUNCEMENTS (state, items) {
      const announcementsFromFeedItems = items.map(item => Announcement.deserialize(item))

      state.announcements = unionBy(state.announcements, announcementsFromFeedItems, 'guid')
    },

    MARK_ANNOUNCEMENT_AS_READ (state, readAnnouncement) {
      let readAnnouncementIndex = state.announcements.findIndex(announcement => announcement.guid === readAnnouncement.guid)
      Vue.set(state.announcements, readAnnouncementIndex, {
        ...readAnnouncement,
        isRead: true
      })
    }
  },

  actions: {
    markAsRead ({ commit }, announcement) {
      commit('MARK_ANNOUNCEMENT_AS_READ', announcement)
    },

    async fetch ({ commit }) {
      const items = await feedService.fetchItems(source.rssUrl)

      commit('SAVE_ANNOUNCEMENTS', items)
    }
  }
}
