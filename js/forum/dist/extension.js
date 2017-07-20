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
	var numOfQ = -1;
	// HACK: Need to load this file from somewhere else in order to get rid of the CORS
	jQuery.getScript("https://steph.hanfucw.com/qanda/demo/sha512.js");

      app.initializers.add(EXTENSION_NAME, function () {
        var examToken = m.prop('');
	var isCode = m.prop('token');
	var examFinish = false;

        function inject(list) {

	var examUrl = app.forum.attribute('examUrl');
	if (numOfQ === -1) numOfQ = app.forum.attribute('questionNum');
	// HACK: jQuery get the question
	function updateQuestion(newQ){
		currentLocale = app.translator.locale;
		if (questList[currentLocale] === undefined || newQ===true){
			jQuery.ajax({
				url: app.forum.attribute('examUrl'),
				data: {"locale": currentLocale,"qnum":app.forum.attribute('questionNum')-numOfQ},
				async: false
			}).done(
				function(resp){
					userID = resp.substr(0,8);
					questText = app.forum.attribute('questionNum')-numOfQ+1 +': '+ resp.substr(8);
					questList[currentLocale] = [userID,questText];
			});
		/*	m.request({
				url: app.forum.attribute('examUrl'),
				data: {"locale": currentLocale,"qnum":app.forum.attribute('questionNum')-numOfQ},
			}).then(function (resp){
					userID = resp.substr(0,8);
					questText = app.forum.attribute('questionNum')-numOfQ+1 +': '+ resp.substr(8);
					questList[currentLocale] = [userID,questText];
			});
		*/} else {
			userID = questList[currentLocale][0];
			questText = questList[currentLocale][1];
		}
	};
	updateQuestion(false);

	function validateAnswer(){
		numOfQ -= 1;
		updateQuestion(true);
	};

	function inviteCodeChange(){
		if (isCode() === 'token'){
			document.getElementById('inviteCode').checked = false;
			document.getElementById('qText').removeAttribute('style');
			if (examFinish === false){
				document.getElementById('nextQuestion').removeAttribute('style');
				$('.Form-group:last').children().hide();
			}
			isCode('answer');
		} else {
			document.getElementById('inviteCode').checked = true;
			document.getElementById('nextQuestion').style['display']="none";
			document.getElementById('qText').style['visibility']="hidden";
			$('.Form-group:last').children().show();
			isCode('token');
		};
	};
          // HACK: avoid modify internal state of mithril object
          var inputList = list[list.length - 1].children;
          var el = m('div', { class: 'Form-group exam-token', oncreate: function(vnode){alert('hey');} }, [
		m('p',{},[app.translator.trans(EXTENSION_NAME+'.forum.sign_up.exam_prompt')]),
		m('pre',{id:'qText'}, [app.translator.trans(EXTENSION_NAME+'.forum.sign_up.exam_question')+questText]),
		m('input', {class: 'FormControl', id:'examAnswer', type: 'text', placeholder: app.translator.trans(EXTENSION_NAME + '.forum.sign_up.exam_'+isCode()),
            value: examToken(), onchange: m.withAttr('value', examToken) }),
		m('input', {id:'inviteCode',type: 'checkbox', checked:isCode()==='token' ,onchange: function(){inviteCodeChange();}}),
		m('label', {for:'inviteCode'},[app.translator.trans(EXTENSION_NAME+'.forum.sign_up.invite_code')]),
		m('button', {id:'nextQuestion',class:'Button Button--primary Button--block', type:'button', onclick: function(){validateAnswer();}},[app.translator.trans(EXTENSION_NAME+'.forum.sign_up.next_question')])
	//	m('p', [m('a', { href: examUrl }, [app.translator.trans(EXTENSION_NAME + '.forum.sign_up.exam_page')])])
	   ]);
          inputList.splice(inputList.length - 1, 0, el);
	console.log(inputList[inputList.length-1].children[0]);
//	inputList[inputList.length-1][0]
          return list;
        }
        extend(SignUpModal.prototype, 'body', inject);

        extend(SignUpModal.prototype, 'submitData', function (data) {
          var newData = data;
	if (document.getElementById("examAnswer").value === "") // Skipped quiz
		e.stopPropagation();
		return newData;
	if (document.getElementById("inviteCode").checked){ // Invitation code
		newData['exam_token'] = document.getElementById("examAnswer").value;
		return newData;
	}
	// Starts the answering process
	var ans = hex_hmac_sha512(userID,document.getElementById("examAnswer").value);
	jQuery.ajax({
		url: app.forum.attribute('validateUrl'),
		data: {"uid":userID,"ans":ans,"qfile":app.forum.attribute('questionFile')},
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
