export default {
  COMMON: {
    ALL: 'All',
    APP_NAME: 'ARK Desktop Wallet',
    APPEARANCE: 'Appearance',
    AVATAR: 'Avatar',
    BACK: 'Back',
    BACKGROUND: 'Background',
    BIP39_LANGUAGE: 'Passphrase Language (BIP39)',
    CONFIRM: 'Confirm',
    CURRENCY: 'Currency',
    DATE: 'Date',
    DONE: 'Done',
    FAILED_FETCH: 'Failed to fetch {name}. Reason: "{msg}".',
    FETCH: 'Fetch',
    FINISH: 'Finish',
    LANGUAGE: 'Application Language',
    NETWORK: 'Network',
    NEXT: 'Next',
    NOT: 'not',
    OF: 'of',
    OTHER: 'Other',
    PREV: 'Prev',
    PROFILE_NAME: 'Profile name',
    REMOVE: 'Remove',
    SAVE: 'Save',
    START: 'Start',
    THEME: 'Theme',
    TIME_FORMAT: 'Time format',
    VERIFIED_ADDRESS: 'This is a verified address',
    WARNING: 'Warning',
    WILL: 'will'
  },

  ANNOUNCEMENTS: {
    LATEST_NEWS: 'Latest News',
    READ_MORE: 'Read more'
  },

  INTRODUCTION: {
    PAGE_TITLE: 'Your {page}',
    WELCOME: {
      TITLE: 'Welcome to the {app}',
      SAFETY_MESSAGE: 'Please take a few moments to read the next few screens for your own safety.',
      FUNDS_WARNING: 'Your funds could be unrecoverable if you do not pay close attention to these warnings.'
    },
    POWER: {
      TITLE: 'Power',
      FINANCE: 'The most important thing for users to know about cryptocurrencies is that they completely reverse the commonly-accepted model of how finance works.',
      BANKS: 'In traditional finance, you give up direct control of your money to a bank. Because banks have control over your money, they can take actions on your behalf, such as refunding transactions and resetting your login info.',
      CRYPTO: 'Cryptocurrencies take that power and give it to you directly. Using nothing more than your passphrase, you can control exactly when, where and how your money is kept and spent.',
      RESPONSIBILITY: 'However, in the words of Uncle Ben Parker, with great power comes great responsibility.'
    },
    DUTY: {
      TITLE: 'Duty',
      INTRO: 'The blockchain industry is built to be censorship resistant. That means no one controls your account but you. This design brings the peace of mind that no central authority can confiscate, freeze, or manipulate your funds at any time. There is also no central location for personal data or funds to be hacked.',
      OWNER: 'This also brings greater responsibility for you, the account owner.',
      WARNING: {
        INFO: 'Unlike your traditional bank account, {warn}',
        WARN: 'lost passwords, passphrases or stolen funds cannot be restored by the delegates, ARK.io team, or anyone else.'
      },
      SECURITY: 'The security of your account is solely up to you.'
    },
    RESPONSIBILITY: {
      TITLE: 'Responsibility',
      STORAGE: {
        INFO: 'The {passphrase} of each wallet address is able to sign transactions and move funds. This means if your computer dies but you have your passphrase, you can still access your funds. The ARK Desktop Wallet has an additional feature that lets you set an {encrypted} as well, for easier management. If your computer dies, you cannot use the encrypted password to access your funds from a different machine. You will need the passphrase.',
        PASSPHRASE: 'passphrase',
        ENCRYPTED: 'encrypted password'
      },
      BACKUP: 'Always backup your passphrase and keep it in a safe place. You can write it down on thick paper and store multiple copies in secure locations. You can also store it on an encrypted flash drive. Alternatively, you can use a Ledger Nano S USB hardware device, available at Ledger.com, to store and access your funds and the ARK Desktop Wallet. You can plug your Ledger Nano S into your computer and access the ARK blockchain without needing to enter your passphrase.',
      PASSPHRASE: 'Remember, anyone who has your passphrase can access your funds. Never share your account with anyone and avoid storing it in locations that are susceptible to hacks, such as the Cloud.'
    },
    TURN: {
      TITLE: 'Turn',
      WALLET: 'Now armed with the knowledge of how important it is to keep your passphrases safe, you are ready to claim your financial autonomy with the ARK Desktop Wallet.',
      SUPPORT: 'ARK is an open-source ecosystem and if you need assistance, the ARK community and team is here to help. Create a post on reddit.ark.io, or join the real-time chat system at slack.ark.io.',
      CONCLUSION: 'Everyone here on the ARK.io team hopes you enjoy using the ARK Desktop Wallet to participate in the blockchain revolution!'
    }
  },

  SEARCH: {
    DEFAULT_PLACEHOLDER: 'Find transaction, address or delegate',
    FILTER: 'Filter',
    SEARCH_BY: 'Search by',
    SELECT_OPTION: 'Select an option',
    DELEGATE: 'Delegate',
    WALLETS: 'Wallets',
    PERIOD: 'Period'
  },

  CONTACT_REMOVAL_CONFIRMATION: {
    QUESTION: 'Are you sure you want to remove this contact?'
  },

  ENCRYPTION: {
    DECRYPTING: 'Decrypting wallet with password...',
    ENCRYPTING: 'Encrypting wallet with password...',
    FAILED_DECRYPT: 'Failed to decrypt passphrase'
  },

  PEER: {
    BEST: 'Connect to best',
    CONNECTED: 'Connected to peer',
    CONNECT_CUSTOM: 'Connect custom peer',
    CONNECT_FAILED: 'Failed to connect to peer',
    DELAY: 'Latency',
    DISCONNECT: 'Disconnect from peer',
    FAILED_REFRESH: 'Failed to refresh peers',
    HEIGHT: 'Block height',
    LAST_CHECKED: 'Last checked',
    NONE: 'None',
    NO_CONNECT: 'Could not connect',
    PEER: 'Peer',
    STATUS_CHECK_FAILED: 'Status check failed',
    WRONG_NETWORK: 'Wrong network'
  },

  VALIDATION: {
    TOO_LONG: 'The \'{0}\' is too long',
    INVALID_URI: 'Invalid URI',
    MAX_LENGTH: 'Max {0}',
    NOT_MATCH: 'The \'{0}\' does not match the \'{1}\'',
    NOT_VALID: 'The \'{0}\' is not valid',
    NOT_NUMERIC: 'The \'{0}\' is not numeric',
    NO_SCHEME: 'The \'{0}\' does not have \'http://\' or \'https://\'',
    NAME: {
      DUPLICATED: 'The name \'{0}\' already exists',
      EXISTS_AS_CONTACT: 'The name \'{0}\' has already been assigned to a contact',
      EXISTS_AS_WALLET: 'The name \'{0}\' has already been assigned to a wallet',
      MAX_LENGTH: 'The name should have less than {0} characters.',
      MIN_LENGTH: 'The name should have at least 1 character | The name should have at least {n} characters.'
    },
    PASSWORD: {
      TOO_SHORT: 'Your password must be at least {0} characters long',
      NUMBERS: 'Your password must contain at least 1 number',
      SPECIAL_CHARACTERS: 'Your password must contain at least 1 special character',
      NO_MATCH: 'Your passwords do not match'
    },
    ADDRESS: {
      EXISTS_AS_CONTACT: 'The address \'{0}\' has already been added as a contact',
      EXISTS_AS_WALLET: 'The address \'{0}\' has already been imported as a wallet'
    },
    REQUIRED: 'The \'{0}\' is required',
    SEND_NOT_ENABLED: 'Sending is not enabled for the selected wallet',
    WALLET_NOT_ACTIVE: 'Select a wallet and open the URI again',
    WARNING_BIP39: 'The \'{0}\' is a BIP39 Passphrase',
    WARNING_NOT_BIP39: 'The \'{0}\' is not a BIP39 Passphrase'
  },

  LANGUAGES: {
    'en-US': 'English',
    'es-ES': 'Spanish',
    'pt-BR': 'Portugues - Brazil'
  },

  TIME_FORMAT: {
    'Default': 'Default',
    '12h': '12h',
    '24h': '24h'
  },

  BIP39_LANGUAGES: {
    chinese_simplified: 'Chinese Simplified',
    chinese_traditional: 'Chinese Traditional',
    english: 'English',
    french: 'French',
    italian: 'Italian',
    japanese: 'Japanese',
    korean: 'Korean',
    spanish: 'Spanish'
  },

  MARKET: {
    MARKET: 'Market',
    HISTORICAL_DATA: 'Historical data',
    DAY: 'Day',
    WEEK: 'Week',
    MONTH: 'Month'
  },

  TABLE: {
    PAGE: 'Page',
    ROWS_PER_PAGE: 'Rows per page',
    NO_TRANSACTIONS: 'No transactions have been found. The latest transactions will be displayed here.',
    NO_DELEGATES: 'No delegates to be shown.'
  },

  APP: {
    RELEASE: {
      REQUEST_ERROR: 'Cannot check latest version'
    }
  },

  APP_FOOTER: {
    TEXT: 'Made with ♥ by Ark'
  },

  APP_SIDEMENU: {
    ANNOUNCEMENTS: 'Announcements',
    CONTACTS: 'My contacts',
    CURRENT_PROFILE: 'Your current profile is "{profileName}"',
    DASHBOARD: 'Dashboard',
    NETWORK: 'Network',
    NETWORKS: 'Manage networks',
    SETTINGS: {
      CURRENCY: 'Currency',
      DARK_MODE: 'Dark mode',
      SCREENSHOT_PROTECTION: 'Screenshot protection',
      BACKGROUND_UPDATE_LEDGER: 'Update Ledger in background',
      BROADCAST_PEERS: 'Broadcast to multiple peers',
      IS_MARKET_CHART_ENABLED: 'Chart on the dashboard',
      TITLE: 'Current settings',
      RESET_DATA: {
        TITLE: 'Reset data',
        QUESTION: 'Are you sure you want to wipe your data?',
        NOTE: 'All your data, including profiles, wallets, networks and contacts will be removed from the app and reset to default. The data, such as transactions, that are on the blockchain cannot be removed.'
      }
    },
    WALLETS: 'My wallets'
  },

  APP_SIDEMENU_NOTIFICATION: {
    NOTIFICATION: 'A new version ({version}) has been released. Upgrade now!',
    TOOLTIP: 'New version ({version}) has been released!'
  },

  MARKET_CHART: {
    TODAY: 'Today',
    TODAY_AT: 'Today at {hour}',
    WEEK: {
      LONG: {
        FRI: 'Friday',
        MON: 'Monday',
        SAT: 'Saturday',
        SUN: 'Sunday',
        TUE: 'Tuesday',
        THU: 'Thursday',
        WED: 'Wednesday'
      },
      SHORT: {
        FRI: 'FRI',
        MON: 'MON',
        SAT: 'SAT',
        SUN: 'SUN',
        TUE: 'TUE',
        THU: 'THU',
        WED: 'WED'
      }
    },
    YESTERDAY_AT: 'Yesterday at {hour}'
  },

  MARKET_CHART_HEADER: {
    PRICE: 'Price'
  },

  BUTTON_CLIPBOARD: {
    DONE: 'Copied!',
    COPY_TO_CLIPBOARD: 'Copy to clipboard',
    NOT_SUPPORTED: 'Copying to clipboard is not supported'
  },

  INPUT_ADDRESS: {
    ERROR: {
      NOT_VALID: 'The address is not valid',
      REQUIRED: 'The address is required',
      NEO_ADDRESS: 'This looks like a NEO address'
    },
    LABEL: 'Address',
    QR: 'Scan the QR code',
    KNOWN_ADDRESS: 'This wallet is known as "{address}"'
  },

  INPUT_CURRENCY: {
    ERROR: {
      LESS_THAN_MINIMUM: 'The minimum amount is {amount}',
      NOT_ENOUGH_AMOUNT: 'The maximum amount is {amount}',
      NOT_VALID: 'The amount is not valid',
      REQUIRED: 'The amount is required'
    },
    LABEL: 'Amount'
  },

  INPUT_FEE: {
    MINIMUM: 'Minimum',
    AVERAGE: 'Average',
    MAXIMUM: 'Maximum',
    INPUT: 'Input',
    ADVANCED: 'Advanced',
    LOW_FEE_NOTICE: 'Transactions with low fees may never get confirmed',
    ADVANCED_NOTICE: 'Be careful what fee you choose as it will cost more than necessary if too high',
    UNIQUE: 'The network fee has been set to the static value of {fee}',
    ERROR: {
      NOT_VALID: 'The fee is not valid',
      LESS_THAN_MINIMUM: 'The minimum fee is {fee}',
      MORE_THAN_MAXIMUM: 'The maximum fee is {fee}'
    }
  },

  INPUT_GRID: {
    MORE: 'Show more'
  },

  INPUT_GRID_MODAL: {
    TITLE: 'Select'
  },

  WALLET_SELECTION: {
    PROFILE: 'Sender Profile',
    WALLET: 'Sender Wallet'
  },

  MODAL_CONFIRMATION: {
    CANCEL: 'No, cancel',
    CONTINUE: 'Yes, I am sure',
    TITLE: 'Confirmation'
  },

  MODAL_QR_CODE: {
    TITLE: 'QR Code',
    SUBTITLE: 'Scan for Address'
  },

  MODAL_QR_SCANNER: {
    ERROR: {
      NOT_ALLOWED: 'We need access to the camera to scan a QR code',
      NOT_FOUND: 'We were unable to find a camera',
      NOT_SUPPORTED: 'The page is not served over a secure connection (https)',
      NOT_READABLE: 'We are unable to read the camera stream, maybe it is already in use?',
      OVERCONSTRAINED: 'It seems that we were unable to find a correct camera. This might be an issue with the constraints we expect.',
      STREAM: 'It seems that you are using an unsupported browser. That is very curious..'
    },
    LOADING: 'Loading camera',
    INSTRUCTION: 'Please hold a QR code in front of the camera',
    TITLE: 'QR Scanner',
    DECODE_FAILED: 'Failed to decode data: {data}'
  },

  MODAL_LOADER: {
    CLOSE_WARNING: 'It looks like something went wrong. You may close the window but this could cause adverse effects.'
  },

  MODAL_NETWORK: {
    NAME: 'Name',
    DESCRIPTION: 'Description',
    SEED_SERVER: 'Seed Server',
    NETHASH: 'Nethash',
    TOKEN: 'Token',
    SYMBOL: 'Symbol',
    VERSION: 'Version',
    EXPLORER: 'Explorer',
    EPOCH: 'Epoch',
    WIF: 'WIF',
    SLIP44: 'Slip44',
    ACTIVE_DELEGATES: 'Active Delegates',
    MARKET_TICKER: 'Market Ticker (Optional)',
    FAILED_FETCH: 'Failed to fetch network information',
    NETWORK_IN_USE: 'This network is in use by one or more profiles and cannot be removed',
    DEFAULT_NETWORK_NO_DELETE: 'This is a default network and cannot be deleted',
    VALIDATING_SEED: 'Validating Seed Server details...',
    SEED_VALIDATE_FAILED: 'Failed to connect to seed server',
    PLACEHOLDER: {
      EXPLORER: 'http://explorer.io',
      SEED_SERVER: 'http://1.1.1.1:4002',
      EPOCH: '2017-03-21T13:00:00.000Z'
    }
  },

  MODAL_NETWORK_SELECTION: {
    TITLE: 'Networks'
  },

  MODAL_PEER: {
    CANCEL: 'Cancel',
    CONNECT: 'Connect',
    HOST: 'IP / Host',
    PORT: 'Port',
    TITLE: 'Connect to custom peer',
    VALIDATING: 'Validating peer details...',
    PLACEHOLDER: {
      HOST: 'http://1.2.3.4',
      PORT: '4003'
    }
  },

  PASSPHRASE_INPUT: {
    HIDE: 'Hide the passphrase',
    LABEL: 'Passphrase',
    QR: 'Scan the QR code',
    SHOW: 'Show the passphrase'
  },

  PASSWORD_INPUT: {
    HIDE: 'Hide the password',
    LABEL: 'Password',
    SHOW: 'Show the password'
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
    CONTACT_ALL: {
      CREATE_CONTACT: 'Create contact',
      IMPORT_CONTACT: 'Import contact',
      DELETE_CONTACT: 'Delete this contact',
      HEADER: 'My contacts',
      SHOW_CONTACT: 'Show contact'
    },

    CONTACT_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'New contact - Address',
          TEXT: 'Enter the address of your contact.'
        },
        TITLE: '1. Enter address',
        ADDRESS: 'Contact address'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'New contact - Name',
          TEXT: 'Optionally, choose a name for you contact and you are done.'
        },
        TITLE: '2. Confirmation',
        NAME: 'Contact name (optional)'
      },
      FAILED: 'Failed to create contact'
    },

    DASHBOARD: {
      ALL_WALLETS: 'All wallets',
      ADD_WALLET: 'Add a wallet',
      CREATE_WALLET: 'Create wallet',
      IMPORT_WALLET: 'Import wallet',
      LAST_TRANSACTIONS: 'Last transactions'
    },

    NETWORK_OVERVIEW: {
      INSTRUCTIONS: {
        HEADER: 'Network Selection',
        TEXT: 'Select and edit any of the available networks, or add new ones.'
      },
      CREATE_NEW: 'Add a new network',
      NEW_NETWORK: 'New network'
    },

    PROFILE_ALL: {
      HEADER: 'My profiles',
      ADD_PROFILE: 'Add profile',
      EDIT_PROFILE: 'Edit profile',
      REMOVE_PROFILE: 'Remove this profile',
      SELECT_PROFILE: 'Use this profile'
    },

    PROFILE_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Create a profile',
          TEXT: 'Enter your name or nickname and select your preferred language and default currency.'
        },
        NAME: 'Profile name',
        TITLE: '1. Profile details',
        AVATAR: 'Select your favorite avatar or the first letter of your profile name',
        NO_AVATAR: 'No Avatar'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Network selection',
          TEXT: 'Choose the network of this profile.'
        },
        CUSTOM_NETWORK: 'or you can choose a custom network',
        CUSTOM_NETWORK_EXPLAIN: 'You can select your custom network or choose any of the available networks.',
        NAME: 'Profile name',
        TITLE: '2. Network'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Appearance',
          TEXT: 'Customize this application by selecting one of our themes and backgrounds.'
        },
        THEME: 'Choose light or dark mode',
        BACKGROUND: 'Select your favorite background',
        NAME: 'Profile name',
        TITLE: '3. Appearance'
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
          TEXT: 'Here you can choose the default theme (light or dark) and the background.'
        },
        TITLE: 'Wallet design'
      }
    },

    WALLET: {
      TRANSACTIONS: 'Transactions',
      DELEGATES: 'Delegates',
      STATISTICS: 'Statistics',
      SIGN_VERIFY: 'Sign',
      PURCHASE: 'Purchase {ticker}'
    },

    WALLET_EXCHANGE: {
      CHANGELLY_TERMS: {
        TITLE: 'Purchase {ticker} directly within ARK Desktop Wallet with our Changelly integration',
        CONTENT: 'Changelly lets you exchange other cryptocurrencies into {ticker} and has an option to buy {ticker} directly with your credit or debit cards.',
        CONFIRMATION: 'I have read and I agree with the {terms} and the {privacy} from Changelly. By clicking {button}, I acknowledge and understand that my transaction may trigger AML/KYC verification according to Changelly {kyc}.',
        TERMS_OF_USE: 'terms of use',
        PRIVACY_POLICY: 'privacy policy',
        KYC: 'AML/KYC'
      }
    },

    WALLET_ALL: {
      CREATE_WALLET: 'Create wallet',
      DELETE_WALLET: 'Delete this wallet',
      HEADER: 'My wallets',
      IMPORT_WALLET: 'Import wallet',
      LOADING_LEDGER: 'Loading Ledger Wallets...',
      SHOW_WALLET: 'Show wallet',
      TOTAL_BALANCE: 'Total balance',
      CACHE_LEDGER: 'Cache ledger wallets?',
      CACHE_LEDGER_INFO: 'Cache wallets from your ledger to speed up loading when first connected'
    },

    WALLET_IMPORT: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Wallet recovery',
          TEXT: 'Fill in the passphrase of your wallet. You can fill in the address first, to ensure that it matches the given passphrase.'
        },
        TITLE: '1. Import wallet',
        ONLY_ADDRESS: 'Use the address only',
        ONLY_PASSPHRASE: 'Use the passphrase only'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Wallet encryption',
          TEXT: 'Enter a password you would like to use in order to encrypt your passphrase.'
        },
        TITLE: '2. Encryption',
        PASSWORD: 'Wallet password (optional)',
        PASSWORD_CONFIRM: 'Confirm password',
        PASSWORD_WARNING: 'Storing your passphrase can bring risks.'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Wallet configuration',
          TEXT: 'Optionally, choose a name for you wallet and you are done.'
        },
        TITLE: '3. Confirmation',
        ADDRESS: 'Wallet address',
        NAME: 'Wallet name (optional)'
      },
      FAILED: 'Failed to import wallet'
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
          HEADER: 'Wallet encryption',
          TEXT: 'Enter a password you would like to use in order to encrypt your passphrase.'
        },
        TITLE: '4. Encryption',
        PASSWORD: 'Wallet password (optional)',
        PASSWORD_CONFIRM: 'Confirm password',
        PASSWORD_WARNING: 'Storing your passphrase can bring risks.'
      },
      STEP5: {
        INSTRUCTIONS: {
          HEADER: 'Wallet configuration',
          TEXT: 'Optionally, choose a name for you wallet and you are done.'
        },
        TITLE: '5. Confirmation',
        ADDRESS: 'Wallet address',
        NAME: 'Wallet name (optional)'
      }
    },

    WALLET_SHOW: {
      NO_VOTE: 'Wallet hasn\'t voted',
      ADD_CONTACT: 'Add to contacts'
    }
  },

  PROFILE_REMOVAL_CONFIRMATION: {
    NOTE: 'Although it would remove your wallets, it does not delete any data on the blockchain. You could recover the wallets as long as you have their passphrases',
    QUESTION: 'Are you sure you want to remove this profile?'
  },

  SELECTION_AVATAR: {
    AVATARS: 'Avatars',
    MODAL_HEADER: 'Select avatar'
  },

  SELECTION_BACKGROUND: {
    MODAL_HEADER: 'Select background',
    TEXTURES: 'Textures',
    WALLPAPERS: 'Wallpapers'
  },

  SELECTION_NETWORK: {
    MODAL_HEADER: 'Networks'
  },

  TRANSACTION: {
    TYPE: {
      TRANSFER: 'Transfer',
      SECOND_SIGNATURE: 'Second Signature',
      DELEGATE_REGISTRATION: 'Delegate Registration',
      VOTE: 'Vote',
      UNVOTE: 'Unvote',
      MULTI_SIGNATURE: 'Multi Signature',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Timelock Transfer',
      MULTI_PAYMENT: 'Multi Payment',
      DELEGATE_RESIGNATION: 'Delegate Resignation'
    },
    ERROR: {
      TRANSFER: 'Your transaction could not be sent',
      SECOND_SIGNATURE: 'Second signature could not be registered',
      DELEGATE_REGISTRATION: 'Could not register as delegate',
      VOTE: 'Vote could not be registered',
      UNVOTE: 'Unvote could not be registered',
      MULTI_SIGNATURE: 'Multi signature could not be created',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Timelock transfer could not be created',
      MULTI_PAYMENT: 'Multi payment could not be created',
      DELEGATE_RESIGNATION: 'Delegate resignation was unsuccessful',
      SAVE_OFFLINE: 'Failed to save your transaction file',
      EXPIRED: 'Transaction expired before it was processed: {transactionId}',
      FEE_TOO_LOW: 'Transaction could not be sent because the fee ({fee}) is too low',
      NOTHING_SENT: 'The transaction could not be sent. Please check your network connection or change peer'
    },
    FOOTER_TEXT: {
      DELEGATE_REGISTRATION: 'Keep in mind that you cannot change the name of your delegate after the registration has been registered on the blockchain.'
    },
    FORM: {
      DELEGATE_REGISTRATION: {
        INSTRUCTIONS: 'for {address}.'
      },
      SECOND_SIGNATURE: {
        INSTRUCTIONS: 'for {address}.'
      }
    },
    INFO: {
      BROADCASTING: 'Your transaction is being broadcast to the network'
    },
    SUCCESS: {
      TRANSFER: 'Your transaction was sent successfully',
      SECOND_SIGNATURE: 'Second signature successfully registered',
      DELEGATE_REGISTRATION: 'Successfully registered as delegate',
      VOTE: 'Voted successfully',
      UNVOTE: 'Unvoted successfully',
      MULTI_SIGNATURE: 'Multi signature created successfully',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Timelock transfer created successfully',
      MULTI_PAYMENT: 'Multi payment created successfully',
      DELEGATE_RESIGNATION: 'Delegate resignation was successful',
      SAVE_OFFLINE: 'The transaction file saved successfully in: {path}'
    },
    VOTE: {
      VOTE_DELEGATE: 'Vote for delegate {delegate}',
      UNVOTE_DELEGATE: 'Unvote delegate {delegate}'
    },
    WARNING: {
      BROADCAST: 'Transaction was broadcasted to other peers. It may not be accepted by them'
    },
    AMOUNT: 'Amount',
    BLOCK_ID: 'Block ID',
    CONFIRMATION_COUNT: '{confirmations} Confirmations',
    CONFIRM_SEND_ALL: 'This will enable sending all of your tokens from the current wallet in this transaction.',
    CONFIRM_SEND_ALL_TITLE: 'Send all your tokens?',
    CONFIRM_SEND_ALL_NOTE: 'Note: once sent, this cannot be undone.',
    CONFIRMATIONS: 'Confirmations',
    CREATE_TRANSFER: 'Create Transfer',
    DISCARD: 'Discard',
    EXPIRED: 'Expired',
    FEE: 'Transaction fee',
    ID: 'ID',
    LEDGER_SIGN_NOTICE: 'Next you will confirm the transaction with your Ledger',
    LEDGER_SIGN_WAIT: 'Awaiting Ledger Signature. Please check and sign the transaction when you are ready.',
    LEDGER_SIGN_FAILED: 'Could not sign transaction with Ledger',
    LEDGER_USER_DECLINED: 'User declined',
    MULTIPLE: 'Multiple',
    OPEN_IN_EXPLORER: 'Open in Explorer',
    PASSPHRASE: 'Passphrase',
    PASSWORD: 'Encryption Password',
    RECIPIENT: 'Recipient',
    RESEND: 'Resend',
    RESENT_NOTICE: 'Transaction {transactionId} has been resent',
    SAVE_OFFLINE: 'Save transaction offline',
    SECOND_PASSPHRASE: 'Second Passphrase',
    SEND: 'Send',
    SEND_ALL: 'Send All',
    SENDER: 'Sender',
    SINGLE: 'Single',
    TIMESTAMP: 'Timestamp',
    TRANSACTION: 'Transaction',
    VENDOR_FIELD: 'Smartbridge',
    WELL_CONFIRMED: 'Well Confirmed',
    WELL_CONFIRMED_COUNT: 'Well Confirmed ({confirmations} confirmations)'
  },

  SIGN_VERIFY: {
    VERIFY_WALLET: 'Verify your wallet',
    VERIFY_BY_SIGNING: 'Sign a message to verify you own the wallet',
    SIGN: 'Sign',
    VERIFY: 'Verify',
    TITLE_SIGN: 'Sign a message',
    TITLE_VERIFY: 'Verify a message',
    MESSAGE: 'Message',
    ADDRESS: 'Address',
    PUBLIC_KEY: 'Public key',
    SIGNATURE: 'Signature',
    JSON_MESSAGE: 'Signed message content',
    FORMAT_FOOTER: 'Format (JSON): { "publickey": "...", "signature": "...", "message": "..." }',
    VERIFIED: 'The message is verified successfully',
    NOT_VERIFIED: 'The message is NOT verified',
    CONFIRMATION: 'Confirmation',
    DELETE: 'Delete message',
    FAILED_SIGN: 'Could not sign message',
    FAILED_VERIFY: 'Could not verify message'
  },

  SYNCHRONIZER: {
    VOTE: 'voted for',
    UNVOTE: 'unvoted',
    NEW_SECOND_SIGNATURE: 'New second signature: {address}',
    NEW_DELEGATE_REGISTRATION: 'New delegate: {address} registered as {username}',
    NEW_VOTE: 'New vote: {address} {voteUnvote} {publicKey}',
    NEW_TRANSFER_SENT: 'New transfer: {amount} sent from {sender} to {recipient}',
    NEW_TRANSFER_RECEIVED: 'New transfer: {amount} received from {sender} to {recipient}'
  },

  TRANSACTION_FORM: {
    ERROR: {
      NOT_ENOUGH_BALANCE: 'The balance is too low ({balance})'
    }
  },

  TRANSACTION_DETAIL: {
    SEND_AMOUNT: 'Send {token}'
  },

  WALLET_HEADING: {
    ACTIONS: {
      WALLET_NAME: 'Wallet name',
      REGISTER_DELEGATE: 'Register delegate',
      SECOND_PASSPHRASE: '2nd passphrase',
      DELETE_WALLET: 'Delete wallet',
      SHOW_PUBLIC_KEY: 'Show public key',
      SHOW_ADDRESS: 'Show address'
    },
    SECOND_PASSPHRASE_ENABLED: 'Second Signature Enabled'
  },

  WALLET_SECOND_SIGNATURE: {
    NEW: 'Generate new second passphrase',
    ALREADY_REGISTERED: 'There is already a second passphrase registered for this address',
    INSTRUCTIONS: 'This is your second passphrase. Make sure to make a backup and keep it somewhere safe!'
  },

  WALLET_SIDEBAR: {
    LOADING_LEDGER: 'Loading Ledger...'
  },

  WALLET_DELEGATES: {
    RANK: 'Rank',
    USERNAME: 'Username',
    PRODUCTIVITY: 'Productivity',
    RANK_BANNER: 'Rank: {rank}',
    PRODUCTIVITY_BANNER: 'Productivity: {productivity}',
    APPROVAL: 'Vote %',
    FORGED: 'Forged',
    BLOCKS: 'Blocks',
    MISSED: 'missed',
    VOTERS: 'Voters',
    UNVOTE: 'Unvote',
    VOTES: 'Votes',
    VOTE: 'Vote',
    USERNAME_ERROR: 'No special characters or uppercase allowed',
    USERNAME_MAX_LENGTH_ERROR: 'The username must be less than or equal to 20 characters long',
    ALREADY_REGISTERED: 'This wallet is already registered as a delegate',
    BLOG: 'Voting Guide',
    EXPLANATION: 'Voting is an optional, but important mechanism that keeps the Ark network secure. The 51 delegates with the most votes from the network are responsible for verifying and forging transactions into new blocks. This page can be used to cast your vote for a delegate that you support. Learn more about voting for a delegate by clicking on the following link:',
    VOTE_DELEGATE: 'Vote Delegate {delegate}',
    UNVOTE_DELEGATE: 'Unvote Delegate {delegate}',
    VOTED_FOR: 'You voted for delegate {delegate}',
    WALLET_VOTED_FOR: 'This wallet voted for delegate {delegate}'
  },

  WALLET_RENAME: {
    TITLE: 'Rename Wallet',
    TITLE_ADD: 'Add wallet',
    NEW: 'New wallet name',
    ADD: 'Add wallet',
    RENAME: 'Rename wallet',
    ADDRESS_INFO: 'Set a name for this wallet: ',
    ERROR_LEDGER: 'Could not rename ledger wallet: {error}'
  },

  WALLET_REMOVAL_CONFIRMATION: {
    NOTE: 'It does not delete any data on the blockchain. You could recover the wallet as long as you have the passphrase',
    QUESTION: 'Are you sure you want to remove this wallet?'
  },

  WALLET_TRANSACTIONS: {
    TRANSACTION_ID: 'Transaction ID',
    RECIPIENT: 'Recipient',
    SENDER: 'Sender',
    AMOUNT: 'Amount',
    NEW_TRANSACTIONS: 'This wallet has {count} new transaction{plural}. Press the refresh button to update.'
  }
}
