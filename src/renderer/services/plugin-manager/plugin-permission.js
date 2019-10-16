class Permission {
  constructor ({
    name,
    description
  }) {
    this.name = name
    this.description = description
  }
}

export const AVATARS = new Permission({ name: 'AVATARS' })
export const COMPONENTS = new Permission({ name: 'COMPONENTS' })
export const HTTP = new Permission({ name: 'HTTP' })
export const MENU_ITEMS = new Permission({ name: 'MENU_ITEMS' })
export const MESSAGING = new Permission({ name: 'MESSAGING' })
export const PUBLIC = new Permission({ name: 'PUBLIC' })
export const ROUTES = new Permission({ name: 'ROUTES' })
export const THEMES = new Permission({ name: 'THEMES' })
export const TIMERS = new Permission({ name: 'TIMERS' })
export const UI_COMPONENTS = new Permission({ name: 'UI_COMPONENTS' })
export const WALLET_TABS = new Permission({ name: 'WALLET_TABS' })
export const WEBFRAME = new Permission({ name: 'WEBFRAME' })
export const WEBSOCKET = new Permission({ name: 'WEBSOCKET' })
export const PROFILE_ALL = new Permission({ name: 'PROFILE_ALL' })
export const PROFILE_CURRENT = new Permission({ name: 'PROFILE_CURRENT' })
export const PEER_CURRENT = new Permission({ name: 'PEER_CURRENT' })
export const STORAGE = new Permission({ name: 'STORAGE' })
export const AUDIO = new Permission({ name: 'AUDIO' })
export const EVENTS = new Permission({ name: 'EVENTS' })
export const ALERTS = new Permission({ name: 'ALERTS' })
