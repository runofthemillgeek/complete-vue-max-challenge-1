let app = new Vue({
    el: '#app',
    data: {
        // Constants
        HEAL_MIN: 1,
        HEAL_MAX: 10,
        ATTACK_MIN: 5,
        ATTACK_MAX: 15,
        SPCL_MIN: 20,
        SPCL_MAX: 30,
        HEALTH_MIN: 0,        
        HEALTH_MAX: 100,

        // State variables
        msg: 'Hello World!',
        playerHealth: 100,
        computerHealth: 100,
        isPlaying: false,
        isPlayerTurn: true,
        gameInfo: "Start a game to see the logs",
        isGameEndStatsShown: false,        
        log: []
    },
    computed: {
        playerHealthBarWidth() {
            return this.playerHealth + '%';
        },

        computerHealthBarWidth() {
            return this.computerHealth + '%';
        }
    },
    methods: {
        addLogEntry(move, points) {
            let [player, opponent] = this.isPlayerTurn ? ["player", "computer"] : ["computer", "player"];

            let entry = {
                player,
                opponent,
                points,
                move
            };

            if (move === 'ATTACK') {
                entry.content = `🔫 ${player} dealt ${points} damage to ${opponent}`;
            } else if (move === 'HEAL') {
                entry.content = `💚 ${player} healed for ${points}`;
            } else if (move === 'SPECIAL') {
                entry.content = `🎆 ${player} used SPL and dealt ${points} damage to ${opponent}`;
            }

            this.log.push(entry);
        },

        onPlay() {
            console.log("Game begins!");
            this.isPlaying = true;
        },

        onReset() {
            this.playerHealth = 100;
            this.computerHealth = 100;
            this.isPlaying = false;
            this.isPlayerTurn = true;
            this.gameInfo = "Start a game to see the logs";
            this.log = [];
            this.isGameEndStatsShown = false;
        },

        getRandom(arr) {
            return arr[
                Math.floor(Math.random() * arr.length)
            ];
        },

        getRandomInt(min, max) {
            return Math.floor(min + (Math.random() * (max - min + 1)));
        },

        computerTurn() {
            let action = this.getRandom(["attack", "heal", "special"]);

            console.log("my turn");
            console.log(this.computerHealth);

            let points = this[action]();
            this.addLogEntry('SPECIAL', points);

            this.checkGameStatus();

            this.isPlayerTurn = true;
        },

        onPlayerHeal() {
            let points = this.heal();
            this.addLogEntry('HEAL', points);

            this.checkGameStatus();

            this.isPlayerTurn = false;
            this.computerTurn();
        },

        onPlayerAttack() {
            let points = this.attack();
            this.addLogEntry('ATTACK', points);            

            if(!this.checkGameStatus()) return;

            this.isPlayerTurn = false;
            this.computerTurn();
        },

        onPlayerSpecial() {
            let points = this.special();
            this.addLogEntry('SPECIAL', points);

            if(!this.checkGameStatus()) return;

            this.isPlayerTurn = false;
            this.computerTurn();
        },

        heal() {
            console.log("heal");            
            let delta = this.getRandomInt(this.HEAL_MIN, this.HEAL_MAX);

            let health = this.isPlayerTurn ? this.playerHealth : this.computerHealth;
            let newHealth = health + delta;

            if (newHealth > this.HEALTH_MAX) newHealth = this.HEALTH_MAX;

            if (this.isPlayerTurn) this.playerHealth = newHealth;
            else this.computerHealth = newHealth;

            return delta;
        },

        checkGameStatus() {
            if (this.playerHealth <= this.HEALTH_MIN) {
                // Computer won
                this.gameInfo = "You lost to the IBM PC!";
                this.isPlaying = false;
                this.isGameEndStatsShown = true;
                return false;
            } else if (this.computerHealth <= this.HEALTH_MIN) {
                // Player won
                this.gameInfo = "You demolished the IBM PC!";
                this.isPlaying = false;
                this.isGameEndStatsShown = true;                
                return false;
            }

            return true;
        },

        attack() {
            console.log("attack");            
            let delta = this.getRandomInt(this.ATTACK_MIN, this.ATTACK_MAX);

            let health = this.isPlayerTurn ? this.computerHealth : this.playerHealth;
            let newHealth = health - delta;

            if (newHealth < this.HEALTH_MIN) newHealth = this.HEALTH_MIN;

            if (this.isPlayerTurn) this.computerHealth = newHealth;
            else this.playerHealth = newHealth;

            console.log(this.computerHealth);

            return delta;
        },

        special() {
            console.log("special");
            let delta = this.getRandomInt(this.SPCL_MIN, this.SPCL_MAX);

            let health = this.isPlayerTurn ? this.computerHealth : this.playerHealth;
            let newHealth = health - delta;

            if (newHealth < this.HEALTH_MIN) newHealth = this.HEALTH_MIN;

            if (this.isPlayerTurn) this.computerHealth = newHealth;
            else this.playerHealth = newHealth;

            return delta;
        }
    }
});