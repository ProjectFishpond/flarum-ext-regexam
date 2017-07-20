import app from 'flarum/app';
import { extend } from 'flarum/extend';
import SignUpModal from 'flarum/components/SignUpModal';

const EXTENSION_NAME = 'czbix-registration-exam';

app.initializers.add(EXTENSION_NAME, () => {
  var examToken = m.prop('');

  function inject(list) {
    const examUrl = app.forum.attribute('examUrl');

    // HACK: avoid modify internal state of mithril object
    const inputList = list[list.length - 1].children;
    const el = m('div', {class: 'Form-group exam-token'}, [
      m('p',{id:'qText'},[app.translator.trans(`${EXTENSION_NAME}.forum.sign_up.exam_question`)]),
      m('input', {class: 'FormControl', type: 'text', placeholder: app.translator.trans(`${EXTENSION_NAME}.forum.sign_up.exam_token`),
        value: examToken(), onchange: m.withAttr('value', examToken)}),
      m('p', [
        m('a', {href: examUrl}, [
          app.translator.trans(`${EXTENSION_NAME}.forum.sign_up.exam_page`)
        ])
      ])
    ]);
    inputList.splice(inputList.length - 1, 0, el);
    return list;
  }
  extend(SignUpModal.prototype, 'body', inject);

  extend(SignUpModal.prototype, 'submitData', function (data) {
    const newData = data;
    newData['exam_token'] = examKey+examToken;
    return newData;
  });
});
