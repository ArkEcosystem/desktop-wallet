export default {
  COMMON: {
    ADDRESS: 'Adresse',
    ALL: 'Tout',
    APP_NAME: 'Portfeuille Local Ark',
    APP_NAME_SHORT: 'Bureau Ark',
    APPEARANCE: 'Apparence',
    AVATAR: 'Avatar',
    BACK: 'Retour',
    BACKGROUND: 'Arrière-plan',
    BIP39_LANGUAGE: 'Langage de phrase secrète (BIP39)',
    CONFIRM: 'Confirmer',
    CURRENCY: 'Devise',
    DATE: 'Date',
    DONE: 'Fait',
    FAILED_FETCH: 'Failed to fetch {name}. Reason: "{msg}".',
    FETCH: 'Chercher',
    FINISH: 'Terminer',
    LANGUAGE: 'Langue de l\'application',
    LEDGER: 'Grand livre',
    LEDGER_WALLET: 'This is a Ledger wallet',
    NETWORK: 'Réseau',
    NETWORK_NAME: 'Cet intitulé est fourni par le réseau',
    NEXT: 'Suivant',
    NOT: 'ne pas', // not
    OF: 'de', // of
    OTHER: 'Autre',
    PREV: 'Préc.',
    PROFILE_NAME: 'Profile name',
    REMOVE: 'Retirer',
    SAVE: 'Sauver',
    SKIP: 'Passer',
    START: 'Démarrer',
    THEME: 'Thème',
    TIME_FORMAT: 'Format horaire',
    VERIFIED_ADDRESS: 'This is a verified address',
    WARNING: 'Attention',
    WILL: 'volonté' // will
  },

  ANNOUNCEMENTS: {
    LATEST_NEWS: 'Dernières nouvelles',
    READ_MORE: 'Lire plus',
    ALL_READ: 'Tout marquer comme lu'
  },

  INTRODUCTION: {
    WELCOME: {
      TITLE: 'Bienvenue sur {APP}',
      SAFETY_MESSAGE: 'Veuillez prendre quelques instants pour lire les écrans suivants pour votre propre sécurité..',
      FUNDS_WARNING: 'Vos fonds pourraient être irrécouvrables si vous ne prêtez pas une attention particulière à ces avertissements.'
    },
    POWER: {
      TITLE: 'Votre pouvoir',
      FINANCE: 'La chose la plus importante à connaître pour les utilisateurs sur les crypto-monnaies est qu’ils renversent complètement le modèle généralement accepté de fonctionnement de la finance.',
      BANKS: 'En finance traditionnelle, vous cédez le contrôle direct de votre argent à une banque. Comme les banques contrôlent votre argent, elles peuvent prendre des mesures en votre nom, telles que le remboursement de transactions et la réinitialisation de vos informations de connexion.',
      CRYPTO: 'Les crypto-monnaies prennent ce pouvoir et vous le donnent directement. En utilisant rien de plus que votre phrase secrète, vous pouvez contrôler exactement quand, où et comment votre argent est conservé et dépensé.',
      RESPONSIBILITY: 'Cependant, selon les mots de l\'oncle Ben Parker, un grand pouvoir entraîne de grandes responsabilités.'
    },
    DUTY: {
      TITLE: 'Votre devoir',
      CONTROL: 'L\'industrie de la blockchain est conçue pour résister à la censure. Cela signifie que personne ne contrôle votre compte à part vous. Cette conception apporte la tranquillité d\'esprit qu\'aucune autorité centrale ne peut confisquer, geler ou manipuler vos fonds à tout moment. Il n\'existe pas non plus d\'emplacement centralisé pour le piratage de données personnelles ou de fonds.',
      OWNER: 'Cela entraîne également une plus grande responsabilité pour vous, le propriétaire du compte.',
      WARNING: {
        ACCOUNT: 'Contrairement à votre compte bancaire traditionnel, {CANNOT_RESTORE}.',
        CANNOT_RESTORE: 'Les mots de passe, phrases secrètes ou fonds volés perdus ne peuvent pas être restaurés par les délégués, l\'équipe ARK.io ou toute autre personne.'
      },
      SECURITY: 'La sécurité de votre compte dépend uniquement de vous.'
    },
    RESPONSIBILITY: {
      TITLE: 'Votre responsabilité',
      STORAGE: {
        EXPLANATION: 'The {PASSPHRASE} of each wallet address is able to sign transactions and move funds. This means if your computer dies but you have your passphrase, you can still access your funds. The ARK Desktop Wallet has an additional feature that lets you set an {ENCRYPTED} as well, for easier management. If your computer dies, you cannot use the encrypted password to access your funds from a different machine. {NEED}.',
        PASSPHRASE: 'Phrase secrète',
        ENCRYPTED: 'mot de passe crypté',
        NEED: 'Vous aurez besoin de votre phrase secrète'
      },
      BACKUP: {
        ALWAYS: 'Sauvegardez toujours votre phrase secrète et conservez-la dans un endroit sûr.',
        OPTIONS: 'Vous pouvez l\'écrire sur du papier épais et stocker plusieurs copies dans des emplacements sécurisés. Vous pouvez également le stocker sur un lecteur flash crypté. Vous pouvez également utiliser un périphérique matériel USB Ledger Nano S, disponible sur Ledger.com, pour stocker et accéder à vos fonds et au portefeuille ARK Desktop. Vous pouvez connecter votre Ledger Nano S à votre ordinateur et accéder à la blockchain ARK sans avoir à saisir votre phrase secrète.'
      },
      REMEMBER: 'N\'oubliez pas que toute personne possédant votre phrase secrète peut accéder à vos fonds. Ne partagez jamais votre compte avec qui que ce soit et évitez de le stocker dans des emplacements susceptibles d\'être piratés, tels que le Cloud.'
    },
    TURN: {
      TITLE: 'A votre tour',
      KNOWLEDGE: 'Maintenant, sachant à quel point il est important de protéger vos phrases secrètes, vous êtes prêt à revendiquer votre autonomie financière avec le portefeuille de bureau ARK.',
      SUPPORT: 'ARK est un écosystème open-source. Si vous avez besoin d\'aide, la communauté ARK et son équipe sont à votre disposition. Créez un post sur reddit.ark.io ou rejoignez le système de discussion en temps réel à l\'adresse slack.ark.io.',
      CONCLUSION: 'Tous les membres de l\'équipe ARK.io espèrent que vous apprécierez l\'utilisation du portefeuille ARK Desktop Wallet pour participer à la révolution de la blockchain !'
    }
  },

  SEARCH: {
    DEFAULT_PLACEHOLDER: 'Trouver une transaction, une adresse ou un délégué',
    FILTER: 'Filtrer',
    SEARCH_BY: 'Recherche par',
    SELECT_OPTION: 'Selectionnez une option',
    DELEGATE: 'Déléguer',
    WALLETS: 'Portefeuilles',
    PERIOD: 'Période'
  },

  CONTACT_REMOVAL_CONFIRMATION: {
    QUESTION: 'Êtes-vous sûr de vouloir supprimer ce contact ?'
  },

  ENCRYPTION: {
    DECRYPTING: 'Déchiffrement du portefeuille avec le mot de passe...',
    ENCRYPTING: 'Chiffrement du portefeuille avec le mot de passe...',
    FAILED_DECRYPT: 'Impossible de déchiffrer la phrase secrète'
  },

  PEER: {
    BEST: 'Connexion au mieux',
    CONNECTED: 'Connecté à un pair',
    CONNECT_CUSTOM: 'Connecter un pair personnalisé',
    CONNECT_FAILED: 'Échec de la connexion au pair',
    DELAY: 'Latence',
    DISCONNECT: 'Déconnecter du pair',
    FAILED_REFRESH: 'Impossible d\'actualiser les pairs',
    HEIGHT: 'Hauteur du bloc',
    LAST_CHECKED: 'Dernière vérification',
    NONE: 'Aucun',
    NO_CONNECT: 'N\'a pas pu se connecter',
    PEER: 'Pair',
    STATUS_CHECK_FAILED: 'La vérification du statut a échoué',
    WRONG_NETWORK: 'Mauvais réseau'
  },

  VALIDATION: {
    TOO_LONG: 'The \'{0}\' is too long',
    INVALID_URI: 'URI invalide',
    INVALID_FORMAT: 'Format invalide',
    MAX_LENGTH: 'Max {0}',
    NOT_MATCH: 'The \'{0}\' does not match the \'{1}\'',
    NOT_VALID: 'The \'{0}\' is not valid',
    NOT_NUMERIC: 'The \'{0}\' is not numeric',
    NO_SCHEME: 'The \'{0}\' does not have \'http://\' or \'https://\'',
    NAME: {
      DUPLICATED: 'Le nom \'{0}\' existe déjà',
      EXISTS_AS_CONTACT: 'Le nom \'{0}\' a déjà été assigné à un contact',
      EXISTS_AS_WALLET: 'Le nom \'{0}\' a déjà été assigné à un portfeuille',
      MAX_LENGTH: 'Le nom devrait comporter moins de {0} caractères.',
      MIN_LENGTH: 'Le nom devrait comporter au moins un caractère | Le nom devrait comporter au moins {n} caractères.'
    },
    PASSWORD: {
      TOO_SHORT: 'Votre mot de passe doit comporter au moins {0} caaractères',
      NUMBERS: 'Votre mot de passe doit comporter au moins un chiffre',
      SPECIAL_CHARACTERS: 'Votre mot de passe doit comporter au moins un caractère spécial',
      NO_MATCH: 'Vos mots de passe ne correspondent pas'
    },
    ADDRESS: {
      EXISTS_AS_CONTACT: 'L\'adresse \'{0}\' a déjà été ajoutée à un contact',
      EXISTS_AS_WALLET: 'L\'adresse \'{0}\' a déjà été importée comme portefeuille'
    },
    PUBLIC_KEY: {
      INVALID_LENGTH: 'La clé publique doit comporter 66 caractères.'
    },
    REQUIRED: 'Le \'{0}\' est requis',
    SEND_NOT_ENABLED: 'L\'envoi n\'est pas activé pour le portefeuille sélectionné',
    WALLET_NOT_ACTIVE: 'Sélectionnez un portefeuille et ouvrez à nouveau l\'URI',
    WARNING_BIP39: 'The \'{0}\' is a BIP39 Passphrase',
    WARNING_NOT_BIP39: 'The \'{0}\' is not a BIP39 Passphrase'
  },

  LANGUAGES: {
    'en-US': 'English',
    'es-ES': 'Spanish',
    'fr-FR': 'French',
    'pt-BR': 'Portugues - Brazil'
  },

  TIME_FORMAT: {
    'DEFAULT': 'Default',
    '12H': '12h',
    '24H': '24h'
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
    MARKET: 'Marché',
    HISTORICAL_DATA: 'Données historiques',
    DAY: 'Jour',
    WEEK: 'Semaine',
    MONTH: 'Mois'
  },

  TABLE: {
    PAGE: 'Page',
    ROWS_PER_PAGE: 'Lignes par page',
    NO_TRANSACTIONS: 'Aucune transaction n\'a été trouvée. Les dernières transactions seront affichées ici.',
    NO_CONTACTS: 'Aucun contact à afficher.',
    NO_DELEGATES: 'Aucun délégué à afficher.',
    NO_WALLETS: 'Aucun portefeuille à afficher.'
  },

  APP: {
    RELEASE: {
      REQUEST_ERROR: 'Impossible de vérifier la dernière version'
    }
  },

  APP_FOOTER: {
    TEXT: 'Fabriqué avec ♥ par Ark'
  },

  APP_SIDEMENU: {
    ANNOUNCEMENTS: 'Annonces',
    CONTACTS: 'Mes contacts',
    CURRENT_PROFILE: 'Votre profil actuel est "{profileName}"',
    DASHBOARD: 'Tableau de bord',
    NETWORK: 'Réseau',
    NETWORKS: 'Gérer les réseaux',
    SETTINGS: {
      CURRENCY: 'Devise',
      DARK_MODE: 'Mode sombre',
      SCREENSHOT_PROTECTION: 'Protection de capture d\'écran',
      BACKGROUND_UPDATE_LEDGER: 'Mettre à jour Ledger en arrière-plan', // Mettre à jour le registre en arrière-plan
      BROADCAST_PEERS: 'Diffuser à plusieurs pairs',
      IS_MARKET_CHART_ENABLED: 'Graphique sur le tableau de bord',
      TITLE: 'Paramètres actuels',
      RESET_DATA: {
        TITLE: 'Réinitialiser les données',
        QUESTION: 'Êtes-vous sûr de vouloir effacer vos données ?',
        NOTE: 'Toutes vos données, y compris vos profils, portefeuilles, réseaux et contacts, seront supprimées de l\'application et réinitialisées. Les données, telles que les transactions, qui se trouvent dans la blockchain ne peuvent pas être supprimées.'
      }
    },
    WALLETS: 'Mes portefeuilles'
  },

  APP_SIDEMENU_NOTIFICATION: {
    NOTIFICATION: 'Une nouvelle version ({version}) a été publiée. Mettre à jour maintenant !',
    TOOLTIP: 'Une nouvelle version ({version}) a été publiée !'
  },

  MARKET_CHART: {
    TODAY: 'Aujourd\'hui',
    TODAY_AT: 'Aujourd\'hui à {hour}',
    WEEK: {
      LONG: {
        FRI: 'Vendredi',
        MON: 'Lundi',
        SAT: 'Samedi',
        SUN: 'Dimanche',
        TUE: 'Mardi',
        THU: 'Jeudi',
        WED: 'Merdredi'
      },
      SHORT: {
        FRI: 'VEN',
        MON: 'LUN',
        SAT: 'SAM',
        SUN: 'DIM',
        TUE: 'MAR',
        THU: 'JEU',
        WED: 'MER'
      }
    },
    YESTERDAY_AT: 'Hier à {hour}'
  },

  MARKET_CHART_HEADER: {
    PRICE: 'Prix'
  },

  BUTTON_CLIPBOARD: {
    DONE: 'Copié !',
    COPY_TO_CLIPBOARD: 'Copier {0} dans le presse-papier',
    NOT_SUPPORTED: 'La copie dans le presse-papier n\'est pas prise en charge.'
  },

  INPUT_ADDRESS: {
    ERROR: {
      NOT_VALID: 'L\'adresse n\'est pas valide',
      REQUIRED: 'L\'adresse est obligatoire'
    },
    KNOWN_ADDRESS: 'Ce portefeuille est connu sous le nom de "{address}"',
    LABEL: 'Adresse',
    NEO_ADDRESS: 'Il y a une adresse NEO comme celle-ci',
    QR: 'Scannez le QR code'
  },

  INPUT_CURRENCY: {
    ERROR: {
      LESS_THAN_MINIMUM: 'Le montant minimum est de {amount}',
      NOT_ENOUGH_AMOUNT: 'Le montant maximum est de {amount}',
      NOT_VALID: 'Le montant n\'est pas valide',
      REQUIRED: 'Le montant est obligatoire'
    },
    LABEL: 'Montant'
  },

  INPUT_FEE: {
    MINIMUM: 'Minimum',
    AVERAGE: 'Moyenne',
    MAXIMUM: 'Maximum',
    INPUT: 'Contribution',
    ADVANCED: 'Advanced',
    LOW_FEE_NOTICE: 'Les transactions avec des frais peu élevés peuvent ne jamais être confirmées',
    ADVANCED_NOTICE: 'Faites attention au montant que vous choisissez car il vous en coûtera plus que nécessaire s\'il est trop élevé',
    UNIQUE: 'Les frais de réseau ont été définis sur la valeur statique de {fee}',
    ERROR: {
      NOT_VALID: 'Les frais ne sont pas valables',
      LESS_THAN_MINIMUM: 'Les frais minimum sont de {fee}',
      MORE_THAN_MAXIMUM: 'Les frais maximum sont de {fee}'
    }
  },

  INPUT_GRID: {
    MORE: 'Afficher plus'
  },

  INPUT_GRID_MODAL: {
    TITLE: 'Selectionner'
  },

  WALLET_SELECTION: {
    PROFILE: 'Profil de l\'émetteur',
    WALLET: 'Portefeuille de l\'émetteur'
  },

  MODAL_CONFIRMATION: {
    CANCEL: 'Non, annuler',
    CONTINUE: 'Oui, je suis sûr(e)',
    TITLE: 'Confirmation'
  },

  MODAL_QR_CODE: {
    TITLE: 'QR Code',
    SUBTITLE: 'Scanner une adresse'
  },

  MODAL_QR_SCANNER: {
    ERROR: {
      NOT_ALLOWED: 'Nous avons besoin d\'un accès à la caméra pour scanner un QR code',
      NOT_FOUND: 'Nous n\'avons pas trouvé de caméra',
      NOT_SUPPORTED: 'La page n\'est pas servie via une connexion sécurisée (https)',
      NOT_READABLE: 'Nous sommes incapables de lire le flux de caméra, peut-être est-il déjà utilisé ?',
      OVERCONSTRAINED: 'Il semble que nous n’ayons pas pu trouver un appareil photo correct. Cela pourrait être un problème avec les contraintes que nous attendons.',
      STREAM: 'Il semble que vous utilisiez un navigateur non pris en charge. C\'est très curieux ...'
    },
    LOADING: 'Chargement de la caméra',
    INSTRUCTION: 'Veuillez tenir le QR code devant la caméra',
    TITLE: 'Scanner QR',
    DECODE_FAILED: 'Impossible de décoder les données :{data}'
  },

  MODAL_LOADER: {
    CLOSE_WARNING: 'On dirait que quelque chose s\'est mal passé. Vous pouvez fermer la fenêtre mais cela pourrait avoir des effets indésirables.'
  },

  MODAL_NETWORK: {
    NAME: 'Nom',
    DESCRIPTION: 'Description',
    SEED_SERVER: 'Serveur de base', // Seed server
    NETHASH: 'Nethash',
    TOKEN: 'Jeton',
    SYMBOL: 'Symbole',
    VERSION: 'Version',
    EXPLORER: 'Explorer',
    EPOCH: 'Epoch',
    WIF: 'WIF',
    SLIP44: 'Slip44',
    ACTIVE_DELEGATES: 'Délégués actifs',
    MARKET_TICKER: 'Market Ticker (Optionnel)', // Téléscripteur du marché (facultatif)
    FAILED_FETCH: 'Impossible de récupérer les informations du réseau',
    NETWORK_IN_USE: 'Ce réseau est utilisé par un ou plusieurs profils et ne peut pas être supprimé.',
    DEFAULT_NETWORK_NO_DELETE: 'Ceci est un réseau par défaut et ne peut pas être supprimé',
    VALIDATING_SEED: 'Validation des détails du serveur de base...',
    SEED_VALIDATE_FAILED: 'Échec de la connexion au serveur de base',
    PLACEHOLDER: {
      EXPLORER: 'http://explorer.io',
      SEED_SERVER: 'http://1.1.1.1:4002',
      EPOCH: '2017-03-21T13:00:00.000Z'
    }
  },

  MODAL_NETWORK_SELECTION: {
    TITLE: 'Réseaux'
  },

  MODAL_PEER: {
    CANCEL: 'Annuler',
    CONNECT: 'Connecter',
    HOST: 'IP / Host',
    PORT: 'Port',
    TITLE: 'Se connecter à un pair personnalisé',
    VALIDATING: 'Validation des détails du pair...',
    PLACEHOLDER: {
      HOST: 'http://1.2.3.4',
      PORT: '4003'
    }
  },

  PASSPHRASE_INPUT: {
    HIDE: 'Masquer la phrase secrète',
    LABEL: 'Phrase secrète',
    QR: 'Scanner le QR code',
    SHOW: 'Afficher la phrase secrète'
  },

  PASSWORD_INPUT: {
    HIDE: 'Masquer le mot de passe',
    LABEL: 'Mot de passe',
    SHOW: 'Afficher le mot de passe'
  },

  PASSPHRASE_VERIFICATION: {
    WORD_LABEL_1: 'Premier mot',
    WORD_LABEL_2: 'Deuxième mot',
    WORD_LABEL_3: 'Troisième mot',
    WORD_LABEL_4: 'Quatrième mot',
    WORD_LABEL_5: 'Cinquième mot',
    WORD_LABEL_6: 'Sixième mot',
    WORD_LABEL_7: 'Septième mot',
    WORD_LABEL_8: 'Huitième mot',
    WORD_LABEL_9: 'Neuvième mot',
    WORD_LABEL_10: 'Dixième mot',
    WORD_LABEL_11: 'Onzième mot',
    WORD_LABEL_12: 'Douzième mot'
  },

  PAGES: {
    CONTACT_ALL: {
      CREATE_CONTACT: 'Créer un contact',
      IMPORT_CONTACT: 'Importer un contact',
      DELETE_CONTACT: 'Supprimer ce contact',
      INSTRUCTIONS: 'Cette page vous permet de créer des contacts, ce qui vous permet de travailler plus facilement avec des adresses en leur attribuant un nom identifiable.',
      HEADER: 'Mes contacts',
      SHOW_CONTACT: 'Afficher le contact'
    },

    CONTACT_NEW: {
      INSTRUCTIONS: {
        HEADER: 'Nouveau contact',
        TEXT: 'Entrez l\'adresse de votre contact. Vous pourrez voir ses transactions'
      },
      TITLE: 'Entrez l\'adresse du contact',
      ADDRESS: 'Adresse',
      NAME: 'Nom du contact (optionnel)',
      NAME_INFO: 'Info.:',
      NAME_DESCRIPTION: 'Le nom de la personne à contacter n\'est pas obligatoire, mais il peut être utilisé pour votre confort',
      FAILED: 'Impossible de créer le contact',
      SUCCESS: '\'{0}\' a été ajouté à vos contacts'
    },

    DASHBOARD: {
      ALL_WALLETS: 'Tous les portefeuilles',
      ADD_WALLET: 'Ajouter un portefeuille',
      CREATE_WALLET: 'Créer un portefeuille',
      IMPORT_WALLET: 'Importer un portfeuille',
      LAST_TRANSACTIONS: 'Dernières transactions'
    },

    NETWORK_OVERVIEW: {
      INSTRUCTIONS: {
        HEADER: 'Gérer les réseaux',
        TEXT: 'Sélectionnez et modifiez l\'un des réseaux disponibles ou ajoutez-en de nouveaux..'
      },
      CREATE_NEW: 'Ajouter un nouveau réseau',
      CREATE_NEW_DESCRIPTION: 'Paramètres individuels pour votre réseau',
      NEW_NETWORK: 'Nouveau réseau'
    },

    PROFILE_ALL: {
      HEADER: 'Mes profils',
      ADD_PROFILE: 'Ajouter un profil',
      EDIT_PROFILE: 'Editer le profil',
      REMOVE_PROFILE: 'Supprimer ce profil',
      SELECT_PROFILE: 'Utiliser ce profil'
    },

    PROFILE_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Créer un profil',
          TEXT: 'Entrez votre nom ou pseudo et sélectionnez votre langue préférée et la devise par défaut.'
        },
        NAME: 'Nom de profil',
        TITLE: '1. Détails du profil',
        AVATAR: 'Sélectionnez votre avatar préféré ou la première lettre de votre nom de profil',
        NO_AVATAR: 'Aucun avatar'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Sélection du réseau',
          TEXT: 'Choisissez le réseau de ce profil.'
        },
        CUSTOM_NETWORK: 'ou vous pouvez choisir un réseau personnalisé',
        CUSTOM_NETWORK_EXPLAIN: 'Vous pouvez sélectionner votre réseau personnalisé ou choisir l’un des réseaux disponibles.',
        NAME: 'Nom de profil',
        TITLE: '2. Réseau'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Apparence',
          TEXT: 'Personnalisez cette application en sélectionnant l’un de nos thèmes et arrière-plans.'
        },
        THEME: 'Choisissez le mode clair ou sombre',
        BACKGROUND: 'Sélectionnez votre fond préféré',
        NAME: 'Nom de profil',
        TITLE: '3. Apparence'
      }
    },

    PROFILE_EDITION: {
      TAB_PROFILE: {
        INSTRUCTIONS: {
          HEADER: 'Editer ce profil',
          TEXT: 'Ici, vous pouvez modifier votre nom ou pseudo, sélectionner votre langue préférée ainsi que la devise par défaut, le réseau et l\'avatar.'
        },
        TITLE: 'Profil'
      },
      TAB_DESIGN: {
        INSTRUCTIONS: {
          HEADER: 'Personnaliser ce portefeuille',
          TEXT: 'Ici, vous pouvez choisir le thème par défaut (clair ou foncé) et l’arrière-plan.'
        },
        TITLE: 'Conception de portefeuille'
      }
    },

    WALLET: {
      TRANSACTIONS: 'Transactions',
      DELEGATES: 'Délégués',
      STATISTICS: 'Statistiques',
      SIGN_VERIFY: 'Signer',
      PURCHASE: 'Achat {ticker}'
    },

    WALLET_EXCHANGE: {
      CHANGELLY_TERMS: {
        TITLE: 'Achetez {ticker} directement dans le portefeuille ARK Desktop avec notre intégration Changelly',
        CONTENT: 'Changelly vous permet d\'échanger d\'autres crypto-devises en {ticker} et vous offre la possibilité d\'acheter {ticker} directement avec vos cartes de crédit ou de débit.',
        CONFIRMATION: 'J\'ai lu et accepté les {terms} et la {privacy} de Changelly. En cliquant sur {button}, je reconnais et comprends que ma transaction peut déclencher une vérification AML/KYC selon Changelly {kyc}.',
        TERMS_OF_USE: 'conditions d\'utilisation',
        PRIVACY_POLICY: 'politique de confidentialité',
        KYC: 'AML/KYC'
      }
    },

    WALLET_ALL: {
      CREATE_WALLET: 'Créer un portefeuille',
      DELETE_WALLET: 'Supprimer ce portefeuille',
      HEADER: 'Mes portefeuilles',
      IMPORT_WALLET: 'Importer un portefeuille',
      LOADING_LEDGER: 'Chergement des portefeuilles Ledger...',
      SHOW_WALLET: 'Afficher le portefeuille',
      TOTAL_BALANCE: 'Solde total',
      CACHE_LEDGER: 'Masquer les portefeuilles du registre ?',
      CACHE_LEDGER_INFO: 'Cachez les portefeuilles de votre registre pour accélérer le chargement lors de la première connexion',
      ADDRESS: 'Adresse',
      NAME: 'Nom',
      VOTING_FOR: 'Voter pour',
      BALANCE: 'Solde',
      DELETE: 'Supprimer'
    },

    WALLET_IMPORT: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Importer un portefeuille',
          TEXT: 'Remplissez la phrase secrète de votre portefeuille. Vous pouvez d\'abord renseigner l\'adresse pour vous assurer qu\'elle correspond à la phrase secrète donnée.'
        },
        TITLE: '1. Importer un portefeuille',
        ONLY_ADDRESS: 'Utilisez uniquement l\'adresse',
        ONLY_PASSPHRASE: 'Utilisez uniquement la phrase secrète'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Chiffrement du portefeuille',
          TEXT: 'Entrez le mot de passe que vous souhaitez utiliser pour chiffrer votre phrase secrète.'
        },
        TITLE: '2. Chiffrement',
        PASSWORD: 'Mot de passe du portefeuille (optionnel)',
        PASSWORD_CONFIRM: 'Confirmez le mot de passe',
        PASSWORD_WARNING: 'Stocker votre phrase secrète peut comporter des risques.'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Configuration du portefeuille',
          TEXT: 'Facultativement, choisissez un nom pour votre portefeuille et vous avez terminé.'
        },
        TITLE: '3. Confirmation',
        ADDRESS: 'Adresse du portefeuille',
        NAME: 'Nom du portefeuille (optionnel)'
      },
      FAILED: 'Échec de l\'importation du portefeuille'
    },

    WALLET_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Nouveau portefeuille',
          TEXT_BEFORE_BUTTON: 'Sélectionnez l\'un de ces portefeuilles fraîchement générés. Si vous ne les aimez pas, cliquez sur le',
          TEXT_AFTER_BUTTON: 'bouton pour en générer d\'autres.'
        },
        TITLE: '1. Choisissez le portefeuille'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Votre clé personnelle',
          TEXT: 'Veillez à enregistrer votre phrase secrète en toute sécurité. Ne montrez cette phrase secrète à personne.'
        },
        TITLE: '2. Sauvegarde'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Confirmation de la phrase secrète',
          TEXT: 'Saisissez des {words} de votre phrase secrète pour vérifier le nouveau compte.',
          ALL_WORDS: 'Tous les mots',
          WORDS: 'les mots {words}'
        },
        TITLE: '3. Vérification',
        CHECK_ENTIRE_PASSPHRASE: 'Vérifier la phrase secrète entière',
        VERIFY_ALL_WORDS: 'Vérifier chaque mot de la phrase secrète'
      },
      STEP4: {
        INSTRUCTIONS: {
          HEADER: 'Chiffrement du portefeuille',
          TEXT: 'Entrez le mot de passe que vous souhaitez utiliser pour chiffrer votre phrase secrète.'
        },
        TITLE: '4. Chiffrement',
        PASSWORD: 'Mot de passe du portefeuille (optionnel)',
        PASSWORD_CONFIRM: 'Confirmez le mot de passe',
        PASSWORD_WARNING: 'Stocker votre phrase secrète peut comporter des risques.'
      },
      STEP5: {
        INSTRUCTIONS: {
          HEADER: 'Configuration du portefeuille',
          TEXT: 'Accessoirement, choisissez un nom pour votre portefeuille et vous avez terminé.'
        },
        TITLE: '5. Confirmation',
        ADDRESS: 'Adresse du portefeuille',
        NAME: 'Nom du portefeuille (optionnel)'
      }
    },

    WALLET_SHOW: {
      NO_VOTE: 'Le portefeuille n\'a pas voté',
      ADD_CONTACT: 'Ajouter aux contacts'
    }
  },

  PROFILE_LEAVING_CONFIRMATION: {
    QUESTION: 'Êtes-vous sûr de vouloir ignorer les modifications apportées à ce profil ?',
    NO: 'Non, les sauvegarder',
    YES: 'Oui, les ignorer'
  },

  PROFILE_REMOVAL_CONFIRMATION: {
    NOTE: 'Bien que cela supprime vos portefeuilles, il ne supprime aucune donnée de la blockchain. Vous pouvez récupérer les portefeuilles aussi longtemps que vous avez leurs phrases secrètes',
    QUESTION: 'Êtes-vous sûr de vouloir supprimer ce profil ?'
  },

  SELECTION_AVATAR: {
    AVATARS: 'Avatars',
    MODAL_HEADER: 'Selectionner un avatar'
  },

  SELECTION_BACKGROUND: {
    MODAL_HEADER: 'Selectionner un fond',
    TEXTURES: 'Textures',
    WALLPAPERS: 'Papier-peint'
  },

  SELECTION_NETWORK: {
    MODAL_HEADER: 'Réseaux'
  },

  TRANSACTION: {
    TYPE: {
      TRANSFER: 'Transfert',
      SECOND_SIGNATURE: 'Seconde Signature',
      DELEGATE_REGISTRATION: 'Inscription des délégués',
      VOTE: 'WALLET_VOTED_FOR',
      UNVOTE: 'Annuler le vote',
      MULTI_SIGNATURE: 'Multi-Signature',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Transfert en différé',
      MULTI_PAYMENT: 'Multi-Paiement',
      DELEGATE_RESIGNATION: 'Démission des délégués'
    },
    ERROR: {
      TRANSFER: 'Votre transaction n\'a pas pu être envoyée',
      SECOND_SIGNATURE: 'La deuxième signature n\'a pas pu être enregistrée',
      DELEGATE_REGISTRATION: 'Impossible de s\'inscrire en tant que délégué',
      VOTE: 'Le vote n\'a pas pu être enregistré',
      UNVOTE: 'L\'annulation du vote n\'a pas pu être enregistré',
      MULTI_SIGNATURE: 'La signature multiple n\'a pas pu être créée',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Le transfert en différé n\'a pu être créé',
      MULTI_PAYMENT: 'Le paiement multiple n\'a pas pu être créé',
      DELEGATE_RESIGNATION: 'La démission du délégué a échoué',
      SAVE_OFFLINE: 'Échec de l\'enregistrement de votre fichier de transaction',
      EXPIRED: 'La transaction a expiré avant son traitement : {transactionId}',
      FEE_TOO_LOW: 'La transaction n\'a pas pu être envoyée car les frais ({fee}) sont trop bas.',
      NOTHING_SENT: 'La transaction n\'a pas pu être envoyée. Veuillez vérifier votre connexion réseau ou changer d\'égal à égal'
    },
    FOOTER_TEXT: {
      DELEGATE_REGISTRATION: 'N\'oubliez pas que vous ne pouvez pas modifier le nom de votre délégué après l\'enregistrement de la chaîne de chaînes.'
    },
    FORM: {
      DELEGATE_REGISTRATION: {
        INSTRUCTIONS: 'pour {address}.'
      },
      SECOND_SIGNATURE: {
        INSTRUCTIONS: 'pour {address}.'
      }
    },
    INFO: {
      BROADCASTING: 'Votre transaction est en cours de diffusion sur le réseau',
      BROADCASTING_SLOW: 'Il semble que cela prenne un certain temps pour diffuser votre transaction. Vous pouvez fermer la fenêtre et continuer à envoyer en arrière-plan.'
    },
    SUCCESS: {
      TRANSFER: 'Votre transaction a été envoyée avec succès',
      SECOND_SIGNATURE: 'Seconde signature enregistrée avec succès',
      DELEGATE_REGISTRATION: 'Enregistré avec succès en tant que délégué',
      VOTE: 'Vote enregistré',
      UNVOTE: 'Annulation du vote enregostrée',
      MULTI_SIGNATURE: 'Signature multiple créée avec succès',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Transfert en différé créé avec succès',
      MULTI_PAYMENT: 'Multi-paiement créé avec succès',
      DELEGATE_RESIGNATION: 'La démission des délégués a été un succès',
      SAVE_OFFLINE: 'Le fichier de transaction enregistré avec succès dans :{path}'
    },
    VOTE: {
      VOTE_DELEGATE: 'Votez pour le délégué {delegate}',
      UNVOTE_DELEGATE: 'Annuler le vote pour le délégué {delegate}'
    },
    WARNING: {
      BROADCAST: 'La transaction a été diffusée à d\'autres pairs. Cela peut ne pas être accepté par eux'
    },
    AMOUNT: 'Montant',
    BLOCK_ID: 'ID du Block',
    CONFIRMATION_COUNT: '{confirmations} Confirmations',
    CONFIRM_SEND_ALL: 'Cela permettra d\'envoyer tous vos jetons à partir du portefeuille actuel dans cette transaction.',
    CONFIRM_SEND_ALL_TITLE: 'Envoyer tous vos jetons ?',
    CONFIRM_SEND_ALL_NOTE: 'Remarque : une fois envoyé, cela ne peut pas être annulé.',
    CONFIRMATIONS: 'Confirmations',
    CREATE_TRANSFER: 'Créer un transfert',
    DISCARD: 'Rejeter',
    EXPIRED: 'Expiré',
    FEE: 'Frais de transaction',
    ID: 'ID',
    LEDGER_SIGN_NOTICE: 'Ensuite, vous confirmerez la transaction avec votre grand livre.',
    LEDGER_SIGN_WAIT: 'En attente de signature du grand livre. Veuillez vérifier et signer la transaction lorsque vous êtes prêt.',
    LEDGER_SIGN_FAILED: 'Impossible de signer la transaction avec Ledger',
    LEDGER_USER_DECLINED: 'Refusé par l\'utlisateur', // User declined
    MULTIPLE: 'Multiple',
    OPEN_IN_EXPLORER: 'Ouvrir dans l\'explorateur',
    PASSPHRASE: 'Phrase secrète',
    PASSWORD: 'Mot de passe de chiffrement',
    RECIPIENT: 'Bénéficiaire',
    RESEND: 'Renvoyer',
    RESENT_NOTICE: 'La transaction {transactionId} a été renvoyée',
    SAVE_OFFLINE: 'Enregistrer la transaction hors ligne',
    SECOND_PASSPHRASE: 'Seconde phrase secrète',
    SEND: 'Envoyer',
    SEND_ALL: 'Envoyer tout',
    SENDER: 'Emetteur',
    SINGLE: 'Unique',
    TIMESTAMP: 'Horodatage',
    TRANSACTION: 'Transaction',
    VENDOR_FIELD: 'Smartbridge',
    WELL_CONFIRMED: 'Bien confirmé',
    WELL_CONFIRMED_COUNT: 'Bien confirmés ({confirmations} confirmations)'
  },

  SIGN_VERIFY: {
    VERIFY_WALLET: 'Vérifiez votre portefeuille',
    VERIFY_BY_SIGNING: 'Signer un message pour vérifier que vous possédez le portefeuille',
    SIGN: 'Signer',
    VERIFY: 'Vérifier',
    TITLE_SIGN: 'Signer un message',
    TITLE_VERIFY: 'Verifier un message',
    MESSAGE: 'Message',
    ADDRESS: 'Adresse',
    PUBLIC_KEY: 'Clé publique',
    SIGNATURE: 'Signature',
    JSON_MESSAGE: 'Contenu du message signé',
    FORMAT_FOOTER: 'Format (JSON): { "publicKey": "...", "signature": "...", "message": "..." }',
    VERIFIED: 'Le message est vérifié avec succès',
    NOT_VERIFIED: 'Le message n\'est PAS vérifié',
    CONFIRMATION: 'Confirmation',
    DELETE: 'Supprimer le message',
    FAILED_SIGN: 'Impossible de signer le message',
    FAILED_VERIFY: 'Impossible de vérifier le message',
    SUCCESSFULL_SIGN: 'Votre message a été signé',
    SUCCESSFULL_VERIFY: 'Le message a été vérifié'
  },

  SYNCHRONIZER: {
    VOTE: 'voté pour',
    UNVOTE: 'non voté',
    NEW_SECOND_SIGNATURE: 'Nouvelle seconde signature : {address}',
    NEW_DELEGATE_REGISTRATION: 'Nouveau délégué : {address} enregistré comme {username}',
    NEW_VOTE: 'Nouveau vote : {address} {voteUnvote} {publicKey}',
    NEW_TRANSFER_SENT: 'Nouveau transfert : {amount} envoyé de {sender} à {recipient}',
    NEW_TRANSFER_RECEIVED: 'Nouveau transfert : {amount} reçu de {sender} par {recipient}'
  },

  TRANSACTION_FORM: {
    ERROR: {
      NOT_ENOUGH_BALANCE: 'Le solde est trop bas ({balance})'
    }
  },

  TRANSACTION_DETAIL: {
    SEND_AMOUNT: 'Envoyer {token}'
  },

  WALLET_HEADING: {
    ACTIONS: {
      WALLET_NAME: 'Nom du portefeuille',
      CONTACT_NAME: 'Nom du contact',
      REGISTER_DELEGATE: 'Inscrire un délégué',
      SECOND_PASSPHRASE: '2nd phrase secrète',
      DELETE_WALLET: 'Delete wallet',
      SHOW_PUBLIC_KEY: 'Afficher la clé publique',
      SHOW_ADDRESS: 'Afficher l\'adresse'
    },
    SECOND_PASSPHRASE_ENABLED: 'Deuxième signature activée'
  },

  WALLET_SECOND_SIGNATURE: {
    NEW: 'Générer une nouvelle deuxième phrase secrète',
    ALREADY_REGISTERED: 'Il existe déjà une deuxième phrase secrète enregistrée pour cette adresse.',
    INSTRUCTIONS: 'Ceci est votre deuxième phrase secrète. Assurez-vous d\'en faire une sauvegarde et conservez-la dans un endroit sûr !'
  },

  WALLET_SIDEBAR: {
    FILTER: 'Filtrer',
    HIDE: 'Masquer',
    EXPAND: 'Développer',
    LOADING_LEDGER: 'Chargement du grand livre...',
    FILTERS: {
      HIDE_EMPTY_CONTACTS: 'Masquer les contacts vides',
      HIDE_EMPTY_WALLETS: 'Masquer les portefeuilles vides',
      HIDE_LEDGER: 'Masquer les portefeuilles de grand livre' // Hide Ledger wallets
    },
    SEARCH: {
      PLACEHOLDER_CONTACTS: 'Cliquez pour filtrer vos contacts',
      PLACEHOLDER_WALLETS: 'Cliquez pour filtrer vos portefeuilles'
    },
    SORT: {
      BALANCE_ASC: 'Solde (min à max)',
      BALANCE_DESC: 'Solde (max à min)',
      BY: 'Trier par',
      NAME_ASC: 'Nom (A à Z)',
      NAME_DESC: 'Nom (Z à A)'
    }
  },

  WALLET_DELEGATES: {
    RANK: 'Rang',
    USERNAME: 'Nom d\'utilisateur',
    PRODUCTIVITY: 'Productivité',
    RANK_BANNER: 'Rang : {rank}',
    PRODUCTIVITY_BANNER: 'Productivité : {productivity}',
    APPROVAL: 'Vote %',
    FORGED: 'Forgé',
    BLOCKS: 'Blocks',
    MISSED: 'manqué',
    VOTERS: 'Votants',
    UNVOTE: 'Annuler le vote', // Unvote
    VOTES: 'Votes',
    VOTE: 'Vote',
    USERNAME_ERROR: 'Aucun caractère spécial ou majuscule n\'est autorisé',
    USERNAME_MAX_LENGTH_ERROR: 'Le nom d\'utilisateur doit être inférieur ou égal à 20 caractères',
    ALREADY_REGISTERED: 'Ce portefeuille est déjà enregistré en tant que délégué',
    BLOG: 'Guide de vote',
    EXPLANATION: 'Le vote est un mécanisme facultatif, mais important, qui assure la sécurité du réseau. Les délégués ayant recueilli le plus grand nombre de votes du réseau sont chargés de vérifier et de valider les transactions dans de nouveaux blocs. Cette page peut être utilisée pour voter pour un délégué que vous soutenez. En savoir plus sur le vote pour un délégué en cliquant sur le lien suivant:',
    VOTE_DELEGATE: 'Voter pour le délégué {delegate}',
    UNVOTE_DELEGATE: 'Annuler le vote pour le délégué {delegate}',
    VOTED_FOR: 'Vous avez voté pour le délégué {delegate}',
    WALLET_VOTED_FOR: 'Ce portefeuille a voté pour le délégué {delegate}'
  },

  WALLET_RENAME: {
    TITLE: 'Renommer le portefeuille',
    TITLE_ADD: 'Ajouter un portefeuille',
    NEW: 'Nom du nouveau portefeuille',
    ADD: 'Ajouter un portefeuille',
    RENAME: 'Renommer le portefeuille',
    ADDRESS_INFO: 'Définissez un nom pour ce portefeuille : ',
    ERROR_LEDGER: 'Impossible de renommer le portefeuille du grand livre :{error}'
  },

  CONTACT_RENAME: {
    TITLE: 'Renommer le contact',
    TITLE_ADD: 'Ajouter un contact',
    NEW: 'Nom du nouveau contact',
    ADD: 'Ajouter un contact',
    RENAME: 'Renommer un contact',
    ADDRESS_INFO: 'Définir un nom pour ce contact : '
  },

  WALLET_REMOVAL_CONFIRMATION: {
    NOTE: 'Ceci ne supprime aucune donnée sur la blockchain. Vous pouvez récupérer le portefeuille tant que vous avez la phrase secrète',
    QUESTION: 'Êtes-vous sûr(e) de vouloir retirer ce portefeuille ?'
  },

  WALLET_TRANSACTIONS: {
    TRANSACTION_ID: 'ID de la transaction',
    RECIPIENT: 'Bénéficiaire',
    SENDER: 'Emetteur',
    AMOUNT: 'Montant',
    NEW_TRANSACTIONS: 'Ce portefeuille contient {count} nouvelle transaction {plural}. Appuyez sur le bouton d\'actualisation pour mettre à jour.'
  },

  WALLET_TABLE: {
    ACTIONS: 'Actions',
    DELETE: 'Effacer',
    NO_DELETE: 'Les portefeuilles de grand livre ne peuvent pas être supprimés', // Ledger wallets cannot be deleted
    RENAME: 'Renommer'
  }
}
