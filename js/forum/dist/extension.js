'use strict';

System.register('czbix/exam/main', ['flarum/app', 'flarum/extend', 'flarum/components/SignUpModal'], function (_export, _context) {
  "use strict";

  var app, extend, SignUpModal, EXTENSION_NAME;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsSignUpModal) {
      SignUpModal = _flarumComponentsSignUpModal.default;
    }],
    execute: function () {
      EXTENSION_NAME = 'czbix-regexam';

	var questText = app.translator.trans(EXTENSION_NAME+'.forum.sign_up.exam_question');
	var userID = "ffffffff";
	var questList = {};
	var currentLocale = 'en';
	// HACK: Need to load this file from somewhere else in order to get rid of the CORS
	jQuery.getScript("https://steph.hanfucw.com/qanda/demo/sha512.js");

      app.initializers.add(EXTENSION_NAME, function () {
        var examToken = m.prop('');

        function inject(list) {
          var examUrl = app.forum.attribute('examUrl');
	// HACK: jQuery get the question
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
			});
		} else {
			userID = questList[currentLocale][0];
			questText = questList[currentLocale][1];
		}
	};	
	updateQuestion();
          // HACK: avoid modify internal state of mithril object
          var inputList = list[list.length - 1].children;
          var el = m('div', { class: 'Form-group exam-token' }, [
		m('p',{},[app.translator.trans(EXTENSION_NAME+'.forum.sign_up.exam_prompt')]),
/*		m('input',{id:'examTypeEn',type:'radio',name:'examType',value:'en-us'}),
		m('label',{for:'examTypeEn'},['English']),
		m('input',{id:'examTypeZhCn',type:'radio',name:'examType',value:'zh-cn'}),
		m('label',{for:'examTypeZhCn'},['简体中文']),
		m('input',{id:'examTypeZhTw',type:'radio',name:'examType',value:'zh-tw'}),
		m('label',{for:'examTypeZhTw'},['正體中文']),
// Future hook for generating questions according to user locale
// Might not need as it is already taking the app.translator.locale.
*/		m('p',{id:'qText'}, [app.translator.trans(EXTENSION_NAME+'.forum.sign_up.exam_question')+questText]),
		m('input', {class: 'FormControl', id:'examAnswer', type: 'text', placeholder: app.translator.trans(EXTENSION_NAME + '.forum.sign_up.exam_token'),
            value: examToken(), onchange: m.withAttr('value', examToken) }),
		m('input', {id:'inviteCode',type: 'checkbox'}),
		m('label', {for:'inviteCode'},[app.translator.trans(EXTENSION_NAME+'.forum.sign_up.invite_code')])
	//	m('p', [m('a', { href: examUrl }, [app.translator.trans(EXTENSION_NAME + '.forum.sign_up.exam_page')])])
	   ]);
          inputList.splice(inputList.length - 1, 0, el);
          return list;
        }
        extend(SignUpModal.prototype, 'body', inject);

        extend(SignUpModal.prototype, 'submitData', function (data) {
          var newData = data;
	if (document.getElementById("examAnswer").value === "") // Skipped quiz
		return newData;
	if (document.getElementById("inviteCode").checked){ // Invitation code
		newData['exam_token'] = document.getElementById("examAnswer").value;
		return newData;
	}
	// Starts the answering process
	var ans = hex_hmac_sha512(userID,document.getElementById("examAnswer").value);
	jQuery.ajax({
		url: app.forum.attribute('validateUrl'),
		data: {"uid":userID,"ans":ans},
		async: false
	}).done(
		function(resp){
		if (resp.substr(0,3) == "ACK"){
			newData['exam_token'] = userID+resp.substr(3).trim();
			questList[currentLocale] = undefined;
		}
		else{
			newData['exam_token'] = "wronganswer";
		};
		return newData;
	});
        });
      });
    }
  };
});
