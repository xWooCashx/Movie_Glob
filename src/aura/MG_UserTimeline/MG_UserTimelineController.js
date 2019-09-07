/**
 * Created by BRITENET on 07.09.2019.
 */
({
    doInit: function (component, event, helper) {
        let getTimeline = component.get('c.getTimeline');
        getTimeline.setParams({});
        getTimeline.setCallback(this, response => {
            if (response.getState() === 'SUCCESS') {
                let results = response.getReturnValue();
                console.log('timeline : ' + JSON.stringify(results));
                component.set('v.events', results);
            }
        });
        $A.enqueueAction(getTimeline);
    }
})