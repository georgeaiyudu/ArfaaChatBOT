var restify = require('restify');
var builder = require('botbuilder');
var Choices = require('prompt-choices');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

// Listen for messages fro.m users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector);
// Ask the user for their name and greet them by name.


var arrayOfQuestions = ['I am not able to receive emails', 'unable to send emails','send receive error in outlook'];
var arrayOfAnswers = ['Check if you connected to internet','Check if your LAN cable is connected or connected to Wifi'
,'Check if your MS outlook is connected to MS exchange or if you are working offline']; 

bot.dialog('/', [
    function (session) {
        session.beginDialog('askName');
    },
    function (session, results) {
        session.endDialog('Hello %s!', results.response);
    }
]);
bot.dialog('askName', [
    function (session) {

		if(session.message.text == "registerTicket"){
				createCard(session, session.message.value);
			}
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
		session.send(session.message.value)	
        session.endDialogWithResult(results);
		session.beginDialog('askQuerry');
		//var message = results.response;
    }
]);
bot.dialog('askQuerry',[
	function (session){
		builder.Prompts.text(session, "How can I Help You ? ");
	},
	function (session, results){
		
		var message = results.response;
		session.send(message);
			if( message == arrayOfQuestions[1] ){
				session.send(JSON.stringify(results.response));
				session.beginDialog('solveQuery');
			}else if( message == "Exit" ){
				session.endConversation("Good Bye !!");
			
			}else{
				session.endDialogWithResult(session,"Cant help you out bro...")
			}	
	}
]);

bot.dialog('solveQuery',[

	function (session){

		builder.Prompts.choice(session, "Please Choose one option : ", 'a|b|c');

	},
	function (session, results){
		switch(results.response.index){
			case 0:
				session.send(arrayOfAnswers[0]);
				
				break;

			case 1:

			//var dataToCard = results.response;
			var card = createCard(session);
			
			//var message = new builder.Message(session).addAttachment(card);
	
			session.send(card);
				//session.send(arrayOfAnswers[1]);
				session.endDialog();
				break;
			
			case 2:
				session.send(arrayOfAnswers[2]);
				session.endDialog();
				break;

			default:
				session.send("Exit");
				session.endDialog();
				break;

		}
	}

]);

function createCard(session){

	return new builder.Message(session).addAttachment({

		contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            speak: "<b>Identifying solutions...</b>",
			
               body: [

                    {
                        "type": "TextBlock",
                        "text": "Check if your LAN cable is connected or connected to Wifi",
                        "size": "large"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Check if you connected to internet"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Check if your MS outlook is connected to MS exchange or if you are working offline"
                    },
					{

						"type": "TextBlock",
						"size":"large",
						"text": "Was that helpful ?"

					}
                    
                ],
                "actions": [
					
                    {
                        "type": "Action.ShowCard",
                        "title": "Yes",
						"card":{
							"type":"AdaptiveCard",
							"body":[{
								'type': 'TextBlock',
                                'weight': 'bolder',
                                'size': 'large',
								"text":"Glad to help you..."
							}]
						}				
                    },
                    {
                        "type": "Action.Submit",
                        "title": "No",
						"data":{
							"type":"registerTicket"
						}
						
                    }
                ]
        }
	});


}

function createTicket(session){
	return   new builder.HeroCard(session)
            .title('Azure Storage')
            .subtitle('Offload the heavy lifting of data center management')
            .text('Store and help protect your data. Get durable, highly available data storage across the globe and pay only for what you use.')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/storage/media/storage-introduction/storage-concepts.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
            ])
}

function createTicket(session, value){

	session.send()

	switch(value.type){
		case 'registerTicket': 
			session.beginDialog('registerTicket');
		default :
			session.send("do nothing...");
	}
}



bot.dialog('registerTicket',function(session){

	session.send("Ticket has been created and forwarded to Level-2 Authority")

})