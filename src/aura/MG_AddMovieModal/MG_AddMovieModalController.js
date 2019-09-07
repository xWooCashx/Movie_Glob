/**
 * Created by BRITENET on 06.09.2019.
 */
({
    openModel: function (component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpen", true);
    },

    closeModel: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"
        component.set("v.isOpen", false);
        component.set('v.currentStep', 1);
        component.set('v.blockStep', true);
        component.set('v.newTitle', '');
        component.set('v.newReleaseDate', '');
        component.set('v.newMovie', {'sobjectType': 'MG_Movie__c'});
        component.set('v.validResult', 'neutral');
    },

    likenClose: function (component, event, helper) {
        // Display alert message on the click on the "Like and Close" button from Model Footer
        // and set set the "isOpen" attribute to "False for close the model Box.
        alert('thanks for like Us :)');
        component.set("v.isOpen", false);
    },
    checkStep: function (component, event, helper) {
        // Display alert message on the click on the "Like and Close" button from Model Footer
        // and set set the "isOpen" attribute to "False for close the model Box.
        let step = component.get('v.currentStep');
        console.log('step : ' + step);
        if (step === 4) {
            component.set("v.isOpen", false);
            component.set('v.currentStep', 1);
            component.set('v.blockStep', true);
            component.set('v.newTitle', '');
            component.set('v.newReleaseDate', '');
            component.set('v.newMovie', {'sobjectType': 'MG_Movie__c'});
        } else {
            component.set('v.currentStep', step + 1);
            component.set('v.blockStep', true);
        }
    },
    checkMovieY: function (component, event, helper) {
        let title = component.get('v.newTitle');
        let date = component.get('v.newReleaseDate');
        console.log(title);
        console.log(date);
        if (title !== undefined && date !== null) {
            let checkMovie = component.get('c.checkMovie');
            checkMovie.setParams({
                'movieTitle': title,
                'movieDate': date
            });
            checkMovie.setCallback(this, response => {
                if (response.getState() === "SUCCESS") {
                    let results = response.getReturnValue();
                    console.log('res of check movie : ' + results);
                    if (results) {
                        component.set('v.validResult', 'success');
                        component.set('v.blockStep', false);
                        component.set('v.newMovie.Title__c', title);
                        component.set('v.newMovie.Release_Date__c', date);
                    } else {
                        component.set('v.validResult', 'destructive');
                    }
                }
            });
            $A.enqueueAction(checkMovie);
        }
    },
    handleLoad: function (cmp, event, helper) {
        cmp.set('v.showSpinner', false);
    },
    handleSubmit: function (cmp, event, helper) {
        cmp.set('v.disabled', true);
        cmp.set('v.showSpinner', true);
    },

    handleError: function (cmp, event, helper) {
        // errors are handled by lightning:inputField and lightning:nessages
        // so this just hides the spinnet
        cmp.set('v.showSpinner', false);
    },

    handleSuccess: function (cmp, event, helper) {
        let payload = event.getParams().response;
        console.log(payload.id);
        cmp.set('v.newMovieId', payload.id);
        cmp.set('v.saved', true);
        cmp.set('v.blockStep', false);
    },
    movieWasAdded: function (component, event, helper) {
        component.set('v.blockStep', false);
        console.log('added image in modal');

    }
})