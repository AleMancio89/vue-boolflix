/* 
Riprodurre un'interfaccia stile Netflix utilizando Vue
*/
const API_KEY = 'a03a9596122b7a930963fc97f1e3e35d';

const app = new Vue({
    el: '#root',
    data:{
        films: [],
        inputUser:''
    },
    methods: {
        call() {
            axios.get('https://api.themoviedb.org/3/search/movie/', { params: {
               'api_key' : API_KEY,
               query: this.inputUser 
            }
            }).then(element=> this.films = element.data.results);
            this.inputUser = '';
        }
    }
});