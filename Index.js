const TelegramBot = require('node-telegram-bot-api');
const token = '571328541:AAF3Ad0oOr3E7r0OTutIC2vp6XY2BcNJKCs';

//Declaração de variaveis globais
global.resp1 ="";
global.resp2 ="";
global.resp3 ="";
global.resp4 ="";
global.resp5 ="";
global.resp6 ="";
global.resp7 ="";

//Definição da constante bot no metodo polling
const bot = new TelegramBot(token, {polling: true});
//Definição da constante state
const state = new Map();


//Area de captura de mensagens Digitadas(Texto)

//Captura tudo que foi digitado
bot.on('message', (msg) => {
	//imprime no console o id do chat que está interagindo
	console.log(msg.chat.id);

	//Se digitar /menu ou /Start direciona para função menu
	bot.onText(/\/menu/,menu);

		//valida o state da mensagem
		if (state.get(msg.from.id) === 8) {
			//Grava a resposta 7
			resp7 = msg.text;
			//Define a constante fs para leitura de arquivos 
			const fs = require('fs');
			//Padroniza para que a resposta a ser gravada no .csv fique separadas por ";"
			var agrupado = ""+resp1+";"+resp2+";"+resp3+";"+resp4+";"+resp5+";"+resp6+";"+resp7+'\r\n';
			//Abre o arquivo em modo de edição
			fs.appendFile('Base/base.csv', agrupado, function (err) {
			if (err) throw err;
			//Imprime mensagem de erro no console
			console.log("Erro ao gravar ao relatorio\nDados:\n"+agrupado+"ID do chat:\n"+msg.chat.id);
			})
		}

		if (state.get(msg.from.id) === 6) {
    		resp5 = msg.text;
    		//Seta o state da mensagem para 7
    		state.set(msg.from.id,7);
    		//Chama função p6 passando "msg" como paramentro
			p6(msg);
    	}
        if (state.get(msg.from.id) === 5) {
        	//Faz uma nova pergunta
        	bot.sendMessage(msg.from.id, "INFORME O ARS:");
        	resp4 = msg.text;
	    	state.set(msg.from.id,6);
    	}
    	if (state.get(msg.from.id) === 3) {
	    	state.set(msg.from.id,4);
	    	resp2 = msg.text;
	    	p3(msg);
    	}

})

//Area de mensagens por Teclado personalizado
	bot.on('callback_query',(msg)=>{
	step = state.get(msg.from.id);
		var data = msg.data;
		
		//pergunta 1
		if (state.get(msg.from.id) === 1){
			state.set(msg.from.id,2);
			return p1(msg);
			
		}

		//pergunta 2
		if (state.get(msg.from.id) === 2){
			resp1 = data;
			bot.sendMessage(msg.from.id, "INFORME O RAMAL:");
			state.set(msg.from.id,3);
		}
		//pergunta 4
		if (state.get(msg.from.id) === 4){
			resp3 = data;
			bot.sendMessage(msg.from.id, "INFORME O DEFEITO:");
			state.set(msg.from.id,5);
			
		}
		//pergunta 7
		if (state.get(msg.from.id) === 7){
			resp6 = data;
			bot.sendMessage(msg.from.id, "INFORME O GERENTE RESPONSAVEL:");
			state.set(msg.from.id,8);
		}
		//bot.deleteMessage(msg.from.id);
	});


function menu(msg){
	var p = {
         reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'CHECK-LIST', callback_data: '1'}],
                [{text: 'RELATORIO', callback_data: '10'}]
            ]
        })
       };  
    bot.sendMessage(msg.from.id, "Menu", p);
    state.set(msg.from.id,1);

}




//PERGUNTAS


function p1(msg){
	var p = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'HARDWARE', callback_data: 'HARDWARE'}],
                [{text: 'SOFTWARE', callback_data: 'SOFTWARE'}], 
                [{text: 'RAMAL', callback_data: 'RAMAL'}],
                [{text: 'OUTRO', callback_data: 'OUTRO'}] 
            ]
        })
    };
    bot.sendMessage(msg.from.id, "INFORME O QUE FOI AFETADO:", p);
    //bot.answerCallbackQuery(msg.query.id);
}


function p3(msg){
	var p = {
       reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'CPE I INF', callback_data: 'CPE I INF'}],
                [{text: 'CPE I SUP', callback_data: 'CPE I SUP'}], 
                [{text: 'CPE II INF', callback_data: 'CPE II INF'}],
                [{text: 'CPE II SUP', callback_data: 'CPE II SUP'}],
                [{text: 'CPE III', callback_data: 'CPE III'}]
            ]
        })
   };
    bot.sendMessage(msg.from.id, "INFORME A LOCALIDADE:", p);
}


function p6(msg){
	var p = {
         reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'NÃO ABERTO', callback_data: 'NÃO ABERTO'}],
                [{text: 'ABERTO', callback_data: 'ABERTO'}], 
                [{text: 'RESOLVIDO', callback_data: 'RESOLVIDO'}],
                [{text: 'CANCELADO', callback_data: 'CANCELADO'}] 
            ]
        })
       };  
    bot.sendMessage(msg.from.id, "INFORME O STATUS:", p);

}


	console.log("\n\n\nBot Startado com sucesso!!!");
