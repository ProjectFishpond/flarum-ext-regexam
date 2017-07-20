import app from 'flarum/app';
import { extend } from 'flarum/extend';
import SignUpModal from 'flarum/components/SignUpModal';

const EXTENSION_NAME = 'czbix-regexam';

var questText = app.translator.trans(`${EXTENSION_NAME}.forum.sign_up.exam_question`);
var userID = "ffffffff";
const questList = {};
var currentLocale = 'en';
// HACK: Need to load this file from somewhere else in order to get rid of the CORS
jQuery.getScript("https://steph.hanfucw.com/qanda/demo/sha512.js");

app.initializers.add(EXTENSION_NAME, () => {
  var examToken = m.prop('');

  function inject(list) {
    const examUrl = app.forum.attribute('examUrl');
    function updateQuestion(){
      currentLocale = app.translator.locale;
      if (questList[currentLocale] === undefined){
        jQuery.ajax({
          url: app.forum.attribute('examUrl'),
          data: {"locale": currentLocale},
          async: false
        }).done(
          function(resp){
            userID = resp.substr(0,8);
            questText = resp.substr(8);
            questList[currentLocale] = [userID,questText];
          }
        );
      } else {
        userID = questList[currentLocale][0];
        questText = questList[currentLocale][1];
      }
    };
    updateQuestion();

    // HACK: avoid modify internal state of mithril object
    const inputList = list[list.length - 1].children;
    const el = m('div', { class: 'Form-group exam-token' }, [
      m('p',{},[app.translator.trans(`${EXTENSION_NAME}.forum.sign_up.exam_prompt`)]),
      m('pre',{id:'qText'}, [questText]),
      m('input', {class: 'FormControl', id:'examAnswer', type: 'text', placeholder: app.translator.trans(`${EXTENSION_NAME}.forum.sign_up.exam_token`),value: examToken(), onchange: m.withAttr('value', examToken) }),
      m('input', {id:'inviteCode',type: 'checkbox'}),
      m('label', {for:'inviteCode'},[app.translator.trans(`${EXTENSION_NAME}.forum.sign_up.invite_code`)])
    ]);
    inputList.splice(inputList.length - 1, 0, el);
    return list;
  }
  extend(SignUpModal.prototype, 'body', inject);

  extend(SignUpModal.prototype, 'submitData', function (data) {
    const newData = data;
      if (document.getElementById("examAnswer").value === "") // Skipped quiz
        return newData;
      if (document.getElementById("inviteCode").checked){ // Invitation code
        newData['exam_token'] = document.getElementById("examAnswer").value;
        return newData;
      }
	// Starts the answering process
      const ans = hex_hmac_sha512(userID,document.getElementById("examAnswer").value);
      jQuery.ajax({
        url: app.forum.attribute('validateUrl'),
        data: {"uid":userID,"ans":ans,"qfile":app.forum.attribute('questionFile')},
        async: false
      }).done(function(resp){
        if (resp.substr(0,3) == "ACK"){
			newData['exam_token'] = userID+resp.substr(3).trim();
			questList[currentLocale] = undefined;
        } else {
			newData['exam_token'] = "wronganswer";
        };
        return newData;
      });
    return newData;
  });
});
