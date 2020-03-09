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
      const readAnnouncementIndex = state.announcements.findIndex(announcement => announcement.guid === readAnnouncement.guid)
      Vue.set(state.announcements, readAnnouncementIndex, {
        ...readAnnouncement,
        summary: null,
        isRead: true
      })
    },

    MARK_ANNOUNCEMENT_AS_READ_BULK (state, announcements) {
      const announcementsToUpdate = []
      for (const announcement of state.announcements) {
        let isRead = announcement.isRead
        if (announcements.find(readAnnouncement => announcement.guid === readAnnouncement.guid)) {
          isRead = true
        }

        announcementsToUpdate.push({
          ...announcement,
          summary: isRead ? null : announcement.summary,
          isRead
        })
      }

      Vue.set(state, 'announcements', announcementsToUpdate)
    }
  },

  actions: {
    markAsRead ({ commit }, announcement) {
      commit('MARK_ANNOUNCEMENT_AS_READ', announcement)
    },

    markAsReadBulk ({ commit }, announcements) {
      commit('MARK_ANNOUNCEMENT_AS_READ_BULK', announcements)
    },

    async fetch ({ commit }) {
      const items = await feedService.fetchItems(source.rssUrl)

      commit('SAVE_ANNOUNCEMENTS', items)
    }
  }
}
