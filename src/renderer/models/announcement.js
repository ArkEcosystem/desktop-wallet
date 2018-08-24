import truncHtml from 'trunc-html'
import Model from './model'

export default class Announcement extends Model {
  /**
   * The configuration of the summaries that are generated from the feed
   * @return {Array}
   */
  static get feedSummaryConfig () {
    return [
      300, // Maximum number of character
      {
        // Use the default configuration of `trunc-html` and the serializer `insane`
      }
    ]
  }

  static fromFeedItem (item) {
    const content = item['content:encoded']

    // Get the text only. It is not perfect, but it is safer than HTML
    const summary = truncHtml(content, ...Announcement.feedSummaryConfig).text

    return new Announcement({
      guid: item.guid,
      date: item.isoDate,
      title: item.title,
      summary,
      url: item.link,
      isRead: false
    })
  }

  get id () {
    return [this.modelType, this.guid].join(Model.modelType.separator)
  }

  get schema () {
    return {
      required: ['guid', 'date', 'title', 'summary', 'url', 'isRead'],
      properties: {
        guid: {
          type: 'string'
        },
        date: {
          type: 'date-time'
        },
        title: {
          type: 'string'
        },
        summary: {
          type: 'string'
        },
        url: {
          type: 'uri'
        },
        isRead: {
          type: 'boolean'
        }
      }
    }
  }

  set isRead (newValue) {
    this.__data.isRead = newValue
  }
}
