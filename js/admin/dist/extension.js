'use strict';

System.register('czbix/exam/components/ExamSettingsModal', ['flarum/components/SettingsModal'], function (_export, _context) {
  "use strict";

  var SettingsModal, EXTENSIONS_NAME, ExamSettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal.default;
    }],
    execute: function () {
      EXTENSIONS_NAME = 'czbix-regexam';

      ExamSettingsModal = function (_SettingsModal) {
        babelHelpers.inherits(ExamSettingsModal, _SettingsModal);

        function ExamSettingsModal() {
          babelHelpers.classCallCheck(this, ExamSettingsModal);
          return babelHelpers.possibleConstructorReturn(this, (ExamSettingsModal.__proto__ || Object.getPrototypeOf(ExamSettingsModal)).apply(this, arguments));
        }

        babelHelpers.createClass(ExamSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'ExamSettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans(EXTENSIONS_NAME + '.admin.exam_settings.title');
          }
        }, {
          key: 'form',
          value: function form() {
            return [
		m('div', { className: 'Form-group' }, [
			m('label', [app.translator.trans(EXTENSIONS_NAME + '.admin.exam_settings.exam_url'),m('input', {className: 'FormControl',bidi: this.setting(EXTENSIONS_NAME + '.exam_url')})])
		]),
		m('div', { className: 'Form-group' }, [
			m('label', [app.translator.trans(EXTENSIONS_NAME + '.admin.exam_settings.verify_url'), m('input', {className: 'FormControl',bidi: this.setting(EXTENSIONS_NAME + '.verify_url')})])
		]),
		m('div', { className: 'Form-group' }, [
			m('label', [app.translator.trans(EXTENSIONS_NAME + '.admin.exam_settings.question_series'), m('input', {className: 'FormControl',bidi: this.setting(EXTENSIONS_NAME + '.question_series')})])
		]),
		m('div', { className: 'Form-group' }, [
			m('label', [app.translator.trans(EXTENSIONS_NAME + '.admin.exam_settings.secret_key'), m('input', {className: 'FormControl',bidi: this.setting(EXTENSIONS_NAME + '.secret_key')})])
		])
	   ];
           }
        }]);
        return ExamSettingsModal;
      }(SettingsModal);

      _export('default', ExamSettingsModal);
    }
  };
});;
'use strict';

System.register('czbix/exam/main', ['flarum/app', 'czbix/exam/components/ExamSettingsModal'], function (_export, _context) {
  "use strict";

  var app, ExamSettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_czbixExamComponentsExamSettingsModal) {
      ExamSettingsModal = _czbixExamComponentsExamSettingsModal.default;
    }],
    execute: function () {

      app.initializers.add('czbix-regexam', function () {
        app.extensionSettings['czbix-regexam'] = function () {
          return app.modal.show(new ExamSettingsModal());
        };
      });
    }
  };
});
