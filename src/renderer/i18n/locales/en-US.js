export default {

  COMMON: {
    AVATAR: 'Avatar',
    BACK: 'Back',
    DONE: 'Done',
    CURRENCY: 'Currency',
    LANGUAGE: 'Language',
    NETWORK: 'Network',
    NEXT: 'Next',
    PROFILE_NAME: 'Profile name',
    SAVE: 'Save',
    SELECT_BACKGROUND: 'Select background',
    SELECT_THEME: 'Select wallet theme',
    FAILED_FETCH: 'Failed to fetch {name}. Reason: "{msg}".'
  },

  LANGUAGES: {
    'en-US': 'English',
    'es-ES': 'Spanish',
    'pt-BR': 'Portugues - Brazil'
  },

  BUTTON_CLIPBOARD: {
    DONE: 'Copied!',
    COPY_TO_CLIPBOARD: 'Copy to clipboard',
    NOT_SUPPORTED: 'Copying to clipboard is not unavailable'
  },

  DELEGATES_TABLE: {
    RATE: 'Rate',
    USERNAME: 'Username',
    PRODUCTIVITY: 'Productivity',
    APPROVAL: 'Approval'
  },

  INPUT_ADDRESS: {
    LABEL: 'Address',
    ERROR: {
      NOT_VALID: 'The address is not valid',
      REQUIRED: 'The address is required'
    }
  },

  SELECTION_AVATAR: {
    AVATARS: 'Avatars',
    POPUP_HEADER: 'Select avatar'
  },

  SELECTION_BACKGROUND: {
    POPUP_HEADER: 'Select background',
    TEXTURES: 'Textures',
    WALLPAPERS: 'Wallpapers'
  },

  InputGrid: {
    more: 'Show more',
    popupHeader: 'Select'
  },

  QRCode: {
    popupTitle: 'QR Code',
    popupSubtitle: 'Scan for Address'
  },

  PASSPHRASE_INPUT: {
    LABEL: 'Passphrase',
    ERROR: {
      NOT_MATCH: 'The passphrase does not match the address',
      NOT_VALID: 'The passphrase is not valid',
      REQUIRED: 'The passphrase is required'
    }
  },

  PASSPHRASE_VERIFICATION: {
    WORD_LABEL_1: 'The 1st word',
    WORD_LABEL_2: 'The 2nd word',
    WORD_LABEL_3: 'The 3rd word',
    WORD_LABEL_4: 'The 4th word',
    WORD_LABEL_5: 'The 5th word',
    WORD_LABEL_6: 'The 6th word',
    WORD_LABEL_7: 'The 7th word',
    WORD_LABEL_8: 'The 8th word',
    WORD_LABEL_9: 'The 9th word',
    WORD_LABEL_10: 'The 10th word',
    WORD_LABEL_11: 'The 11th word',
    WORD_LABEL_12: 'The 12th word'
  },

  PAGES: {
    PROFILE_ALL: {
      HEADER: 'My profiles',
      ADD_PROFILE: 'Add profile',
      EDIT_PROFILE: 'Edit profile',
      SELECT_PROFILE: 'Use this profile'
    },
    PROFILE_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Create a profile',
          TEXT: 'Enter your name or nickname and select your preferred language and default currency.'
        },
        NAME: 'Profile name'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Network selection',
          TEXT: 'Choose the network of this profile.'
        },
        NAME: 'Profile name'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Appearance',
          TEXT: 'Customize this application selecting one of our themes and backgrounds.'
        },
        NAME: 'Profile name'
      }
    },
    PROFILE_EDITION: {
      TAB_PROFILE: {
        INSTRUCTIONS: {
          HEADER: 'Edit this profile',
          TEXT: 'Here you can modify your name or nickname, select your preferred language and default currency, the network and avatar.'
        },
        TITLE: 'Profile'
      },
      TAB_DESIGN: {
        INSTRUCTIONS: {
          HEADER: 'Customize this wallet',
          TEXT: 'Here you can choose the default theme (light or dark) and the bakground.'
        },
        TITLE: 'Wallet design'
      }
    },
    WALLET_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'New wallet',
          TEXT_BEFORE_BUTTON: 'Select one of these freshly generated wallets. If you do not like them, click on the',
          TEXT_AFTER_BUTTON: 'button to generate others.'
        },
        TITLE: '1. Choose wallet'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Your personal key',
          TEXT: 'Be sure to save your passphrase securely. Do not show this passphrase to anyone.'
        },
        TITLE: '2. Backup'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Passphrase confirmation',
          TEXT: 'Type {words} from your passphrase to verify the new account.',
          ALL_WORDS: 'all the words',
          WORDS: 'the words {words}'
        },
        TITLE: '3. Verification',
        CHECK_ENTIRE_PASSPHRASE: 'Check the entire passphrase',
        VERIFY_ALL_WORDS: 'Verify each passphrase word'
      },
      STEP4: {
        INSTRUCTIONS: {
          HEADER: 'Wallet configuration',
          TEXT: 'Choose a name for you wallet and decide which operations could perform and you are done.'
        },
        TITLE: '4. Confirmation',
        ADDRESS: 'Wallet address',
        NAME: 'Wallet name',
        OPERATIONS: 'Wallet operations',
        SENDING_ENABLED: 'Sending transactions enabled'
      }
    }
  }

}
