/*
Riprodurre un'interfaccia stile Netflix utilizando Vue
*/

const API_KEY = 'a03a9596122b7a930963fc97f1e3e35d';
const MAX_STAR_VOTE = 5;
const FLAGS_PATH = ["en", "es", "fr", "it", "de", "ja", "nl", "pt", "ru",];

const app = new Vue({
    el: '#root',
    data:{
        imgConfig: '',
        language: 'it',
        menuSections:['Home', 'Film', 'Serie Tv', 'Più popolari', 'Preferiti'],
        selectedSection:'Home',
        flags: [...FLAGS_PATH],
        videoTitles: [],
        maxStarVote: MAX_STAR_VOTE,
        myList: [],
        inputUser:'',
        searchParam: '',
        currentPage: 1,
        totalPages: 0,
        prevSection: ''
    },
    methods: {
        //Search both movies and Tv Series
        search() {
            this.selectedSection = '';
            // Imposto funzione per richiamare la lista di film secondo il filtraggio per "inputUser" e salvo il risultato in films[]
            axios.get('https://api.themoviedb.org/3/search/movie/', { params: {
               'api_key' : API_KEY,
               language: this.language,
               query: this.inputUser
            }
            }).then(element => this.videoTitles = element.data.results);

            // Imposto funzione per richiamare la lista di serie TV secondo il filtraggio per "inputUser" e salvo il risultato in tvSeries[]
            axios.get('https://api.themoviedb.org/3/search/tv/', { params: {
                'api_key' : API_KEY,
                language: this.language,
                query: this.inputUser
            }
            }).then(element => this.videoTitles = [...this.videoTitles, ...element.data.results]);
                this.searchParam = this.inputUser;
                //Azzero il cambo input
                this.inputUser = '';
        },
        //Search Tv top rated and save in videoTitles
        searchTvPopular(){
            axios.get('https://api.themoviedb.org/3/tv/popular', { params: {
                'api_key' : API_KEY,
                language: this.language,
                page: this.currentPage
            }
            }).then(element => {
                this.videoTitles = element.data.results;
                this.totalPages = element.data.total_pages;
            });
        },
        //Search movie top rated and save in videoTitles
        searchMoviePopular(){
            axios.get('https://api.themoviedb.org/3/movie/popular', { params: {
                'api_key' : API_KEY,
                language: this.language,
                page: this.currentPage
            }
            }).then(element => {
                this.videoTitles = element.data.results;
                this.totalPages = element.data.total_pages;
            });
        },
        //Search movie & tv most popular and save in videoTitles
        searchTvAndMoviesMostPopular(){
            axios.get('https://api.themoviedb.org/3/movie/popular', { params: {
                'api_key' : API_KEY,
                language: this.language,
                page: this.currentPage
            }
            }).then(element => this.videoTitles = element.data.results );

            axios.get('https://api.themoviedb.org/3/tv/popular', { params: {
                'api_key' : API_KEY,
                language: this.language,
                page: this.currentPage
            }
            }).then(element => {
                this.videoTitles = [...this.videoTitles, ...element.data.results];
                this.totalPages = element.data.total_pages
            });

        },
        //
        searchDailyTrending(){
            axios.get('https://api.themoviedb.org/3/trending/all/day', { params: {
                'api_key' : API_KEY,
                language: this.language,
                page: this.currentPage
            }
            }).then(element => {
                this.videoTitles = element.data.results;
                this.totalPages = element.data.total_pages;
                });
        },
        //Round vote from 1/10 to 1/5
        roundVote(num) {
            return num = Math.ceil(num / 2);
        },
        //If img from server is null ut this img
        handleImgNull(e){
            e.target.src = "img/netflix-black.jpg";
        },
        //Convert language and show flag
        showFlag(str){
            return `img/flags/${str}.svg`
        },
        //Define what's selected section and save it in selectedSection
        selectSection(section){
            //Reset to 1st page at change section
            this.prevSection = this.selectedSection;
            this.selectedSection = section;
            (this.prevSection != this.selectedSection) ? this.currentPage = 1 : '';
            switch(this.selectedSection) {
                case this.menuSections[0]:
                    this.searchDailyTrending();
                    break;
                case this.menuSections[1]:
                    this.searchMoviePopular();
                    break;
                case this.menuSections[2]:
                    this.searchTvPopular();
                    break;
                case this.menuSections[3]:
                    this.searchTvAndMoviesMostPopular();
                    break;
                case this.menuSections[4]:
                    this.videoTitles = this.myList;
                    break;
            }
        },
        //Obj present in array
        isPresent(element, array){
           return array.some(el => el.id === element.id)
        },
        //Add or remove element to My List
        addOrRemoveToMyList(e, array){
            //Remove from myList if present
            if (this.isPresent(e, array)){
                this.myList.forEach((element, index) => {
                    if(element.id === e.id){
                        this.myList.splice(index, 1);
                    }
                })
            //Add to myList if not present
            } else {
                this.myList.push(e);
            }
        },
        //Next page in pagination
        nextPage(section){
            if(this.currentPage === this.totalPages){
                return
            }
            this.currentPage++;
            this.selectSection(section);
        },
        //Prev page in pagination
        prevPage(section){
            if(this.currentPage === 1){
                return
            }
            this.currentPage--;
            this.selectSection(section);
        },
    },
    mounted: function() {
        //Call the config and save it in imgConfig[]
        axios.get('https://api.themoviedb.org/3/configuration', { params: {
            'api_key' : API_KEY
        }
        }).then(element => this.imgConfig = element.data.images)

        this.searchDailyTrending();
    },
});
