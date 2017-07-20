import app from 'flarum/app';

import ExamSettingsModal from 'czbix/exam/components/ExamSettingsModal';

app.initializers.add('czbix-regexam', () => {
  app.extensionSettings['czbix-regexam'] = () => app.modal.show(new ExamSettingsModal());
});
