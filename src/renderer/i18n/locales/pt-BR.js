export default {
  COMMON: {
    APP_NAME: 'ARK Desktop Wallet',
    ALL: 'Tudo',
    APPEARANCE: 'Aparência',
    AVATAR: 'Avatar',
    BACK: 'Voltar',
    BIP39_LANGUAGE: 'BIP39 Linguagem',
    DONE: 'Concluir',
    FINISH: 'Finalizar',
    CONFIRM: 'Confirmar',
    CURRENCY: 'Moeda',
    LANGUAGE: 'Linguagem',
    NETWORK: 'Rede',
    PREV: 'Anterior',
    NEXT: 'Próximo',
    OF: 'Do',
    NOT: 'Não',
    WILL: 'Vai',
    PROFILE_NAME: 'Nome perfil',
    SAVE: 'Salvar',
    SELECT_BACKGROUND: 'Selecione um background',
    SELECT_THEME: 'Selecione o tema da carteira',
    START: 'Iniciar',
    FAILED_FETCH: 'Falha em buscar {name}. Razção: "{msg}".',
    DATE: 'Data',
    WARNING: 'Aviso',
    FETCH: 'Buscar',
    REMOVE: 'Remover',
    OTHER: 'Outro'
  },

  ANNOUNCEMENTS: {
    LATEST_NEWS: 'Últimas noticías',
    READ_MORE: 'Leia mais'
  },

  INTRODUCTION: {
    PAGE_TITLE: 'Sua {page}',
    WELCOME: {
      TITLE: 'Bem vindo ao {app}',
      SAFETY_MESSAGE: 'Por favor, dedique alguns minutos para ler as próximas telas para sua própria segurança.',
      FUNDS_WARNING: 'Seus fundos podem ser irrecuperáveis se você não prestar atenção a esses avisos.'
    },
    POWER: {
      TITLE: 'Poder',
      FINANCE: 'A coisa mais importante para os usuários saberem sobre criptomoedas é que eles invertem completamente o modelo comumente aceito de como funciona o financiamento.',
      BANKS: 'Nas finanças tradicionais, você desiste do controle direto do seu dinheiro para um banco. Como os bancos têm controle sobre seu dinheiro, eles podem realizar ações em seu nome, como reembolsar transações e redefinir suas informações de login.',
      CRYPTO: 'Criptomoedas levam esse poder e dão a você diretamente. Usando nada mais do que sua chave privada, você pode controlar exatamente quando, onde e como seu dinheiro é mantido e gasto.',
      RESPONSIBILITY: 'No entanto, nas palavras do tio Ben Parker, com grande poder vem grande responsabilidade.'
    },
    DUTY: {
      TITLE: 'Dever',
      INTRO: 'A indústria de blockchain é construída para ser resistente à censura. Isso significa que ninguém controla sua conta, exceto você. Esse design traz a tranquilidade de que nenhuma autoridade central pode confiscar, congelar ou manipular seus fundos a qualquer momento.',
      OWNER: 'Também traz uma responsabilidade maior para você, o proprietário da conta.',
      WARNING: {
        INFO: 'Ao contrário da sua conta bancária tradicional, {warn}',
        WARN: 'Senhas perdidas, senhas ou fundos roubados não podem ser restaurados pela equipe ARK, pelos Delegados ou por qualquer outra pessoa.'
      },
      SECURITY: 'A segurança da sua conta é da sua exclusiva responsabilidade.'
    },
    RESPONSIBILITY: {
      TITLE: 'Responsabilidade',
      STORAGE: 'Você tem a opção de armazenar uma cópia criptografada de sua senha localmente. Lembre-se de que sua senha é sua conta. Se você escolher essa opção e seu computador morrer, sua conta será perdida para sempre.',
      BACKUP: 'Sempre faça backup de sua frase secreta e mantenha-a em um local seguro. A melhor prática é escrevê-lo em papel grosso e armazená-lo em um cofre à prova de fogo ou salvá-lo em uma unidade flash criptografada.',
      PASSPHRASE: 'Lembre-se, qualquer pessoa que tenha sua frase secreta pode acessar seu dinheiro. Nunca compartilhe sua conta com ninguém e evite armazená-la em contas suscetíveis a hackers, como serviços na nuvem.'
    },
    TURN: {
      TITLE: 'Virar',
      WALLET: 'Armado com o conhecimento sobre a importância de manter sua frase secreta segura, você está pronto para reivindicar sua autonomia financeira com a ARK Desktop Wallet.',
      HARDWARE_WALLET: 'Como alternativa, para uma camada extra de segurança e conveniência, considere uma carteira de hardware. Esses produtos de armazenamento dedicados gerenciam suas chaves privadas no dispositivo. Além disso, a carteira de hardware Ledger Nano S integra-se diretamente com a ARK Desktop Wallet, o que significa que você pode conectar seu Ledger Nano ao seu computador e acessar o blockchain ARK sem precisar digitar sua frase secreta.'
    }
  },

  SEARCH: {
    DEFAULT_PLACEHOLDER: 'Encontrar transação, endereço ou delegar',
    FILTER: 'Filtrar',
    SEARCH_BY: 'Procurar por',
    SELECT_OPTION: 'Selecione uma opção',
    DELEGATE: 'Delegados',
    WALLETS: 'Carteiras',
    PERIOD: 'Period'
  },

  CONTACT_REMOVAL_CONFIRMATION: {
    QUESTION: 'Tem certeza de que deseja remover este contato?'
  },

  ENCRYPTION: {
    DECRYPTING: 'Descriptografar carteira com senha ...',
    ENCRYPTING: 'Encripitar carteira com senha ...',
    FAILED_DECRYPT: 'Falha ao descriptografar a senha'
  },

  PEER: {
    CONNECTED: 'Conectado ao  peer',
    CONNECT_CUSTOM: 'Conectar ao seu  peer',
    CONNECT_FAILED: 'Falha ao conectar ao  peer',
    DELAY: 'Delay',
    FAILED_REFRESH: 'Falha ao atualizar os  peers',
    HEIGHT: 'Altura',
    LAST_CHECKED: 'Último checado',
    NONE: 'None',
    NO_CONNECT: 'Não foi possível se conectar',
    PEER: 'Peer:',
    STATUS_CHECK_FAILED: 'Falha na verficição de status',
    WRONG_NETWORK: 'Rede errada'
  },

  VALIDATION: {
    TOO_LONG: 'O \'{0}\' é muito longo',
    INVALID_URI: 'Invalido URI',
    MAX_LENGTH: 'Máximo {0}',
    NOT_MATCH: 'O \'{0}\' não corresponde ao \'{1}\'',
    NOT_VALID: 'O \'{0}\' não é valido',
    NOT_NUMERIC: 'O \'{0}\' não é um númeor',
    NO_SCHEME: 'O \'{0}\' não tem \'http://\' ou \'https://\'',
    NAME: {
      DUPLICATED: 'O nome \'{0}\' já está em uso',
      MAX_LENGTH: 'O nome de ver menos de {0} caractere.',
      MIN_LENGTH: 'O nome deve ter pelo menos 1 caractere | O nome deve ter pelo menos {n} caracteres.'
    },
    PASSWORD: {
      TOO_SHORT: 'Sua senha deve ter pelo menos {0} caracteres de comprimento',
      NUMBERS: 'Sua senha deve conter pelo menos 1 número',
      SPECIAL_CHARACTERS: 'Sua senha deve conter pelo menos 1 caractere especial',
      NO_MATCH: 'As senhas não correspondem'
    },
    REQUIRED: 'O \'{0}\' é obrigatorio',
    SEND_NOT_ENABLED: 'O envio não está ativado para a carteira selecionada',
    WALLET_NOT_ACTIVE: 'Selecione uma carteira e abra o URI novamente',
    WARNING_BIP39: 'O \'{0}\' é uma frase secreta BIP39',
    WARNING_NOT_BIP39: 'O \'{0}\' não é uma frase secreta BIP39'
  },

  LANGUAGES: {
    'en-US': 'English',
    'es-ES': 'Spanish',
    'pt-BR': 'Portugues - Brazil'
  },

  BIP39_LANGUAGES: {
    chinese_simplified: 'Chinês simplificado',
    chinese_traditional: 'Chinês tradicional',
    english: 'English',
    french: 'French',
    italian: 'Italian',
    japanese: 'Japanese',
    korean: 'Korean',
    spanish: 'Spanish'
  },

  MARKET: {
    MARKET: 'Market',
    HISTORICAL_DATA: 'Data historica',
    DAY: 'Dia',
    WEEK: 'Semana',
    MONTH: 'Mês'
  },

  TABLE: {
    PAGE: 'Página',
    ROWS_PER_PAGE: 'Linhas por página',
    NO_TRANSACTIONS: 'Nenhuma transação foi encontrada. As últimas transações serão exibidas aqui.',
    NO_DELEGATES: 'Nenhum delegado a ser mostrado.'
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
    DASHBOARD: 'Dashboard',
    NETWORK: 'Rede',
    NETWORK_OVERVIEW: 'Visão geral da rede',
    SETTINGS: {
      CURRENCY: 'Moeda',
      DARK_MODE: 'Modo Dark',
      SCREENSHOT_PROTECTION: 'Proteção de captura de tela',
      TITLE: 'Configurações atual',
      RESET_DATA: {
        TITLE: 'Redefinir dados',
        QUESTION: 'Tem certeza de que deseja limpar seus dados?',
        NOTE: 'Todos os seus dados, incluindo perfis, carteiras, redes e contatos serão removidos do aplicativo e redefinidos para o padrão. Os dados, como transações, que estão no blockchain não podem ser removidos.'
      }
    },
    WALLETS: 'Minhas carteiras'
  },

  APP_SIDEMENU_NOTIFICATION: {
    NOTIFICATION: 'Uma nova versão ({version}) foi lançada. Atualize agora!',
    TOOLTIP: 'Nova versão ({version}) foi lançada!'
  },

  MARKET_CHART: {
    TODAY: 'Hoje',
    TODAY_AT: 'Hoje as {hour}',
    WEEK: {
      LONG: {
        FRI: 'Sexta-feira',
        MON: 'Segunda-feira',
        SAT: 'Sábado',
        SUN: 'Domingo',
        TUE: 'Terça-feira',
        THU: 'Quinta-feira',
        WED: 'Quarta-feira'
      },
      SHORT: {
        FRI: 'Sexta',
        MON: 'Segunda',
        SAT: 'Sábado',
        SUN: 'Domingo',
        TUE: 'Terça',
        THU: 'Quinta',
        WED: 'Quarta'
      }
    },
    YESTERDAY_AT: 'Ontem as {hour}'
  },

  MARKET_CHART_HEADER: {
    PRICE: 'Preço'
  },

  BUTTON_CLIPBOARD: {
    DONE: 'Copiado!',
    COPY_TO_CLIPBOARD: 'Copiado para área de trabalho',
    NOT_SUPPORTED: 'Copiar para a área de transferência não é suportado'
  },

  INPUT_ADDRESS: {
    ERROR: {
      NOT_VALID: 'O endereço não é válido',
      REQUIRED: 'O endereço é obrigatorio',
      NEO_ADDRESS: 'Isso parece um endereço NEO'
    },
    LABEL: 'Endereço',
    QR: 'Escaniar o QR Code'
  },

  INPUT_CURRENCY: {
    ERROR: {
      LESS_THAN_MINIMUM: 'O valor mínimo é {amount}',
      NOT_ENOUGH_AMOUNT: 'O valor máximo é {amount}',
      NOT_VALID: 'O valor não é valido',
      REQUIRED: 'A quantia é obrigatorio'
    },
    LABEL: 'Quantia'
  },

  INPUT_FEE: {
    MINIMUM: 'Mínimo',
    AVERAGE: 'Média',
    MAXIMUM: 'Máximo',
    INPUT: 'Entrada',
    ADVANCED: 'Avançado',
    ADVANCED_NOTICE: 'Tenha cuidado com a taxa que você escolhe, pois vai custar mais do que o necessário se for muito alto',
    UNIQUE: 'A taxa de rede foi definida para o valor estático de {fee}',
    ERROR: {
      NOT_VALID: 'A taxa não é válida',
      LESS_THAN_MINIMUM: 'O mínimo de taxa é {fee}',
      MORE_THAN_MAXIMUM: 'O máximo de taxa é {fee}'
    }
  },

  INPUT_GRID: {
    MORE: 'Mostrar mais'
  },

  INPUT_GRID_MODAL: {
    TITLE: 'Selecione'
  },

  MODAL_CONFIRMATION: {
    CANCEL: 'Não, cancelar',
    CONTINUE: 'Sim, tenho certeza',
    TITLE: 'Confirmação'
  },

  MODAL_QR_CODE: {
    TITLE: 'QR Code',
    SUBTITLE: 'Escaniar o endereço'
  },

  MODAL_QR_SCANNER: {
    ERROR: {
      NOT_ALLOWED: 'Precisamos de acesso à câmera para escanear um código QR',
      NOT_FOUND: 'Não foi possível encontrar uma câmera',
      NOT_SUPPORTED: 'A página não é servida por uma conexão segura (https)',
      NOT_READABLE: 'Não conseguimos ler o stream da câmera, talvez ele já esteja em uso?',
      OVERCONSTRAINED: 'Parece que não conseguimos encontrar uma câmera correta. Isso pode ser um problema com as restrições que esperamos.',
      STREAM: 'Parece que você está usando um navegador não suportado. Isso é muito curioso ..'
    },
    LOADING: 'Carregando camera',
    INSTRUCTION: 'Por favor, segure um código QR na frente da câmera',
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
    SYMBOL: 'Simbolo',
    VERSION: 'Versão',
    EXPLORER: 'Explorer',
    EPOCH: 'Epoch',
    WIF: 'WIF',
    SLIP44: 'Slip44',
    ACTIVE_DELEGATES: 'Delegados ativos',
    MARKET_TICKER: 'Market Ticker (Opcional)',
    FAILED_FETCH: 'Falha ao buscar informações da rede',
    NETWORK_IN_USE: 'Esta rede está em uso por um ou mais perfis e não pode ser removida',
    DEFAULT_NETWORK_NO_DELETE: 'Esta é uma rede padrão e não pode ser excluída',
    VALIDATING_SEED: 'Validando os detalhes do Seed Server...',
    SEED_VALIDATE_FAILED: 'Falha ao conectar-se ao servidor de origem',
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
    CANCEL: 'Cancelar',
    CONNECT: 'Conectar',
    HOST: 'IP / Host',
    PORT: 'Porta',
    TITLE: 'Conecte-se a um peer personalizado',
    VALIDATING: 'Validando detalhes de pares ...',
    PLACEHOLDER: {
      HOST: 'http://1.2.3.4',
      PORT: '4003'
    }
  },

  PASSPHRASE_INPUT: {
    HIDE: 'Ocultar a frase secreta',
    LABEL: 'frase secreta',
    QR: 'Scaniar o qr code',
    SHOW: 'Mostrar a frase secreta'
  },

  PASSWORD_INPUT: {
    HIDE: 'Esconder a senha',
    LABEL: 'Senha',
    SHOW: 'Mostra a senha'
  },

  PASSPHRASE_VERIFICATION: {
    WORD_LABEL_1: 'Primeira palavra',
    WORD_LABEL_2: 'Segunda palavra',
    WORD_LABEL_3: 'Terceira palavra',
    WORD_LABEL_4: 'Quarta palavra',
    WORD_LABEL_5: 'Quinta palavra',
    WORD_LABEL_6: 'Sexta palavra',
    WORD_LABEL_7: 'Setima palavra',
    WORD_LABEL_8: 'Oitava palavra',
    WORD_LABEL_9: 'Nona palavra',
    WORD_LABEL_10: 'Decima palavra',
    WORD_LABEL_11: 'Decima primeira palavra',
    WORD_LABEL_12: 'Decima segunda palavra'
  },

  PAGES: {
    CONTACT_ALL: {
      CREATE_CONTACT: 'Criar contato',
      IMPORT_CONTACT: 'Importar contato',
      DELETE_CONTACT: 'Deletar esse contato',
      HEADER: 'Meus contatos',
      SHOW_CONTACT: 'Mostrar contatos'
    },

    CONTACT_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Novo contato - Endereço',
          TEXT: 'Digite o endereço do seu contato'
        },
        TITLE: '1. Entre com endereço',
        ADDRESS: 'Endereço do contato'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Novo contato - Nome',
          TEXT: 'Opcionalmente, escolha um nome para contato e pronto.'
        },
        TITLE: '2. Confirmação',
        NAME: 'Nome do contato (Opcional)'
      },
      FAILED: 'Falha ao criar o contato'
    },

    DASHBOARD: {
      ALL_WALLETS: 'Todas as carteiras',
      ADD_WALLET: 'Adicionar uma carteira',
      CREATE_WALLET: 'Criar uma carteira',
      IMPORT_WALLET: 'Importar uma carteira',
      LAST_TRANSACTIONS: 'Últimas carteiras'
    },

    NETWORK_OVERVIEW: {
      INSTRUCTIONS: {
        HEADER: 'Selecionar rede',
        TEXT: 'Selecione e edite qualquer uma das redes disponíveis ou adicione novas.'
      },
      CREATE_NEW: 'Adicionar uma nova rede',
      NEW_NETWORK: 'Nova rede'
    },

    PROFILE_ALL: {
      HEADER: 'Meus perfis',
      ADD_PROFILE: 'Adicionar perfil',
      EDIT_PROFILE: 'Editar perfil',
      REMOVE_PROFILE: 'Remover esse perfil',
      SELECT_PROFILE: 'Usar esse perfil'
    },

    PROFILE_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Criar um perfil',
          TEXT: 'Digite seu nome ou apelido e selecione seu idioma preferido e moeda padrão.'
        },
        NAME: 'Nome do perfil'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Seleção de rede',
          TEXT: 'Esconha uma rede para esse perfil.'
        },
        NAME: 'Nome do perfil'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Aparência',
          TEXT: 'Personalize esta aplicação selecionando um dos nossos temas e fundos.'
        },
        NAME: 'Nome do perfil'
      }
    },

    PROFILE_EDITION: {
      TAB_PROFILE: {
        INSTRUCTIONS: {
          HEADER: 'Editar esse perfil',
          TEXT: 'Aqui você pode modificar seu nome ou apelido, selecionar seu idioma preferido e moeda padrão, a rede e avatar.'
        },
        TITLE: 'Perfil'
      },
      TAB_DESIGN: {
        INSTRUCTIONS: {
          HEADER: 'Personalize esta carteira',
          TEXT: 'Aqui você pode escolher o tema padrão (claro ou escuro) e o fundo.'
        },
        TITLE: 'Design da carteira'
      }
    },

    WALLET: {
      TRANSACTIONS: 'Transações',
      DELEGATES: 'Delegados',
      STATISTICS: 'Estatisticas',
      SIGN_VERIFY: 'Sign'
    },

    WALLET_ALL: {
      CREATE_WALLET: 'Criar uma carteira',
      DELETE_WALLET: 'Deletar essa carteira',
      HEADER: 'Minhas carteiras',
      IMPORT_WALLET: 'Importar carteira',
      LOADING_LEDGER: 'Carregando carteiras do razão ...',
      SHOW_WALLET: 'Mostrar carteira',
      TOTAL_BALANCE: 'Balanço total'
    },

    WALLET_IMPORT: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Recuperação de carteira',
          TEXT: 'Preencha a senha da sua carteira. Você pode preencher o endereço primeiro para garantir que ele corresponda à frase-senha fornecida.'
        },
        TITLE: '1. Importar carteira',
        ONLY_ADDRESS: 'Usar o endereço apenas',
        ONLY_PASSPHRASE: 'Usar a frase secreta apenas'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Criptografia de carteira',
          TEXT: 'Digite uma senha que você gostaria de usar para criptografar sua frase secreta.'
        },
        TITLE: '2. Encriptação',
        PASSWORD: 'Senha da carteira (Opcional)',
        PASSWORD_CONFIRM: 'Confirmar senha',
        PASSWORD_WARNING: 'Armazenar sua senha pode trazer riscos.'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Configuração da carteira',
          TEXT: 'Opcionalmente, escolha um nome para sua carteira e pronto.'
        },
        TITLE: '3. Confirmação',
        ADDRESS: 'Carteira endereço',
        NAME: 'Nome da carteira (Opcional)'
      },
      FAILED: 'Falha ao importar carteira'
    },

    WALLET_NEW: {
      STEP1: {
        INSTRUCTIONS: {
          HEADER: 'Nova carteira',
          TEXT_BEFORE_BUTTON: 'Selecione uma dessas carteiras recém-geradas. Se você não gosta deles, clique no',
          TEXT_AFTER_BUTTON: 'Botão para gerar outros.'
        },
        TITLE: '1. Escolha uma carteira'
      },
      STEP2: {
        INSTRUCTIONS: {
          HEADER: 'Sua chave pessoal',
          TEXT: 'Não se esqueça de salvar sua senha com segurança. Não mostre esta senha para ninguém.'
        },
        TITLE: '2. Backup'
      },
      STEP3: {
        INSTRUCTIONS: {
          HEADER: 'Confirmação de frase secreta',
          TEXT: 'Digite {words} da sua senha para verificar a nova conta.',
          ALL_WORDS: 'todas as palavras',
          WORDS: 'as palavras{words}'
        },
        TITLE: '3. Verificação',
        CHECK_ENTIRE_PASSPHRASE: 'Verifique toda a frase secreta',
        VERIFY_ALL_WORDS: 'Verificar cada palavra de frase secreta'
      },
      STEP4: {
        INSTRUCTIONS: {
          HEADER: 'Criptografia de carteira',
          TEXT: 'Digite uma senha que você gostaria de usar para criptografar sua frase secreta.'
        },
        TITLE: '4. Encriptação',
        PASSWORD: 'Senha da carteira (opcional)',
        PASSWORD_CONFIRM: 'Confirm password',
        PASSWORD_WARNING: 'Storing your passphrase can bring risks.'
      },
      STEP5: {
        INSTRUCTIONS: {
          HEADER: 'Configuração da carteira',
          TEXT: 'Opcionalmente, escolha um nome para sua carteira e pronto.'
        },
        TITLE: '5. Confirmação',
        ADDRESS: 'Endereço da carteira',
        NAME: 'Nome da carteira (opcional)'
      }
    },

    WALLET_SHOW: {
      NO_VOTE: 'A carteira não votou'
    }
  },

  PROFILE_REMOVAL_CONFIRMATION: {
    NOTE: 'Embora remova suas carteiras, não exclui nenhum dado no blockchain. Você pode recuperar as carteiras contanto que tenha suas senhas',
    QUESTION: 'Tem certeza de que deseja remover este perfil?'
  },

  SELECTION_AVATAR: {
    AVATARS: 'Avatars',
    MODAL_HEADER: 'Selecione o avatar'
  },

  SELECTION_BACKGROUND: {
    MODAL_HEADER: 'Selecione o plano de fundo',
    TEXTURES: 'Texturas',
    WALLPAPERS: 'Wallpapers'
  },

  SELECTION_NETWORK: {
    MODAL_HEADER: 'Rede'
  },

  TRANSACTION: {
    TYPE: {
      TRANSFER: 'Transferir',
      SECOND_SIGNATURE: 'Segunda assinatura',
      DELEGATE_REGISTRATION: 'Registro de Delegado',
      VOTE: 'Voto',
      UNVOTE: 'Desvotar',
      MULTI_SIGNATURE: 'Assinatura multipla',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Transferência de Timelock',
      MULTI_PAYMENT: 'Pagamento múltiplo',
      DELEGATE_RESIGNATION: 'Delegar Renúncia'
    },
    ERROR: {
      TRANSFER: 'Sua transação não pôde ser enviada',
      SECOND_SIGNATURE: 'Segunda assinatura não pôde ser registrada',
      DELEGATE_REGISTRATION: 'Não foi possível registrar como delegado',
      VOTE: 'A votação não pôde ser registrada',
      UNVOTE: 'O desvotar não pôde ser registrado',
      MULTI_SIGNATURE: 'Não foi possível criar a assinatura múltipla',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'A transferência de timelock não pôde ser criada',
      MULTI_PAYMENT: ' pagamento múltiplo não pôde ser criado',
      DELEGATE_RESIGNATION: 'Delegação de delegação não teve sucesso',
      SAVE_OFFLINE: 'Falha ao salvar seu arquivo de transação',
      EXPIRED: 'Transação expirou antes de ser processada: {transactionId}'
    },
    FOOTER_TEXT: {
      DELEGATE_REGISTRATION: 'Tenha em mente que você não pode alterar o nome do seu representante depois que o registro for registrado no blockchain.'
    },
    FORM: {
      DELEGATE_REGISTRATION: {
        INSTRUCTIONS: 'para {address}.'
      },
      SECOND_SIGNATURE: {
        INSTRUCTIONS: 'para {address}.'
      }
    },
    SUCCESS: {
      TRANSFER: 'YSua transação foi enviada com sucesso',
      SECOND_SIGNATURE: 'Segunda assinatura registada com sucesso',
      DELEGATE_REGISTRATION: 'Registrado com sucesso como delegado',
      VOTE: 'Votou com sucesso',
      UNVOTE: 'Não votado com sucesso',
      MULTI_SIGNATURE: 'Assinatura múltipla criada com sucesso',
      IPFS: 'IPFS',
      TIMELOCK_TRANSFER: 'Transferência de timelock criada com sucesso',
      MULTI_PAYMENT: 'Pagamento múltiplo criado com sucesso',
      DELEGATE_RESIGNATION: 'Renúncia de delegado foi bem sucedida',
      SAVE_OFFLINE: 'O arquivo de transação salvo com sucesso em: {path}'
    },
    VOTE: {
      VOTE_DELEGATE: 'Vote no delegado {delegate}',
      UNVOTE_DELEGATE: 'Desvincular delegado {delegado}'
    },
    AMOUNT: 'Montante',
    BLOCK_ID: 'Bloco ID',
    CONFIRMATION_COUNT: '{0} Confirmações',
    CONFIRMATIONS: 'Confirmações',
    CREATE_TRANSFER: 'Criar transfêrencia',
    FEE: 'Taxa transfêrencia',
    ID: 'ID',
    LEDGER_SIGN_NOTICE: 'Em seguida, você confirmará a transação com seu Ledger',
    LEDGER_SIGN_WAIT: 'Aguardando a assinatura do razão. Por favor, verifique e assine a transação quando estiver pronto.',
    LEDGER_SIGN_FAILED: 'Não foi possível assinar transação com o Ledger',
    LEDGER_USER_DECLINED: 'Usuário recusado',
    MULTIPLE: 'Multiplo',
    OPEN_IN_EXPLORER: 'abrir no Explorer',
    PASSPHRASE: 'Frase secreta',
    PASSWORD: 'Senha de Criptografia',
    RECIPIENT: 'Destinatário',
    SAVE_OFFLINE: 'Salvar transação off-line',
    SECOND_PASSPHRASE: 'Segunda frase secreta',
    SEND: 'Enviar',
    SEND_ALL: 'Enviar tudo',
    SENDER: 'Remetente',
    SINGLE: 'Solteiro',
    TIMESTAMP: 'Timestamp',
    TRANSACTION: 'Transação',
    VENDOR_FIELD: 'Smartbridge',
    WELL_CONFIRMED: 'Bem confirmado',
    WELL_CONFIRMED_COUNT: 'Confirmado ({confirmations} confirmações)'
  },

  SIGN_VERIFY: {
    VERIFY_WALLET: 'Verifique sua carteira',
    VERIFY_BY_SIGNING: 'Assine uma mensagem para confirmar que você é o proprietário da carteira',
    SIGN: 'Sign',
    VERIFY: 'Verificar',
    TITLE_SIGN: 'Assine uma mensagem',
    TITLE_VERIFY: 'Verificar uma mensagem',
    MESSAGE: 'Mensagem',
    ADDRESS: 'Endereço',
    PUBLIC_KEY: 'Chave publica',
    SIGNATURE: 'Assinatura',
    JSON_MESSAGE: 'Conteúdo da mensagem assinado',
    FORMAT_FOOTER: 'Formato (JSON): { "publickey": "...", "signature": "...", "message": "..." }',
    VERIFIED: 'A mensagem é verificada com sucesso',
    NOT_VERIFIED: 'A mensagem NÃO é confirmada',
    CONFIRMATION: 'Confirmação',
    DELETE: 'Deletar mensagem',
    FAILED_SIGN: 'Não foi possível assinar a mensagem',
    FAILED_VERIFY: 'Não foi possível verificar a mensagem'
  },

  SYNCHRONIZER: {
    VOTE: 'votado para',
    UNVOTE: 'não votado',
    NEW_SECOND_SIGNATURE: 'Nova segunda assinatura: {address}',
    NEW_DELEGATE_REGISTRATION: 'Novo delegado: {address} registrado como {username}',
    NEW_VOTE: 'Nova votação: {address} {voteUnvote} {publicKey}',
    NEW_TRANSFER_SENT: 'Nova transferência: {amount} enviada de {sender} para {recipient}',
    NEW_TRANSFER_RECEIVED: 'Nova transferência: {amount} recebida de {sender} para {recipient}'
  },

  TRANSACTION_FORM: {
    ERROR: {
      NOT_ENOUGH_BALANCE: 'O saldo é muito baixo ({balance})'
    }
  },

  TRANSACTION_DETAIL: {
    SEND_AMOUNT: 'Enviar {token}'
  },

  WALLET_HEADING: {
    ACTIONS: {
      WALLET_NAME: 'Nome da carteira',
      REGISTER_DELEGATE: 'Registrar delegado',
      SECOND_PASSPHRASE: '2nd passphrase',
      DELETE_WALLET: 'Deletar carteira',
      SHOW_PUBLIC_KEY: 'Mostra chave pública',
      SHOW_ADDRESS: 'Mostra endereço'
    },
    SECOND_PASSPHRASE_ENABLED: 'Segunda assinatura ativada'
  },

  WALLET_SECOND_SIGNATURE: {
    NEW: 'Gerar nova segunda frase secreta',
    ALREADY_REGISTERED: 'Já existe uma segunda frase-senha registrada para este endereço',
    INSTRUCTIONS: 'Esta é sua segunda frase secreta. Certifique-se de fazer um backup e mantê-lo em algum lugar seguro!'
  },

  WALLET_SIDEBAR: {
    LOADING_LEDGER: 'Carregando Ledger ...'
  },

  WALLET_DELEGATES: {
    RANK: 'Classificação',
    USERNAME: 'Nome de usuário',
    PRODUCTIVITY: 'Produtividade',
    PRODUCTIVITY_BANNER: 'Produtividade: {productivity}',
    APPROVAL: 'Aprovação',
    FORGED: 'Forjado',
    BLOCKS: 'Blocos',
    MISSED: 'perdido',
    VOTERS: 'eleitores',
    UNVOTE: 'Unvote',
    VOTES: 'Votos',
    VOTE: 'Voto',
    USERNAME_ERROR: 'Nenhum caractere especial ou maiúsculo permitido',
    USERNAME_MAX_LENGTH_ERROR: 'The username must be less than or equal to 20 characters long',
    ALREADY_REGISTERED: 'Esta carteira já está registrada como delegado',
    BLOG: 'Guia de votação',
    EXPLANATION: 'A votação é um mecanismo opcional, mas importante, que mantém a rede da Ark segura. Os 51 delegados com mais votos da rede são responsáveis por verificar e forjar transações em novos blocos. Esta página pode ser usada para votar em um delegado que você suporta. Saiba mais sobre como votar em um delegado clicando no link a seguir:',
    VOTE_DELEGATE: 'Delegados votados {delegate}',
    UNVOTE_DELEGATE: 'Desvotar delegado {delegate}',
    VOTED_FOR: 'Você votou para delegar {delegate}'
  },

  WALLET_RENAME: {
    TITLE: 'Renomear Carteira',
    NEW: 'Novo nome da carteira',
    RENAME: 'Renomear carteira',
    ADDRESS_INFO: 'Especifique um nome para sua carteira: {wallet}',
    ERROR_LEDGER: 'Não foi possível renomear a carteira do razão: {error}'
  },

  WALLET_REMOVAL_CONFIRMATION: {
    NOTE: 'Não elimina quaisquer dados no blockchain. Você pode recuperar a carteira contanto que tenha a senha',
    QUESTION: 'Tem certeza de que deseja remover esta carteira?'
  },

  WALLET_TRANSACTIONS: {
    TRANSACTION_ID: 'Transação ID',
    RECIPIENT: 'Destinatário',
    SENDER: 'Remetente',
    AMOUNT: 'Montante',
    NEW_TRANSACTIONS: 'Essa carteira tem {count} nova transações{plural}. Pressione o botão de atualização para atualizar.'
  }
}
