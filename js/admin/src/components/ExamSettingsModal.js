import SettingsModal from 'flarum/components/SettingsModal';

const EXTENSIONS_NAME = 'czbix-regexam';

export default class ExamSettingsModal extends SettingsModal {
	className() {
		return 'ExamSettingsModal Modal--small';
	}

	title() {
		return app.translator.trans(`${EXTENSIONS_NAME}.admin.exam_settings.title`);
	}

	form() {
		return [
			m('div', {className: 'Form-group'}, [
				m('label', [
					app.translator.trans(`${EXTENSIONS_NAME}.admin.exam_settings.exam_url`),
					m('input', {
						className: 'FormControl',
						bidi: this.setting(`${EXTENSIONS_NAME}.exam_url`)
					})
				])
			]),
			m('div', {className: 'Form-group'}, [
				m('label', [
					app.translator.trans(`${EXTENSIONS_NAME}.admin.exam_settings.verify_url`),
					m('input', {
						className: 'FormControl',
						bidi: this.setting(`${EXTENSIONS_NAME}.verify_url`)
					})
				])
			]),
			m('div', {className: 'Form-group'}, [
				m('label', [
					app.translator.trans(`${EXTENSIONS_NAME}.admin.exam_settings.question_series`),
					m('input', {
						className: 'FormControl',
						bidi: this.setting(`${EXTENSIONS_NAME}.question_series`)
					})
				])
			]),
			m('div', {className: 'Form-group'}, [
				m('label', [
					app.translator.trans(`${EXTENSIONS_NAME}.admin.exam_settings.secret_key`),
					m('input', {
						className: 'FormControl',
						bidi: this.setting(`${EXTENSIONS_NAME}.secret_key`)
					})
				])
			]),
		];
	}
}
