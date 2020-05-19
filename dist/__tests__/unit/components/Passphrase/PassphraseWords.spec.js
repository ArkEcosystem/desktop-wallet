import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { PassphraseWords } from '@/components/Passphrase';
Vue.use(Vuelidate);
describe('PassphraseWords', function () {
    var passphraseWords = ['test', 'check', 'verify', 'true', 'false', 'validate', 'ignore', 'shoulder'];
    var wrapper;
    beforeEach(function () {
        wrapper = mount(PassphraseWords, {
            propsData: {
                passphraseWords: passphraseWords
            }
        });
    });
    it('should render', function () {
        expect(wrapper.contains('.PassphraseWords')).toBeTruthy();
    });
    it('should display an `InputText` per word', function () {
        var inputs = wrapper.findAll('.InputText');
        expect(inputs).toHaveLength(passphraseWords.length);
    });
});
//# sourceMappingURL=PassphraseWords.spec.js.map