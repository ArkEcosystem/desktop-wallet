export default {
  COMMON: {
    ADDRESS: 'Endereço',
    ALL: 'Tudo',
    APP_NAME: 'Carteira ARK DESKTOP',
    APP_NAME_SHORT: 'ARK Desktop',
    APPEARANCE: 'Aparencia',
    AVATAR: 'Avatar',
    BACK: 'Voltar',
    BACKGROUND: 'Background',
    BIP39_LANGUAGE: 'Passphrase Language (BIP39)',
    CONFIRM: 'Confirmar',
    CURRENCY: 'Moeda',
    DATE: 'Data',
    DELEGATE: 'Delegado',
    DONE: 'Feito',
    FAILED_UPDATE: 'Falha ao atualizar \'{name}\'. Razão: {reason}',
    FAILED_FETCH: 'Falha ao buscar {name}. Razão: "{msg}".',
    FETCH: 'Buscar',
    FINISH: 'Terminar',
    HIDE_WALLET_BUTTON_TEXT: 'Ocultar texto dos botões da carteira',
    IS_MARKET_CHART_ENABLED: 'Gráfico de preços no painel',
    LANGUAGE: 'Linguagem de Aplicação',
    LEDGER: 'Ledger',
    LEDGER_WALLET: 'Esta é uma carteira do Ledger',
    LOAD: 'Carga',
    NETWORK: 'Rede',
    NETWORK_NAME: 'Este nome é fornecido pela rede',
    NEXT: 'Próximo',
    NOT: 'Não',
    OF: 'Do',
    OTHER: 'Outro',
    PREV: 'Prev',
    PROFILE_NAME: 'Nome do Perfil',
    REMOVE: 'Remover',
    SAVE: 'Salvar',
    SKIP: 'Pular',
    START: 'Iniciar',
    THEME: 'Tema',
    TIME_FORMAT: 'Formato da hora',
    VERIFIED_ADDRESS: 'Este é um endereço verificado',
    WARNING: 'Aviso',
    WILL: 'Vai',
    WALLET: 'Carteira'
  },

  ANNOUNCEMENTS: {
    LATEST_NEWS: 'Últimas notícias',
    READ_MORE: 'Leia mais',
    ALL_READ: 'Marcar tudo como lido'
  },

  INTRODUCTION: {
    WELCOME: {
      TITLE: 'Bem-vindo ao {APP}',
      SAFETY_MESSAGE: 'Por favor, dedique alguns minutos para ler as próximas telas para sua própria segurança.',
      FUNDS_WARNING: 'Seus fundos podem ser irrecuperáveis se você não prestar muita atenção a esses avisos.'
    },
    POWER: {
      TITLE: 'Seu poder',
      FINANCE: 'A coisa mais importante para os usuários saberem sobre criptomoedas é que eles invertem completamente o modelo comumente aceito de como as finanças funcionam.',
      BANKS: 'Nas finanças tradicionais, você desiste do controle direto do seu dinheiro para um banco. Como os bancos têm controle sobre seu dinheiro, eles podem realizar ações em seu nome, como reembolsar transações e redefinir suas informações de login.',
      CRYPTO: 'Criptomoedas levam esse poder e dão a você diretamente. Usando nada mais do que sua senha, você pode controlar exatamente quando, onde e como seu dinheiro é mantido e gasto.',
      RESPONSIBILITY: 'No entanto, nas palavras do tio Ben Parker, com grandes poderes vem grandes responsabilidades.'
    },
    DUTY: {
      TITLE: 'Seu dever',
      CONTROL: 'A indústria blockchain é construída para ser resistente à censura. Isso significa que ninguém controla sua conta, exceto você. Esse design traz a tranquilidade de que nenhuma autoridade central pode confiscar, congelar ou manipular seus fundos a qualquer momento. Também não há localização central para dados pessoais ou fundos a serem hackeados.',
      OWNER: 'Isso também traz uma responsabilidade maior para você, o proprietário da conta.',
      WARNING: {
        ACCOUNT: 'Diferente da sua conta bancária tradicional, {CANNOT_RESTORE}.',
        CANNOT_RESTORE: 'Senhas perdidas, senhas ou fundos roubados não podem ser restaurados pelos delegados, pela equipe do ARK.io ou por qualquer outra pessoa'
      },
      SECURITY: 'A segurança da sua conta é da sua exclusiva responsabilidade.'
    },
    RESPONSIBILITY: {
      TITLE: 'Sua responsabilidade',
      STORAGE: {
        EXPLANATION: 'A {PASSPHRASE} de cada endereço da carteira é capaz de assinar transações e movimentar fundos. Isso significa que, se seu computador morrer, mas você tiver sua frase secreta, ainda poderá acessar seus fundos. A ARK Desktop Wallet tem um recurso adicional que permite definir um {ENCRYPTED} também, para facilitar o gerenciamento. Se o seu computador morrer, você não poderá usar a senha criptografada para acessar seus fundos de uma máquina diferente. {NEED}.',
        PASSPHRASE: 'Frase secreta',
        ENCRYPTED: 'Senha criptografada',
        NEED: 'Você precisará da frase secreta'
      },
      BACKUP: {
        ALWAYS: 'Sempre faça backup de sua frase secreta e mantenha-a em um local seguro.',
        OPTIONS: 'Você pode anotá-lo em papel e armazenar várias cópias em locais seguros. Você também pode armazená-lo em uma unidade flash criptografada. Alternativamente, você pode usar um dispositivo de hardware USB Ledger Nano S, disponível em Ledger.com, para armazenar e acessar seus fundos e a Carteira Desktop ARK. Você pode conectar seu Ledger Nano S ao seu computador e acessar o blockchain ARK sem precisar digitar sua frase secreta..'
      },
      REMEMBER: 'Remember, anyone who has your passphrase can access your funds. Never share your account with anyone and avoid storing it in locations that are susceptible to hacks, such as the Cloud.'
    },
    TURN: {
      TITLE: 'Your Turn',
      KNOWLEDGE: 'Agora, armado com o conhecimento de como é importante manter suas senhas seguras, você está pronto para reivindicar sua autonomia financeira com o ARK Desktop Wallet.',
      SUPPORT: 'O ARK é um ecossistema de código aberto e, se precisar de ajuda, a comunidade e a equipe da ARK estão aqui para ajudar. Crie um post no reddit.ark.io, ou entre no chat em tempo real no slack.ark.io.',
      CONCLUSION: 'Todos aqui na equipe ARK.io esperam que você goste de usar a ARK Desktop Wallet para participar da revolução blockchain!'
    }
  },

  SEARCH: {
    DEFAULT_PLACEHOLDER: 'Encontrar transação, endereço ou delegado',
    FILTER: 'Filtrar',
    SEARCH_BY: 'Procurar por',
    SELECT_OPTION: 'Selecione uma opção',
    DELEGATE: 'Delegado',
    WALLETS: 'Carteiras',
    PERIOD: 'Período'
  },

  CONTACT_REMOVAL_CONFIRMATION: {
    QUESTION: 'Tem certeza de que deseja remover este contato?'
  },

  ENCRYPTION: {
    DECRYPTING: 'Descriptografar carteira com senha ...',
    ENCRYPTING: 'Descriptografar carteira com senha ...',
    FAILED_DECRYPT: 'Falha ao decifrar a frase secreta',
    FAILED_ENCRYPT: 'Falha ao criptografar a frase secreta'
  },

  PEER: {
    BEST: 'Conecte-se ao melhor',
    CONNECTED: 'Conectado ao peer',
    CONNECT_CUSTOM: 'Conecte o peer personalizado',
    CONNECT_FAILED: 'Falha ao conectar-se ao peer',
    DELAY: 'Latência',
    DISCONNECT: 'Desconectar do peer',
    FAILED_REFRESH: 'Falha ao atualizar seus peers',
    HEIGHT: 'Altura do bloco',
    LAST_CHECKED: 'Última verificação',
    NONE: 'Nenhuma',
    NO_CONNECT: 'Não foi possível conectar',
    PEER: 'Peer',
    STATUS_CHECK_FAILED: 'Falha na verificação de status',
    WRONG_NETWORK: 'Rede errada'
  },

  VALIDATION: {
    TOO_LONG: 'A \'{0}\' é muito longo',
    INVALID_URI: 'URI inválido',
    INVALID_FORMAT: 'Formato Inválido',
    INVALID_TYPE: 'Tipo invalido',
    MAX_LENGTH: 'Máximo {0}',
    MUST_BE_GREATER_THAN: 'Deve ser maior que {0}',
    NOT_MATCH: 'A \'{0}\' não corresponde ao \'{1}\'',
    NOT_VALID: 'A \'{0}\' não é válido',
    NOT_NUMERIC: 'A \'{0}\' não é numérico',
    NO_SCHEME: 'A \'{0}\' não tem \'http://\' or \'https://\'',
    NAME: {
      DUPLICATED: 'O nome \'{0}\' já existe',
      EXISTS_AS_CONTACT: 'O nome \'{0}\' já foi atribuído a um contato',
      EXISTS_AS_WALLET: 'O nome \'{0}\' já foi atribuído a uma carteira',
      MAX_LENGTH: 'O nome deve ter menos que {0} caracteres.',
      MIN_LENGTH: 'O nome deve ter pelo menos 1 caractere | O nome deve ter pelo menos {n} characters.'
    },
    PASSWORD: {
      TOO_SHORT: 'Sua senha deve ter pelo menos {0} caracteres',
      NUMBERS: 'Sua senha deve conter pelo menos um número',
      SPECIAL_CHARACTERS: 'Sua senha deve conter pelo menos 1 caractere especial',
      NO_MATCH: 'Suas senhas não conferem'
    },
    ADDRESS: {
      EXISTS_AS_CONTACT: 'O endereço \'{0}\' já foi adicionado como contato',
      EXISTS_AS_WALLET: 'O endereço \'{0}\' já foi importado como uma carteira'
    },
    PUBLIC_KEY: {
      INVALID_LENGTH: 'A chave pública deve ter 66 caracteres'
    },
    VENDOR_FIELD: {
      LIMIT_REACHED: 'Você pode inserir no máximo {0} caracteres apenas',
      LIMIT_REMAINING: '{0}/{1} Restante'
    },
    RECIPIENT_DIFFERENT_NETWORK: 'O destinatário {0} pertence a um rede diferente',
    REQUIRED: 'O \'{0}\'O é necessário',
    SEND_NOT_ENABLED: 'O envio não está ativado para a carteira selecionada',
    WALLET_NOT_ACTIVE: 'Selecione uma carteira e abra o URI novamente',
    WARNING_BIP39: 'The \'{0}\' is a BIP39 Passphrase',
    WARNING_NOT_BIP39: 'The \'{0}\' is not a BIP39 Passphrase'
  },

  LANGUAGES: {
    'en-US': 'Inglês',
    'es-ES': 'Espanhol',
    'it-IT': 'Italiano',
    'pt-BR': 'Portugues - Brazil'
  },

  TIME_FORMAT: {
    DEFAULT: 'Padrão',
    '12H': '12h',
    '24H': '24h'
  },

  BIP39_LANGUAGES: {
    chinese_simplified: 'Chinês simplificado',
    chinese_traditional: 'Chinês tradicional',
    english: 'Inglês',
    french: 'Francês',
    italian: 'Italiano',
    japanese: 'Japonês',
    korean: 'Coreano',
    spanish: 'Espanhol'
  },

  MARKET: {
    MARKET: 'Mercado',
    HISTORICAL_DATA: 'Data histórica',
    DAY: 'Dia',
    WEEK: 'Semana',
    MONTH: 'Mês'
  },

  TABLE: {
    PAGE: 'Page',
    ROWS_PER_PAGE: 'Linhas por página',
    NO_TRANSACTIONS: 'Nenhuma transação foi encontrada. As últimas transações serão exibidas aqui.',
    NO_CONTACTS: 'Nenhum contato para ser mostrado.',
    NO_DELEGATES: 'Nenhum delegado será mostrado.',
    NO_WALLETS: 'Nenhuma carteira deve ser mostrada.'
  },

  APP: {
    RELEASE: {
      REQUEST_ERROR: 'Não é possível verificar a versão mais recente'
    }
  },

  APP_FOOTER: {
    TEXT: 'Feito com ♥ por Ark'
  },

  APP_SIDEMENU: {
    ANNOUNCEMENTS: 'Anúncios',
    CONTACTS: 'Meus contatos',
    CURRENT_PROFILE: 'Seu perfil atual é "{profileName}"',
    DASHBOARD: 'painel de controle',
    NETWORK: 'Rede',
    NETWORKS: 'Gerenciar redes',
    PLUGINS: 'Plugins',
    PLUGINS_PAGES: 'Páginas de plugins',
    SETTINGS: {
      CURRENCY: 'Moeda',
      DARK_MODE: 'Modo escuro',
      SCREENSHOT_PROTECTION: {
        TITLE: 'Proteção de captura de tela',
        QUESTION: 'Tem certeza de que deseja desativar a proteção de captura de tela?',
        NOTE: 'Esse recurso permite que os aplicativos protejam o próprio conteúdo da janela na tela de serem capturados ou copiados por meio de utilitários de captura de tela.',
        SESSION_ONLY: 'Desativar apenas para esta sessão',
        PERMANENTLY: 'Desativar permanentemente'
      },
      BACKGROUND_UPDATE_LEDGER: 'Atualizar Ledger em segundo plano',
      BROADCAST_PEERS: 'Transmissão para vários peers',
      TITLE: 'Configurações atuais',
      RESET_DATA: {
        TITLE: 'Redefinir dados',
        QUESTION: 'Tem certeza de que deseja limpar seus dados?',
        NOTE: 'Todos os seus dados, incluindo perfis, carteiras, redes e contatos serão removidos do aplicativo e redefinidos para o padrão. Os dados, como transações, que estão no blockchain não podem ser removidos.'
      },
      THEME: 'Tema'
    },
    WALLETS: 'Minhas carteiras'
  },

  APP_SIDEMENU_NOTIFICATION: {
    NOTIFICATION: 'Uma nova versão ({version}) foi lançado. Atualize agora!',
    TOOLTIP: 'Nova versão ({version}) foi lançado!'
  },

  MARKET_CHART: {
    TODAY: 'Hoje',
    TODAY_AT: 'Hoje às {hour}',
    WEEK: {
      LONG: {
        FRI: 'Sexta-feira',
        MON: 'Segunda-feira',
        SAT: 'Sábado',
        SUN: 'Domingo',
        TUE: 'Terça-Feira',
        THU: 'Quinta-feira',
        WED: 'Quarta-feira'
      },
      SHORT: {
        FRI: 'SEX',
        MON: 'SEG',
        SAT: 'SAB',
        SUN: 'DOM',
        TUE: 'TER',
        THU: 'QUI',
        WED: 'QUA'
      }
    },
    YESTERDAY_AT: 'Ontem às {hour}'
  },

  MARKET_CHART_HEADER: {
    PRICE: '{currency} preço',
    SHOW_CHART: 'Mostrar gráfico'
  },

  BUTTON_CLIPBOARD: {
    DONE: 'Copiado!',
    COPY_TO_CLIPBOARD: 'Cópia de {0} para a área de transferência',
    NOT_SUPPORTED: 'Copiar para a área de transferência não é suportado'
  },

  INPUT_ADDRESS: {
    ERROR: {
      NOT_VALID: 'O endereço não é válido',
      REQUIRED: 'O endereço é obrigatório'
    },
    KNOWN_ADDRESS: 'Esta carteira é conhecida como "{address}"',
    LABEL: 'Endereço',
    NEO_ADDRESS: 'Existe um endereço NEO como este',
    QR: 'Digitalize o QR CODE'
  },

  INPUT_CURRENCY: {
    ERROR: {
      LESS_THAN_MINIMUM: 'O valor mínimo é {amount}',
      NOT_ENOUGH_AMOUNT: 'A quantia máxima é {amount}',
      NOT_VALID: 'O valor não é válido',
      REQUIRED: 'A quantia é necessária'
    },
    LABEL: 'Montante'
  },

  INPUT_DELEGATE: {
    ERROR: {
      REQUIRED: 'O nome, endereço ou chave pública do delegado é obrigatório',
      USERNAME_NOT_FOUND: 'O delegado \'{0}\' Não pode ser achado',
      ADDRESS_NOT_FOUND: 'O delegado com o endereço \'{0}\' não pode ser achado',
      PUBLIC_KEY_NOT_FOUND: 'O delegado com a chave pública \'{0}\' não pode ser achado'
    },
    SEARCH_HINT: 'Você pode pesquisar por nome de usuário, endereço ou chave pública'
  },

  INPUT_FEE: {
    LAST: 'Último',
    MINIMUM: 'Mínimo',
    AVERAGE: 'Média',
    MAXIMUM: 'Máximo',
    INPUT: 'Entrada',
    ADVANCED: 'Avançado',
    LOW_FEE_NOTICE: 'Transações com taxas baixas podem nunca ser confirmadas',
    ADVANCED_NOTICE: 'Tenha cuidado com a taxa que você escolhe, pois vai custar mais do que o necessário se for muito alto',
    UNIQUE: 'A taxa de rede foi definida para o valor estático de {fee}',
    ERROR: {
      NOT_VALID: 'A taxa não é válida',
      LESS_THAN_MINIMUM: 'A taxa mínima é {fee}',
      MORE_THAN_MAXIMUM: 'A taxa máxima é {fee}'
    }
  },

  INPUT_GRID: {
    MORE: 'Mostre mais'
  },

  INPUT_GRID_MODAL: {
    TITLE: 'Selecione'
  },

  WALLET_SELECTION: {
    PROFILE: 'Perfil do remetente',
    WALLET: 'Carteira remetente'
  },

  MODAL_ADDITIONAL_LEDGERS: {
    CANCEL: 'Cancelar',
    INFO: 'Escolha o valor máximo de carteiras do Ledger que você deseja exibir. Você está mostrando no momento {quantity} carteiras.',
    LARGE_QUANTITY: 'Você está tentando carregar um grande número de carteiras. Isso pode resultar em carregamento lento ou o dispositivo pode atingir o tempo limite.',
    LOAD: 'Carregar carteiras',
    QUANTITY: 'Quantidade',
    TITLE: 'Carregar carteiras adicionais do razão'
  },

  MODAL_EXPORT_WALLETS: {
    ADVANCED: 'Opções avançadas',
    CANCEL: 'Cancelar',
    COUNT: '{count} carteiras serão exportadas',
    ERROR: {
      EXPORT_WALLETS: 'Falha ao exportar suas carteiras'
    },
    EXPORT: 'Exportar 0 Carteiras | Exportar 1 carteira | Exportar {count} Carteiras',
    INSTRUCTIONS: 'Suas carteiras exportadas não conterão suas senhas, somente os endereços e respectivos nomes serão salvos!',
    OPTIONS: {
      ADD_NETWORK: 'Adicionar informações sobre a rede',
      EXCLUDE_EMPTY: 'Excluir carteiras vazias',
      EXCLUDE_LEDGER: 'Excluir carteiras do razão',
      EXCLUDE_UNNAMED: 'Excluir carteiras sem nome'
    },
    SUCCESS: {
      EXPORT_WALLETS: 'Suas carteiras foram exportadas com sucesso para: {path}'
    },
    TITLE: 'Carteiras de exportação'
  },

  MODAL_CONFIRMATION: {
    CANCEL: 'Não, cancelar',
    CONTINUE: 'Sim eu tenho certeza',
    TITLE: 'Confirmação'
  },

  MODAL_CLOSE_CONFIRMATION: {
    QUESTION: 'Tem certeza que deseja fechar esta janela?',
    CONFIRM: 'Sim, fechar',
    CANCEL: 'Não, cancelar'
  },

  MODAL_QR_CODE: {
    TITLE: 'QR Code',
    SUBTITLE: 'Verificar endereço'
  },

  MODAL_QR_SCANNER: {
    ERROR: {
      NOT_ALLOWED: 'Precisamos de acesso à câmera para escanear um QR CODE',
      NOT_FOUND: 'Não foi possível encontrar uma câmera',
      NOT_SUPPORTED: 'A página não é servida por uma conexão segura (https)',
      NOT_READABLE: 'Não conseguimos ler o stream da câmera, talvez ele já esteja em uso?',
      OVERCONSTRAINED: 'Parece que não conseguimos encontrar uma câmera correta. Isso pode ser um problema com as restrições que esperamos.',
      STREAM: 'Parece que você está usando um navegador não suportado. Isso é muito curioso ..'
    },
    LOADING: 'Carregando câmera',
    INSTRUCTION: 'Por favor, segure um QR CODE na frente da câmera',
    TITLE: 'QR Scanner',
    DECODE_FAILED: 'Falha ao decodificar dados: {data}'
  },

  MODAL_LOADER: {
    CLOSE_WARNING: 'Parece que algo deu errado. Você pode fechar a janela, mas isso pode causar efeitos adversos.'
  },

  MODAL_NETWORK: {
    NAME: 'Nome',
    DESCRIPTION: 'Descrição',
    SEED_SERVER: 'Seed Server',
    NETHASH: 'Nethash',
    TOKEN: 'Token',
    SYMBOL: 'Símbolo',
    VERSION: 'Versão',
    EXPLORER: 'Explorer',
    EPOCH: 'Época',
    WIF: 'WIF',
    SLIP44: 'Slip44',
    ACTIVE_DELEGATES: 'Delegados Ativos',
    MARKET_TICKER: 'Market Ticker (Optional)',
    FAILED_FETCH: 'Falha ao buscar informações da rede',
    NETWORK_IN_USE: 'Esta rede está em uso por um ou mais perfis e não pode ser removida',
    DEFAULT_NETWORK_NO_DELETE: 'esta é uma rede padrão e não pode ser excluída',
    VALIDATING_SEED: 'Validando detalhes do Seed Server ...',
    SEED_VALIDATE_FAILED: 'Falha ao conectar-se ao servidor de origem',
    PLACEHOLDER: {
      EXPLORER: 'http://explorer.io',
      SEED_SERVER: 'http://1.1.1.1:4002',
      EPOCH: '2017-03-21T13:00:00.000Z'
    }
  },

  MODAL_NETWORK_SELECTION: {
    TITLE: 'Redes'
  },

  MODAL_PEER: {
    CANCEL: 'Cancelar',
    CONNECT: 'Conectar',
    HOST: 'Protocolo + IP / Hostname',
    PORT: 'Porta',
    TITLE: 'Conecte-se a um peer personalizado',
    VALIDATING: 'Validando detalhes de peer ...',
    PLACEHOLDER: {
      HOST: 'http://1.2.3.4',
      PORT: '4003'
    }
  },

  PASSPHRASE_INPUT: {
    HIDE: 'Ocultar a frase secreta',
    LABEL: 'Passphrase',
    QR: 'Digitalize o QR CODE',
    SHOW: 'Mostrar a frase secreta'
  },

  PASSWORD_INPUT: {
    HIDE: 'Esconda a senha',
    LABEL: 'Senha',
    SHOW: 'Mostrar a senha'
  },

  PASSPHRASE_VERIFICATION: {
    WORD_LABEL_1: 'A 1ª palavra',
    WORD_LABEL_2: 'A 2ª palavra',
    WORD_LABEL_3: 'A 3ª palavra',
    WORD_LABEL_4: 'A 4ª palavra',
    WORD_LABEL_5: 'A 5ª palavra',
    WORD_LABEL_6: 'A 6ª palavra',
    WORD_LABEL_7: 'A 7 palavra',
    WORD_LABEL_8: 'A 8 palavra',
    WORD_LABEL_9: 'A 6ª palavra',
    WORD_LABEL_10: 'A 10ª palavra',
    WORD_LABEL_11: 'A 11ª palavra',
    WORD_LABEL_12: 'A 12ª palavra'
  },

  PAGES: {
    CONTACT_ALL: {
      CREATE_CONTACT: 'Criar contato',
      IMPORT_CONTACT: 'Importar contato',
      INSTRUCTIONS: 'Esta página permite criar contatos, facilitando o trabalho com endereços, dando a eles um nome identificável',
      HEADER: 'Meus contatos',
      SHOW_CONTACT: 'Mostrar contato'
    },

    CONTACT_NEW: {
      INSTRUCTIONS: {
        HEADER: 'Novo contato',
        TEXT: 'Digite o endereço do seu contato. Você poderá ver suas transações'
      },
      TITLE: 'Digite o endereço de contato',
      ADDRESS: 'Endereço',
      NAME: 'Nome do contato (opcional)',
      NAME_INFO: 'Info:',
      NAME_DESCRIPTION: 'O nome do contato não é obrigatório, mas pode ser usado para sua conveniência',
      FAILED: 'Falha ao criar contato',
      SUCCESS: '\'{0}\' foi adicionado aos seus contatos'
    },

    DASHBOARD: {
      ALL_WALLETS: 'Todas as carteiras',
      ADD_WALLET: 'Adicione uma carteira',
      CREATE_WALLET: 'Criar carteira',
      IMPORT_WALLET: 'Importar carteira ',
      LAST_TRANSACTIONS: 'Últimas transações'
    },

    NETWORK_OVERVIEW: {
      INSTRUCTIONS: {
        HEADER: 'Gerenciar redes',
        TEXT: 'Selecione e edite qualquer uma das redes disponíveis ou adicione novas.'
      },
      CREATE_NEW: 'Adicione uma nova rede',
      CREATE_NEW_DESCRIPTION: 'Configurações individuais para sua rede',
      NEW_NETWORK: 'Nova rede'
    },

    PLUGINS: {
      HEADER: 'Plugins',
      DISCOVER: 'Descubra os plugins',
      OPEN: 'Abrir plugins',
      RELOAD: 'Recarregar Plugins'
    },

    PROFILE_ALL: {
      HEADER: 'Meus perfis',
      ADD_PROFILE: 'Adicionar perfil',
      EDIT_PROFILE: 'Editar Perfil',
      REMOVE_PROFILE: 'Remover este perfil ',
      SELECT_PROFILE: 'Use este perfil'
    },

    PROFILE_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Crie um perfil',
          TEXT: 'Digite seu nome ou apelido e selecione seu idioma preferido e a moeda padrão.'
        },
        NAME: 'Nome do perfil',
        TITLE: '1. Detalhes do perfil',
        AVATAR: 'Selecione seu avatar favorito ou a primeira letra do seu nome de perfil'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Seleção de rede',
          TEXT: 'Escolha a rede deste perfil.'
        },
        CUSTOM_NETWORK: 'ou você pode escolher uma rede personalizada',
        CUSTOM_NETWORK_EXPLAIN: 'Você pode selecionar sua rede personalizada ou escolher qualquer uma das redes disponíveis.',
        NAME: 'Nome do perfil',
        TITLE: '2. Rede'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Aparência',
          TEXT: 'Personalize este aplicativo selecionando um de nossos temas e planos de fundo.'
        },
        MARKET_CHART: 'Opte por exibir o gráfico de preços no painel ou não',
        THEME: 'Escolha o tema',
        BACKGROUND: 'Selecione seu plano de fundo favorito',
        NAME: 'Nome do perfil',
        TITLE: '3. Aparência'
      }
    },

    PROFILE_EDITION: {
      ERROR: {
        DUPLICATE_PROFILE: 'Um perfil já existe com esse nome'
      },
      TAB_PROFILE: {
        INSTRUCTIONS: {
          HEADER: 'Edite este perfil',
          TEXT: 'Aqui você pode modificar seu nome ou apelido, selecionar seu idioma preferido e moeda padrão, a rede e o avatar.'
        },
        TITLE: 'Perfil'
      },
      TAB_DESIGN: {
        INSTRUCTIONS: {
          HEADER: 'Personalize esta carteira',
          TEXT: 'Aqui você pode escolher o tema padrão (claro ou escuro) e o plano de fundo.'
        },
        TITLE: 'Design de carteira'
      }
    },

    WALLET: {
      TRANSACTIONS: 'Transações',
      DELEGATES: 'Delegados',
      STATISTICS: 'Estatisticas',
      SIGN_VERIFY: 'Placa',
      PURCHASE: 'Compra {ticker}'
    },

    WALLET_EXCHANGE: {
      CHANGELLY_TERMS: {
        TITLE: 'Compre {ticker} diretamente dentro da ARK Desktop Wallet com a nossa integração com o Changelly',
        CONTENT: 'Changelly permite que você troque outras criptomoedas em {ticker} e tem a opção de comprar {ticker} diretamente com seus cartões de crédito ou débito.',
        CONFIRMATION: 'Eu li e concordo com o {terms} e a {privacy} de Changelly. Clicando {button}, Eu reconheço e entendo que minha transação pode acionar a verificação AML / KYC de acordo com a Changelly {kyc}.',
        TERMS_OF_USE: 'termos de uso',
        PRIVACY_POLICY: 'política de privacidade',
        KYC: 'AML/KYC'
      }
    },

    WALLET_ALL: {
      LEDGER: {
        CACHE: 'Carteiras de contabilidade?',
        CACHE_INFO: 'Carteiras de cache de seu livro para acelerar o carregamento quando conectado pela primeira vez',
        ADDITIONAL: 'Carregar carteiras adicionais do razão',
        OPTIONS: 'Opções do razão'
      },
      CREATE_WALLET: 'Criar carteira',
      DELETE_WALLET: 'Excluir esta carteira',
      EXPORT_WALLETS: 'Exportar carteiras',
      HEADER: 'Minhas carteiras',
      IMPORT_WALLET: 'Carteira de Importação',
      LOADING_LEDGER: 'Carregando carteiras do Ledger ...',
      SHOW_WALLET: 'Mostrar carteira',
      TOTAL_BALANCE: 'Balanço total',
      ADDRESS: 'Endereço',
      NAME: 'Nome',
      VOTING_FOR: 'Votar por',
      DELEGATE_NOT_ACTIVE: '{delegate} ({rank}) não é um delegado ativo',
      BALANCE: 'Equilibrar',
      DELETE: 'Excluir'
    },

    WALLET_IMPORT: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Carteira de Importação',
          TEXT: 'Preencha a senha da sua carteira. Você pode preencher o endereço primeiro, para garantir que ele corresponda à frase-senha fornecida.'
        },
        TITLE: '1. Importar Carteira',
        ONLY_ADDRESS: 'Use o endereço somente',
        ONLY_PASSPHRASE: 'Use apenas a frase secreta'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Criptografia de carteira',
          TEXT: 'Insira uma senha que você gostaria de usar para criptografar sua frase secreta.'
        },
        TITLE: '2. Criptografia',
        PASSWORD: 'Senha da carteira (opcional)',
        PASSWORD_CONFIRM: 'Confirme a senha',
        PASSWORD_WARNING: 'Armazenar sua senha pode trazer riscos.'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Configuração de carteira',
          TEXT: 'Opcionalmente, escolha um nome para sua carteira e pronto.'
        },
        TITLE: '3. Confirmação',
        ADDRESS: 'Endereço da carteira',
        NAME: 'Nome da carteira (opcional)'
      },
      FAILED: 'Falha ao importar carteira '
    },

    WALLET_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Nova carteira ',
          TEXT_BEFORE_BUTTON: 'Selecione uma dessas carteiras recém-geradas. Se você não gosta deles, clique no',
          TEXT_AFTER_BUTTON: 'botão para gerar outros.'
        },
        TITLE: '1. Escolha carteira '
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Sua chave pessoal',
          TEXT: 'Certifique-se de salvar sua senha com segurança. Não mostre esta senha para ninguém.'
        },
        TITLE: '2. Backup'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Confirmação de frase secreta',
          TEXT: 'Tipo {words} da sua senha para verificar a nova conta.',
          ALL_WORDS: 'todas as palavras',
          WORDS: 'as palavras {words}'
        },
        TITLE: '3. Verificação',
        CHECK_ENTIRE_PASSPHRASE: 'Verifique toda a frase secreta',
        VERIFY_ALL_WORDS: 'Verificar cada palavra de frase secreta'
      },
      STEP4: {
        INSTRUCTIONS: {
          HEADER: 'Criptografia de carteira',
          TEXT: 'Insira uma senha que você gostaria de usar para criptografar sua frase secreta.'
        },
        TITLE: '4. Criptografia',
        PASSWORD: 'Senha da carteira (opcional)',
        PASSWORD_CONFIRM: 'Confirme a Senha',
        PASSWORD_WARNING: 'Armazenar sua senha pode trazer riscos.'
      },
      STEP5: {
        INSTRUCTIONS: {
          HEADER: 'Configuração de carteira',
          TEXT: 'Opcionalmente, escolha um nome para sua carteira e pronto.'
        },
        TITLE: '5. Confirmação',
        ADDRESS: 'Seu endereço e identificador da carteira',
        NAME: 'Nome da carteira (opcional)'
      }
    },

    WALLET_SHOW: {
      NO_VOTE: 'A carteira não votou',
      ADD_CONTACT: 'Adicionar aos contatos'
    }
  },

  PLUGIN_TABLE: {
    ACTIONS: 'Ações',
    ENABLE: 'Habilitar',
    ENABLED: 'Ativado',
    DESCRIPTION: 'Descrição',
    DISABLE: 'Desabilitar',
    DISABLED: 'Desativado',
    ID: 'ID',
    NAME: 'Nome',
    NO_PERMISSIONS: 'Nenhuma permissão',
    NO_PLUGINS: 'Nenhum plugin disponível',
    PERMISSIONS: 'Permissões',
    STATUS: 'Status'
  },

  PROFILE_LEAVING_CONFIRMATION: {
    QUESTION: 'Tem certeza de que deseja ignorar as alterações feitas neste perfil?',
    NO: 'Não, salve-os',
    YES: 'Sim, ignore-os'
  },

  PROFILE_REMOVAL_CONFIRMATION: {
    NOTE: 'Embora remova suas carteiras, não exclui nenhum dado no blockchain. Você pode recuperar as carteiras contanto que tenha suas senhas',
    QUESTION: 'Tem certeza de que deseja remover este perfil?'
  },

  SELECTION_AVATAR: {
    ADDITIONAL_AVATARS: 'Avatares Adicionais',
    AVATARS: 'Avatares',
    MODAL_HEADER: 'Selecione o avatar',
    NO_AVATAR: 'Sem avatar'
  },

  SELECTION_BACKGROUND: {
    MODAL_HEADER: 'Selecione o plano de fundo',
    TEXTURES: 'Texturas',
    WALLPAPERS: 'Papeis de parede'
  },

  SELECTION_NETWORK: {
    MODAL_HEADER: 'Redes'
  },

  TRANSACTION: {
    TYPE: {
      TRANSFER: 'Transferir',
      SECOND_SIGNATURE: 'Segunda assinatura',
      DELEGATE_REGISTRATION: 'Registro de Delegado',
      VOTE: 'Vote',
      UNVOTE: 'Desvotar',
      MULTI_SIGNATURE: 'Assinatura Multi',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Transferência de Timelock',
      MULTI_PAYMENT: 'Multi Pagamento',
      DELEGATE_RESIGNATION: 'Delegar Renúncia'
    },
    ERROR: {
      TRANSFER: 'Sua transação não pôde ser enviada',
      SECOND_SIGNATURE: 'Segunda assinatura não pôde ser registrada',
      DELEGATE_REGISTRATION: 'Não foi possível registrar como delegado',
      VOTE: 'A votação não pôde ser registrada',
      UNVOTE: 'O unvote não pôde ser registrado',
      MULTI_SIGNATURE: 'A assinatura múltipla não pôde ser criada',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'A transferência de timelock não pôde ser criada',
      MULTI_PAYMENT: 'O pagamento múltiplo não pôde ser criado',
      DELEGATE_RESIGNATION: 'Delegação de delegação não teve sucesso',
      SAVE_OFFLINE: 'Falha ao salvar seu arquivo de transação',
      LOAD_FROM_FILE: 'Falha ao carregar o arquivo de transação',
      EXPIRED: 'Transação expirou antes de ser processada: {transactionId}',
      FEE_TOO_LOW: 'A transação não pôde ser enviada porque a taxa ({fee}) é muito baixo',
      NOTHING_SENT: 'A transação não pôde ser enviada. Por favor, verifique sua conexão de rede ou altere seus peers'
    },
    FOOTER_TEXT: {
      DELEGATE_REGISTRATION: 'Tenha em mente que você não pode alterar o nome do seu representante depois que o registro for registrado no blockchain.'
    },
    INFO: {
      BROADCASTING: 'Sua transação está sendo transmitida para a rede',
      BROADCASTING_SLOW: 'Parece que demora um pouco para transmitir sua transação. Você pode fechar a janela e ela continuará enviando em segundo plano.'
    },
    SUCCESS: {
      TRANSFER: 'Sua transação foi enviada com sucesso',
      SECOND_SIGNATURE: 'Segunda assinatura registrada com sucesso',
      DELEGATE_REGISTRATION: 'Registrado com sucesso como delegado',
      VOTE: 'Votou com sucesso',
      UNVOTE: 'Não votado com sucesso',
      MULTI_SIGNATURE: 'Assinatura múltipla criada com sucesso',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Transferência de timelock criada com sucesso',
      MULTI_PAYMENT: 'Pagamento múltiplo criado com sucesso',
      DELEGATE_RESIGNATION: 'Renúncia de delegado foi bem sucedida',
      SAVE_OFFLINE: 'O arquivo de transação salvo com sucesso em: {path}',
      LOAD_FROM_FILE: 'Falha ao carregar o arquivo de transação'
    },
    VOTE: {
      VOTE_DELEGATE: 'Vote para o delegado {delegate}',
      UNVOTE_DELEGATE: 'Desvotar delegado {delegate}'
    },
    WARNING: {
      BROADCAST: 'Transação foi transmitida para outros pares. Pode não ser aceito por eles'
    },
    AMOUNT: 'Montante',
    BLOCK_ID: 'Block ID',
    CONFIRMATION_COUNT: '{confirmations} Confirmações',
    CONFIRM_SEND_ALL: 'Isso permitirá o envio de todos os seus tokens da carteira atual nesta transação.',
    CONFIRM_SEND_ALL_TITLE: 'Envie todos os seus tokens?',
    CONFIRM_SEND_ALL_NOTE: 'Nota: uma vez enviado, isso não pode ser desfeito.',
    CONFIRMATIONS: 'Confirmações',
    CREATE_TRANSFER: 'Criar transferência',
    DISCARD: 'Descartar',
    EXPIRED: 'Expirado',
    FEE: 'Taxa de transação',
    ID: 'ID',
    LEDGER_SIGN_NOTICE: 'Em seguida, você confirmará a transação com seu Ledger',
    LEDGER_SIGN_WAIT: 'Aguardando a assinatura do razão. Por favor, verifique e assine a transação quando estiver pronto.',
    LEDGER_SIGN_FAILED: 'Não foi possível assinar transação com o Ledger',
    LEDGER_USER_DECLINED: 'Usuário recusado',
    LOAD_FROM_FILE: 'Falha ao carregar o arquivo de transação',
    MULTIPLE: 'Múltiplo',
    OPEN_IN_EXPLORER: 'Abrir no Explorer',
    PASSPHRASE: 'Passphrase',
    PASSWORD: 'Senha de Criptografia',
    RECIPIENT: 'Recebedor',
    RESEND: 'Reenviar',
    RESENT_NOTICE: 'Transação {transactionId} foi reenviado',
    SAVE_OFFLINE: 'Salvar transação off-line',
    SECOND_PASSPHRASE: 'Segunda frase-chave',
    SEND: 'Mandar',
    SEND_ALL: 'Envie todos',
    SENDER: 'Remetente',
    SINGLE: 'Solteiro',
    TIMESTAMP: 'Timestamp',
    TRANSACTION: 'Transação',
    VENDOR_FIELD: 'Smartbridge',
    WELL_CONFIRMED: 'Bem confirmado',
    WELL_CONFIRMED_COUNT: 'Bem confirmado({confirmations} confirmações)'
  },

  SIGN_VERIFY: {
    VERIFY_WALLET: 'Verifique sua carteira',
    VERIFY_BY_SIGNING: 'Assine uma mensagem para confirmar que você é o proprietário da carteira',
    SIGN: 'Placa',
    VERIFY: 'Verificar',
    TITLE_SIGN: 'Assine uma mensagem',
    TITLE_VERIFY: 'Verificar uma mensagem',
    MESSAGE: 'mensagem',
    ADDRESS: 'Endereço',
    PUBLIC_KEY: 'Chave pública',
    SIGNATURE: 'Assinatura',
    JSON_MESSAGE: 'Conteúdo da mensagem assinada',
    FORMAT_FOOTER: 'Format (JSON): { "publicKey": "...", "signature": "...", "message": "..." }',
    VERIFIED: 'A mensagem é verificada com sucesso',
    NOT_VERIFIED: 'A mensagem NÃO é confirmada',
    CONFIRMATION: 'Confirmação',
    DELETE: 'Apagar mensagem',
    FAILED_SIGN: 'Não foi possível assinar a mensagem',
    FAILED_VERIFY: 'Não foi possível verificar a mensagem',
    SUCCESSFULL_SIGN: 'Sua mensagem foi assinada',
    SUCCESSFULL_VERIFY: 'A mensagem foi verificada'
  },

  SYNCHRONIZER: {
    VOTE: 'votado para',
    UNVOTE: 'não votado',
    NEW_SECOND_SIGNATURE: 'Nova segunda assinatura: {address}',
    NEW_DELEGATE_REGISTRATION: 'Novo delegado: {address} registrado como {username}',
    NEW_VOTE: 'Novo voto: {address} {voteUnvote} {publicKey}',
    NEW_TRANSFER_SENT: 'Nova transferência: {amount} enviado de {sender} para {recipient}',
    NEW_TRANSFER_RECEIVED: 'Nova transferência: {amount} recebido de {sender} para {recipient}'
  },

  TRANSACTION_FORM: {
    ERROR: {
      NOT_ENOUGH_BALANCE: 'O saldo é muito baixo ({balance})'
    }
  },

  TRANSACTION_DETAIL: {
    SEND_AMOUNT: 'Mandar {token}'
  },

  WALLET_HEADING: {
    ACTIONS: {
      WALLET_NAME: 'Nome da carteira',
      CONTACT_NAME: 'Nome de contato',
      REGISTER_DELEGATE: 'Registrar delegado',
      SECOND_PASSPHRASE: '2 passphrase',
      DELETE_WALLET: 'Excluir carteira',
      SHOW_PUBLIC_KEY: 'Mostrar chave pública',
      SHOW_ADDRESS: 'Mostrar endereço'
    },
    PENDING_BALANCE: '{amount} incluindo 1 transação não confirmada | {amount} incluindo {n} transações não confirmadas',
    SECOND_PASSPHRASE_ENABLED: 'Segunda assinatura ativada'
  },

  WALLET_SECOND_SIGNATURE: {
    NEW: 'Gerar nova segunda frase secreta',
    ALREADY_REGISTERED: 'Já existe uma segunda frase-senha registrada para este endereço',
    INSTRUCTIONS: 'Você precisará de 12 senhas de palavra para interagir com a rede. Mantenha eles salvos!'
  },

  WALLET_SIDEBAR: {
    FILTER: 'Filtro',
    HIDE: 'Ocultar',
    EXPAND: 'Expandir',
    LOADING_LEDGER: 'Ledger de carregamento...',
    FILTERS: {
      HIDE_EMPTY_CONTACTS: 'Ocultar contatos vazios',
      HIDE_EMPTY_WALLETS: 'Esconder carteiras vazias',
      HIDE_LEDGER: 'Ocultar carteiras do Ledger'
    },
    SEARCH: {
      PLACEHOLDER_CONTACTS: 'Clique para filtrar seus contatos',
      PLACEHOLDER_WALLETS: 'Clique para filtrar suas carteiras'
    },
    SORT: {
      BALANCE_ASC: 'Saldo (minímo a máximo)',
      BALANCE_DESC: 'Balance (maxáximo para minímo)',
      BY: 'Ordenar por',
      NAME_ASC: 'Nome (A a Z)',
      NAME_DESC: 'Nome (Z a A)'
    }
  },

  WALLET_DELEGATES: {
    RANK: 'Classificação',
    USERNAME: 'Nome de usuário',
    RANK_BANNER: 'Classificação: {rank}',
    APPROVAL: 'Voto %',
    FORGED: 'Forjado',
    BLOCKS: 'Blocos',
    VOTERS: 'Eleitores',
    UNVOTE: 'Desvotar',
    VOTES: 'Votos',
    VOTE: 'Voto',
    USERNAME_EMPTY_ERROR: 'O nome de usuário deve ter pelo menos 1 caractere',
    USERNAME_ERROR: 'Nenhum caractere especial ou maiúsculo permitido',
    USERNAME_EXISTS: 'Já existe um delegado com esse nome de usuário',
    USERNAME_MAX_LENGTH_ERROR: 'O nome de usuário deve ser menor ou igual a 20 caracteres',
    ALREADY_REGISTERED: 'Esta carteira já está registrada como delegado',
    BLOG: 'Guia de votação',
    EXPLANATION: 'A votação é um mecanismo opcional, mas importante, que mantém a rede da Ark segura. Os 51 delegados com mais votos da rede são responsáveis por verificar e forjar transações em novos blocos. Esta página pode ser usada para votar em um delegado que você apóia. Saiba mais sobre como votar em um delegado clicando no link a seguir:',
    VOTE_DELEGATE: 'Delegado de voto {delegate}',
    UNVOTE_DELEGATE: 'Desvendar Delegado {delegate}',
    CURRENTLY_VOTED: 'Você é votado atualmente para {delegate}',
    VOTED_FOR: 'Você votou para delegar {delegate}',
    WALLET_VOTED_FOR: 'Esta carteira votou pelo delegado {delegate}',
    VOTE_INFO: 'Informação:',
    NO_VOTE: 'Esta carteira não está votando. Para ver mais informações e votar, use a pesquisa ou clique em qualquer delegado',
    AWAITING_VOTE_CONFIRMATION: 'Seu {type} está aguardando confirmação',
    LOADING_VOTE: 'Carregando detalhes do voto ...',
    SEARCH_DELEGATE: 'Delegado de pesquisa'
  },

  WALLET_GRID: {
    LOADING_LEDGER: 'Carregando carteiras do Ledger ...'
  },

  WALLET_RENAME: {
    TITLE: 'Rename wallet',
    TITLE_ADD: 'Adicionar carteira',
    NEW: 'Novo nome da carteira',
    ADD: 'Adicionar carteira',
    RENAME: 'Renomear carteira',
    ADDRESS_INFO: 'Definir um nome para esta carteira: ',
    ERROR_LEDGER: 'Não foi possível renomear a carteira do razão: {error}'
  },

  CONTACT_RENAME: {
    TITLE: 'Renomear contato',
    TITLE_ADD: 'Adicionar contato',
    NEW: 'Novo nome de contato',
    ADD: 'Adicionar contatot',
    RENAME: 'Renomear contato',
    ADDRESS_INFO: 'Definir um nome para este contato: '
  },

  WALLET_REMOVAL_CONFIRMATION: {
    NOTE: 'Ele não exclui nenhum dado no blockchain. Você pode recuperar a carteira contanto que tenha a senha',
    QUESTION: 'Tem certeza de que deseja remover esta carteira?'
  },

  WALLET_TRANSACTIONS: {
    TRANSACTION_ID: 'ID de transação',
    RECIPIENT: 'Recebedor',
    SENDER: 'Remetente',
    AMOUNT: 'Montante',
    NEW_TRANSACTIONS: 'Esta carteira tem {count} nova transação {plural}. Pressione o botão de atualização para atualizar.'
  },

  WALLET_TABLE: {
    ACTIONS: 'Ações',
    DELETE: 'Excluir',
    NO_DELETE: 'Carteiras do razão não podem ser excluídas',
    RENAME: 'Renomear'
  }
}
