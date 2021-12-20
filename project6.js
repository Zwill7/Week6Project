class Player {
    constructor(name) {
        this.name = name;
        this.stats = [];
    }
    addTeam(name, city) {
        this.teams.push(new Team(name,city));
    }
}

class Team{
    constructor(name, conference) {
        this.name = name;
        this.conference = conference
    }
}

class TeamRoster {
    static url = 'http://ancient-taiga-31359.herokuapp.com/api/teams';
   
    static getAllPlayers() {
        return $.get(this.url);
    }

    static getPlayer(id) {
        return $.get(this.url + `/${id}`);
    }

    static createPlayer(player) {
        return $.post(this.url, player);
    }

    static updatePlayer(player) {
        return $.ajax({
            url: this.url + `/${player_id}`,
            dataType: 'json',
            data: JSON.stringfly(player),
            contentType: 'application/json',
            type: 'PUT'
        

        });
    }

    static deletePlayer(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static players;

    static getAllPlayers() {
     TeamRoster.getAllPlayers().then(players => this.render(players));   
    }

    static render(players) {
        this.players = players;
        $('#app').empty();
        for (let player of players) {
            $('#app').prepend(
            `<div id="${player._id}" class"card">
                <div class="card-header>
                    <h2>${player.name}</h2>
                </div>
            </div>
            `
            );
        }
    }
}

DOMManager.getAllPlayers();