/**
 * Created by BRITENET on 02.09.2019.
 */
({
    handleSectionToggle: function (cmp, event) {
        let openSections = event.getParam('openSections');

        if (openSections.length === 0) {
            cmp.set('v.activeSectionsMessage', "All sections are closed");
        } else {
            cmp.set('v.activeSectionsMessage', "Open sections: " + openSections.join(', '));
        }
    },
    changeResults: function (cmp, event, helper) {
        let query = event.getParam('query');
        cmp.set('v.movie', '');
        let mediaType = event.getParam('mediaType');
        if (mediaType === 'home') {
            cmp.set('v.mediaType', 'Random');
            cmp.set('v.movie', '');
            cmp.set('v.person', '');
            helper.findRandomMovies(cmp);
        } else if (mediaType === 'account') {
            cmp.set('v.randomMovies', '');
            cmp.set('v.movie', '');
            cmp.set('v.person', '');
            cmp.set('v.mediaType', 'Timeline');
        } else {
            cmp.set('v.mediaType', mediaType);
        }
    },
    sortPersonByName: function (cmp, event, helper) {
        helper.sortResult('name');
    },
    sortPersonByPopularity: function (cmp, event, helper) {
        helper.sortResult('personPopularity');
    },
    sortMovieByTitle: function (cmp, event, helper) {
        helper.sortResult('title');
    },
    sortMovieByDate: function (cmp, event, helper) {
        helper.sortResult('date');
    },
    sortMovieByPopularity: function (cmp, event, helper) {
        helper.sortResult('moviePopularity');
    },
    showMovie: function (component, event, helper) {
        console.log('got movie');
        let movie = event.getParam('movie');
        // console.log(JSON.stringify(movie));
        component.set('v.person', '');
        component.set('v.addedRecord', false);
        component.set('v.movie', movie);
        component.set('v.mediaType', 'Details');
        component.set('v.reviewed', movie.isReviewed);
        console.log('is reviewed : '+movie.isReviewed);
        console.log('got movie 2');
        // component.set('v.genres', helper.getGenres(movie.genres));
        console.log('got movie 3');
        component.find("service").getNewRecord(
            "MG_MovieReview__c", // sObject type (entityAPIName)
            null,      // recordTypeId
            false,     // skip cache?
            $A.getCallback(function () {
                let rec = component.get("v.review");
                let error = component.get("v.recordError");
                console.log('In callback getnewrecord');
                if (error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                } else {
                    component.set("v.review.Movie_Id__c", movie.id);
                    component.set("v.review.Image_Path__c", movie.poster_path);
                }
            })
        );
        console.log('end of show m');
    },
    showPeople: function (cmp, event, helper) {
        console.log('got movie');
        let person = event.getParam('person');
        console.log(JSON.stringify(person));
        cmp.set('v.movie', '');
        cmp.set('v.person', person);
        cmp.set('v.mediaType', 'Details');
    },
    onInit: function (cmp, event, helper) {
        helper.findRandomMovies(cmp);
    },
    goToMovie: function (cmp, event, helper) {
        let target = event.currentTarget;
        console.log(target.dataset.id);
        let showMovie = $A.get('e.c:MG_ShowMovieFromRandom');
        showMovie.setParams({'movieId': target.dataset.id});
        showMovie.fire();

    },
    onRecordUpdated: function (cmp, event, helper) {
        console.log('onrecupda');
    },
    onSave: function (component, event, helper) {
        console.log('onsaverec');
        let movie = component.get("v.movie");
        let review = component.get("v.review");
        console.log("movie review " + JSON.stringify(movie.id));
        // alert(boat.Id)

        component.set("v.review.Movie_Id__c", movie.id);


        component.find("service").saveRecord(function (saveResult) {
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                component.set('v.addedRecord', true);
                let resultsToast = $A.get("e.force:showToast");
                if (resultsToast) {
                    resultsToast.setParams({
                        "title": "Saved",
                        "message": "Added Review!"
                    });
                    resultsToast.fire();
                    component.set('v.reviewed', true);
                    let newTLEvent = component.get('c.saveTimelineEvent');
                    newTLEvent.setParams({
                        'actionName': 'Posted new review',
                        'description': 'Movie : ' + movie.title
                    });
                    newTLEvent.setCallback(this, response => {
                        if (response.getState() === "SUCCESS") {
                            let results = response.getReturnValue();
                            console.log('result of event : ' + results);
                        }
                    });
                    $A.enqueueAction(newTLEvent);
                } else {
                    alert('Added Review!');
                }
            } else if (saveResult.state === "ERROR") {
                let errMsg = '';
                console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
                for (let i = 0; i < saveResult.error.length; i++) {
                    errMsg += saveResult.error[i].message + "\n";
                }
                component.set("v.recordError", errMsg);
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }

        });

    }

})