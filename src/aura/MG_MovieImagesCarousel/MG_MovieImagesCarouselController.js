/**
 * Created by BRITENET on 05.09.2019.
 */
({
    changeActive: function (component, event, helper) {

        console.log('index : ');
        let images = component.get('v.images');
        let index = event.currentTarget.dataset.index;
        let imag = images[0];
        console.log('path : ' + images[index].file_path);
        // images[0] = images[index];
        // images[index] = imag;
        // images[5]=index;
        console.log('index : ' + index);
        component.set('v.images', images);

        component.set('v.activeIndex', index);
    }
})