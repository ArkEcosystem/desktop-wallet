import WalletService from '../../../src/renderer/services/wallet'

describe('Services > Wallet', () => {
  describe('generating a passphrase and address', () => {
    it('should work in English', () => {
      const passphrase = 'one video jaguar gap soldier ill hobby motor bundle couple trophy smoke'
      const address = 'DAy2xDNZLRQsgiJCnF3x4WDxGsBrmsKCsV'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
    })

    it('should work in Chinese (Traditional)', () => {
      const passphrase = '苗 雛 陸 桿 用 腐 爐 詞 鬼 雨 爾 然'
      const address = 'DS6hPMzbgRkKCZa6fJSmQrG2M7toJAtd5B'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
    })

    it('should work in French', () => {
      const passphrase = 'galerie notoire prudence mortier soupape cerise argent neurone pommade géranium potager émouvoir'
      const address = 'DUFdRiUNXt1PiLVakbq4ADo1Ttsx3kH1AT'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
    })

    it('should work in Italian', () => {
      const passphrase = 'mucca comodo imbevuto talismano sconforto cavillo obelisco quota recupero malinteso gergo bipede'
      const address = 'D8nAGdSCCRMsLPsM4GgzRtgbiTn16rHW6J'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
    })

    it('should work in Japanese', () => {
      const passphrase = 'うかべる　くすりゆび　ひさしぶり　たそがれ　そっこう　ちけいず　ひさしぶり　ていか　しゃちょう　けおりもの　ちぬり　りきせつ'
      const address = 'DQquFjRfgA26cut7A8wFC4Bbo4TawWArWr'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
    })

    it('should work in Korean with initially decomposed characters', () => {
      const passphrase = '변명 박수 사건 실컷 목적 비용 가능 시골 수동적 청춘 식량 도망'
      const address = 'D5FvjRH136fbw8j4thcmKiFiJjfbYHT3zY'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
    })

    it('should work in Korean without decomposing', () => {
      const passphrase = '변명 박수 사건 실컷 목적 비용 가능 시골 수동적 청춘 식량 도망'
      const address = 'D5FvjRH136fbw8j4thcmKiFiJjfbYHT3zY'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
    })

    it('should work in Spanish', () => {
      const passphrase = 'cadena cadáver malla etapa vista alambre burbuja vejez aéreo taco rebaño tauro'
      const address = 'DNZSrNt7SQ1VBrzx7C17gbPv9FDAxnaor3'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
    })
  })
})
