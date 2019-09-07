/**
 * Created by BRITENET on 03.09.2019.
 */
({
    doInit: function (component, event, helper) {
        component.set('v.isLoading', true);
        component.set('v.movieCastAndCrew', '');
        component.set('v.reviews', '');
        let movieId = component.get('v.id');
        console.log('movie id : ' + movieId);
        let getDetails = component.get('c.getMovieDetails');
        getDetails.setParams({
            'movieId': '' + movieId
        });
        getDetails.setCallback(this, response => {
            if (response.getState() === "SUCCESS") {
                console.log('in m d resp');
                let results = response.getReturnValue();
                console.log('in response movie details : ' + JSON.stringify(results));
                // console.log('response : '+JSON.stringify(response.getReturnValue()));
                // console.log('response : '+JSON.stringify(response.getReturnValue()));
                component.set('v.movie', results);
                component.set('v.liked', results.isFavourite);
                component.set('v.blocked', results.isBlackListed);
                let showMovie = $A.get('e.c:MG_ShowMovie');
                showMovie.setParams({'movie': results});
                showMovie.fire();
                if (!results.fromDB) {
                    let getImages = component.get('c.getMovieImages');
                    getImages.setParams({'movieId': movieId});
                    getImages.setCallback(this, response => {
                        if (response.getState() === "SUCCESS") {
                            console.log('in mov imag resp');
                            let results = response.getReturnValue();
                            if (results.posters.length > 5) {
                                results.posters = results.posters.slice(0, 5);
                            }
                            let i = 0;
                            component.set('v.backdrop_path', results.backdrops[i].file_path);
                            i++;
                            setInterval(() => {
                                if (i === results.backdrops.length) {
                                    i = 0;
                                } else {
                                    i++;
                                }
                                component.set('v.backdrop_path', results.backdrops[i].file_path);

                            }, 15000);
                            component.set('v.images', results);
                            console.log('images : ', JSON.stringify(results));

                        }

                        component.set('v.isLoading', false);
                    });
                    $A.enqueueAction(getImages);

                }
                let newTLEvent = component.get('c.saveTimelineEvent');
                newTLEvent.setParams({
                    'actionName': 'Looked at',
                    'description': 'Movie : ' +results.title
                });
                newTLEvent.setCallback(this, response => {
                    if (response.getState() === "SUCCESS") {
                        let results = response.getReturnValue();
                        console.log('result of event : ' + results);
                    }
                });
                $A.enqueueAction(newTLEvent);
            }
        });
        $A.enqueueAction(getDetails);

    },
    goToPerson: function (cmp, event, helper) {
        let target = event.currentTarget;
        let id = target.dataset.id;
        console.log('sending id: ' + id);
        let showMovie = cmp.getEvent('showPersonFromCast');
        showMovie.setParams({
            'personId': id
        });
        showMovie.fire();

    },
    loadCast: function (component, event, helper) {
        component.set('v.isLoading', true);
        let movieId = component.get('v.id');
        console.log('movie id : ' + movieId);
        if (!movieId.startsWith('a0C2') && component.get('v.movieCastAndCrew') === '') {
            let getCastCrew = component.get('c.getMovieCastCrew');
            getCastCrew.setParams({
                'movieId': movieId
            });
            getCastCrew.setCallback(this, response => {
                console.log('got resp');
                if (response.getState() === "SUCCESS") {
                    console.log('got cast');
                    let results = response.getReturnValue();
                    console.log('response cast crew : ' + JSON.stringify(response));
                    // console.log('response : '+JSON.stringify(response.getReturnValue()));
                    console.log('response : ' + JSON.stringify(response.getReturnValue()));
                    component.set('v.movieCastAndCrew', results);
                }
                component.set('v.isLoading', false);
            });
            $A.enqueueAction(getCastCrew);
        }
    },
    loadReviews: function (component, event, helper) {
        console.log('in rev');
        component.set('v.isLoading', true);
        let movieId = component.get('v.id');
        console.log('movie id : ' + movieId);
        let getReviews = component.get('c.getReviews');
        getReviews.setParams({
            'movieId': movieId
        });
        getReviews.setCallback(this, response => {
            console.log('got resp');
            if (response.getState() === "SUCCESS") {
                console.log('got rev');
                let results = response.getReturnValue();
                console.log('response reviews : ' + JSON.stringify(results));
                component.set('v.reviews', results);
            }
            component.set('v.isLoading', false);
        });
        $A.enqueueAction(getReviews);
    },
    like: function (component, event, helper) {
        console.log('in like');
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        console.log(userId);
        let liked = component.get('v.liked');
        component.set('v.liked', !liked);
        let movieId = component.get('v.id');
        let addToFavourites = component.get('c.setFavourite');
        addToFavourites.setParams({
            'movieId': movieId,
            'userId': userId,
            'value': !liked
        });
        addToFavourites.setCallback(this, response => {
            if (response.getState() === "SUCCESS") {
                let results = response.getReturnValue();

                let newTLEvent = component.get('c.saveTimelineEvent');
                if(component.get('v.liked')){
                    newTLEvent.setParams({
                        'actionName': 'New Favourite',
                        'description': 'Movie : ' +component.get('v.movie').title
                    });
                }else{
                    newTLEvent.setParams({
                        'actionName': 'Removed Favourite',
                        'description': 'Movie : ' +component.get('v.movie').title
                    });
                }
                newTLEvent.setCallback(this, response => {
                    if (response.getState() === "SUCCESS") {
                        let results = response.getReturnValue();
                        console.log('result of event : ' + results);
                    }
                });
                $A.enqueueAction(newTLEvent);
            }
        });
        console.log(JSON.stringify(addToFavourites));
        $A.enqueueAction(addToFavourites);
    },
    block: function (component, event, helper) {
        console.log('in block');
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        console.log(userId);
        let movieId = component.get('v.id');
        let blocked = component.get('v.blocked');
        component.set('v.blocked', !blocked);
        let addToBlackListed = component.get('c.setBlackListed');
        addToBlackListed.setParams({
            'movieId': movieId,
            'userId': userId,
            'value': !blocked
        });
        addToBlackListed.setCallback(this, response => {
            if (response.getState() === "SUCCESS") {
                let results = response.getReturnValue();

                let newTLEvent = component.get('c.saveTimelineEvent');
                if(component.get('v.blocked')){
                    newTLEvent.setParams({
                        'actionName': 'New Blacklist item',
                        'description': 'Movie : ' +component.get('v.movie').title
                    });
                }else{
                    newTLEvent.setParams({
                        'actionName': 'Removed from Blacklist',
                        'description': 'Movie : ' +component.get('v.movie').title
                    });
                }
                newTLEvent.setCallback(this, response => {
                    if (response.getState() === "SUCCESS") {
                        let results = response.getReturnValue();
                        console.log('result of event : ' + results);
                    }
                });
                $A.enqueueAction(newTLEvent);
            }
        });
        console.log(JSON.stringify(addToBlackListed));
        $A.enqueueAction(addToBlackListed);
    }

})