/**
 * Created by BRITENET on 02.09.2019.
 */
({
    sortResult: function(sortBy){

        let sortEvent = $A.get('e.c:MG_SortResults');
        sortEvent.setParams({
            'sortBy': sortBy,
            'sortingType': 'aaa'
        });
        sortEvent.fire();
    },
    getGenres: function (genId) {

        let genres = [
            {
                id: 28,
                name: 'Action'
            },
            {
                id: 12,
                name: 'Adventure'
            },
            {
                id: 16,
                name: 'Animation'
            },
            {
                id: 35,
                name: 'Comedy'
            },
            {
                id: 80,
                name: 'Crime'
            },
            {
                id: 99,
                name: 'Documentary'
            },
            {
                id: 18,
                name: 'Drama'
            },
            {
                id: 10751,
                name: 'Family'
            },
            {
                id: 14,
                name: 'Fantasy'
            },
            {
                id: 36,
                name: 'History'
            },
            {
                id: 27,
                name: 'Horror'
            },
            {
                id: 10402,
                name: 'Music'
            },
            {
                id: 9648,
                name: 'Mystery'
            },
            {
                id: 10749,
                name: 'Romance'
            },
            {
                id: 878,
                name: 'Science Fiction'
            },
            {
                id: 10770,
                name: 'TV Movie'
            },
            {
                id: 53,
                name: 'Thriller'
            },
            {
                id: 10752,
                name: 'War'
            },
            {
                id: 37,
                name: 'Western'
            }
        ];
        let genresNames = [];
        genres.map((g)=>{
            if(genId.contains(g.id)){
                genresNames.push(g.name);
            }
        });
        return genresNames;
    },
    findRandomMovies:function (cmp) {
        let getRandom = cmp.get('c.getRandomMovies');
        let shuffle = function (myArr) {
            let l = myArr.length, temp, index;
            while (l > 0) {
                index = Math.floor(Math.random() * l);
                l--;
                temp = myArr[l];
                myArr[l] = myArr[index];
                myArr[index] = temp;
            }
            return myArr;
        };
        getRandom.setCallback(this, response => {
            if (response.getState() === "SUCCESS") {
                let results = response.getReturnValue();
                results = shuffle(results.results);
                results = results.slice(0, 6);
                cmp.set('v.movie', '');
                cmp.set('v.person', '');
                cmp.set('v.randomMovies', results);
                // console.log('rand val " ' + JSON.stringify(results));
                // console.log('rand size " ' + results.size());
            }
        });
        $A.enqueueAction(getRandom);
    }
})