/* 
Riprodurre un'interfaccia stile Netflix utilizando Vue
*/
const API_KEY = 'a03a9596122b7a930963fc97f1e3e35d';
const MAX_STAR_VOTE = 5;
const flagsPath = ["en", "es", "fr", "it", "de", "ja", "nl", "pt", "ru",];

const app = new Vue({
    el: '#root',
    data:{
        imgConfig: '',
        flags: [...flagsPath],
        films: [],
        tvSeries: [],
        maxStarVote: MAX_STAR_VOTE,
        inputUser:''
    },
    methods: {
        search() {
            // Imposto funzione per richiamare la lista di film secondo il filtraggio per "inputUser" e salvo il risultato in films[]
            axios.get('https://api.themoviedb.org/3/search/movie/', { params: {
               'api_key' : API_KEY,
               query: this.inputUser 
            }
            }).then(element => this.films = element.data.results);

            // Imposto funzione per richiamare la lista di serie TV secondo il filtraggio per "inputUser" e salvo il risultato in tvSeries[]
            axios.get('https://api.themoviedb.org/3/search/tv/', { params: {
                'api_key' : API_KEY,
                query: this.inputUser 
            }
            }).then(element => this.tvSeries = element.data.results);
              //Azzero il cambo input
              this.inputUser = '';
        },
        roundVote(num) {
            return num = Math.ceil(num / 2);
        },
        handleImgNull(e){
            e.target.src = "img/netflix-black.jpg";
        },
        showFlag(str){
            return `img/flags/${str}.svg`
        }
    },
    mounted: function() {
        axios.get('https://api.themoviedb.org/3/configuration', { params: {
            'api_key' : API_KEY,
        }
        }).then(element => this.imgConfig = element.data.images)
    },

});
