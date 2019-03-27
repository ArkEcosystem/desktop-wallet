import announcementStore from '@/store/modules/announcements'

describe('the announcementStore mutations', () => {
  it('saves announcements to state', () => {
    // vuex state -- will be modified by mutation
    let state = {
      announcements: []
    }

    // array mimicking raw data from data feed service
    const announcementsFromFeed = require('../../__fixtures__/services/feed-items')

    // do the mutation
    announcementStore.mutations.SAVE_ANNOUNCEMENTS(state, announcementsFromFeed)

    // pull first announcement from state and from feed to make comparison easier
    const firstAnnouncement = state.announcements[0]
    const firstAnnouncementFromFeed = announcementsFromFeed[0]

    expect(firstAnnouncement.date).toEqual(firstAnnouncementFromFeed.isoDate)
    expect(firstAnnouncement.guid).toEqual(firstAnnouncementFromFeed.guid)
    expect(firstAnnouncement.title).toEqual(firstAnnouncementFromFeed.title)
    expect(firstAnnouncement.url).toEqual(firstAnnouncementFromFeed.link)
    expect(firstAnnouncement.isRead).toEqual(false)
    expect(firstAnnouncementFromFeed.isRead).toEqual(undefined)
  })

  it('marks an announcement as read', () => {
    // create state
    let state = {
      announcements: []
    }

    announcementStore.mutations.SAVE_ANNOUNCEMENTS(state, [
      {
        guid: 'TESTGUID',
        title: 'Testing the mark-as-read functionality'
      }
    ])

    expect(state.announcements[0].isRead).toBe(false)

    announcementStore.mutations.MARK_ANNOUNCEMENT_AS_READ(
      state,
      state.announcements[0]
    )

    expect(state.announcements[0].isRead).toBe(true)
  })
})

describe('the announcementStore getters', () => {
  it('fetches announcements from state', () => {
    // create state with items
    let state = {
      announcements: [
        {
          guid: '1234ABCD',
          title: 'Ark Arrives At Moon',
          summary:
            'The value of ARK reached 3 Bitcoin today as all hodlers bought lambos for their pets.',
          url: 'https://fakenews.com/ark-lunar-trip'
        },
        {
          guid: '1FSAFEWA',
          title: 'Second News Article',
          summary:
            'The value of ARK reached 6 Bitcoin today as all hodlers bought lambos for their pets.',
          url: 'https://fakenews.com/ark-lunar-trip'
        },
        {
          guid: '3123321',
          title: 'Moon arrives at ark',
          summary:
            'The value of ARK reached 213 Bitcoin today as all hodlers bought lambos for their pets.',
          url: 'https://fakenews.com/ark-lunar-trip'
        },
        {
          guid: 'LDKJASD',
          title: 'Fourth News Article',
          summary:
            'The value of ARK reached 431 Bitcoin today as all hodlers bought lambos for their pets.',
          url: 'https://fakenews.com/ark-lunar-trip'
        }
      ]
    }

    const fetchedAnnouncements = announcementStore.getters.all(state)

    fetchedAnnouncements.forEach(announcement => {
      expect(state.announcements).toContainEqual(announcement)
    })
  })

  it('fetches a single announcement from state', () => {
    let state = {
      announcements: [
        {
          guid: '1234ABCD',
          title: 'Ark Arrives At Moon',
          summary:
            'The value of ARK reached 3 Bitcoin today as all hodlers bought lambos for their pets.',
          url: 'https://fakenews.com/ark-lunar-trip'
        },
        {
          guid: '1FSAFEWA',
          title: 'Second News Article',
          summary:
            'The value of ARK reached 6 Bitcoin today as all hodlers bought lambos for their pets.',
          url: 'https://fakenews.com/ark-lunar-trip'
        },
        {
          guid: '3123321',
          title: 'Moon arrives at ark',
          summary:
            'The value of ARK reached 213 Bitcoin today as all hodlers bought lambos for their pets.',
          url: 'https://fakenews.com/ark-lunar-trip'
        },
        {
          guid: 'LDKJASD',
          title: 'Fourth News Article',
          summary:
            'The value of ARK reached 431 Bitcoin today as all hodlers bought lambos for their pets.',
          url: 'https://fakenews.com/ark-lunar-trip'
        }
      ]
    }

    const response = announcementStore.getters.findById(state, {
      guid: 'LDKJASD'
    }) // guid from sample state

    expect(state.announcements).toContainEqual(response)
  })

  it('fetches all read and unread announcements from state', () => {
    let state = {
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
    }

    const readAnnouncements = announcementStore.getters.read(state)
    const unreadAnnouncements = announcementStore.getters.unread(state)

    readAnnouncements.forEach(readAnnouncement => {
      expect(readAnnouncement.isRead).toBe(true)
      expect(unreadAnnouncements).not.toContainEqual(readAnnouncement)
    })

    unreadAnnouncements.forEach(unreadAnnouncement => {
      expect(unreadAnnouncement.isRead).toBe(false)
      expect(readAnnouncements).not.toContainEqual(unreadAnnouncement)
    })

    const allAnnouncements = readAnnouncements.concat(unreadAnnouncements)

    expect(allAnnouncements).toHaveLength(state.announcements.length)
  })
})
