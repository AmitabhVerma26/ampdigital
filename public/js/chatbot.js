$(function() {
    $("#contactform").on("click", function(e){
        e.preventDefault();
        $(".chat-widget-container").click();
    })
    $("#wisdom").on("keypress",function(e) {
        var key = e.keyCode;
    
        // If the user has pressed enter
        if (key == 13) {
            return pushChat();
        }
    });
    var loaded = true;
    var chatWidget = (".chat-widget-container"),
        chatBox = $(".chat-box-container");
    
        $(".btn-chat-close").on("click", function(){
            $(chatBox).toggleClass("show");
          $(chatWidget).toggleClass("open");
          $(".chat-box-form").addClass("d-none");
                $(".chat-widget-wrapper").css("width", "111px");
        })

    $(chatWidget).click(function(e){
      e.preventDefault();
      if(loaded==true){
        setTimeout(function(){
            var conversationDiv = document.getElementById('conversation');
              var responsePara = document.createElement("P");
              responsePara.className = 'lexResponse';
              $(responsePara).append('<img src="/kendra.svg" style="width: 2rem;">')
              responsePara.appendChild(document.createTextNode("Hi"));
              responsePara.appendChild(document.createElement('br'));
              conversationDiv.appendChild(responsePara);
              var $target=$(".chat-box-container.show"); $target.animate({scrollTop: $target.height()}, 1000);
          }, 800)
          setTimeout(function(){
            var conversationDiv = document.getElementById('conversation');
              var responsePara = document.createElement("P");
              responsePara.className = 'lexResponse';
              responsePara.appendChild(document.createTextNode("I am Kendra. Do you want me to help you find something?"));
              responsePara.appendChild(document.createElement('br'));
              $(responsePara).append('<a style="color: white; background: #f42434!important;border-color: #f42434!important;" onclick="pushChat2()" class="btn btn-primary btn-yes">Yes</a>');
              conversationDiv.appendChild(responsePara);
              var $target=$(".chat-box-container.show"); $target.animate({scrollTop: $target.height()}, 1000);
          }, 1500)
          loaded = false;
      }
      
      $(chatBox).toggleClass("show");
      $(chatWidget).toggleClass("open");
      if($(chatBox).hasClass("show")){
          $(".chat-box-form").removeClass("d-none");
        $(".chat-widget-wrapper").css("width", "300px");
      }
      else{
        $(".chat-box-form").addClass("d-none");
        $(".chat-widget-wrapper").css("width", "111px");
      }
    })
    
  });
      // set the focus to the input box
      document.getElementById("wisdom").focus();
  
      // Initialize the Amazon Cognito credentials provider
      AWS.config.region = 'eu-west-1'; // Region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          // Provide your Pool Id here
          IdentityPoolId: 'eu-west-1:dc8c07a4-afbb-46cf-98c3-a2daf5f0870a',
      });
  
      var lexruntime = new AWS.LexRuntime();
      var lexUserId = 'chatbot-demo' + Date.now();
      var sessionAttributes = {};
  
  
  
      function pushChat2() {
          $(".btn-yes").remove();
  // if there is text to be sent...
  if (1) {
  
      // disable input to show we're sending it
      var wisdom = "Yes";
  
      // send it to the Lex runtime
      var params = {
          botAlias: 'ampdigitalchatbot',
          botName: 'AMPDigitalchatbot',
          inputText: wisdom,
          userId: lexUserId,
          sessionAttributes: sessionAttributes
      };
      showRequest(wisdom);
      lexruntime.postText(params, function(err, data) {
          if (err) {
              console.log(err, err.stack);
              showError('Error:  ' + err.message + ' (see console for details)')
          }
          if (data) {
              // capture the sessionAttributes for the next cycle
              sessionAttributes = data.sessionAttributes;
              // show response and/or error/dialog status
              showResponse(data);
          }
      });
  }
  // we always cancel form submission
  return false;
  }
  
  
      function pushChat() {
  
          // if there is text to be sent...
          var wisdomText = document.getElementById('wisdom');
          if (wisdomText && wisdomText.value && wisdomText.value.trim().length > 0) {
  
              // disable input to show we're sending it
              var wisdom = wisdomText.value.trim();
              wisdomText.value = '';
              wisdomText.locked = true;
  
              // send it to the Lex runtime
              var params = {
                  botAlias: 'ampdigitalchatbot',
                  botName: 'AMPDigitalchatbot',
                  inputText: wisdom,
                  userId: lexUserId,
                  sessionAttributes: sessionAttributes
              };
              showRequest(wisdom);
              lexruntime.postText(params, function(err, data) {
                  if (err) {
                      console.log(err, err.stack);
                      showError('Error:  ' + err.message + ' (see console for details)')
                  }
                  if (data) {
                      console.log("jere");
              console.log(data);
              if(data.slots.Question){
                $.ajax({
                    method: "POST",
                    url: "/lexmail",
                    data: data.slots
                }).done(function(response) {
                    console.log(response);
                });
              }
                      // capture the sessionAttributes for the next cycle
                      sessionAttributes = data.sessionAttributes;
                      // show response and/or error/dialog status
                      showResponse(data);
                  }
                  // re-enable input
                  wisdomText.value = '';
                  wisdomText.locked = false;
              });
          }
          // we always cancel form submission
          return false;
      }
  
      function showRequest(daText) {
  
          var conversationDiv = document.getElementById('conversation');
          var requestPara = document.createElement("P");
          requestPara.className = 'userRequest';
          requestPara.appendChild(document.createTextNode(daText));
          conversationDiv.appendChild(requestPara);
          var $target=$(".chat-box-content"); $target.animate({scrollTop: $target.height()}, 1000);
      }
  
      function showError(daText) {
  
          var conversationDiv = document.getElementById('conversation');
          var errorPara = document.createElement("P");
          errorPara.className = 'lexError';
          errorPara.appendChild(document.createTextNode(daText));
          conversationDiv.appendChild(errorPara);
          var $target=$(".chat-box-container.show"); $target.animate({scrollTop: $target.height()}, 1000);
      }
  
      function showResponse(lexResponse) {
  
          var conversationDiv = document.getElementById('conversation');
          var responsePara = document.createElement("P");
          responsePara.className = 'lexResponse';
          if (lexResponse.message) {
            $(responsePara).append('<img src="/kendra.svg" style="width: 2rem;">')
            responsePara.appendChild(document.createElement('br'));
              responsePara.appendChild(document.createTextNode(lexResponse.message));
          }
          if (lexResponse.dialogState === 'ReadyForFulfillment') {
              // responsePara.appendChild(document.createTextNode(
              //     'Ready for fulfillment'));
              // TODO:  show slot values
          } else {
              // responsePara.appendChild(document.createTextNode(
              //     '(' + lexResponse.dialogState + ')'));
          }
          conversationDiv.appendChild(responsePara);
          var $target=$(".chat-box-content"); $target.animate({scrollTop: $target.height()}, 1000);
      }