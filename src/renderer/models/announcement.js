import trunc from 'trunc-html'
export default class Announcement {
  static create (data) {
    const announcement = new Announcement()

    Object.defineProperties(announcement, Announcement.marshalDataToProperties(data))

    return announcement
  }

  static marshalDataToProperties (data) {
    return {
      guid: {
        enumerable: true,
        value: data.guid
      },
      date: {
        enumerable: true,
        value: data.isoDate
      },
      title: {
        enumerable: true,
        value: data.title
      },
      summary: {
        enumerable: true,
        value: trunc(data['content:encoded'], 300).text
      },
      url: {
        enumerable: true,
        value: data.link
      },
      isRead: {
        enumerable: true,
        writable: true,
        value: false
      }
    }
  }
}
