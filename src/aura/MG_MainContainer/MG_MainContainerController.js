/**
 * Created by BRITENET on 02.09.2019.
 */
({
    showResults: function (component, event, helper) {
        component.set('v.movieResults', '');
        component.set('v.personResults', '');
        component.set('v.id', '');
        let query = event.getParam('query');
        component.set('v.query', query);
        let mediaType = event.getParam('mediaType');

        if (mediaType === 'movie') {
            component.set('v.isLoading', true);
            component.set('v.mediaType', 'Movies');
            let searchFor = component.get('c.searchForMovies');
            searchFor.setParams({
                'query': query,
                'pageNumber': 1
            });
            searchFor.setCallback(this, response => {
                if (response.getState() === "SUCCESS") {
                    let results = response.getReturnValue();
                    // console.log('response : '+JSON.stringify(response.getReturnValue()));
                    // console.log('response : '+JSON.stringify(response.getReturnValue()));
                    results.results.map()
                    component.set('v.movieResults', results.results);
                    component.set('v.total_pages', results.total_pages);
                    component.set('v.pageIndex', results.page);
                }
                component.set('v.isLoading', false);
            });
            $A.enqueueAction(searchFor);
        } else if (mediaType === 'person') {
            component.set('v.isLoading', true);
            component.set('v.mediaType', 'People');
            let searchFor = component.get('c.searchForPeople');
            searchFor.setParams({
                'query': query,
                'pageNumber': 1
            });
            searchFor.setCallback(this, response => {
                if (response.getState() === "SUCCESS") {
                    let results = response.getReturnValue();
                    component.set('v.personResults', results.results);
                    component.set('v.total_pages', results.total_pages);
                    component.set('v.pageIndex', results.page);
                }
                component.set('v.isLoading', false);
            });
            $A.enqueueAction(searchFor);
        } else if (mediaType === 'home') {
            component.set('v.movieResults', '');
            component.set('v.personResults', '');
            component.set('v.total_pages', '');
            component.set('v.pageIndex', '');
            component.set('v.mediaType', 'Popular Movies');
            helper.fireInit(component);
        } else if (mediaType === 'account') {
            component.set('v.mediaType', 'Account');
            component.set('v.movieResults', '');
            component.set('v.personResults', '');
            component.set('v.total_pages', '');
            component.set('v.pageIndex', '');
        }
    },
    changePage: function (component, event, helper) {
        component.set('v.isLoading', true);
        let mediaType = component.get('v.mediaType');
        let query = component.get('v.query');
        console.log(mediaType);
        if (mediaType === 'Movies') {
            let pageNumber = component.get('v.pageIndex');
            console.log(pageNumber);
            let searchFor = component.get('c.searchForMovies');
            searchFor.setParams({
                'query': query,
                'pageNumber': pageNumber
            });
            searchFor.setCallback(this, response => {
                if (response.getState() === "SUCCESS") {
                    let results = response.getReturnValue();
                    // console.log('response : '+JSON.stringify(response.getReturnValue()));
                    // console.log('response : '+JSON.stringify(response.getReturnValue()));
                    component.set('v.movieResults', results.results);
                    component.set('v.total_pages', results.total_pages);
                    component.set('v.pageIndex', results.page);
                }
                component.set('v.isLoading', false);
            });
            $A.enqueueAction(searchFor);
        }
        if (mediaType === 'People') {
            let pageNumber = component.get('v.pageIndex');
            let searchFor = component.get('c.searchForPeople');
            searchFor.setParams({
                'query': query,
                'pageNumber': pageNumber
            });
            searchFor.setCallback(this, response => {
                if (response.getState() === "SUCCESS") {
                    let results = response.getReturnValue();
                    component.set('v.personResults', results.results);
                }
                component.set('v.isLoading', false);
            });
            $A.enqueueAction(searchFor);
        }
    },
    sortResults: function (cmp, event, helper) {
        cmp.set('v.isLoading', true);
        let sortBy = event.getParam('sortBy');
        let i = cmp.get('v.sortedI');
        if (cmp.get('v.sortBy') === sortBy) {
            i = -i;
        } else {
            i = 1;
        }
        cmp.set('v.sortBy', sortBy);
        cmp.set('v.sortedI', i);
        let mediaType = cmp.get('v.mediaType');
        if (mediaType === 'People') {
            let results = cmp.get('v.personResults');
            if (sortBy === 'name') {
                results.sort((a, b) => {
                    if (a.name > b.name) {
                        return -i;
                    }
                    if (b.name > a.name) {
                        return i;
                    }
                    return 0;
                })
            }
            if (sortBy === 'personPopularity') {
                results.sort((a, b) => {
                    if (a.popularity > b.popularity) {
                        return -i;
                    }
                    if (b.popularity > a.popularity) {
                        return i;
                    }
                    return 0;
                })
            }
            cmp.set('v.personResults', results);
        }
        if (mediaType === 'Movies') {
            let results = cmp.get('v.movieResults');
            if (sortBy === 'title') {
                results.sort((a, b) => {
                    if (a.title > b.title) {
                        return -i;
                    }
                    if (b.title > a.title) {
                        return i;
                    }
                    return 0;
                })
            } else if (sortBy === 'moviePopularity') {
                results.sort((a, b) => {
                    if (a.popularity > b.popularity) {
                        return -i;
                    }
                    if (b.popularity > a.popularity) {
                        return i;
                    }
                    return 0;
                })
            } else if (sortBy === 'date') {
                results.sort((a, b) => {
                    if (a.release_date > b.release_date) {
                        return -i;
                    }
                    if (b.release_date > a.release_date) {
                        return i;
                    }
                    return 0;
                })
            }
            cmp.set('v.movieResults', results);
        }

        cmp.set('v.isLoading', false);
    },
    goToPerson: function (cmp, event, helper) {
        let target = event.currentTarget;
        console.log(target.dataset.id);
        cmp.set('v.mediaType', 'People');
        cmp.set('v.id', target.dataset.id);

    },
    showPerson: function (cmp, event, helper) {
        let target = event.getParam('person');
        cmp.set('v.mediaType', 'People');
        cmp.set('v.id', target.id);

    },
    goToMovie: function (cmp, event, helper) {
        let target = event.currentTarget;
        console.log(target.dataset.id);
        cmp.set('v.mediaType', 'Movies');
        cmp.set('v.id', target.dataset.id);
        cmp.set('v.popularMovies', '');

    },
    showMovie: function (cmp, event, helper) {
        let target = event.getParam('movie');
        cmp.set('v.mediaType', 'Movies');
        cmp.set('v.id', target.id);

    },
    showPersonFromCast: function (cmp, event, helper) {
        let id = event.getParams().personId;
        console.log('got it ' + id);
        cmp.set('v.id', id);
        cmp.set('v.mediaType', 'People');
    },
    showMovieFromCast: function (cmp, event, helper) {
        let id = event.getParams().movieId;
        console.log('got it ' + id);
        cmp.set('v.id', id);
        cmp.set('v.mediaType', 'Movies');
    },
    doInit: function (component, event, helper) {
        helper.fireInit(component);
    },
    showMovieFromRandom: function (cmp, event, helper) {
        let id = event.getParams().movieId;
        console.log('got it ' + id);
        cmp.set('v.id', id);
        cmp.set('v.mediaType', 'Movies');
    }
})