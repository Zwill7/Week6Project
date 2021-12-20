class Player {
    constructor(name) {
        this.name = name;
        this.stats = [];
    }
    addTeam(name, city) {
        this.teams.push(new Team(name, city));
    }
}

class Team {
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

    static createPlayer(name) {
        TeamRoster.createPlayer(new Player(name))
            .then(() => {
                return TeamRoster.getAllPlayers();
            })
            .then((players) => this.render(players));
    }
    static deletePlayer(id) {
        TeamRoster.deletePlayer(id)
            .then(() => {
                return TeamRoster.getAllPlayers();
            })
            .then((players) => this.render(players));
    }

    static addTeam(id) {
        for (let player of this.players) {
            if (player._id == id) {
                player.teams.push(new Team($(`#${player._id}-team-name`).val(), $(`#${player._id}-team-conference`).val()));
                TeamRoster.updatePlayer(player)
                    .then(() => {
                        return TeamRoster, this.getAllPlayers();
                    })
                    .then((players) => this.render(players));
            }
        }
    }

    static deleteTeam(playerId, teamId) {
        for (let player of this.players) {
            for (let team of player.teams) {
                if (team._id == teamId) {
                    player.teams.splice(player.teams.indexOf(team), 1);
                    TeamRoster.updatePlayer(player)
                        .then(() => {
                            return TeamRoster.getAllPlayers();
                        })
                        .then((players) => this.render(players));
                }
            }
        }
    }

    static render(players) {
        this.players = players;
        $('#app').empty();
        for (let player of players) {
            $('#app').prepend(
                `<div id="${player._id}" class"card">
                <div class="card-header>
                    <h2>${player.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deletePlayer('${player._id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" id="${player._id}-team-name" class ="form-control" placeholder ="Team Name"
                            </div>   
                                    <div class="col-sm">
                                        <input type="text" id="${player._id}-team-city" class ="form-control" placeholder ="Team City"
                                     </div>
                                        <button id=${player._id}-new-team" onclick="DOMManager.addTeam('${player._id}')" class ="btn btn-primary form-control">Add</button> 
                     </div>
                </div<
            </div><br>`
            );
            for (let team of player.teams) {
                $(`#${player._id}`).find('.card.body').append(
                    `<p>
                    <span id="name-${team._id}"><strong>Name: </strong> ${team.name}</span>
                    <span id="conference-${team._id}"<strong>Conference: </strong> ${team.conference}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteTeam('${player._id})', '${team._id}')"Delete Team</button>`
                );
            }
        }
    }
}

$('#create-new-player').click(() => {
    DOMManager.createPlayer($('#new-player-name').val());
    $('#new-player-name').val('');
});

DOMManager.getAllPlayers();
