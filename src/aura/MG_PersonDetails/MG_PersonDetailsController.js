/**
 * Created by BRITENET on 03.09.2019.
 */
({
    doInit: function (component, event, helper) {
        let personId = component.get('v.id');
        console.log('movie id : ' + personId);
        let getDetails = component.get('c.getPersonDetails');
        getDetails.setParams({
            'personId': '' + personId
        });
        getDetails.setCallback(this, response => {
            if (response.getState() === "SUCCESS") {
                let results = response.getReturnValue();
                // console.log('response : '+JSON.stringify(response.getReturnValue()));
                // console.log('response : '+JSON.stringify(response.getReturnValue()));
                component.set('v.person', results);
                let showPerson = $A.get('e.c:MG_ShowPerson');
                showPerson.setParams({'person': results});
                showPerson.fire();
                let newTLEvent = component.get('c.saveTimelineEvent');
                newTLEvent.setParams({
                    'actionName': 'Looked at',
                    'description': 'Person : ' +results.name
                });
                newTLEvent.setCallback(this, response => {
                    if (response.getState() === "SUCCESS") {
                        let results = response.getReturnValue();
                        console.log('result of event : ' + results);
                    }
                });
                $A.enqueueAction(newTLEvent);
            }
            component.set('v.isLoading', false);
        });
        $A.enqueueAction(getDetails);
        let getCredits = component.get('c.getPersonCredits');
        getCredits.setParams({
            'personId': '' + personId
        });
        getCredits.setCallback(this, response => {
            if (response.getState() === "SUCCESS") {
                let results = response.getReturnValue();
                // console.log('response : '+JSON.stringify(response.getReturnValue()));
                // console.log('response : '+JSON.stringify(response.getReturnValue()));
                component.set('v.credits', results);
            }
            component.set('v.isLoading', false);
        });
        $A.enqueueAction(getCredits);
    },
    goToMovie: function (cmp, event, helper) {
        let target = event.currentTarget;
        let id = target.dataset.id;
        console.log('sending id: ' + id);
        let showMovie = cmp.getEvent('showMovieFromCast');
        showMovie.setParams({
            'movieId': id
        });
        showMovie.fire();

    }
})