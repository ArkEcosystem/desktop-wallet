import db from '@/store/db/instance'
import DbModule from './db-module'
import feedService from '@/services/feed'
import Announcement from '@/models/announcement'
import { ANNOUNCEMENTS } from '@config'

export default new DbModule('announcements', {
  getters: {
    /**
     * Read announcements
     * @return {Array}
     */
    read: state => state.all.filter(announcement => announcement.isRead),

    /**
     * Unread announcements
     * @return {Array}
     */
    unread: state => state.all.filter(announcement => !announcement.isRead)
  },

  actions: {
    /**
     * Fetches the latest feed and creates the new items on the db.
     */
    async fetch () {
      try {
        const items = await feedService.fetchItems(ANNOUNCEMENTS.rssUrl)

        if (items) {
          items.forEach(async item => {
            const announcement = Announcement.fromFeedItem(item)
            const found = await db.find(announcement.id)

            if (!found) {
              await this.dispatch('announcements/create', announcement)
            }
          })
        }
      } catch (errror) {
        // TODO alert/toast component
        console.error('Error loading the announcements.')
      }
    },
    /**
     * Synchronizes the data, fetching the latest items of the feed first and
     * then loading the older from the db.
     */
    async sync () {
      await this.dispatch('announcements/fetch')
      await this.dispatch('announcements/load')
    }
  }
})
