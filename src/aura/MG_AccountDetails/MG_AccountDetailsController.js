/**
 * Created by BRITENET on 05.09.2019.
 */
({
    doInit: function (component, event, helper) {

        component.set('v.isLoading', true);
        let userId = $A.get("$SObjectType.CurrentUser.Id"), getUserMovies = component.get('c.getUserCollection'),
            favs = [], blacks = [];
        getUserMovies.setParams({'userId': userId});
        getUserMovies.setCallback(this, response => {
            console.log('got resp');
            if (response.getState() === "SUCCESS") {
                console.log('got rev');
                let results = response.getReturnValue();
                console.log('response reviews : ' + JSON.stringify(results));
                results.map(x => {
                    if (x.isBlackListed) {
                        blacks.push(x);
                    } else if (x.isFavourite) {
                        favs.push(x);
                    }
                    component.set('v.favourites', favs);
                    component.set('v.blacklisted', blacks);
                });
                component.set('v.reviews', results);
                component.set('v.isLoading', false);
            }
        });
        $A.enqueueAction(getUserMovies);
    },
    removeFromLike: function (component, event, helper) {
        console.log('in block');
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        console.log(userId);
        let movieId = event.currentTarget.dataset.id;
        console.log('in remove from f:' + movieId);
        let favs = component.get('v.favourites');
        favs = favs.filter(x => {
            return x.id !== movieId;
        });
        let removeFav = component.get('c.setFavourite');
        removeFav.setParams({
            'movieId': movieId,
            'userId': userId,
            'value': false
        });
        component.set('v.favourites', favs);
        $A.enqueueAction(removeFav);
    },
    removeFromBlackList: function (component, event, helper) {

        console.log('in block');
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        console.log(userId);
        let movieId = event.currentTarget.dataset.id;
        console.log('in remove from b:' + movieId);
        let blacklisted = component.get('v.blacklisted');
        let newTLEvent = component.get('c.saveTimelineEvent');
        newTLEvent.setParams({
            'actionName': 'Removed from Blacklist',
            'description': 'Movie : ' + blacklisted
                .filter(x => x.id === movieId)[0].title
        });
        newTLEvent.setCallback(this, response => {
            if (response.getState() === "SUCCESS") {
                let results = response.getReturnValue();
                console.log('result of event : ' + results);
            }
        });
        $A.enqueueAction(newTLEvent);
        blacklisted = blacklisted.filter(x => {
            return x.id !== movieId;
        });
        let removeBlackListed = component.get('c.setBlackListed');
        removeBlackListed.setParams({
            'movieId': movieId,
            'userId': userId,
            'value': false
        });
        component.set('v.blacklisted', blacklisted);
        $A.enqueueAction(removeBlackListed);

    },
    goToMovie: function (cmp, event, helper) {
        let target = event.currentTarget;
        let id = target.dataset.id;
        console.log('sending id: ' + id);
        let showMovie = $A.get('e.c:MG_ShowMovieFromRandom');
        showMovie.setParams({'movieId': id});
        showMovie.fire();

    },
    loadReviews: function (component, event, helper) {
        component.set('v.isLoading', true);
        console.log('in rev');
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        console.log(userId);
        let getReviewsForU = component.get('c.getReviewsForUser');
        getReviewsForU.setParams({
            'userId': userId
        });
        getReviewsForU.setCallback(this, response => {
            console.log('got resp');
            if (response.getState() === "SUCCESS") {
                console.log('got rev');
                let results = response.getReturnValue();
                console.log('response reviews : ' + JSON.stringify(results));
                component.set('v.reviews', results);
            }
            component.set('v.isLoading', false);
        });
        $A.enqueueAction(getReviewsForU);
    },
})