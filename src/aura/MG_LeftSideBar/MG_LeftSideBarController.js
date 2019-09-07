/**
 * Created by BRITENET on 02.09.2019.
 */
({
    handleSelect: function (cmp, event) {
        // This will contain the index (position) of the selected lightning:menuItem
        let selectedMenuItemValue = event.getParam("value");
        console.log(selectedMenuItemValue);
        cmp.set('v.selectedMedia', selectedMenuItemValue);
        // Find all menu items
        let menuItems = cmp.find("menuItems");
        menuItems.forEach(function (menuItem) {
            // For each menu item, if it was checked, un-check it. This ensures that only one
            // menu item is checked at a time
            if (menuItem.get("v.checked")) {
                menuItem.set("v.checked", false);
            }
            // Check the selected menu item
            if (menuItem.get("v.value") === selectedMenuItemValue) {
                menuItem.set("v.checked", true);
            }
        });
    },
    handleKeyUp: function (cmp, evt) {
        let isEnterKey = evt.keyCode === 13;
        let queryTerm = cmp.find('enter-search').get('v.value');
        if (isEnterKey && queryTerm !== '') {
            cmp.set('v.issearching', true);
            console.log(cmp.get('v.query'));
            console.log(cmp.get('v.selectedMedia'));
            let findEvent = $A.get('e.c:MG_FindResult');
            findEvent.setParams({
                'query': cmp.get('v.query'),
                'mediaType': cmp.get('v.selectedMedia')
            });
            findEvent.fire();
            cmp.set('v.issearching', false);

            let newTLEvent = cmp.get('c.saveTimelineEvent');
            newTLEvent.setParams({
                'actionName': 'Searched for',
                'description': 'Phrase : ' + queryTerm + ' in ' + cmp.get('v.selectedMedia')
            });
            newTLEvent.setCallback(this, response => {
                if (response.getState() === "SUCCESS") {
                    let results = response.getReturnValue();
                    console.log('result of event : ' + results);
                }
            });
            $A.enqueueAction(newTLEvent);
            // setTimeout(function () {
            //     alert('Searched for "' + queryTerm + '"!');
            //     cmp.set('v.issearching', false);
            // }, 1000);
        }
    },
    showHome: function (cmp, evt) {
        let findEvent = $A.get('e.c:MG_FindResult');
        findEvent.setParams({
            'query': '',
            'mediaType': 'home'
        });
        findEvent.fire();
    },
    showAccount: function (cmp, evt) {
        let findEvent = $A.get('e.c:MG_FindResult');
        findEvent.setParams({
            'query': '',
            'mediaType': 'account'
        });
        findEvent.fire();
    },
    showModalNewMovie: function (component, event, helper) {
        component.set('v.modalIsOpen', true);
    }
})