/**
 * Created by BRITENET on 04.09.2019.
 */
({
    fireInit: function (component) {
        component.set('v.isLoading', true);
        let searchFor = component.get('c.getPopularMovies');
        searchFor.setCallback(this, response => {
            if (response.getState() === "SUCCESS") {
                let results = response.getReturnValue();
                // console.log('response : '+JSON.stringify(response.getReturnValue()));
                // console.log('response : '+JSON.stringify(response.getReturnValue()));
                component.set('v.movieResults', '');
                component.set('v.personResults', '');
                component.set('v.total_pages', '');
                component.set('v.pageIndex', '');
                component.set('v.mediaType', 'Popular Movies');
                component.set('v.popularMovies', results.results);
            }
            component.set('v.isLoading', false);
        });
        $A.enqueueAction(searchFor);
    }
})