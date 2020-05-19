var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { pull } from 'lodash';
import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { useI18nGlobally } from '../../__utils__/i18n';
import { PassphraseVerification } from '@/components/Passphrase';
var i18n = useI18nGlobally();
Vue.use(Vuelidate);
describe('PassphraseVerification', function () {
    var passphrase = 'one two three four five six seven eight nine ten eleven twelve';
    var wordArray = passphrase.split(' ');
    var words = wordArray.reduce(function (acc, word, index) {
        acc[(index + 1).toString()] = word;
        return acc;
    }, {});
    var wrapper;
    beforeEach(function () {
        wrapper = mount(PassphraseVerification, {
            i18n: i18n,
            propsData: {
                passphrase: passphrase
            }
        });
    });
    it('should render', function () {
        expect(wrapper.contains('.PassphraseVerification')).toBeTruthy();
    });
    it('should display an `InputText` per position', function () {
        var inputs = wrapper.findAll('.InputText');
        expect(inputs).toHaveLength(wrapper.vm.wordPositions.length);
    });
    describe('computed passpharseWords', function () {
        describe('when receiving a String as the `passphrase` props', function () {
            it('should return it as an Array', function () {
                expect(wrapper.vm.passphraseWords).toEqual(wordArray);
            });
        });
        describe('when receiving an Array as the `passphrase` props', function () {
            it('should return it as an Array', function () {
                wrapper.setProps({ passphrase: wordArray });
                expect(wrapper.vm.passphraseWords).toEqual(wordArray);
            });
        });
    });
    describe('computed words', function () {
        describe('when receiving a String as the `passphrase` props', function () {
            it('should return it as an Object', function () {
                expect(wrapper.vm.words).toEqual(words);
            });
        });
        describe('when receiving an Array as the `passphrase` props', function () {
            it('should return it as an Object', function () {
                wrapper.setProps({ passphrase: wordArray });
                expect(wrapper.vm.words).toEqual(words);
            });
        });
    });
    describe('suggestedPerPosition', function () {
        it('should return `suggestionsPerWord` suggestions', function () {
            var suggested = wrapper.vm.suggestedPerPosition;
            var defaultNumber = 9;
            [3, 6, 9].forEach(function (position) {
                expect(suggested).toBeInstanceOf(Object);
                expect(suggested[position.toString()]).toBeArray();
                expect(suggested[position.toString()]).toHaveLength(defaultNumber);
            });
            wrapper.setProps({
                suggestionsPerWord: 4,
                wordPositions: [3, 2, 1]
            });
            suggested = wrapper.vm.suggestedPerPosition;
            [3, 2, 1].forEach(function (position) {
                expect(suggested).toBeInstanceOf(Object);
                expect(suggested[position.toString()]).toBeArray();
                expect(suggested[position.toString()]).toHaveLength(4);
            });
        });
        describe('when there are not `additionalSuggestions`', function () {
            it('should include the passphrase word into the suggestions', function () {
                var suggested = wrapper.vm.suggestedPerPosition;
                [3, 6, 9].forEach(function (position) {
                    var passphraseWord = words[position.toString()];
                    expect(suggested).toBeInstanceOf(Object);
                    expect(suggested[position.toString()]).toContain(passphraseWord);
                });
            });
            it('should include passphrase words only in the suggestions', function () {
                var suggested = wrapper.vm.suggestedPerPosition;
                [3, 6, 9].forEach(function (position) {
                    expect(wordArray).toIncludeAllMembers(suggested[position.toString()]);
                });
            });
        });
        describe('when there are more `additionalSuggestions` than `suggestionPerWord`', function () {
            var additionalSuggestions = ['word A', 'word B', 'word C'];
            var suggested;
            beforeEach(function () {
                wrapper.setProps({
                    suggestionsPerWord: wordArray.length + 3,
                    additionalSuggestions: additionalSuggestions
                });
                suggested = wrapper.vm.suggestedPerPosition;
            });
            it('should include the passphrase word into the suggestions', function () {
                ;
                [3, 6, 9].forEach(function (position) {
                    var passphraseWord = words[position.toString()];
                    expect(suggested).toBeInstanceOf(Object);
                    expect(suggested[position.toString()]).toContain(passphraseWord);
                });
            });
            it('should include several passphrase words and additional suggestions', function () {
                ;
                [3, 6, 9].forEach(function (position) {
                    expect(suggested[position.toString()]).toIncludeAnyMembers(additionalSuggestions);
                    expect(suggested[position.toString()]).toIncludeAnyMembers(wordArray);
                });
            });
        });
        describe('when there are less `additionalSuggestions` than `suggestionPerWord`', function () {
            var additionalSuggestions = ['word A', 'word B', 'word C', 'word D', 'word E'];
            var suggested;
            beforeEach(function () {
                wrapper.setProps({
                    suggestionsPerWord: additionalSuggestions.length + 1,
                    additionalSuggestions: additionalSuggestions
                });
                suggested = wrapper.vm.suggestedPerPosition;
            });
            it('should include the passphrase word into the suggestions', function () {
                ;
                [3, 6, 9].forEach(function (position) {
                    var passphraseWord = words[position.toString()];
                    expect(suggested).toBeInstanceOf(Object);
                    expect(suggested[position.toString()]).toContain(passphraseWord);
                });
            });
            it('should include the passphrase word with the additional suggestions only', function () {
                ;
                [3, 6, 9].forEach(function (position) {
                    var passphraseWord = words[position.toString()];
                    var withoutPassphraseWord = pull(suggested[position.toString()], passphraseWord);
                    expect(suggested[position.toString()]).toIncludeAnyMembers(additionalSuggestions);
                    expect(withoutPassphraseWord).not.toIncludeAnyMembers(wordArray);
                });
            });
        });
    });
    describe('acceptWord', function () {
        describe('when all words have been verified', function () {
            it('emits the `verified` event', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper = mount(PassphraseVerification, {
                                i18n: i18n,
                                propsData: {
                                    passphrase: passphrase
                                },
                                computed: {
                                    allVerified: function () { return true; }
                                }
                            });
                            wrapper.vm.acceptWord();
                            // The method waits some milliseconds before emitting the event
                            return [4 /*yield*/, setTimeout(function () {
                                    expect(wrapper.emitted('verified')).toBeTruthy();
                                }, 1000)];
                        case 1:
                            // The method waits some milliseconds before emitting the event
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('toNextWord', function () {
        it('should show the suggetions of the next position', function () {
            jest.spyOn(wrapper.vm, 'showSuggestions');
            var nextPosition = '9';
            wrapper.setData({ currentPosition: '6' });
            wrapper.vm.toNextWord();
            expect(wrapper.vm.showSuggestions).toHaveBeenCalledWith(nextPosition);
            nextPosition = '3';
            wrapper.vm.toNextWord();
            expect(wrapper.vm.showSuggestions).toHaveBeenCalledWith(nextPosition);
        });
        it('should focus on the next input', function () {
            var nextPosition = '6';
            var textInput = wrapper.vm.$refs["input-" + nextPosition][0];
            jest.spyOn(textInput, 'focus');
            wrapper.setData({ currentPosition: '3' });
            wrapper.vm.toNextWord();
            expect(textInput.focus).toHaveBeenCalled();
        });
        describe('when the next position is already accepted', function () {
            it('should move to the subsequent position', function () {
                jest.spyOn(wrapper.vm, 'showSuggestions');
                var subsequentPosition = '7';
                wrapper.setProps({
                    wordPositions: [1, 3, 5, 7, 9, 11]
                });
                wrapper.setData({
                    currentPosition: '3',
                    acceptedWords: {
                        1: 'former',
                        3: '',
                        5: 'other',
                        7: '',
                        9: 'example',
                        11: 'random'
                    }
                });
                wrapper.vm.toNextWord();
                expect(wrapper.vm.showSuggestions).toHaveBeenCalledWith(subsequentPosition);
                subsequentPosition = '2';
                wrapper.setProps({
                    wordPositions: [1, 2, 3, 4, 5, 6]
                });
                wrapper.setData({
                    currentPosition: '3',
                    acceptedWords: {
                        1: 'former',
                        2: '',
                        3: '',
                        4: 'random',
                        5: 'other',
                        6: 'example'
                    }
                });
                wrapper.vm.toNextWord();
                expect(wrapper.vm.showSuggestions).toHaveBeenCalledWith(subsequentPosition);
            });
        });
    });
});
//# sourceMappingURL=PassphraseVerification.spec.js.map