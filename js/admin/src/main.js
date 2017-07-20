import app from 'flarum/app';

import ExamSettingsModal from 'czbix/exam/components/ExamSettingsModal';

app.initializers.add('czbix-registration-exam', () => {
  app.extensionSettings['czbix-registration-exam'] = () => app.modal.show(new ExamSettingsModal());
});
