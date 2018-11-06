export default {
  COMMON: {
    ALL: 'All',
    APPEARANCE: 'Appearance',
    AVATAR: 'Avatar',
    BACK: 'Back',
    BIP39_LANGUAGE: 'BIP39 Language',
    DONE: 'Done',
    FINISH: 'Finish',
    CONFIRM: 'Confirm',
    CURRENCY: 'Currency',
    LANGUAGE: 'Language',
    NETWORK: 'Network',
    PREV: 'Prev',
    NEXT: 'Next',
    OF: 'of',
    PROFILE_NAME: 'Profile name',
    SAVE: 'Save',
    SELECT_BACKGROUND: 'Select background',
    SELECT_THEME: 'Select wallet theme',
    START: 'Start',
    FAILED_FETCH: 'Failed to fetch {name}. Reason: "{msg}".',
    DATE: 'Date'
  },

  INTRODUCTION: {
    WELCOME: {
      TITLE: 'Welcome to the <b>Ark Desktop Wallet</b>',
      SAFETY_MESSAGE: 'Please take a few moments to read the next few screens for your own safety.',
      FUNDS_WARNING: 'Your funds could be unrecoverable if you do not pay attention to these warnings'
    },
    POWER: {
      TITLE: 'Your <b>Power</b>',
      FINANCE: 'The most important thing for users to know about cryptocurrencies is that they completely reverse the commonly-accepted model of how finance works',
      BANKS: 'In traditional finance, you give up direct control of your money to a bank. Because banks have control over your money, they can take actions on your behalf, such as refunding transactions and resetting your login info.',
      CRYPTO: 'Cryptocurrencies take that power and give it to you directly. Using nothing more than your private key, you can control exactly when, where and how your money is kept and spent.',
      RESPONSIBILITY: 'However, in the words of Uncle Ben Parker, with great power comes great responsibility.'
    },
    RESPONSIBILITY: {
      TITLE: 'Your <b>Responsibility<b>',
      STORAGE: 'Maintaining control of your key and passphrase is absolutely vital. Although you can use this wallet to create a new wallet with a unique passphrase, at no point does ARK ever store, access, or recover your passphrase.',
      WARNING: 'This last point bears repeating: <b>at no point does ARK ever store, access or recover your passphrase. Additionally, ARK does not have the power to refund transactions or suspend accounts for any reason whatsoever.</b>',
      PASSPHRASE: 'Your passphrase is <b>not</b> kept on this wallet, and without your own copy of your passphrase you <b>will</b> lose access to your funds.',
      BACKUP: 'This means that you are responsible for keeping this information safe and secure. Back up your passphrase and keep it in a safe place. If you lose it, there is nobody who can recover it for you. Your funds will be lost.'
    },
    TURN: {
      TITLE: 'Your <b>Turn</b>',
      WALLET: 'Armed with knowledge about the importance of keeping your passphrase safe, you\'re ready to claim your financial autonomy with ARK Desktop Wallet.',
      HARDWARE_WALLET: 'Alternatively, for an extra layer of security and convenience, consider a hardware wallet. These dedicated storage products manage your private keys within the device. Additionally, the Ledger Nano S hardware wallet integrates directly with ARK Desktop Wallet, meaning you can plug your Ledger Nano into your computer and access the ARK blockchain without needing to enter your passphrase.'
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
    CONNECTED: 'Connected to peer',
    CONNECT_CUSTOM: 'Connect your peer',
    CONNECT_FAILED: 'Failed to connect to peer',
    DELAY: 'Delay',
    FAILED_REFRESH: 'Failed to refresh peers',
    HEIGHT: 'Height',
    LAST_CHECKED: 'Last checked',
    NONE: 'None',
    NO_CONNECT: 'Could not connect',
    PEER: 'Peer:',
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
    PASSWORD: {
      TOO_SHORT: 'Your password must be at least {0} characters long',
      NUMBERS: 'Your password must contain at least 1 number',
      SPECIAL_CHARACTERS: 'Your password must contain at least 1 special character'
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
    ROWS_PER_PAGE: 'Rows per page'
  },

  APP: {
    RELEASE: {
      REQUEST_ERROR: 'Cannot check latest version'
    }
  },

  APP_SIDEMENU: {
    ANNOUNCEMENTS: 'Announcements',
    CONTACTS: 'My contacts',
    CURRENT_PROFILE: 'Your current profile is "{profileName}"',
    DASHBOARD: 'Dashboard',
    NETWORK: 'Network',
    SETTINGS: {
      CURRENCY: 'Currency',
      DARK_MODE: 'Dark mode',
      SCREENSHOT_PROTECTION: 'Screenshot protection',
      TITLE: 'Current settings'
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
    NOT_SUPPORTED: 'Copying to clipboard is not unavailable'
  },

  INPUT_ADDRESS: {
    ERROR: {
      NOT_VALID: 'The address is not valid',
      REQUIRED: 'The address is required',
      NEO_ADDRESS: 'This looks like a NEO address'
    },
    LABEL: 'Address',
    QR: 'Scan the QR code'
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

  INPUT_GRID: {
    MORE: 'Show more'
  },

  INPUT_GRID_MODAL: {
    TITLE: 'Select'
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
      NOT_READABLE: 'We are inable to read the camera stream, maybe it is already in use?',
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
          TEXT: 'Choose a name for you contact and you are done.'
        },
        TITLE: '2. Confirmation',
        NAME: 'Contact name'
      },
      FAILED: 'Failed to create contact'
    },

    DASHBOARD: {
      ALL_WALLETS: 'All wallets',
      CREATE_WALLET: 'Create wallet',
      IMPORT_WALLET: 'Import wallet',
      LAST_TRANSACTIONS: 'Last transactions'
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

    WALLET: {
      TRANSACTIONS: 'Transactions',
      DELEGATES: 'Delegates',
      STATISTICS: 'Statistics',
      SIGN_VERIFY: 'Sign'
    },

    WALLET_ALL: {
      CREATE_WALLET: 'Create wallet',
      IMPORT_WALLET: 'Import wallet',
      DELETE_WALLET: 'Delete this wallet',
      HEADER: 'My wallets',
      SHOW_WALLET: 'Show wallet'
    },

    WALLET_IMPORT: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Wallet recovery',
          TEXT: 'Introduce the passphrase of your wallet. You can introduce the wallet address first to ensure that your both match.'
        },
        TITLE: '1. Introduce wallet',
        ONLY_ADDRESS: 'Use the address only',
        ONLY_PASSPHRASE: 'Use the passphrase only'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Wallet encryption',
          TEXT: 'Enter a password you would like to use in order to encrypt your passphrase.'
        },
        TITLE: '2. Encryption',
        PASSWORD: 'Wallet password (optional)'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Wallet configuration',
          TEXT: 'Choose a name for you wallet and decide which operations could perform and you are done.'
        },
        TITLE: '3. Confirmation',
        ADDRESS: 'Wallet address',
        NAME: 'Wallet name (optional)',
        OPERATIONS: 'Wallet operations',
        SENDING_ENABLED: 'Sending transactions enabled'
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
        PASSWORD: 'Wallet password (optional)'
      },
      STEP5: {
        INSTRUCTIONS: {
          HEADER: 'Wallet configuration',
          TEXT: 'Choose a name for you wallet and decide which operations could perform and you are done.'
        },
        TITLE: '5. Confirmation',
        ADDRESS: 'Wallet address',
        NAME: 'Wallet name (optional)',
        OPERATIONS: 'Wallet operations',
        SENDING_ENABLED: 'Sending transactions enabled'
      }
    },

    WALLET_SHOW: {
      NO_VOTE: 'Wallet hasn\'t voted'
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
      SAVE_OFFLINE: 'Failed to save your transaction file'
    },
    FOOTER_TEXT: {
      DELEGATE_REGISTRATION: 'Keep in mind that you cannot change the name of your delegate after the registration has been registered on the blockchain.'
    },
    FORM: {
      DELEGATE_REGISTRATION: {
        INSTRUCTIONS: 'for {address}.'
      }
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
    SINGLE: 'Single',
    MULTIPLE: 'Multiple',
    SAVE_OFFLINE: 'Save transaction offline',
    SEND: 'Send',
    SEND_ALL: 'Send All',
    CONFIRMATIONS: 'Confirmations',
    ID: 'ID',
    TRANSACTION: 'Transaction',
    TIMESTAMP: 'Timestamp',
    CREATE_TRANSFER: 'Create Transfer',
    RECIPIENT: 'Recipient',
    SENDER: 'Sender',
    AMOUNT: 'Amount',
    VENDOR_FIELD: 'Smartbridge',
    PASSPHRASE: 'Passphrase',
    SECOND_PASSPHRASE: 'Second Passphrase',
    PASSWORD: 'Encryption Password',
    FEE: 'Fee',
    OPEN_IN_EXPLORER: 'Open in Explorer',
    LEDGER_SIGN_NOTICE: 'Next you will confirm the transaction with your Ledger',
    LEDGER_SIGN_FAILED: 'Could not sign transaction with Ledger',
    LEDGER_USER_DECLINED: 'User declined'
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
    DELETE: 'Delete message'
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

  WALLET_DELEGATES: {
    RANK: 'Rank',
    USERNAME: 'Username',
    PRODUCTIVITY: 'Productivity',
    APPROVAL: 'Approval',
    FORGED: 'Forged',
    BLOCKS: 'Blocks',
    MISSED: 'missed',
    VOTERS: 'Voters',
    UNVOTE: 'Unvote',
    VOTES: 'Votes',
    VOTE: 'Vote',
    USERNAME_ERROR: 'No special characters or uppercase allowed',
    ALREADY_REGISTERED: 'This wallet is already registered as a delegate',
    BLOG: 'Official Ark.io blog',
    EXPLANATION: 'Voting is an optional, but important mechanism that keeps the Ark network secure. The 51 delegates with the most votes from the network are responsible for verifying and forging transactions into new blocks. This page can be used to cast your vote for a delegate that you support. Learn more about voting for a delegate by clicking on the following link:',
    VOTE_DELEGATE: 'Vote Delegate {delegate}',
    UNVOTE_DELEGATE: 'Unvote Delegate {delegate}'
  },

  WALLET_RENAME: {
    TITLE: 'Rename Wallet',
    NEW: 'New wallet name',
    RENAME: 'Rename wallet',
    ADDRESS_INFO: 'Specify a name for you wallet: {wallet}'
  },

  WALLET_REMOVAL_CONFIRMATION: {
    NOTE: 'It does not delete any data on the blockchain. You could recover the wallet as long as you have the passphrase',
    QUESTION: 'Are you sure you want to remove this wallet?'
  },

  WALLET_TRANSACTIONS: {
    TRANSACTION_ID: 'Transaction ID',
    RECIPIENT: 'Recipient',
    SENDER: 'Sender',
    AMOUNT: 'Amount'
  }
}
