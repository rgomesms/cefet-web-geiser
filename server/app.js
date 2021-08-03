// importação de dependência(s)
const fs = require('fs');
const express = require('express');
const app = express();

// variáveis globais deste módulo
const PORT = 3000


// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 1-4 linhas de código (você deve usar o módulo de filesystem (fs))
const players = JSON.parse(fs.readFileSync('server/data/jogadores.json', 'utf8'));
const games = JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json', 'utf8'));
const db = { players, games }


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???qual-templating-engine???');
//app.set('views', '???caminho-ate-pasta???');
// dica: 2 linhas
app.set('view engine', 'hbs');
app.set('views', 'server/views');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json (~3 linhas)
app.get('/', (req, res) => {
	res.render('index', db.players);
});


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código

app.get('/:steamid', (req, res) => {
	const steamid = req.params.steamid;
	const player = db.players.players.find(p => p.steamid === steamid);
	if (db.games && db.games[steamid]) {
		const gameData = { ...db.games[steamid] };

		player.top5 = gameData.games.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 5);
		player.top5.map((game) => {
			game.playtime_forever = Math.floor(game.playtime_forever / 60);
			return game;
		});
		player.favoritegame = player.top5.slice(0, 1)[0];
		player.gamecount = gameData.game_count;
		player.notplayedcount = gameData.games.filter(g => g.playtime_forever === 0).length;
		res.render('jogador', player);
	}
});


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client/'));


// abrir servidor na porta 3000 (constante PORT)
// dica: 1-3 linhas de código
app.listen(PORT, () => {
	console.log("Listening on port: " + PORT);
});